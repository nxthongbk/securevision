import { Box, Button, Typography } from '@mui/material';
import { CopySimple, FileArrowUp } from '@phosphor-icons/react';

import HeaderPage from '~/components/HeaderPage';
import { translation } from '~/utils/translate';
import { usePostFileSystem } from './handleApi';
import { useState } from 'react';

const URL_SYSTEM = `${import.meta.env.VITE_API_HOST}/api/storage/files/system/`;

export default function TabUploadFile() {
  const [listFile, setListFile] = useState<File[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const { mutate: postFileSystem, isPending } = usePostFileSystem();

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const initFile = e?.target?.files?.[0];
    if (initFile) {
      setFile(initFile);
      const formData = new FormData();
      formData.append('file', initFile);

      postFileSystem(formData, {
        onSuccess: () => {
          setListFile((prevListFile) => [initFile, ...prevListFile]);
          setFile(null);
        },
        onError: (error) => {
          console.error('Error uploading file:', error);
        }
      });
    }
  };
  return (
    <div className='flex flex-col w-full h-full p-6 gap-6'>
      <HeaderPage
        title={translation('upload-file')}
        btnPopup={
          <Button variant='contained' component='label' startIcon={<FileArrowUp size={20} />}>
            {translation('upload-file')}
            <input type='file' hidden onChange={handleChangeFile} />
          </Button>
        }
      />
      <Box
        sx={{
          height: '100%',
          border: '1px solid #C0C4C4',
          borderRadius: '8px',
          flexGrow: '1',
          overflow: 'scroll',
          background: 'white'
        }}
      >
        {file && (
          <Box
            sx={{
              padding: '26px 16px',
              borderBottom: '1px solid #C0C4C4',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='label1'>{file?.name}</Typography>
            <Box>
              <Typography variant='body1'>
                {!isPending ? (
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <span>{URL_SYSTEM + file?.name}</span>
                    <CopySimple size={24} color='#18A0A0' />
                  </Box>
                ) : (
                  'Đang tải lên...'
                )}
              </Typography>
            </Box>
          </Box>
        )}
        {listFile?.map((item) => (
          <Box
            key={item.name}
            sx={{
              padding: '26px 16px',
              borderBottom: '1px solid #C0C4C4',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='label1'>{item?.name}</Typography>
            <Box>
              <Typography variant='body1'>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <span>{URL_SYSTEM + item?.name}</span>
                  <CopySimple
                    size={24}
                    color='#18A0A0'
                    style={{ cursor: 'pointer' }}
                    onClick={async () => {
                      await navigator.clipboard.writeText(URL_SYSTEM + item?.name);
                    }}
                  />
                </Box>
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  );
}
