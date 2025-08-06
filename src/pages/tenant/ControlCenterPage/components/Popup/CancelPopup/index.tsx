import { MenuItem, Typography } from '@mui/material';
import { Check, X } from '@phosphor-icons/react';
import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ButtonCustom from '~/components/ButtonCustom';
import DialogCustom from '~/components/DialogCustom';
import SelectCustom from '~/components/SelectCustom';
import Textarea from '~/components/Textarea';
import { AppContext } from '~/contexts/app.context';

interface IFormInput {
  reason: string;
  note: string;
}

export default function CancelPopup() {
  const { openCancelPopup, fakeData, setFakeData, setOpenMarkerPopup, setOpenAlertPopup, setOpenCancelPopup } =
    useContext(AppContext);
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      reason: '',
      note: ''
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log('==============> LOG for BUILD', data);
    const newFakeData = fakeData.map((item) => {
      if (item.id === openCancelPopup.id) {
        return { ...item, status: 'ACTIVE' };
      }
      return item;
    });

    setFakeData(newFakeData);
    setOpenCancelPopup(null);
    setOpenMarkerPopup(null);
  };

  const handleClose = () => {
    setOpenAlertPopup(openCancelPopup);
    setOpenCancelPopup(null);
  };

  return (
    <DialogCustom
      open={Boolean(openCancelPopup)}
      title='Bỏ qua cảnh báo'
      maxWidth='600px'
      handleClose={handleClose}
      content={
        <form className='px-4 py-6'>
          <SelectCustom
            control={control}
            name='reason'
            label='Lý do'
            isRequired
            classNameContainer='mb-3'
            displayEmpty
            renderValue={
              watch('reason') === ''
                ? () => (
                    <Typography variant='body3' color='var(--grey-neutral-300)'>
                      Chọn lý do
                    </Typography>
                  )
                : null
            }
          >
            <MenuItem value={10}>Kiểm tra bảo trì</MenuItem>
            <MenuItem value={20}>Cảnh báo giả</MenuItem>
            <MenuItem value={30}>Lỗi cảm biến</MenuItem>
            <MenuItem value={40}>Khác</MenuItem>
          </SelectCustom>
          <Textarea
            name='note'
            label='Ghi chú'
            control={control}
            placeholder='Nhập ghi chú'
            className='resize-none min-h-[96px] border border-[var(--grey-neutral-100)] px-4 py-3 rounded-md outline-none text-sm font-normal'
          />
        </form>
      }
      footer={
        <div className='flex gap-4'>
          <ButtonCustom
            onClick={handleClose}
            variant='contained'
            startIcon={<X />}
            className='!bg-[var(--button-Tertiary-default)] !text-[var(--text-primary)] !font-semibold'
          >
            Huỷ
          </ButtonCustom>
          <ButtonCustom variant='contained' startIcon={<Check />} onClick={handleSubmit(onSubmit)}>
            Lưu
          </ButtonCustom>
        </div>
      }
    />
  );
}
