import './style.scss';

import { Avatar, Box, Stack, SxProps, Theme } from '@mui/material';
import { useEffect, useState } from 'react';

import { Camera } from '@phosphor-icons/react';
import imageDefault from '~/assets/images/svg/ImageDefaultDevice.svg';
import { resizeImage } from '../ImageUpload/resizeImage';
import { useTranslation } from 'react-i18next';

interface AvatarUploadProps {
  onFileUpload: (file: any) => void;
  src?: any;
  avatarSx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
  asyncLoadAvatar?: boolean;
}

export default function AvatarUpload({
  onFileUpload,
  src,
  avatarSx,
  inputSx,
  asyncLoadAvatar = false
}: AvatarUploadProps) {
  const [t] = useTranslation('', { keyPrefix: 'setting' });
  const [avatar, setAvatar] = useState<string | null>(src || imageDefault);
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("invalid-avatar-file-format"))
        return;
      }
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

  useEffect(() => {
    if (asyncLoadAvatar) setAvatar(src);
  }, [asyncLoadAvatar, src]);

  return (
    <Stack className='container-avatar'>
      <Avatar
        variant='rounded'
        src={avatar}
        sx={[{ width: '120px', height: '120px' }, ...(Array.isArray(avatarSx) ? avatarSx : [avatarSx])]}
      />
      <Box
        className='overlay'
        component='label'
        htmlFor='avatar-upload'
        sx={[...(Array.isArray(inputSx) ? inputSx : [inputSx])]}
      >
        <Camera size={'40px'} />
        <input accept='image/*' type='file' hidden id='avatar-upload' onChange={handleImageChange} />
      </Box>
    </Stack>
  );
}
