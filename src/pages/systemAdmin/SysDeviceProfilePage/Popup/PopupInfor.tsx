import AvatarTableDeviceProfile from '../AvatarDeviceProfile';
import PopupInfoCover from '~/components/Modal/InforPopupCover';
import { Typography } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';


export default function PopupInforDeviceProfile({ stt, imageUrl, name, signalWaitingTime, totalDevices, type, description, footerBtn, openInfo }: any) {
  const translate = (text: string) => translationCapitalFirst(text, 'deviceProfile');
  const data = [
    { key: 'ID', value: stt },
    { key: translate('device-profile-name'), value: name },
    { key: translate('type-device'), value: type?.label },
    { key: translate('time-waiting'), value: `${signalWaitingTime / 60000} phút` },
    { key: translate('total-device'), value: totalDevices?.total },
    {
      key: translate('description'),
      value: description
    }
  ];
  const bodyPopup = () => {
    return (
      <div className=' flex flex-col items-center min-h-[300px]'>
        <AvatarTableDeviceProfile avatarUrl={imageUrl} sx={{ width: '120px', height: '120px', mb: '8px' }} />
        {data?.map((item: any, idx: number) => {
          return (
            <div
              key={idx}
              className={`flex justify-start items-start w-full px-4 py-3 ${idx % 2 === 0 ? 'bg-[var(--grey-primary-60)] rounded-md' : ''}`}
            >
              <div className='w-[40%]'>
                <Typography
                  variant='label3'
                  className='break-words'
                  style={{
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal'
                  }}
                >
                  {item.key}
                </Typography>
              </div>
              <div className='w-[60%]'>
                <Typography
                  variant='body2'
                  className='break-words'
                  style={{
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal'
                  }}
                >
                  {item.value}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <PopupInfoCover
      openOver={openInfo}
      footerBtn={footerBtn}
      childrent={bodyPopup()}
      title={translationCapitalFirst('infor-device-profile', 'deviceProfile')}
    />
  );
}
