import { Avatar, AvatarProps } from '@mui/material';
import { useDownloadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';
type Aprops = {
  avatarUrl: string;
} & AvatarProps;
export default function AvatarTableTenant(props: Aprops) {
  const { avatarUrl, ...rest } = props;
  const { imageUrl } = useDownloadFileAvatar(avatarUrl);
  return <Avatar variant='rounded' src={imageUrl} {...rest} />;
}
