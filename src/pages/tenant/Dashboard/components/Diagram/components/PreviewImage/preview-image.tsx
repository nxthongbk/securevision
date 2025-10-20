import { useRef, useState } from 'react';
import { Image } from 'react-feather';
import { Box, Button, Menu, MenuItem, Typography, CircularProgress } from '@mui/material';
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
  const [uploadProgress, setUploadProgress] = useState<number>(0); // 🟢 Added progress state
  const [isSaving, setIsSaving] = useState(false); // 🟢 Added saving state

  const open = Boolean(anchorEl);

  // Convert file to base64 (for images/PDFs)
  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // 3D model upload mutation
  const uploadBabylonAttribute = useMutation({
    mutationFn: (file: File) =>
      dashboardService.uploadAndSaveModel(
        tenantCode,
        dashboard?.id,
        file,
        (percent: number) => setUploadProgress(percent) // 🟢 update progress
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
      resetState();
    },
    onError: (err) => console.error('❌ [3D Upload Error]', err),
  });

  // Reset state helper
  const resetState = () => {
    setShowDiagram?.(true);
    setPreview?.(null);
    setSelectedFile(null);
    setIs3DModel(false);
    setUploadProgress(0);
    setIsSaving(false);
  };

  // Handle image / PDF selection
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

  // Handle 3D model selection
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    // Ensure correct MIME type
    if (file.name.endsWith('.glb')) {
      file = new File([file], file.name, { type: 'model/gltf-binary' });
    } else if (file.name.endsWith('.gltf')) {
      file = new File([file], file.name, { type: 'model/gltf+json' });
    }

    setIs3DModel(true);
    setSelectedFile(file);
    
    const objectUrl = URL.createObjectURL(file);
    setPreview?.(objectUrl);
  };

  // Handle save
  const handleSave = async () => {
    if (!selectedFile) return alert('No file selected.');

    setIsSaving(true);
    setUploadProgress(0);

    try {
      if (is3DModel) {
        await uploadBabylonAttribute.mutateAsync(selectedFile, {
          onError: (err) => console.warn('❌ 3D upload returned error', err),
        });
      } else {
        const base64 = await fileToBase64(selectedFile);

        // Simulate progress for image uploads (since base64 is instant)
        for (let i = 0; i <= 100; i += 20) {
          await new Promise((res) => setTimeout(res, 50));
          setUploadProgress(i);
        }

        await dashboardService.saveEntityAttributes(tenantCode, dashboard?.id, {
          operationImage: base64,
        });
        queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
      }
    } catch (e) {
      console.warn('❌ Upload failed', e);
    } finally {
      setTimeout(() => resetState(), 800);
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
                <BabylonViewer 
                  modelUrl={preview} 
                  editMode={false} 
                  isDraw={false} 
                  areas={[]} 
                />
              </Box>
            ) : (
              <img className="preview" alt="diagram" src={preview} onClick={handleMenuOpen} />
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
              <Button variant="outlined" onClick={handleCancel} disabled={isSaving}>
                {t('cancel')}
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving || uploadBabylonAttribute.isPending}
                sx={{ minWidth: 120 }}
              >
                {isSaving || uploadBabylonAttribute.isPending ? (
                  <>
                    <CircularProgress
                      size={20}
                      variant="determinate"
                      value={uploadProgress}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    {uploadProgress < 100
                      ? `${Math.round(uploadProgress)}%`
                      : t('saving') || 'Saving...'}
                  </>
                ) : (
                  t('save')
                )}
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
