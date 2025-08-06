import LoginForm from './components/LoginForm';
import { useState } from 'react';
import ResetPasswordForm from './components/ResetPasswordForm';
import { Box } from '@mui/material';
import './style.scss';

export default function LogInPage() {
  const [resetMode, setResetMode] = useState(false);

  return (
    <Box>
      <Box>
        {!resetMode ? (
          <LoginForm setResetMode={setResetMode} />
        ) : (
          <ResetPasswordForm setResetMode={setResetMode} />
        )}
      </Box>
    </Box>
  );
}
