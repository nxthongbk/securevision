import { Box, IconButton, Stack, SxProps, TextField, Theme } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';

import { useTranslation } from 'react-i18next';
import './styles.scss';
import { useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

type SearchBoxProps = {
  keyword: string;
  setKeyword: (value: string) => void;
  dataSearch?: any[];
  placeholder?: string;
  minWidth?: string;
  id?: string;
};

const SearchBox = ({ keyword, setKeyword, dataSearch, placeholder, minWidth, id = 'inputSearch' }: SearchBoxProps) => {
  const { t } = useTranslation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchData = useCallback(
    debounce((value: string) => {
      setKeyword(value);
    }, 300),
    []
  );

  const handleKeywordChange = (e: any) => {
    const inputText = e.target.value?.trim();
    debouncedFetchData(inputText);
  };

  const handleClear = () => {
    try {
      const element = document?.getElementById(id) as HTMLInputElement | null;
      if (element && element instanceof HTMLInputElement) {
        element.value = '';
        setKeyword('');
        debouncedFetchData('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!keyword) {
      handleClear();
    }
  }, [keyword]);

  return (
    <Stack direction='row' gap={1} alignItems='center' position='relative'>
      <Box className='search-container'>
        <TextField
          id={id}
          sx={textFieldCustomStyle}
          style={{ minWidth: minWidth }}
          placeholder={placeholder || t('search')}
          // value={keyword}
          onChange={handleKeywordChange}
          autoComplete='off'
          InputProps={{
            className: 'border-none',
            startAdornment: (
              <IconPhosphor iconName='MagnifyingGlass' size={20} color='var(--text-tertiary)' className='mr-2' />
            ),
            endAdornment:
              keyword !== '' ? (
                <IconButton onClick={handleClear}>
                  <IconPhosphor iconName='X' size={16} color='var(--text-tertiary)' className='cursor-pointer' />
                </IconButton>
              ) : (
                <Box width={'20px'}></Box>
              )
          }}
        />
        {keyword && dataSearch && dataSearch.length > 0 && (
          <div className='search-result' style={{ fontSize: '14px' }}>
            {dataSearch.map((item: any) => (
              <div key={item.id}>{item?.configName}</div>
            ))}
          </div>
        )}
      </Box>
    </Stack>
  );
};

export default SearchBox;

const textFieldCustomStyle: SxProps<Theme> = {
  '& .MuiInputBase-root': {
    padding: '0px 16px',
    height: '40px',
    lineHeight: '20px',
    '&.MuiOutlinedInput-root input': {
      padding: '0 !important',
      fontSize: '14px',
      lineHeight: '20px',
      '&::placeholder': {
        fontSize: '14px'
      }
    }
  }
};
