import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Img from '~/assets/images/svg/repainr.svg';
import ButtonCustom from '~/components/ButtonCustom';

export default function ReportPage() {
  const navigate = useNavigate();
  return <div className='flex items-center justify-center w-screen h-screen'>
    <div className='flex flex-col items-center'>
      <img alt='error' src={Img} className='max-w-[400px] max-h-[400px]' />
      <div className='flex flex-col items-center justify-center mt-14'>
        <Typography variant='h4'>Trang đang được bảo trì</Typography>
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
  </div>;
}
