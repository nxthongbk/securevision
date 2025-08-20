import { Avatar, Box, Stack } from '@mui/material';
import { useState } from 'react';
import { Camera } from '@phosphor-icons/react';
import imageDefault from '~/assets/images/svg/ImageDefaultDevice.svg';
import { resizeImage } from './resizeImage';
import './style.scss';
import { useDownloadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';
interface AvatarUploadProps {
  onFileUpload: (file: any) => void;
  src?: any;
}

export default function ImageUpload({ onFileUpload, src }: AvatarUploadProps) {
  const { imageUrl } = useDownloadFileAvatar(src);
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
    <Stack className='container-img-device'>
      {imageUrl ? (
        <Avatar variant='rounded' src={imageUrl} sx={{ width: '120px', height: '120px' }} />
      ) : (
        <Avatar variant='rounded' src={avatar} sx={{ width: '120px', height: '120px' }} />
      )}
      <Box className='overlay-img' component='label' htmlFor='avatar-upload'>
        <Camera size={'60px'} />
        <input accept='image/*' type='file' hidden id='avatar-upload' onChange={handleImageChange} />
      </Box>
    </Stack>
  );
}
