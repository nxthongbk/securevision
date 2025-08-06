import { useCallback, useRef, useState } from "react";
import { TypographyProps, Typography, Tooltip } from "@mui/material";

const TooltipEllipsisTypography = ({
  variant = "body3",
  lines = 1,
  children,
  tooltipMaxWidth = 300,
  ...rest
}: TypographyProps & { tooltipMaxWidth?: string | number; lines?: number }) => {
  const typoRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    if (typoRef.current) {
      const { clientHeight, scrollHeight } = typoRef.current;
      setOpen(scrollHeight > clientHeight);
    }
  }, []);

  return (
    <Tooltip
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      title={children}
      componentsProps={{
        tooltip: {
          sx: {
            maxWidth: tooltipMaxWidth,
          },
        },
      }}
    >
      <Typography
        variant={variant}
        ref={typoRef}
        sx={{
          maxWidth: "100%",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: lines,
          textOverflow: "ellipsis",
          wordBreak: "break-all",
          overflow: "hidden",
        }}
        {...rest}
      >
        {children}
      </Typography>
    </Tooltip>
  );
};

export default TooltipEllipsisTypography;
