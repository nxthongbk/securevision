import { useState, useEffect } from 'react';
import AddMarker from './babylon-addmarker';
import { useGetDataDevice, useGetLatestTelemetry } from '~/pages/tenant/DevicePage/handleApi';

function ModalMarker({ show, setShow, coords, handleSaveMarker: parentSave, arrayMarker }) {
  const dataDevice = useGetDataDevice({ page: 0, size: 100, keyword: '' });

  const [label, setLabel] = useState('');
  const [nameDevice, setNameDevice] = useState('');
  const [deviceId, setDeviceId] = useState();
  const [typeData, setTypeData] = useState<any>();
  const [loadingTypeData, setLoadingTypeData] = useState(false);
  const [valueDevice, setValueDevice] = useState([]);

  // telemetry fetch
  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: deviceId || "?",
  });

  useEffect(() => {
    deviceId && setLoadingTypeData(true);
    const latestTelemetry = initLatestTelemetry;
    if (latestTelemetry) {
      const keys = Object.keys(latestTelemetry?.data?.data || {});
      setTypeData(keys);
      setLoadingTypeData(false);
    }
  }, [initLatestTelemetry]);

  const handleSelectDevice = (value) => {
    setNameDevice(value);
    setDeviceId(value);
    setValueDevice([]);
  };

  const handleSelectValue = (value) => {
    setValueDevice(value);
  };

  const handleSave = () => {
    if (!label || !nameDevice) return;

    const newMarker = {
      label,
      name: nameDevice,
      deviceId,
      telemetry: valueDevice,
      coords,
    };

    // call parent callback if provided
    parentSave?.(newMarker);

    // reset local form
    setShow(false);
    setLabel('');
    setNameDevice('');
    setValueDevice([]);
  };

  return (
    <AddMarker
      show={show}
      handleClose={() => setShow(false)}
      handleSaveMarker={handleSave}
      label={label}
      setLabel={setLabel}
      nameDevice={nameDevice}
      handleSelectDevice={handleSelectDevice}
      dataDevice={dataDevice?.data?.data?.content || []}
      typeData={typeData}
      loadingTypeData={loadingTypeData}
      valueDevice={valueDevice}
      handleSelectValue={handleSelectValue}
      dataSourceMarker={arrayMarker}
      columnsMarker={[
        { title: 'Label', dataIndex: 'label', key: 'label' },
        { title: 'Type', dataIndex: 'name', key: 'name' },
        { title: 'Value', dataIndex: 'value', key: 'value' },
      ]}
      coords={coords}
    />
  );
}

export default ModalMarker;
