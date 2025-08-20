import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { useDeleteAlarmConfig } from '~/pages/systemAdmin/SysDevicePage/handleApi';

export default function PopupDeleteAlarmConfig({ deviceId, telemetry }: { deviceId: string; telemetry: string }) {
  const { isPending, isSuccess, mutate } = useDeleteAlarmConfig();
  const handleDelete = () => {
    mutate({ deviceId, telemetry });
  };

  return (
    <PopupCoverDelete
      isSuccess={isSuccess}
      handleSubmit={handleDelete}
      title='devicePage.delete-alarm-device'
      message='devicePage.delete-attribute-device-message'
      isLoading={isPending}
    />
  );
}
