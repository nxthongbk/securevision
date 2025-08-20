import { Typography } from '@mui/material';
import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { translationCapitalFirst } from '~/utils/translate';

export default function PopupCloseAlarmDevice({ id }: { id: string }) {
  const handleDelete = () => {
    console.log(id);
    // mutate();
  };
  const btnComponent = (
    <div className='bg-[var(--button-Tertiary-default)] h-8 rounded px-3 flex justify-center items-center w-full'>
      <Typography variant='button3'>{translationCapitalFirst('close-alarm', 'devicePage')}</Typography>
    </div>
  );

  return (
    <PopupCoverDelete
      btnComponent={btnComponent}
      isSuccess={false}
      handleSubmit={handleDelete}
      title='devicePage.close-alarm-device'
      message='devicePage.close-alarm-device-message'
      isLoading={false}
    />
  );
}
