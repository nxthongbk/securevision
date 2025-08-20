import { useEffect, useState } from 'react';
import AddArea from './add-area';
import EditArea from './edit-area';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetDataDevice, useGetLatestTelemetry } from '~/pages/tenant/DevicePage/handleApi';
import { useQueryClient } from '@tanstack/react-query';

interface ModalAreaProps {
  isDraw?: boolean;
  indexSelected?: number;
  show?: boolean;
  setShow?: (value: boolean) => void;
  setPoints?: (points: any[]) => void; // Replace `any` with the specific type if known
  setPolyComplete?: (value: boolean) => void;
  flattenedPoints?: any[]; // Replace `any` with the specific type if known
  width?: number;
  height?: number;
  dataArea?: any; // Replace `any` with the specific type if known
  arrArea?: any[]; // Replace `any` with the specific type if known
  setArrArea?: (value: any[]) => void; // Replace `any` with the specific type if known
  dataDiagram?: any; // Replace `any` with the specific type if known
}

const ModalArea: React.FC<ModalAreaProps> = ({
  isDraw,
  indexSelected,
  show,
  setShow,
  setPoints,
  setPolyComplete,
  flattenedPoints,
  width,
  height,
  dataArea,
  arrArea,
  setArrArea,

}) => {
  const { t } = useTranslation();

  const dataDevice = useGetDataDevice({ page: 0, size: 100, keyword: '' });

  // status when add
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();
  // value device
  const [label, setLabel] = useState('');
  const [nameDevice, setNameDevice] = useState();
  const [deviceId, setDeviceId] = useState();
  const [typeData, setTypeData] = useState<any>();
  const [typeDevice, setTypeDevice] = useState();
  const [loadingTypeData, setLoadingTypeData] = useState(false);
  const [valueDevice, setValueDevice] = useState([]);
  const [valueChange, setValueChange] = useState(false);
  const [type, setType] = useState('edit');
  const [valueTelemetry, setValueTelemetry] = useState([]);
  const [dataSourceModalDiagram, setDataSourceModalDiagram] = useState({});
  const [currTypeValue, setCurrTypeValue] = useState();


  useEffect(() => {
    if (!isDraw) {
      setLabel(arrArea[indexSelected]?.label);
      setNameDevice(arrArea[indexSelected]?.name);
      setTypeDevice(arrArea[indexSelected]?.type);
      setDeviceId(arrArea[indexSelected]?.key);
    }
  }, [show, indexSelected]);

  useEffect(() => {
    if (!isDraw && currTypeValue) {
      handleSelectValue(arrArea[indexSelected]?.telemetry?.map((e) => e.name));
    } else {
      handleSelectValue([]);
    }
  }, [valueTelemetry?.length]);




  // close modal
  const handleClose = () => {
    setShow(false);
    setPoints([]);
    setPolyComplete(false);
  };

  // save
  const handleSaveArea = () => {
    let listArea = [...(dataArea?.length > 0 ? dataArea : [])];
    if (nameDevice === undefined || label === '') setStatus('error');
    else {
      if (isDraw) {
        // find top point ---------------->>
        let topPol = flattenedPoints[1];
        let sumX = 0,
          sumY = 0;
        let listPointResponsive = flattenedPoints?.map((value, idx) => {
          if (idx % 2 === 0) {
            sumX += value;
            return (value /= width);
          } else {
            sumY += value;
            if (topPol > value) topPol = value;
            return (value /= height);
          }
        });

        let centerPol = {
          x: (2 * sumX) / flattenedPoints?.length,
          y: (2 * sumY) / flattenedPoints?.length,
        };
        // -------------------------------->>

        let newArea = {
          name: nameDevice,
          type: typeDevice,
          key: deviceId,
          label: label,
          telemetry: valueDevice,
          textPoint: {
            centerPol: {
              x: centerPol.x / width,
              y: centerPol.y / height,
            },
            topPol: {
              x: centerPol.x / width,
              y: topPol / height,
            },
          },
          polygon: listPointResponsive,
        };

        listArea.push(newArea);
        setArrArea([...arrArea, newArea]);
      } else if (type === 'edit') {
        let newArea = {
          type: typeDevice,
          name: nameDevice,
          key: deviceId,
          label: label,
          telemetry: valueDevice,
          textPoint: listArea[indexSelected].textPoint,
          polygon: listArea[indexSelected].polygon,
        };

        arrArea[indexSelected] = newArea;
        setArrArea(arrArea);
      } else {
        arrArea.splice(indexSelected, 1);
        setArrArea(arrArea);
      }

      // close
      setPoints([]);
      setPolyComplete(false);
      setShow(false);
    }
  };

  const handleSelectedType = (e) => {
    setType(e);
  };

  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: deviceId
  });


  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['lastestTelemetry'] });
  }, [deviceId]);
  useEffect(() => {
    deviceId && setLoadingTypeData(true);
    const latestTelemetry = initLatestTelemetry
    if (latestTelemetry) {
      const keyTelemetry = Object.entries(latestTelemetry?.data?.data)?.map(([key]) => {
        return key;
      });

      const valueTelemetry = Object.entries(latestTelemetry?.data?.data)?.map(
        ([key, val]: [key: any, val: any]) => {
          return [key, val?.value];
        }
      );
      let newArrTele = [],
        arrFilter = [];
      keyTelemetry.map((item) => {
        if (!newArrTele.includes(item)) {
          arrFilter.push(item);
        }
      });
      setValueTelemetry(valueTelemetry);
      setTypeData(arrFilter);
      setLoadingTypeData(false);
    }
  }, [initLatestTelemetry]);


  const columnsModalDiagram = [
    {
      title: t('label'),
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('unit'),
      dataIndex: 'tempo',
      key: 'tempo',
    },
  ];

  const handleSelectDevice = (value) => {
    // setTypeDevice(key.title);
    setNameDevice(value);
    setDeviceId(value);
  };

  const handleSelectValue = (e) => {
    let label = '',
      tempo = '',
      nameValue = '';

    const valueTel = valueTelemetry?.filter((element1) =>
      e.includes(element1[0])
    );
    if (!isDraw) {
      nameValue = arrArea[indexSelected]?.telemetry?.map((e) => e.name);
      label = arrArea[indexSelected]?.telemetry?.map((e) => e.label);
      tempo = arrArea[indexSelected]?.telemetry?.map((e) => e.tempo);
    }
    let newArrValue = valueDevice;
    valueTel.forEach((value) => {
      if (value[0].includes('tem'))
        newArrValue.push({
          label:
            label !== ''
              ? nameValue.includes(value[0])
                ? label[nameValue.indexOf(value[0])]
                : ''
              : '',
          name: value[0],
          value: value?.[1],
          tempo: '°C',
          isShow: true
        });
      else if (value[0].includes('hum'))
        newArrValue.push({
          label:
            label !== ''
              ? nameValue.includes(value[0])
                ? label[nameValue.indexOf(value[0])]
                : ''
              : '',
          name: value[0],
          value: value?.[1]?.value,
          tempo: '%RH',
          isShow: true
        });
      else if (value[0].includes('bat'))
        newArrValue.push({
          label:
            label !== ''
              ? nameValue.includes(value[0])
                ? label[nameValue.indexOf(value[0])]
                : ''
              : '',
          name: value[0],
          value: value?.[1],
          tempo: 'mAh',
          isShow: true
        });
      else
        newArrValue.push({
          label:
            label !== ''
              ? nameValue.includes(value[0])
                ? label[nameValue.indexOf(value[0])]
                : ''
              : '',
          name: value[0],
          value: value?.[1],
          tempo: nameValue.includes(value[0])
            ? tempo[nameValue.indexOf(value[0])]
            : '',
          isShow: true
        });
    });
    setValueChange(!valueChange)
    setValueDevice(newArrValue);
  };
  useEffect(() => {
    setDataSourceModalDiagram(
      valueDevice?.map((value, idx) => ({
        key: 'text',
        label: (
          <TextField
            inputProps={{ maxLength: 14 }}
            fullWidth
            disabled={type === 'delete'}
            onChange={(e) => {
              valueDevice[idx].label = e.target.value;
            }}
            defaultValue={value.label}
          />
        ),
        type: <p>{value.name}</p>,
        tempo: (
          <TextField
            inputProps={{ maxLength: 14 }}
            fullWidth
            disabled={type === 'delete'}
            onChange={(e) => {
              valueDevice[idx].tempo = e.target.value;
            }}
            defaultValue={value.tempo}
          />
        ),
      }))
    );
  }, [valueDevice, valueChange]);

  if (isDraw && dataDevice?.data) {
    return (
      <AddArea
        show={show}
        isDraw={isDraw}
        dataDevice={dataDevice?.data}
        status={status}
        label={label}
        setLabel={setLabel}
        nameDevice={nameDevice}
        typeData={typeData}
        loadingTypeData={loadingTypeData}
        valueDevice={valueDevice}
        type={type}
        handleClose={() => handleClose()}
        handleSaveArea={handleSaveArea}
        handleSelectedType={handleSelectedType}
        dataSourceModalDiagram={dataSourceModalDiagram}
        columnsModalDiagram={columnsModalDiagram}
        handleSelectDevice={handleSelectDevice}
        handleSelectValue={handleSelectValue}
      />
    );
  } else if (arrArea?.length > 0 && dataDevice?.data) {
    return (
      <EditArea
        indexSelected={indexSelected}
        isDraw={isDraw}
        arrArea={arrArea}
        dataDevice={dataDevice?.data}
        status={status}
        label={label}
        nameDevice={nameDevice}
        typeData={typeData}
        loadingTypeData={loadingTypeData}
        valueDevice={valueDevice}
        type={type}
        setLabel={setLabel}
        handleClose={() => handleClose()}
        handleSaveArea={handleSaveArea}
        handleSelectedType={handleSelectedType}
        dataSourceModalDiagram={dataSourceModalDiagram}
        columnsModalDiagram={columnsModalDiagram}
        handleSelectDevice={handleSelectDevice}
        handleSelectValue={handleSelectValue}
        currTypeValue={currTypeValue}
        setCurrTypeValue={setCurrTypeValue}
      />
    );
  } else return <></>;
}

export default ModalArea;