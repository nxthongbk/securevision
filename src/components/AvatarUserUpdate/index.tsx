import { Avatar } from '@mui/material';
import { Camera, User } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import fileStorageService from '~/services/fileStorage.service';
import { resizeImage } from '~/utils/resizeImage';

interface IProps {
  onFileUpload?: (file: any) => void;
  avatarUrl?: string;
}

export default function AvatarUserUpdate(props: IProps) {
  const [t] = useTranslation('', { keyPrefix: 'setting' });
  const { avatarUrl, onFileUpload } = props;
  const [avatar, setAvatar] = useState<string | null>('');
  const { data: img } = useQuery({
    queryKey: ['userImg', avatarUrl],
    queryFn: async () => {
      const res: any = await fileStorageService.getFileImage(avatarUrl);
      if (res !== undefined) {
        let url = URL.createObjectURL(res);
        return url;
      }
      return '';
    }
  });

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
    setAvatar(img);
  }, [img]);

  return (
    <div className='relative !w-[120px] !h-[120px] mb-[16px]'>
      <Avatar src={avatar} className='!w-[120px] !h-[120px]  !bg-[#EAEBEB]'>
        <User size={64} color='var(--grey-neutral-300)' />
      </Avatar>
      <label
        htmlFor='avatar-upload'
        className='absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-out opacity-0 cursor-pointer bg-[rgba(0,_0,_0,_0.5)] hover:opacity-100 rounded-full flex items-center justify-center'
      >
        <Camera size={64} color='var(--white)' />
        <input accept='image/*' type='file' hidden id='avatar-upload' onChange={handleImageChange} />
      </label>
    </div>
  );
}
