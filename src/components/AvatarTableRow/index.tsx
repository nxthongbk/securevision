import { Avatar, AvatarProps } from '@mui/material';
import defaultImage from '~/assets/images/svg/ImageDefaultDevice.svg';
import { useDownloadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';

type Props = {
  avatarUrl: string;
} & AvatarProps;

export default function AvatarTableRow(props: Props) {
  const { avatarUrl, ...rest } = props;
  const { imageUrl } = useDownloadFileAvatar(avatarUrl);
  return (
    <Avatar
      src={imageUrl || defaultImage}
      variant='rounded'
      style={{ objectFit: 'cover', borderRadius: '8px' }}
      {...rest}
    />
  );
}
