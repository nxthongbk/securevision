import {
  Box,
  IconButton,
  Tooltip,
  Popover,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eraser, FloppyDiskBack, PencilSimple, Polygon, X } from '@phosphor-icons/react';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '~/services/dashboard.service';
import ButtonCustom from '~/components/ButtonCustom';

interface BabylonEditBarProps {
  isEdit?: boolean;
  setEdit?: (value: boolean) => void;
  isDraw?: boolean;
  setDraw?: (value: boolean) => void;
  arrArea?: any[];
  setArrArea?: (value: any[]) => void;
  isRole?: boolean;
  dashboard?: any;
}

const BabylonEditBar: React.FC<BabylonEditBarProps> = ({
  isEdit,
  setEdit,
  isDraw,
  setDraw,
  arrArea,
  setArrArea,
  isRole,
  dashboard
}) => {
  const { t } = useTranslation();
  const { tenantCode } = useTenantCode();
  const queryClient = useQueryClient();

  const [showTool, setShowTool] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const createAttributes = useMutation({
    mutationFn: (body: { data: any }) =>
      dashboardService.saveEntityAttributes(tenantCode, dashboard?.id, body.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAttributesMonitoring'] });
    },
  });
  // keep isEdit for UI control consistency with 2D editor
  void isEdit;
  // 🧭 Handlers
  const handleShowTool = () => {
    setShowTool(true);
    setEdit?.(true);
  };

  const handleDraw = () => {
    setDraw?.(true);
  };

  const handleCancel = () => {
    setShowTool(false);
    setEdit?.(false);
    setDraw?.(false);
  };

  const handleSave = async () => {
    createAttributes.mutate({
      data: {
        operationData: [],
        listArea: arrArea || [],
      },
    });
    setShowTool(false);
    setEdit?.(false);
    setDraw?.(false);
  };

  const handleConfirmDeleteAll = async () => {
    createAttributes.mutate({
      data: {
        operationData: [],
        listArea: [],
      },
    });
    setArrArea?.([]);
    setShowTool(false);
    setEdit?.(false);
    setDraw?.(false);
  };

  // Popover
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="flex">
      {!showTool ? (
        <Tooltip title="Edit" placement="top">
          <IconButton onClick={isRole ? handleShowTool : undefined}>
            <PencilSimple size={24} />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          {/* Place Marker */}
          <Tooltip title="Place Marker" placement="top">
            <IconButton onClick={isRole ? handleDraw : undefined}>
              <div className={isDraw ? 'bg-blue-500 text-white rounded-lg' : ''}>
                <Polygon size={24} />
              </div>
            </IconButton>
          </Tooltip>

          {/* Delete All */}
          <Tooltip title={t('delete')} placement="top">
            <IconButton aria-describedby={id} onClick={handleClick}>
              <Eraser size={24} />
            </IconButton>
          </Tooltip>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box p={2}>
              <Typography>Delete All?</Typography>
              <div className="flex justify-end gap-4 mt-2">
                <ButtonCustom variant="contained" color="secondary" onClick={handleClose}>
                  Cancel
                </ButtonCustom>
                <ButtonCustom variant="contained" color="error" onClick={handleConfirmDeleteAll}>
                  Confirm
                </ButtonCustom>
              </div>
            </Box>
          </Popover>

          {/* Cancel */}
          <Tooltip title={t('cancel')} placement="top">
            <IconButton onClick={handleCancel}>
              <X size={24} />
            </IconButton>
          </Tooltip>

          {/* Save */}
          <Tooltip title={t('save')} placement="top">
            <IconButton onClick={isRole ? handleSave : undefined}>
              <FloppyDiskBack size={24} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default BabylonEditBar;
