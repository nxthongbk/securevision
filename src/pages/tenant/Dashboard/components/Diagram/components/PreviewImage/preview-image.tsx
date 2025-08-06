import { useRef } from 'react';

import { Image } from 'react-feather';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { convertPdfToImages } from '~/utils/PDFResolver';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '~/services/dashboard.service';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { resizeImage } from '~/utils/resizeImage';

const PreviewImage = ({ preview, setPreview, setShowDiagram, dashboard, setImageDiagram }: { preview?: any, setPreview?: any, setShowDiagram?: any, dashboard: any, setImageDiagram?: any }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file.type !== 'application/pdf') {
      let reader = new FileReader();

      reader.onload = function (e) {
        let img = document.createElement('img');
        const sizeW = 1800,
          sizeH = 1000;
        const resizedImage: any = resizeImage(file, sizeW, sizeH);
        if (resizedImage) {
          resizedImage.then((resizedImage) => {
            const formData = new FormData();
            formData.append('file', resizedImage);
          });
        }
        img.onload = function () {
          // Dynamically create a canvas element
          let canvas = document.createElement('canvas');
          canvas.width = sizeW;
          canvas.height = sizeH;

          let ctx = canvas.getContext('2d');

          // Actual resizing
          ctx.drawImage(img, 0, 0, sizeW, sizeH);

          // Show resized image in preview element
          let dataurl = canvas.toDataURL(file.type);

          setPreview(dataurl);
        };
        img.src = e.target.result.toString();
      };

      reader.readAsDataURL(file);
    } else {
      convertPdfToImages(file).then((url) => {
        let img = document.createElement('img');
        const sizeW = 1800,
          sizeH = 1000;

        img.onload = function (event) {
          console.log(event)
          // Dynamically create a canvas element
          let canvas = document.createElement('canvas');
          canvas.width = sizeW;
          canvas.height = sizeH;

          let ctx = canvas.getContext('2d');

          // Actual resizing
          ctx.drawImage(img, 0, 0, sizeW, sizeH);

          // Show resized image in preview element
          let dataurl = canvas.toDataURL(file.type);

          setPreview(dataurl);
        };
        img.src = url;
      });
      window.console.log = () => { };
    }
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const { tenantCode } = useTenantCode();
  const createAtributes = useMutation({
    mutationFn: (body: { data: any }) => {
      return dashboardService.saveEntityAttributes(tenantCode, dashboard?.id, body.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
    }
  });



  const handleSaveImageDiagram = () => {
    const arrMachine = [];
    const listArea = [];
    createAtributes.mutate({
      data: {
        operationData: arrMachine,
        listArea: listArea,
      }
    });
    createAtributes.mutate({
      data: {
        operationImage: preview,
      }
    });
    setImageDiagram(preview);
    setShowDiagram(true);
  }

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
              alt="avatar"
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
              <Button
                variant="outlined"
                onClick={handleCancelImageDiagram}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveImageDiagram}
              >
                {t('save')}
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
              accept="image/*"
              onChange={handleImageChange}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default PreviewImage;