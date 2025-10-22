import {
  Box,
  IconButton,
  Tooltip,
  Popover,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eraser, FloppyDiskBack, PencilSimple, Polygon, X } from '@phosphor-icons/react';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '~/services/dashboard.service';
import ButtonCustom from '~/components/ButtonCustom';

let newArrMoveFilter;
let existsInBothArrays;

interface BabylonEditBarProps {
  setShowDiagram?: (value: boolean) => void;
  setPreview?: any
  isDraw?: boolean;
  setDraw?: (value: boolean) => void;
  isEdit?: boolean;
  setEdit?: (value: boolean) => void;
  arrMachine?: any[];
  setArrMachine?: (value: any[]) => void;
  dataDiagram?: any;
  isRole?: boolean;
  width?: number;
  height?: number;
  setPoints?: (points: any[]) => void;
  setPolyComplete?: any;
  setFlattenedPoints?: any;
  selected?: any;
  setSelected?: (value: any) => void;
  arrArea?: any[];
  setArrArea?: (value: any[]) => void;
  dataArea?: any;
  isMaximize?: boolean;
  extendCard?: any;
  setIsloading?: (value: boolean) => void;
  setCurTypeDevice?: (value: any) => void;
  curTypeDevice?: any;
  dashboard?: any;
  sensitivity?: number; // NEW
  setSensitivity?: (value: number) => void; // NEW
}

