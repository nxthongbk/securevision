import { Box, Stack } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import SearchBox from '~/components/SearchBox';

interface Props {
  setKeyword: Dispatch<SetStateAction<string>>;
  keyword: string;
  actionPopup: JSX.Element;
}

const DrawerHeader = ({ keyword, setKeyword, actionPopup }: Props) => {
  return (
    <Stack direction='row' className='w-full justify-between'>
      <Box className='flex'>
        <SearchBox keyword={keyword} setKeyword={setKeyword} id='inputSearchTabs'/>
      </Box>
      {actionPopup}
    </Stack>
  );
};

export default DrawerHeader;
