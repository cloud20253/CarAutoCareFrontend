import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { userForgetPassword } from '../Services/userService';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = React.useState('');

  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleForgetPassword = async () => {
    try {
      const response = await userForgetPassword({ email });
      console.log(response);
      if (response.status === "Successful") {
        setNotification({
          open: true,
          message: "Reset Link Sent Successfully. Please Check Your Mail",
          severity: "success",
        });
      }
    } catch (error: any) {
      console.log(error);

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.exception ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        "Failed to send OTP";
      setNotification({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    }
  };
  
  const handleNotificationClose = () => {
    setNotification({ open: false, message: '', severity: 'success' });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleForgetPassword();
              handleClose();
            },
            sx: { backgroundImage: 'none' },
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={notification.open}
        onClose={handleNotificationClose}
        aria-labelledby="notification-dialog-title"
        aria-describedby="notification-dialog-description"
      >
        <DialogTitle id="notification-dialog-title">Notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="notification-dialog-description">
            {notification.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotificationClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
