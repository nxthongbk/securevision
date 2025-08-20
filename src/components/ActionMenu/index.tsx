import { Box, Button, Divider, MenuItem, SxProps, Theme, Typography, alpha } from '@mui/material';
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
    <div className='w-fit'>
      <Button
        id='action-button'
        variant='contained'
        disableElevation
        onClick={handleClick}
        className='h-[32px] w-full !p-0'
        sx={{ bgcolor: 'var(--grey-primary-80)', '&:hover': { bgcolor: alpha('#d9e1e8', 0.8) } }}
      >
        <Box
          onClick={(e) => {
            onClick?.();
            e.stopPropagation();
          }}
          className={`px-[14px] h-full flex items-center ${centerBtnContent ? 'justify-center' : 'justify-normal'} grow`}
        >
          <Typography color='var(--text-primary)' variant='button3'>
            {label}
          </Typography>
        </Box>
        {hasMenuOptions && (
          <Box className='flex items-center pr-[8px] gap-[6.5px]'>
            <Divider orientation='vertical' sx={{ width: '1px', height: '21px' }} />
            <CaretDown size={16} color='var(--grey-neutral-800' />
          </Box>
        )}
      </Button>
      <StyledMenu
        id='action-menu'
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
            <Typography variant='body3'>{option.title}</Typography>
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
