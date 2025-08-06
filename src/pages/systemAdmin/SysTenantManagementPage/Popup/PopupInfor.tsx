import AvatarTableTenant from '../AvatarTenant';
import PopupInfoCover from '~/components/Modal/InforPopupCover';
import StatusChip from '~/components/StatusChip';
import { Typography } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';

export default function PopupInforTenant({ props }: { props: any }) {
  const { email, phoneNumber, status, tenant, userName, avatarUrl, footerBtn, openInfo, tenantId } = props;
  const translate = (text: string) => translationCapitalFirst(text, 'tenantPage');
  const data = [
    { key: 'ID', value: tenantId },
    { key: translate('tenant'), value: tenant },
    { key: translate('user-name'), value: userName },
    { key: translate('phone-number'), value: phoneNumber },
    { key: translate('email'), value: email },
    { key: translate('status'), value: status }
  ];

  const bodyPopup = () => {
    return (
      <div className='gap-2 flex flex-col'>
        <div className='flex justify-center w-full'>
          <AvatarTableTenant avatarUrl={avatarUrl} sx={{ height: '120px', width: '120px' }} />
        </div>
        {data?.map((item: any, idx: number) => {
          return (
            <div
              key={idx}
              className={`flex justify-start items-center w-full px-4 py-3 ${idx % 2 === 0 ? ' bg-[var(--grey-primary-60)] rounded-md' : ''}`}
            >
              <div className='w-[40%]'>
                <Typography variant='label3'>{item.key}</Typography>
              </div>
              <div className='w-[60%]'>
                {item.key === translate('status') ? (
                  <StatusChip status={item.value} />
                ) : (
                  <Typography
                    variant='body3'
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}
                  >
                    {item.value}
                  </Typography>
                )}
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
      childrent={bodyPopup()}
      title={translate('tenant-infor')}
      footerBtn={footerBtn}
    />
  );
}
