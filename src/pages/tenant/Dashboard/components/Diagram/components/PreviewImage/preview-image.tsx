import { useRef, useState } from 'react';
import { Image } from 'react-feather';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { convertPdfToImages } from '~/utils/PDFResolver';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '~/services/dashboard.service';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { ImageIcon, Cube } from '@phosphor-icons/react';
import BabylonViewer from '../../../Babylon/babylon-scene';

interface PreviewImageProps {
  preview?: string;
  setPreview?: (val: string | null) => void;
  setShowDiagram?: (val: boolean) => void;
  dashboard: any;
}

const PreviewImage = ({ preview, setPreview, setShowDiagram, dashboard }: PreviewImageProps) => {
  const { t } = useTranslation();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { tenantCode } = useTenantCode();

  const [is3DModel, setIs3DModel] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // ✅ Mutations (direct file upload)
  const uploadBabylonAttribute = useMutation({
    mutationFn: (file: File) =>
      dashboardService.uploadAndSaveModel(tenantCode, dashboard?.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
      resetState();
    },
    onError: (err) => console.error('❌ [3D Upload Error]', err),
  });

  const uploadImageAttribute = useMutation({
    mutationFn: (file: File) =>
      dashboardService.saveEntityAttributes(tenantCode, dashboard?.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
      resetState();
    },
    onError: (err) => console.error('❌ [Image Upload Error]', err),
  });

  const resetState = () => {
    setShowDiagram?.(true);
    setPreview?.(null);
    setSelectedFile(null);
    setIs3DModel(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIs3DModel(false);
    setSelectedFile(file);

    if (file.type === 'application/pdf') {
      const url = await convertPdfToImages(file);
      setPreview?.(url);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => setPreview?.(event.target?.result?.toString() || '');
      reader.readAsDataURL(file);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIs3DModel(true);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview?.(objectUrl);
  };

  const handleSave = () => {
    if (!selectedFile) return alert('No file selected.');

    if (is3DModel) {
      console.log('🟣 Uploading 3D model directly...');
      uploadBabylonAttribute.mutate(selectedFile);
    } else {
      console.log('🟡 Uploading image directly...');
      uploadImageAttribute.mutate(selectedFile);
    }
  };

  const handleCancel = resetState;
  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleUploadImageClick = () => {
    handleMenuClose();
    imageInputRef.current?.click();
  };
  const handleUploadModelClick = () => {
    handleMenuClose();
    modelInputRef.current?.click();
  };

  return (
    <Box className="imageUploadContainer">
      <Box className="previewWrapper">
        {preview ? (
          <>
            {is3DModel ? (
              <Box sx={{ width: '100%', height: 400 }}>
                <BabylonViewer width={800} height={400} editMode={false} modelUrl={preview} />
              </Box>
            ) : (
              <img className="preview" alt="diagram" src={preview} onClick={handleMenuOpen} />
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
              <Button variant="outlined" onClick={handleCancel}>
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={uploadImageAttribute.isPending || uploadBabylonAttribute.isPending}
              >
                {uploadImageAttribute.isPending || uploadBabylonAttribute.isPending
                  ? t('saving...')
                  : t('save')}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box
              onClick={handleMenuOpen}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Image className="preview" width={150} />
              <Typography sx={{ textAlign: 'center', mt: 2 }}>{t('upload-file')}</Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MenuItem onClick={handleUploadImageClick}>
                <ImageIcon size={20} className="mr-2" /> {t('upload image')}
              </MenuItem>
              <MenuItem onClick={handleUploadModelClick}>
                <Cube size={20} className="mr-2" /> {t('upload 3D model')}
              </MenuItem>
            </Menu>

            <input
              type="file"
              style={{ display: 'none' }}
              ref={imageInputRef}
              accept="image/*,application/pdf"
              onChange={handleImageChange}
            />
            <input
              type="file"
              style={{ display: 'none' }}
              ref={modelInputRef}
              accept=".glb,.gltf,.obj,.stl"
              onChange={handleModelChange}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default PreviewImage;
