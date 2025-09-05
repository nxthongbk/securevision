import IconPhosphor from '~/assets/iconPhosphor';
import Img from '~/assets/images/png/Building.png';
import StatusChip from '~/components/StatusChip';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface IProps {
  info: any;
}

export default function CommonInfoLocation({ info }: IProps) {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col text-white  '>
      <div className='py-3 flex justify-center tablet:justify-start'>
        <img src={Img} className='w-[72px] h-[72px]  ' />
      </div>
      <div className='flex w-fullb px-4 py-3  '>
        <Typography variant='label2' className='w-[26%] '>
          {t('alarm-page.status')}
        </Typography>
        <Typography variant='body2' className='flex-1'>
          <StatusChip status={info?.status} />
        </Typography>
      </div>
      <div className='flex w-full px-4 py-3 bg-[#00BCFF12]  '>
        <Typography variant='label2' className='w-[26%]'>
          ID
        </Typography>
        <Typography variant='body2' className='flex-1'>
          {info?.code ? String(info?.code).padStart(4, '0') : ''}
        </Typography>
      </div>
      <div className='flex w-full   px-4 py-3'>
        <Typography variant='label2' className='w-[26%]'>
          {t('locationPage.name')}
        </Typography>
        <Typography variant='body2' className='flex-1'> 
          {info?.name}
        </Typography>
      </div>
      <div className='flex w-full px-4 py-3 bg-[#00BCFF12]  '>
        <Typography variant='label2' className='w-[26%]'>
          {t('alarm-page.address')}
        </Typography>
        <Typography variant='body2' className='flex-1'>
          {info?.address}
        </Typography>
      </div>
      <div className='flex w-full px-4 py-3  '>
        <Typography variant='label2' className='w-[26%]'>
          {t('locationPage.coordinate')}
        </Typography>
        <Typography variant='body2' className='flex-1'>
          {info?.location?.latitude}, {info?.location?.longitude}
        </Typography>
      </div>

      <div className='flex w-full px-4 py-3 bg-[#00BCFF12] '>
        <Typography variant='label2' className='w-[26%]'>
          {t('locationPage.manager')}
        </Typography>
        <div className='flex items-center gap-2'>
          <img src={Img} className='w-[32px] h-[32px] ' />
          <div className='flex flex-col'>
            <Typography variant='body2' className='flex-1'>
              {info?.operatorInfo?.name}
            </Typography>
            <div className='flex gap-[2px]'>
              <IconPhosphor iconName='Phone' size={16} />
              <Typography variant='caption1' className='flex-1'>
                {info?.operatorInfo?.phone}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
