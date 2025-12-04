import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  RadioGroup,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import TableCustom from '../../Table/table';
import { useMemo } from 'react';
import SelectCustom from '~/components/SelectCustom';
import InputCustom from '~/components/InputCustom';
import ButtonCustom from '~/components/ButtonCustom';

function AddArea(props) {
  const {
    isDraw,
    dataDevice,
    label,
    nameDevice,
    typeData,
    loadingTypeData,
    valueDevice,
    type,
    setLabel,
    handleClose,
    handleSaveArea,
    handleSelectedType,
    dataSourceModalDiagram,
    columnsModalDiagram,
    handleSelectDevice,
    handleSelectValue,
    show,
  } = props;

  const { t } = useTranslation();
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });

  // Device options
  const optionDeviceProfile = useMemo(() => {
    return dataDevice?.data?.content?.map((item: any) => (
      <MenuItem value={item?.id} key={item?.id}>
        {item?.name}
      </MenuItem>
    ));
  }, [dataDevice?.data]);

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
      <DialogTitle id="form-dialog-title">
        {isDraw ? 'Thêm zone mới' : t('edit')}
      </DialogTitle>

      <DialogContent>
        <RadioGroup value={type} onChange={handleSelectedType} style={{ width: '100%' }}>
          {/* ====== Form Layout ====== */}
          <Grid container spacing={2}>
            {/* --- Zone Name --- */}
            <Grid item mobile={12}>
              <InputCustom
                fullWidth
                variant="outlined"
                disabled={type === 'delete'}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                label="Tên zone"
                inputProps={{ maxLength: 14 }}
                isRequired
              />
            </Grid>

            {/* --- Device Selector --- */}
            <Grid item mobile={12}>
              <SelectCustom
                name="deviceId"
                isRequired
                label={deviceTranslate('devices')}
                placeholderText={deviceTranslate('select-device')}
                children={optionDeviceProfile}
                value={nameDevice}
                onChange={(e) => handleSelectDevice(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: '50vh',
                      padding: '16px',
                      '& .MuiMenuItem-root': {
                        padding: 1,
                      },
                    },
                  },
                }}
              />
            </Grid>

            {/* --- Telemetry & Table Section --- */}
            {loadingTypeData ? (
              <Grid item mobile={12}>
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress />
                </Box>
              </Grid>
            ) : (
              typeData &&
              typeData.length > 0 && (
                <Grid item mobile={12}>
                  {/* Telemetry Selector */}
                  <SelectCustom
                    name="telemetryId"
                    isRequired
                    label="Telemetry"
                    placeholderText="Chọn Telemetry"
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
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: '50vh',
                          padding: '16px',
                          '& .MuiMenuItem-root': {
                            padding: 1,
                            backgroundColor: 'var(--bg)',
                          },
                        },
                      },
                    }}
                  />

                  {/* Table under telemetry */}
                  {valueDevice?.length > 0 && (
                    <Box mt={2}>
                      <TableCustom
                        dataSource={dataSourceModalDiagram}
                        columns={columnsModalDiagram}
                        unfooter={false}
                      />
                    </Box>
                  )}
                </Grid>
              )
            )}
          </Grid>
        </RadioGroup>
      </DialogContent>

      {/* Divider */}
      <Divider
        sx={{
          borderBottom: '1px solid var(--border-color)',
          width: '100%',
        }}
      />

      {/* Dialog Actions */}
      <DialogActions>
        <ButtonCustom variant="outlined" onClick={handleClose} color="primary">
          {t('cancel')}
        </ButtonCustom>
        <ButtonCustom
          onClick={handleSaveArea}
          variant="contained"
          color="primary"
          type="submit"
        >
          {type === 'delete' ? t('delete') : t('save')}
        </ButtonCustom>
      </DialogActions>
    </Dialog>
  );
}

export default AddArea;
