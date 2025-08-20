import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import './style.scss';
import { Camera } from '@phosphor-icons/react';
import { resizeImage } from '../ImageUpload/resizeImage';
import imageDefault from '~/assets/images/svg/ImageDefaultDevice.svg';
import { translationCapitalFirst } from '~/utils/translate';
interface AvatarUploadProps {
  onFileUpload: (file: any) => void;
  src?: any;
}

export default function AvatarUploadDeviceProfile({ onFileUpload, src }: AvatarUploadProps) {
  const [avatar, setAvatar] = useState<string | null>(imageDefault);
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Đoạn này để truyền file ra ngoài component cha
      const resizedImage: any = await resizeImage(file, 500, 500);
      if (resizedImage) {
        const formData = new FormData();
        formData.append('file', resizedImage);
        onFileUpload(formData);
      }
    }
  };
  return (
    <Stack className='container-avatar-device'>
      <Typography variant='label3' className='!mb-1'>
        {translationCapitalFirst('image')} <span className='text-[var(--semantic-alert)]'>*</span>
      </Typography>
      {avatar ? (
        <Avatar variant='rounded' src={avatar} sx={{ width: '72px', height: '72px' }} />
      ) : (
        <Avatar variant='rounded' src={src ? src : null} sx={{ width: '72px', height: '72px' }} />
      )}
      <Box className='overlay-device' component='label' htmlFor='avatar-upload'>
        <Camera size={'30px'} />
        <input accept='image/*' type='file' hidden id='avatar-upload' onChange={handleImageChange} />
      </Box>
    </Stack>
  );
}
