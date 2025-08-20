
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { X } from '@phosphor-icons/react';
import { SwitchCustom } from '~/components/SwitchToggle';

interface ContextMenuProps {
  position: { x: number; y: number };
  closeMenu: (option: boolean) => void;
  dataDiagram: any[];
  positionKey: string;
  arrArea: any[];
  sendShareAttribute: (key: string, index: number, value: any) => void;
  setArrArea?: any
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  closeMenu,
  dataDiagram,
  positionKey,
  arrArea,
  sendShareAttribute,
  setArrArea
}) => {
  const countRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [typeControl, setTypeControl] = useState<React.ReactNode[]>([]);
  const [timer, setTimer] = useState(1000);
  const { control, handleSubmit } = useForm();
  const allData = [...dataDiagram, ...arrArea];
  const contextPoint = allData.find((item) => item.key === positionKey);

  useEffect(() => {
    if (loading) {
      setTimer(1000);
      countRef.current = setInterval(() => {
        setTimer((timer) => timer + 1000);
      }, 1000);
    }
  }, [loading]);

  useEffect(() => {
    if (timer >= 10000) {
      setLoading(false);
      if (countRef.current) {
        clearInterval(countRef.current);
      }
    }
  }, [timer]);

  useEffect(() => {
    if (contextPoint?.telemetry) {
      setTypeControl(
        contextPoint.telemetry.map((item: any, idx: number) => {
          const telemetry = item.name.slice(5);
          const valueTele = item.isShow;
          return (
            <div key={idx} className='flex items-center justify-between'>
              <Typography variant='body3' color='var(--text-secondary)' className='text-sm '>{item.label}</Typography>
              <Controller
                name={'control_' + telemetry}
                control={control}
                defaultValue={valueTele}
                render={({ field }) => (
                  <SwitchCustom
                    checked={field.value}
                    onChange={(e) => {
                      const value = e.target.checked;
                      field.onChange(value);
                      // sendShareAttribute(contextPoint.key, idx, value);
                      arrArea.find((item) => item.key === positionKey).telemetry[idx].isShow = value;
                      setArrArea([...arrArea]);
                      setLoading(true);
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                )}
              />
            </div>
          );
        })
      );
    }
  }, [contextPoint, control, sendShareAttribute, t]);

  const handleCloseMenu = (option: boolean) => {
    closeMenu(option);
  };

  return (
    contextPoint?.telemetry?.length > 0 && (
      <Box
        id="menu-diagram"
        sx={{
          position: 'absolute',
          left: position?.x + 33,
          top: position?.y,
          zIndex: 99,
          width: '200px',
          maxHeight: '180px',
          overflowY: 'auto',
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <div className='flex justify-between'>
          <Typography variant="label3" className='font-bold'>Hiện thông số</Typography>
          <Box component="span" sx={{ cursor: 'pointer' }} onClick={() => handleCloseMenu(false)}>
            <X />
          </Box>
        </div>
        <form onSubmit={handleSubmit(() => { })}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          )}
          <div
            className='flex flex-col gap-2'
          >
            {typeControl}
          </div>
        </form>
      </Box>
    )
  );
};

export default ContextMenu;
