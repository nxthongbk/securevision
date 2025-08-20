import { TypographyProps, Typography } from '@mui/material';

const EllipsisTypography = ({ variant, lines = 1, children, sx, ...rest }: TypographyProps & { lines?: number }) => {
  return (
    <Typography
      variant={variant}
      sx={{
        maxWidth: '100%',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
        textOverflow: 'ellipsis',
        wordBreak: 'break-word',
        overflow: 'hidden',
        ...sx
      }}
      {...rest}
    >
      {children}
    </Typography>
  );
};

export default EllipsisTypography;
