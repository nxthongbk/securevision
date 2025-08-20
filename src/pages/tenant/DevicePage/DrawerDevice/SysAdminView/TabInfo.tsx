import { Avatar, Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import ButtonCustom from '~/components/ButtonCustom';
import StatusChip from '~/components/StatusChip';
import { translationCapitalFirst } from '~/utils/translate';
import PopupEdit from '../../Popup/SysAdminView/PupupEdit';
type Data = {
  key: string;
  lable: string;
  value: string;
};
export default function TabsInforDevice({ props }: { props:  Record<string, any> }) {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const { code, token, deviceProfileName, status, tenant, location } = props;
  const data: Data[] = [
    { key: 'status', lable: translate('device-status'), value: status },
    { key: 'iddevice', lable: translate('label-device-id'), value: code },
    { key: 'token', lable: translate('device-token'), value: token },
    { key: 'tenant', lable: translate('tenant'), value: tenant ? 'Công ty TMA Solutions' : '---' },
    { key: 'location', lable: translate('location'), value: location ? 'SSR. Sai Gon South' : '---' },
    { key: 'deviceProfile', lable: translate('device-profile'), value: deviceProfileName },
    { key: 'type', lable: translate('device-type'), value: 'Cảm biến' },
    { key: 'waitingTime', lable: translate('time-waiting'), value: '5 phút' },
    {
      key: 'description',
      lable: translate('description'),
      value:
        'Chuông báo cháy Horing NQ-418 là một loại thiết bị có khả năng phát ra âm thanh to (90dB @1M) và rõ khi có đám cháy xảy ra. NQ-418 là một bộ phận không thể thiếu trong hệ thống báo cháy. Mục đích là để thông báo cho những người xung quanh biết được sự cố đang xảy ra và có phương án xử lý, di tản kịp thời.'
    }
  ];
  return (
    <div className='w-full flex flex-col justify-start'>
      <div className='h-[132px] flex justify-between items-start'>
        <Avatar variant='rounded' sx={{ width: '120px', height: '120px' }} />
        <div className='flex justify-end items-center gap-4'>
          <ButtonCustom variant='outlined' className='gap-2'>
            <IconPhosphor iconName='CopySimple' size={20} />
            <Typography variant='button3'>Copy ID</Typography>
          </ButtonCustom>
          <ButtonCustom variant='outlined' className='gap-2'>
            <IconPhosphor iconName='CopySimple' size={20} />
            <Typography variant='button3'>Copy Token</Typography>
          </ButtonCustom>
          <PopupEdit props={props} />
        </div>
      </div>
      {data?.map((item: Data, idx: number) => {
        return (
          <div
            className={`w-full flex justify-start items-start py-3 px-4 rounded-md ${idx % 2 === 0 ? ' bg-[var(--grey-primary-60)]' : ''}`}
          >
            <div className='w-[30%]'>
              <Typography variant='label2'>{item.lable}</Typography>
            </div>
            <div className='w-[70%]'>
              {item.key === 'status' ? (
                <StatusChip status={item.value} />
              ) : (
                <Typography variant='body2'>{item.value}</Typography>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
