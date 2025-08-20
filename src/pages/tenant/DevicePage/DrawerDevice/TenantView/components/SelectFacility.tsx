import { Typography, Checkbox, Box, Divider } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import InputCustom from '~/components/InputCustom';

function SelectFacility({ label, isRequired }: { label: string; isRequired: boolean }) {
  return (
    <div>
      {label && (
        <Typography variant='label3' className='!mb-1'>
          {label} {isRequired && <span className='text-[var(--semantic-alert)]'>*</span>}
        </Typography>
      )}
      <div className='grid grid-cols-2 gap-2 h-[330px] '>
        <div className='border border-solid border-[var(--border-color)] rounded-xl'>
          <div className='flex items-center '>
            <Checkbox
              id='facilityCheckbox'
              className='mr-2'
              sx={{
                color: 'var(--border-color)',
                '& .MuiSvgIcon-root': { fontSize: 28 },
                '&.Mui-checked': {
                  color: 'var(--primary)'
                }
              }}
            />
            <label htmlFor='facilityCheckbox' className='cursor-pointer'>
              <Typography variant='body2'>Call</Typography>
            </label>
          </div>
          <div className='flex items-center '>
            <Checkbox
              id='facilityCheckbox'
              className='mr-2'
              sx={{
                color: 'var(--border-color)',
                '& .MuiSvgIcon-root': { fontSize: 28 },
                '&.Mui-checked': {
                  color: 'var(--primary)'
                }
              }}
            />
            <label htmlFor='facilityCheckbox' className='cursor-pointer'>
              <Typography variant='body2'>Email</Typography>
            </label>
          </div>
          <div className='flex items-center '>
            <Checkbox
              id='facilityCheckbox'
              className='mr-2'
              sx={{
                color: 'var(--border-color)',
                '& .MuiSvgIcon-root': { fontSize: 28 },
                '&.Mui-checked': {
                  color: 'var(--primary)'
                }
              }}
            />
            <label htmlFor='facilityCheckbox' className='cursor-pointer'>
              <Typography variant='body2'>Skype</Typography>
            </label>
          </div>
          <div className='flex items-center '>
            <Checkbox
              id='facilityCheckbox'
              className='mr-2'
              sx={{
                color: 'var(--border-color)',
                '& .MuiSvgIcon-root': { fontSize: 28 },
                '&.Mui-checked': {
                  color: 'var(--primary)'
                }
              }}
            />
            <label htmlFor='facilityCheckbox' className='cursor-pointer'>
              <Typography variant='body2'>SMS</Typography>
            </label>
          </div>
          <div className='flex items-center '>
            <Checkbox
              id='facilityCheckbox'
              className='mr-2'
              sx={{
                color: 'var(--border-color)',
                '& .MuiSvgIcon-root': { fontSize: 28 },
                '&.Mui-checked': {
                  color: 'var(--primary)'
                }
              }}
            />
            <label htmlFor='facilityCheckbox' className='cursor-pointer'>
              <Typography variant='body2'>Zalo</Typography>
            </label>
          </div>
        </div>
        <div className='border border-solid border-[var(--border-color)] rounded-xl'>
          <Box className='flex justify-between items-center p-4 h-[40px]'>
            <Typography color='var(--text-primary)' variant='body3'>
              Phương tiện đã chọn
            </Typography>
          </Box>
          <Divider
            sx={{
              borderBottom: '1px solid var(--border-color)',
              width: '100%'
            }}
          />
          <div className=' h-[250px] overflow-y-auto'>
            <div className='flex flex-col gap-2 p-2'>
              <div className='flex items-center justify-between bg-[var(--grey-primary-60)] rounded-lg p-2'>
                <Typography variant='body3'>Call</Typography>
                <IconPhosphor iconName='X' size={20} />
              </div>
              <InputCustom />
              <InputCustom />
            </div>
            <div className='flex flex-col gap-2 p-2'>
              <div className='flex items-center justify-between bg-[var(--grey-primary-60)] rounded-lg p-2'>
                <Typography variant='body3'>SMS</Typography>
                <IconPhosphor iconName='X' size={20} />
              </div>
              <InputCustom />
              <InputCustom />
            </div>
            <div className='flex flex-col gap-2 p-2'>
              <div className='flex items-center justify-between bg-[var(--grey-primary-60)] rounded-lg p-2'>
                <Typography variant='body3'>Skype</Typography>
                <IconPhosphor iconName='X' size={20} />
              </div>
              <InputCustom />
              <InputCustom />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectFacility;