const BabylonEditBar: React.FC<BabylonEditBarProps> = ({
  isDraw,
  setDraw,
  isEdit,
  setEdit,
  arrMachine,
  setArrMachine,
  dataDiagram,
  isRole,
  width,
  height,
  setPoints,
  selected,
  setSelected,
  arrArea,
  setArrArea,
  setCurTypeDevice,
  curTypeDevice,
  dashboard,
  sensitivity, // NEW
  setSensitivity, // NEW
}) => {
  const { t } = useTranslation();

  const numberKey = 0;
  const confirmX = 0;
  const confirmY = 0;
  const editArea = arrMachine?.filter((item) => item.type !== 'Area');
  const editPoint = Array.isArray(dataDiagram)
    ? dataDiagram.filter((item) => item?.topLeftPoint?.x === numberKey)
    : [];

  let index = Array.isArray(dataDiagram)
    ? dataDiagram.findIndex(
      (elm) => elm.topLeftPoint?.x === editPoint[0]?.topLeftPoint?.x
    )
    : -1;

  const [newArrMove, setNewArrMove] = useState([]);
  const [showTool, setShowTool] = useState(false);
  const [currentSelected, setCurrentSelected] = useState();
  const { tenantCode } = useTenantCode();
  const queryClient = useQueryClient();
  const createAtributes = useMutation({
    mutationFn: (body: { data: any }) => {
      return dashboardService.saveEntityAttributes(tenantCode, dashboard?.id, body.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
    }
  });

  useEffect(() => {
    if (index > -1) {
      let newArr2;
      if (numberKey && confirmX && confirmY) {
        newArr2 = {
          ...editPoint[0],
          topRightPoint: {
            x: (confirmX + 5) / width,
            y: (confirmY + 13) / height,
          },
        };
        const uniqueSet = [...newArrMove];
        let checkDuplicate = arrMachine.findIndex(
          (element1) => element1.label === newArr2.label
        );
        if (checkDuplicate > -1) {
          uniqueSet[checkDuplicate] = newArr2;
          setNewArrMove(uniqueSet);
        } else {
          setNewArrMove([...newArrMove, newArr2]);
        }
      }
    }
  }, [index, confirmX, confirmY, numberKey, isEdit]);

  useEffect(() => {
    existsInBothArrays = editArea.filter(
      (element1) =>
        !newArrMove.map((element2) => element2?.label).includes(element1?.label)
    );

    newArrMoveFilter = newArrMove.filter((element1) =>
      dataDiagram.map((element2) => element2?.label).includes(element1?.label)
    );
  }, [editArea, newArrMove]);

  useEffect(() => {
    curTypeDevice && setCurTypeDevice(curTypeDevice);
  }, [curTypeDevice]);

  const handleShowTool = () => {
    setShowTool(true);
    setEdit(true);
    setDraw(false);
  };

  const handleDraw = (value) => {
    setArrMachine(arrMachine);
    setCurrentSelected(value);
    if (currentSelected === value && !isEdit) {
      setSelected(null);
      setEdit(true);
      setDraw(false);
      setPoints([]);
    } else {
      setEdit(false);
      setDraw(true);
      if (value === 1) {
        setSelected(true);
      } else if (value === 2) {
        setSelected(false);
      }
    }
  };

  const handleCancelActionDiagram = () => {
    setShowTool(false);
  };

  const handleError = () => {
    console.log('error');
  };

  const handleSave = async () => {
    let arrMachine = [...newArrMoveFilter, ...existsInBothArrays];
    let listArea = [...(arrArea?.length > 0 ? arrArea : [])];
    createAtributes.mutate({
      data: {
        operationData: arrMachine,
        listArea: listArea,
      }
    });
    setDraw(false);
    setEdit(false);
    setShowTool(false);
    setArrMachine(arrMachine);
  };

  const handleConfirmDeleteAll = async () => {
    const arrMachine = [];
    const listArea = [];
    createAtributes.mutate({
      data: {
        operationData: arrMachine,
        listArea: listArea,
      }
    });
    setArrMachine([]);
    setArrArea([]);
    setDraw(false);
    setEdit(false);
    setShowTool(false);
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="flex items-center">
      {/* --------- Sensitivity Slider --------- */}
      
<div className="flex flex-col items-center mr-4 select-none">
  <Typography variant="caption" className="text-white text-xs mb-1">
    Sensitivity
  </Typography>
  <input
    type="range"
    min={1}
    max={100}
    value={sensitivity || 50}
    onChange={(e) => setSensitivity?.(Number(e.target.value))}
    className="w-32 cursor-pointer"
  />
</div>



      {/* --------- Existing Tool Buttons --------- */}
      <div className="flex">
        {!showTool ? (
          <Tooltip title="Edit" placement="top">
            <IconButton
              onClick={isRole ? handleShowTool : handleError}
              className="btn-ctrl-diagram"
            >
              <PencilSimple size={24} />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Tooltip title="Place Marker" placement="top">
              <IconButton
                onClick={isRole ? () => handleDraw(2) : handleError}
                className={`btn-ctrl-diagram `}
              >
                <div className={isDraw && selected === false ? `bg-blue-500 text-white rounded-lg` : ''}>
                  <Polygon size={24} />
                </div>
              </IconButton>
            </Tooltip>

            <div>
              <Tooltip title={t('delete')} placement="top">
                <IconButton aria-describedby={id} onClick={handleClick}>
                  <Eraser size={24} className={'btn-selected'} />
                </IconButton>
              </Tooltip>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Box p={2}>
                  <div className='pb-2'>
                    <Typography>Delete All?</Typography>
                  </div>
                  <div className='flex justify-end gap-4'>
                    <ButtonCustom variant='contained' color='secondary' onClick={handleClose}>
                      Cancel
                    </ButtonCustom>
                    <ButtonCustom variant='contained' onClick={handleConfirmDeleteAll} color="error">
                      Confirm
                    </ButtonCustom>
                  </div>
                </Box>
              </Popover>
            </div>

            <Tooltip title={t('cancel')} placement="top">
              <IconButton onClick={handleCancelActionDiagram} className="btn-ctrl-diagram">
                <X size={24} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('save')} placement="top">
              <IconButton onClick={isRole ? handleSave : handleError} className="btn-ctrl-diagram">
                <FloppyDiskBack size={24} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default BabylonEditBar;
