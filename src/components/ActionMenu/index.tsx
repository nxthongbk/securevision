import { Box, Button, Divider, MenuItem, SxProps, Theme, Typography } from '@mui/material';
import { MouseEvent, ReactNode, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { StyledMenu } from './styled';

type MenuOptions = {
  icon: ReactNode;
  title: string;
  onClick: () => void;
}[];

export default function ActionMenu({
  label,
  menuOptions,
  onClick,
  paperSx,
  centerBtnContent = false
}: Readonly<{
  label: string;
  menuOptions: MenuOptions;
  onClick: () => void;
  paperSx?: SxProps<Theme>;
  centerBtnContent?: boolean;
}>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const hasMenuOptions = menuOptions.length > 0;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    hasMenuOptions && setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-fit">
      <Button
        id="action-button"
        variant="text"
        disableElevation
        onClick={handleClick}
        className="h-[32px] w-full !p-0"
        sx={{
          color: '#00BCFF',
          bgcolor: 'transparent',
          '&:hover': {
            bgcolor: 'transparent',
            color: '#00BCFF'
          }
        }}
      >
        <Box
          onClick={(e) => {
            onClick?.();
            e.stopPropagation();
          }}
          className={`px-[14px] h-full flex items-center ${
            centerBtnContent ? 'justify-center' : 'justify-normal'
          } grow`}
        >
          <Typography sx={{ color: '#00BCFF' }} variant="button3">
            {label}
          </Typography>
        </Box>

        {hasMenuOptions && (
          <Box className="flex items-center pr-[8px] gap-[6.5px]">
            <Divider orientation="vertical" sx={{ width: '1px', height: '21px', borderColor: '#00BCFF' }} />
            <CaretDown size={16} color="#00BCFF" />
          </Box>
        )}
      </Button>

      <StyledMenu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: { sx: paperSx }
        }}
      >
        {menuOptions.map((option) => (
          <MenuItem
            onClick={() => {
              option.onClick?.();
              handleClose();
            }}
            key={option.title}
            disableRipple
          >
            {option.icon}
            <Typography variant="body3">{option.title}</Typography>
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
