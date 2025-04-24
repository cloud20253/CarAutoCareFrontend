import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getTimeUntilExpiration, logout } from '../../utils/tokenUtils';

interface SessionExpirationHandlerProps {
  // Time in milliseconds before expiration to show warning (default: 5 minutes)
  warningTime?: number;
  // Time in milliseconds before expiration to show critical warning (default: 1 minute)
  criticalTime?: number;
}

const SessionExpirationHandler: React.FC<SessionExpirationHandlerProps> = ({
  warningTime = 5 * 60 * 1000,
  criticalTime = 60 * 1000,
}) => {
  const [warningOpen, setWarningOpen] = useState(false);
  const [criticalOpen, setCriticalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Check token expiration and set up timers
  useEffect(() => {
    // Check token expiration time
    const checkExpiration = () => {
      const expTime = getTimeUntilExpiration();
      
      if (expTime === null) {
        // Token is invalid or already expired
        logout();
        return;
      }
      
      setTimeLeft(expTime);
      
      // Set up warning timer
      if (expTime > warningTime) {
        const warningTimer = setTimeout(() => {
          setWarningOpen(true);
        }, expTime - warningTime);
        
        // Set up critical warning timer
        const criticalTimer = setTimeout(() => {
          setWarningOpen(false);
          setCriticalOpen(true);
        }, expTime - criticalTime);
        
        // Cleanup function
        return () => {
          clearTimeout(warningTimer);
          clearTimeout(criticalTimer);
        };
      } else if (expTime > criticalTime) {
        // Already past warning time but not critical
        setWarningOpen(true);
        
        // Set up critical warning timer
        const criticalTimer = setTimeout(() => {
          setWarningOpen(false);
          setCriticalOpen(true);
        }, expTime - criticalTime);
        
        // Cleanup function
        return () => {
          clearTimeout(criticalTimer);
        };
      } else {
        // Already in critical time
        setCriticalOpen(true);
      }
    };
    
    // Initial check
    checkExpiration();
    
    // Set up interval to check every minute
    const interval = setInterval(checkExpiration, 60 * 1000);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, [warningTime, criticalTime]);

  // Calculate remaining time for display
  const getFormattedTimeLeft = (): string => {
    if (!timeLeft) return '0:00';
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    // In a real implementation, this would call an API to refresh the token
    // For now, just close the warnings
    setWarningOpen(false);
    setCriticalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Warning notification */}
      <Snackbar
        open={warningOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={handleExtendSession}>
              Stay Logged In
            </Button>
          }
        >
          Your session will expire soon. Please save your work.
        </Alert>
      </Snackbar>

      {/* Critical dialog - can't be dismissed except by action */}
      <Dialog
        open={criticalOpen}
        disableEscapeKeyDown
      >
        <DialogTitle>
          Session Expiring
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your session will expire in {getFormattedTimeLeft()}. Any unsaved work will be lost.
            Would you like to stay logged in or log out now?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="error">
            Log Out
          </Button>
          <Button onClick={handleExtendSession} variant="contained" color="primary" autoFocus>
            Stay Logged In
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionExpirationHandler; 