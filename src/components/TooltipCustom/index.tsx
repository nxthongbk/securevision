import { Tooltip, TooltipProps } from '@mui/material';
export default function TooltipAction(props: TooltipProps) {
  return (
    <Tooltip
      {...props}
      componentsProps={{
        tooltip: {
          sx: {
            color: 'var(--white)',
            fontSize: '12px',
            lineHeight: '18px',
            fontWeight: 400,
            bgcolor: 'var(--grey-primary-800)',
            //   border: '1px solid var(--border-color)',
            '& .MuiTooltip-arrow': {
              color: 'var(--grey-primary-800)'
            },
            maxWidth: 600
          }
        }
      }}
      arrow
    />
  );
}
