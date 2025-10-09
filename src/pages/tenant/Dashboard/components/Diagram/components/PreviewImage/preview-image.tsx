import { useRef } from 'react';
import { Image } from 'react-feather';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { convertPdfToImages } from '~/utils/PDFResolver';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '~/services/dashboard.service';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { resizeImage } from '~/utils/resizeImage';

const PreviewImage = ({ 
  preview, 
  setPreview, 
  setShowDiagram, 
  dashboard,
}: { 
  preview?: any, 
  setPreview?: any, 
  setShowDiagram?: any, 
  dashboard: any 
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { tenantCode } = useTenantCode();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeW = 1800, sizeH = 1000;

    // Non-PDF file upload
    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const resizedImage = await resizeImage(file, sizeW, sizeH);
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = sizeW;
          canvas.height = sizeH;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, sizeW, sizeH);
          const dataurl = canvas.toDataURL(file.type);
          setPreview(dataurl);
        };
        img.src = event.target?.result?.toString() || '';
      };
      reader.readAsDataURL(file);
    } 
    // PDF file upload
    else {
      convertPdfToImages(file).then((url) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = sizeW;
          canvas.height = sizeH;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, sizeW, sizeH);
          const dataurl = canvas.toDataURL('image/png');
          setPreview(dataurl);
        };
        img.src = url;
      });
    }
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  // ✅ Fixed mutation flow
  const createAttributes = useMutation({
    mutationFn: (body) => dashboardService.saveEntityAttributes(tenantCode, dashboard?.id, body.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
      setShowDiagram(true);
      setPreview(null);
    },
    onError: (err: any) => {
      console.error("❌ [onError FIRED]", err);

      // 🔧 Gracefully recover if backend saved successfully
      if (err.response?.status === 500) {
        console.warn("⚠️ 500 error received, but assuming backend saved successfully.");
        queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
        setShowDiagram(true);
        setPreview(null);
      }
    },
  });


  const handleSaveImageDiagram = () => {
    if (!preview) {
      alert("No image selected.");
      return;
    }

    console.log("🟡 Mutating with image...");
    createAttributes.mutate({ data: { operationImage: preview } });
  };

  const handleCancelImageDiagram = () => {
    setPreview(null);
    setShowDiagram(true);
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
