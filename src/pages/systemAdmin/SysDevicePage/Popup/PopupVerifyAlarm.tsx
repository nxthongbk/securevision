import { Typography } from '@mui/material';
import ButtonCustom from '~/components/ButtonCustom';
import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { translationCapitalFirst } from '~/utils/translate';

export default function PopupVerifyAlarm({ id }: { id: string }) {
  const handleDelete = () => {
    console.log(id);
    // mutate();
  };
  const btnComponent = (
    <div className='bg-[var(--button-Tertiary-default)] h-8 rounded px-3 flex justify-center items-center w-full'>
      <Typography variant='button3'>{translationCapitalFirst('verify')}</Typography>
    </div>
  );

  const renderGroupActionButton = (onClose) => {
    return (
      <>
        <ButtonCustom className='!bg-[#D9E1E8]' variant='contained' color='tertiary' onClick={onClose}>
          <Typography variant='button3' fontWeight={600}>
            {translationCapitalFirst('cancel')}
          </Typography>
        </ButtonCustom>
        <ButtonCustom className='hover:bg-white' color='primary' variant='contained' onClick={onClose}>
          <Typography variant='button3' fontWeight={600}>
            {translationCapitalFirst('verify', 'deviceProfile')}
          </Typography>
        </ButtonCustom>
      </>
    );
  };

  return (
    <PopupCoverDelete
      btnComponent={btnComponent}
      isSuccess={false}
      handleSubmit={handleDelete}
      title='devicePage.verify-alarm'
      message=''
      isLoading={false}
      customGroupActionButton={renderGroupActionButton}
    />
  );
}
