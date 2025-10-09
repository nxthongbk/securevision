import { useRef } from 'react';
import { Image } from 'react-feather';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { convertPdfToImages } from '~/utils/PDFResolver';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '~/services/dashboard.service';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
// import { resizeImage } from '~/utils/resizeImage';

interface PreviewImageProps {
  preview?: string;
  setPreview?: (val: string | null) => void;
  setShowDiagram?: (val: boolean) => void;
  dashboard: any;
}

const PreviewImage = ({ preview, setPreview, setShowDiagram, dashboard }: PreviewImageProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { tenantCode } = useTenantCode();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeW = 1800;
    const sizeH = 1000;

    // Non-PDF file upload
    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        // const resizedImage = await resizeImage(file, sizeW, sizeH);
        const img = document.createElement('img');

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = sizeW;
          canvas.height = sizeH;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0, sizeW, sizeH);
          const dataUrl = canvas.toDataURL(file.type);
          setPreview?.(dataUrl);
        };

        img.src = event.target?.result?.toString() || '';
      };
      reader.readAsDataURL(file);
    } else {
      // PDF file upload
      convertPdfToImages(file).then((url) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = sizeW;
          canvas.height = sizeH;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0, sizeW, sizeH);
          const dataUrl = canvas.toDataURL('image/png');
          setPreview?.(dataUrl);
        };
        img.src = url;
      });
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  // ✅ Correctly typed and consistent mutation
  const createAttributes = useMutation({
    mutationFn: (body: { data: { operationImage: string } }) =>
      dashboardService.saveEntityAttributes(tenantCode, dashboard?.id, body.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
      setShowDiagram?.(true);
      setPreview?.(null);
    },

    onError: (err: any) => {
      console.error('❌ [onError FIRED]', err);

      // Handle possible 500 where backend actually saved successfully
      if (err?.response?.status === 500) {
        console.warn('⚠️ Received 500, assuming backend saved successfully');
        queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
        setShowDiagram?.(true);
        setPreview?.(null);
      }
    },
  });

  const handleSaveImageDiagram = () => {
    if (!preview) {
      alert('No image selected.');
      return;
    }

    console.log('🟡 Mutating with image...');
    createAttributes.mutate({ data: { operationImage: preview } });
  };

  const handleCancelImageDiagram = () => {
    setPreview?.(null);
    setShowDiagram?.(true);
  };

  return (
    <Box className="imageUploadContainer">
      <Box className="previewWrapper">
        {preview ? (
          <>
            <img
              className="preview"
              alt="diagram"
              src={preview}
              onClick={handleInputClick}
            />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={handleCancelImageDiagram}>
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveImageDiagram}
                disabled={createAttributes.isPending}
              >
                {createAttributes.isPending ? t('saving...') : t('save')}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Image className="preview" width={150} onClick={handleInputClick} />
            <Typography
              className="content-preview"
              sx={{ textAlign: 'center', cursor: 'pointer', mt: 2 }}
              onClick={handleInputClick}
            >
              {t('upload-file')}
            </Typography>
            <input
              type="file"
              style={{ display: 'none' }}
              ref={fileInputRef}
              accept="image/*,application/pdf"
              onChange={handleImageChange}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default PreviewImage;
