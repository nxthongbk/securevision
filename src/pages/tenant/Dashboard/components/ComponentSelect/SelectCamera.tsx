import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { useGetLocationDetail } from '~/pages/tenant/LocationPage/handleApi';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { CameraDetail } from '~/pages/tenant/ControlCenterPage/components/Popup/AlertPopup';

const SelectCameras = ({
  control,
  isError,
  helperText,
  locationId,
}: {
  control: any;
  isError: boolean;
  helperText: string;
  locationId: string;
}) => {
  const { tenantCode } = useTenantCode();
  const [cameraList, setCameraList] = useState([]);
  const { data: detail } = useGetLocationDetail(locationId, tenantCode);

  const {
    field: { value: selectedDeviceId, onChange },
  } = useController({
    name: 'deviceId',
    control,
    defaultValue: '',
  });

  useEffect(() => {
    if (detail) {
      setCameraList(detail?.data?.cameraList);
    }
  }, [detail?.data]);

  return (
    <>
      {cameraList?.length > 0 && (
        <div className="flex flex-col gap-3">
          {cameraList.map((deviceInfo, index) => (
            <div
              key={index}
              className={`mx-2 p-2 hover:cursor-pointer rounded-lg ${
                deviceInfo.id === selectedDeviceId ? 'bg-slate-400' : 'hover:bg-slate-300'
              }`}
              onClick={() => onChange(deviceInfo.id)}
            >
              <CameraDetail deviceInfo={deviceInfo} />
            </div>
          ))}
        </div>
      )}
      {isError && <p className="text-red-500">{helperText}</p>}
    </>
  );
};

export default SelectCameras;
