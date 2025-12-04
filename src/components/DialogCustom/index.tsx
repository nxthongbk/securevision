    import { DialogActions, DialogContent, Divider, Typography } from '@mui/material';
    import Dialog from '@mui/material/Dialog';
    import Slide from '@mui/material/Slide';
    import { TransitionProps } from '@mui/material/transitions';
    import { X } from '@phosphor-icons/react';
    import { forwardRef } from 'react';

    interface IProps {
      open?: boolean;
      title?: string;
      content?: any;
      footer?: any;
      handleClose?: any;
      width?: number;
      maxWidth?: number | string;
      otherPosition?: any;
    }

    const Transition = forwardRef(function Transition(
      props: TransitionProps & {
        children: React.ReactElement<any, any>;
      },
      ref: React.Ref<unknown>
    ) {
      return <Slide direction='up' ref={ref} {...props} />;
    });

    export default function DialogCustom(props: IProps) {
      const { title, content, footer, open, otherPosition, handleClose } = props;

      return (
        <Dialog
          open={open}
          sx={{ '& .MuiPaper-root': 
            { maxWidth: '60vw', 
              borderRadius: '0px',
              backgroundColor: '#030712',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              border: '1px solid #36BFFA3D',
            } }}
          fullWidth
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby='scroll-dialog-title'
        >
          <div className='flex justify-between p-4 border border-[#FFFFFF1A] overflow-visible  bg-[#00BCFF1F]'>
            <Typography variant='h6' className='text-[#36BFFA]'>{title}</Typography>
            <div onClick={handleClose} className='cursor-pointer'>
              <X size={24} color='var(--text-secondary)' />
            </div>
          </div>
          {otherPosition}
          <DialogContent className='!px-0 !py-0'>{content}</DialogContent>
          <Divider />
          {footer && <DialogActions className='!p-4'>{footer}</DialogActions>}
        </Dialog>
      );
    }
