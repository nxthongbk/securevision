import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TableCustom from '../Diagram/components/Table/table';
import SelectCustom from '~/components/SelectCustom';
import InputCustom from '~/components/InputCustom';
import ButtonCustom from '~/components/ButtonCustom';
import { useGetDataDevice, useGetLatestTelemetry } from '~/pages/tenant/DevicePage/handleApi';
import { useQueryClient } from '@tanstack/react-query';

interface TelemetryValue {
  label: string;
  name: string;
  value: any;
  tempo: string;
  isShow: boolean;
}

function AddArea3D(props) {
  const {
    show,
    isDraw,
    setShow,
    flattenedPoints3D,
    width,
    height,
    depth,
    arrArea,
    setArrArea,
    setPoints,
    setPolyComplete,
  } = props;

  const { t } = useTranslation();
  const dataDevice = useGetDataDevice({ page: 0, size: 100, keyword: '' });

  const [label, setLabel] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [nameDevice, setNameDevice] = useState('');
  const [typeData, setTypeData] = useState<string[]>([]);
  const [valueTelemetry, setValueTelemetry] = useState<[string, any][]>([]);
  const [loadingTypeData, setLoadingTypeData] = useState(false);
  const [valueDevice, setValueDevice] = useState<TelemetryValue[]>([]);

  // Fetch telemetry
  const {
    data: initLatestTelemetry,
    refetch: refetchTelemetry,
    isFetching,
  } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: deviceId,
  });

  // Refetch when device changes
  useEffect(() => {
    if (deviceId) refetchTelemetry();
  }, [deviceId]);

  // Process telemetry data
  useEffect(() => {
    if (!deviceId) return;
    if (!initLatestTelemetry?.data?.data) return;

    setLoadingTypeData(true);
    const entries = Object.entries(initLatestTelemetry.data.data);
    const keys = entries.map(([key]) => key);
    const vals = entries.map(([key, val]) => [key, (val as { value?: any })?.value]);

    setValueTelemetry(vals);
    setTypeData(keys);
    setLoadingTypeData(false);
  }, [initLatestTelemetry]);

  const handleClose = () => {
    setShow(false);
    setPoints?.([]);
    setPolyComplete?.(false);
  };

  const handleSelectDevice = (value: string) => {
    const selected = dataDevice?.data?.content?.find((d) => d.id === value);
    setDeviceId(value);
    setNameDevice(selected?.name ?? '');
  };

  const handleSelectValue = (selected: string[]) => {
    const selectedTelemetry = valueTelemetry.filter(([key]) => selected.includes(key));
    const mapped: TelemetryValue[] = selectedTelemetry.map(([key, val]) => ({
      label: '',
      name: key,
      value: val,
      tempo: key.includes('tem')
        ? '°C'
        : key.includes('hum')
        ? '%RH'
        : key.includes('bat')
        ? 'mAh'
        : '',
      isShow: true,
    }));
    setValueDevice(mapped);
  };

  const handleSaveArea = () => {
    if (!deviceId || !label) return;

    const normalizedPoints: number[] = [];
    let sumX = 0,
      sumY = 0,
      sumZ = 0;

    flattenedPoints3D?.forEach((val: number, idx: number) => {
      const axis = idx % 3;
      if (axis === 0) {
        sumX += val / width;
        normalizedPoints.push(val / width);
      } else if (axis === 1) {
        sumY += val / height;
        normalizedPoints.push(val / height);
      } else {
        sumZ += val / depth;
        normalizedPoints.push(val / depth);
      }
    });

    const len = flattenedPoints3D?.length ?? 3;
    const center = {
      x: (sumX * 3) / len,
      y: (sumY * 3) / len,
      z: (sumZ * 3) / len,
    };

    const newArea = {
      name: nameDevice,
      key: deviceId,
      label,
      telemetry: valueDevice,
      polygon3D: normalizedPoints,
      center,
    };

    setArrArea?.([...(arrArea ?? []), newArea]);
    handleClose();
  };

  const optionDeviceProfile = useMemo(() => {
    return dataDevice?.data?.content?.map((item) => (
      <MenuItem value={item.id} key={item.id}>
        {item.name}
      </MenuItem>
    ));
  }, [dataDevice?.data]);

  const optionTelemetry = useMemo(() => {
    return typeData?.map((item) => (
      <MenuItem value={item} key={item}>
        {item}
      </MenuItem>
    ));
  }, [typeData]);

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          width: '600px',
          maxHeight: '90vh',
          height: '800px',
          backgroundColor: 'var(--bg)',
        },
      }}
    >
      <DialogTitle>{isDraw ? t('Add 3D Zone') : t('Edit 3D Zone')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* --- Zone Label --- */}
          <Grid item mobile={12}>
            <InputCustom
              fullWidth
              variant="outlined"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              label={t('Zone Name')}
              inputProps={{ maxLength: 14 }}
              isRequired
            />
          </Grid>

          {/* --- Device Selector --- */}
          <Grid item mobile={12}>
            <SelectCustom
              name="deviceId"
              isRequired
              label={t('Device')}
              placeholderText={t('Select Device')}
              children={optionDeviceProfile}
              value={deviceId}
              onChange={(e) => handleSelectDevice(e.target.value)}
            />
          </Grid>

          {/* --- Telemetry --- */}
          {loadingTypeData || isFetching ? (
            <Grid item mobile={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : (
            typeData?.length > 0 && (
              <Grid item mobile={12}>
                <SelectCustom
                  name="telemetryId"
                  isRequired
                  label={t('Telemetry')}
                  placeholderText={t('Select Telemetry')}
                  children={optionTelemetry}
                  multiple
                  isSelectAll
                  value={valueDevice.map((v) => v.name)}
                  onChange={(e) => handleSelectValue(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected?.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                />
              </Grid>
            )
          )}

          {/* --- Table --- */}
          {valueDevice.length > 0 && (
            <Grid item mobile={12}>
              <TableCustom
                dataSource={valueDevice.map((v, i) => ({
                  key: i,
                  label: (
                    <InputCustom
                      fullWidth
                      variant="outlined"
                      value={v.label}
                      onChange={(e) => {
                        const updated = [...valueDevice];
                        updated[i].label = e.target.value;
                        setValueDevice(updated);
                      }}
                    />
                  ),
                  type: v.name,
                  tempo: (
                    <InputCustom
                      fullWidth
                      variant="outlined"
                      value={v.tempo}
                      onChange={(e) => {
                        const updated = [...valueDevice];
                        updated[i].tempo = e.target.value;
                        setValueDevice(updated);
                      }}
                    />
                  ),
                }))}
                columns={[
                  { title: t('Label'), dataIndex: 'label', key: 'label' },
                  { title: t('Type'), dataIndex: 'type', key: 'type' },
                  { title: t('Unit'), dataIndex: 'tempo', key: 'tempo' },
                ]}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions>
        <ButtonCustom variant="outlined" onClick={handleClose} color="primary">
          {t('Cancel')}
        </ButtonCustom>
        <ButtonCustom onClick={handleSaveArea} variant="contained" color="primary">
          {t('Save')}
        </ButtonCustom>
      </DialogActions>
    </Dialog>
  );
}

export default AddArea3D;
