import { Avatar, AvatarProps } from '@mui/material';
import defaultImage from '~/assets/images/svg/ImageDefaultDevice.svg';
import { useDownloadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';
type Aprops = {
  avatarUrl: string;
} & AvatarProps;
export default function AvatarTableDeviceProfile(props: Aprops) {
  const { avatarUrl, ...rest } = props;
  const { imageUrl } = useDownloadFileAvatar(avatarUrl);
  return <Avatar src={imageUrl || defaultImage} variant='rounded' {...rest} />;
}
