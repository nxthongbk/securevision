import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import ResetForm from './ResetForm';
import OtpForm from './OtpForm';
import NewPasswordForm from './NewPasswordForm';
import { MODE_RESET_PASSWORD_FORM } from '~/constants/rule.constant';
import { Box, Paper } from '@mui/material';

interface IProps {
  setResetMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ResetPasswordForm({ setResetMode }: IProps) {
  const [modeForm, setModeForm] = useState(MODE_RESET_PASSWORD_FORM.RESET_PASSWORD_FORM);
  const [account, setAccount] = useState({
    phone: '',
    username: '',
  });

  const renderForm = () => {
    if (modeForm === MODE_RESET_PASSWORD_FORM.RESET_PASSWORD_FORM) {
      return <ResetForm setAccount={setAccount} setModeForm={setModeForm} />;
    }
    if (modeForm === MODE_RESET_PASSWORD_FORM.OTP_PASSWORD_FORM) {
      return <OtpForm username={account.username} />;
    }
    if (modeForm === MODE_RESET_PASSWORD_FORM.NEW_PASSWORD_FORM) {
      return <NewPasswordForm />;
    }
  };

  return (
    <div className="min-w-[500px]">
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: 588,
          px: 5,
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Paper
          sx={{
            zIndex: 3,
            position: 'relative',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            padding: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
              fontWeight: 400,
              mb: 8,
              textAlign: 'center',
              letterSpacing: 1,
              fontSize: { xs: 28, sm: 32 },
            }}
          >
            Đổi mật khẩu mới
          </Typography>
          <div>{renderForm()}</div>

          <Button
            variant="outlined"
            className="w-full"
            type="submit"
            onClick={() => setResetMode(false)}
          >
            Về trang đăng nhập
          </Button>
        </Paper>
      </Box>
    </div>
  );
}
