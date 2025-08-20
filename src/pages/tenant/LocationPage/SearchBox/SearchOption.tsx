import { Grid, Stack, Typography } from '@mui/material';
import { HTMLAttributes } from 'react';

const SearchOption = (props: HTMLAttributes<HTMLLIElement> & { label: string; fullAddress?: string }) => {
  return (
    <li {...props}>
      <Grid container alignItems='center'>
        <Grid item sx={{ width: 'calc(100% - 4vmin)', wordWrap: 'break-word' }}>
          <Stack>
            <Typography variant='label3'>{props.label}</Typography>
            {props.fullAddress && <Typography variant='caption1'>{props.fullAddress}</Typography>}
          </Stack>
        </Grid>
      </Grid>
    </li>
  );
};

export default SearchOption;
