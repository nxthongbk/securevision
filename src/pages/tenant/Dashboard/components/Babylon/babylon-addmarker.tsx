import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Chip,
  Grid,
} from '@mui/material';
import { useMemo } from 'react';
import TableCustom from '../Diagram/components/Table/table';
import SelectCustom from '~/components/SelectCustom';
import InputCustom from '~/components/InputCustom';
import ButtonCustom from '~/components/ButtonCustom';
import { useTranslation } from 'react-i18next';

function AddMarker(props) {
  const {
    show,
    label,
    setLabel,
    nameDevice,
    handleSelectDevice,
    dataDevice,
    typeData,
    loadingTypeData,
    valueDevice,
    handleSelectValue,
    dataSourceMarker,
    columnsMarker,
    handleSaveMarker,
    handleClose,
    coords, // { x, y, z }
  } = props;

  const { t } = useTranslation();
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });

  // Device options
  const optionDeviceProfile = useMemo(() => {
    return dataDevice?.map((item: any) => (
      <MenuItem value={item?.id} key={item?.id}>
        {item?.name}
      </MenuItem>
    ));
  }, [dataDevice]);

  // Telemetry options
  const optionTelemetry = useMemo(() => {
    return typeData?.map((item: any) => (
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
      <DialogTitle>Add Marker</DialogTitle>

      <DialogContent>
        <p>
          Coordinates: X={coords?.x}, Y={coords?.y}, Z={coords?.z}
        </p>

        <Grid container spacing={2}>
          <Grid item mobile={12}>
            <InputCustom
              fullWidth
              variant="outlined"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              label="Marker Name"
              inputProps={{ maxLength: 14 }}
              isRequired
            />
          </Grid>

          <Grid item mobile={12}>
            <SelectCustom
              name="deviceId"
              isRequired
              label={deviceTranslate('devices')}
              placeholderText={deviceTranslate('select-device')}
              children={optionDeviceProfile}
              value={nameDevice}
              onChange={(e) => handleSelectDevice(e.target.value)}
            />
          </Grid>

          {loadingTypeData ? (
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
                  label="Telemetry"
                  placeholderText="Select Telemetry"
                  children={optionTelemetry}
                  value={valueDevice}
                  onChange={(e) => handleSelectValue(e.target.value)}
                  multiple
                  isSelectAll
                  renderValue={(selected: any[]) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected?.map((value) => (
                        <Chip key={value.name} label={value.name} />
                      ))}
                    </Box>
                  )}
                />

                {valueDevice?.length > 0 && (
                  <Box mt={2}>
                    <TableCustom
                      dataSource={dataSourceMarker}
                      columns={columnsMarker}
                      unfooter={false}
                    />
                  </Box>
                )}
              </Grid>
            )
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <ButtonCustom variant="outlined" onClick={handleClose}>
          {t('cancel')}
        </ButtonCustom>
        <ButtonCustom variant="contained" onClick={handleSaveMarker}>
          {t('save')}
        </ButtonCustom>
      </DialogActions>
    </Dialog>
  );
}

export default AddMarker;
