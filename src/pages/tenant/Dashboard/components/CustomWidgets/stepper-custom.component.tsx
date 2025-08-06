import { Step, StepConnector, stepConnectorClasses, StepIconProps, StepLabel, Stepper, styled } from '@mui/material';

function StepperCustom({ steps, activeStep }: any) {
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
      display: 'flex',
      justifyContent: 'center'
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: 'var(--primary)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: 'var(--primary)'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
      border: 0,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
      width: 80
    }
  }));

  const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ ownerState }) => ({
    backgroundColor: 'transparent',
    zIndex: 1,
    color: 'var(--text-secondary)',
    border: '1px solid var(--grey-neutral-100)',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)'
    }),
    ...(ownerState.completed && {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)'
    })
  }));
  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {String(props.icon)}
      </ColorlibStepIconRoot>
    );
  }

  return (
    <Stepper className='w-3/4' alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
      {steps?.map((label) => (
        <Step
          sx={{
            '& .MuiStepLabel-label': {
              marginTop: '0 !important',
              fontSize: '14px',
              '&.Mui-active': {
                color: '#007EF5' // Change the color to blue when active
              }
            }
          }}
          key={label}
        >
          <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default StepperCustom;
