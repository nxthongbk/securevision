import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Img from '~/assets/images/svg/404Error.svg';
import ButtonCustom from '~/components/ButtonCustom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center h-screen w-screen'>
      <div className='flex flex-col items-center'>
        <img alt='error' src={Img} className='max-w-[400px] max-h-[400px]' />
        <div className='flex flex-col justify-center items-center mt-14'>
          <Typography variant='h4'>Trang bạn muốn tìm không tồn tại</Typography>
          <ButtonCustom
            variant='contained'
            onClick={() => {
              navigate(-1);
            }}
            className='!w-[120px] !h-[48px] !mt-6'
          >
            <Typography variant='button1'>Quay về</Typography>
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
}
