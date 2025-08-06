import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  FormControl,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import TableCustom from '../../Table/table';

// Define the types for the component's props
interface EditAreaProps {
  indexSelected: number;
  isDraw: boolean;
  arrArea: Array<{
    name: string;
    telemetry?: Array<{ name: string }>;
  }>;
  dataDevice: any;
  status?: any;
  label: string;
  nameDevice: string;
  typeData: string[];
  loadingTypeData: boolean;
  valueDevice: any[];
  type: string;
  setLabel: (label: string) => void;
  handleClose: () => void;
  handleSaveArea: () => void;
  handleSelectedType?: (value: string) => void;
  dataSourceModalDiagram: any;
  columnsModalDiagram: any;
  handleSelectDevice: (value: string, event: any) => void;
  handleSelectValue: (value: string[]) => void;
  currTypeValue: string[];
  setCurrTypeValue: any;
}

const EditArea: React.FC<EditAreaProps> = (props) => {
  const {
    indexSelected,
    isDraw,
    arrArea,
    dataDevice,
    status,
    label,
    nameDevice,
    typeData,
    loadingTypeData,
    valueDevice,
    type,
    setLabel,
    handleClose,
    handleSaveArea,
    dataSourceModalDiagram,
    columnsModalDiagram,
    handleSelectDevice,
    handleSelectValue,
    currTypeValue,
    setCurrTypeValue,
  } = props;

  const { t } = useTranslation();

  useEffect(() => {
    if (arrArea[indexSelected]?.name === nameDevice) {
      const telemetryNames = arrArea[indexSelected]?.telemetry?.map((e) => e.name) || [];
      setCurrTypeValue(telemetryNames);
      handleSelectValue(telemetryNames);
    } else {
      setCurrTypeValue([]);
    }
  }, [type, nameDevice]);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth
      aria-labelledby="edit-area-dialog-title"
      maxWidth="mobile"
    >
      <DialogTitle id="edit-area-dialog-title">
        {`${isDraw ? t('add-new') : t('edit')} [Area]`}
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item mobile={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t('please-select-device')}</InputLabel>
                <Select
                  value={nameDevice}
                  onChange={(e) => handleSelectDevice(e.target.value as string, e)}
                  disabled={type === 'delete'}
                  label={t('please-select-device')}
                  error={status === 'error'}
                >
                  {dataDevice?.data?.content?.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item mobile={8}>
              <TextField
                fullWidth
                variant="outlined"
                label={t('enter-name')}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={type === 'delete'}
                error={status === 'error'}
                helperText={status === 'error' ? t('error-message') : ''}
              />
            </Grid>
          </Grid>
        </Box>

        {loadingTypeData ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>{`${t('please-select-type')} ${t('value')}`}</InputLabel>
              <Select
                multiple
                value={currTypeValue}
                onChange={(e) => {
                  const selectedValues = e.target.value as string[];
                  const limitedValues = selectedValues.length > 3 ? selectedValues.slice(1) : selectedValues;
                  handleSelectValue(limitedValues);
                  setCurrTypeValue(limitedValues);
                }}
                disabled={type === 'delete'}
                label={`${t('please-select-type')} ${t('value')}`}
                renderValue={(selected) => (selected as string[]).join(', ')}
              >
                {typeData.map((type, idx) => (
                  <MenuItem key={idx} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {valueDevice.length > 0 && (
              <TableCustom
                dataSource={dataSourceModalDiagram}
                columns={columnsModalDiagram}
              />
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSaveArea}
          color={type === 'delete' ? 'secondary' : 'primary'}
          variant="contained"
        >
          {type === 'delete' ? t('delete') : t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditArea;