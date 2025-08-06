import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { useDeleteAttributes } from '../handleApi';

export default function PopupDeleteAttributeDevice({
  deviceId,
  keyAtrribute
}: {
  deviceId: string;
  keyAtrribute: string;
}) {
  const { isPending, isSuccess, mutate } = useDeleteAttributes();
  const handleDelete = () => {
    mutate({ deviceId, keyAtrribute });
  };

  return (
    <PopupCoverDelete
      isSuccess={isSuccess}
      handleSubmit={handleDelete}
      title='devicePage.delete-attribute'
      message='devicePage.delete-attribute-device-message'
      isLoading={isPending}
    />
  );
}
