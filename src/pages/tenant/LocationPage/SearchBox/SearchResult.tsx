import { PaperProps, Paper } from '@mui/material';

const SearchResultsContainer = (props: PaperProps) => (
  <Paper sx={{ mt: '10px', width: '100% !important', height: 'fit-content !important' }} elevation={8} {...props} />
);

export default SearchResultsContainer;
