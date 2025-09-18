import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconPhosphor from '~/assets/iconPhosphor';
import Img from '~/assets/images/png/Building.png';
import StatusChip from '~/components/StatusChip';

interface IProps {
  info: any;
}

export default function CommonInfoLocation({ info }: IProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col tablet:flex-row text-white gap-4">
      {/* Left column: location image */}
      <div className="flex items-center justify-center px-4 py-3 tablet:w-[20%]">
        <img
          src={Img}
          alt="Location"
          className="w-[96px] h-[96px] object-cover rounded-lg"
        />
      </div>

      {/* Right column: details */}
      <div className="flex flex-col flex-1 pr-6">

        <div className="flex w-full px-4 py-2 ">
          <Typography variant="label2" className="w-[26%] text-white">
            {t('locationPage.name')}
          </Typography>
          <Typography variant="body2" className="flex-1 text-white">
            {info?.name}
          </Typography>
        </div>

        <div className="flex w-full px-4 py-2 bg-[#00BCFF12]">
          <Typography variant="label2" className="w-[26%] text-white">
            {t('alarm-page.status')}
          </Typography>
          <Typography variant="body2" className="flex-1 text-white">
            <StatusChip status={info?.status} />
          </Typography>
        </div>

        

        <div className="flex w-full px-4 py-2">
          <Typography variant="label2" className="w-[26%] text-white">
            {t('alarm-page.address')}
          </Typography>
          <Typography variant="body2" className="flex-1 text-white">
            {info?.address}
          </Typography>
        </div>

        <div className="flex w-full px-4 py-2 bg-[#00BCFF12]">
          <Typography variant="label2" className="w-[26%] text-white">
            {t('locationPage.manager')}
          </Typography>
          <div className="flex items-center gap-2">
            <img
              src={Img}
              alt="Manager"
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <div className="flex flex-col">
              <Typography variant="body2" className="flex-1 text-white">
                {info?.operatorInfo?.name}
              </Typography>
              <div className="flex gap-[2px] items-center">
                <IconPhosphor iconName="Phone" size={16} />
                <Typography variant="caption1" className="flex-1 text-white">
                  {info?.operatorInfo?.phone}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
