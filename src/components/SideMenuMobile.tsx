import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import storageUtils from '../utils/storageUtils';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const auth = useAuth();
  const { logout, userName, userRole } = auth;
  const navigate = useNavigate();
  const [displayName, setDisplayName] = React.useState<string>('User');

  // Get username immediately on component mount and whenever auth changes
  React.useEffect(() => {
    console.log('Auth context in SideMenuMobile:', auth);
    console.log('userName from context:', userName);
    
    // Try to get username from token if not available in context
    try {
      const userData = storageUtils.getUserData();
      if (userData && userData.firstname) {
        setDisplayName(userData.firstname);
        console.log('Got username from token:', userData.firstname);
      } else if (userName) {
        setDisplayName(userName);
        console.log('Using userName from context:', userName);
      }
    } catch (error) {
      console.error('Error getting username:', error);
    }
  }, [auth, userName]);

  const handleLogout = () => {
    toggleDrawer(false)();
    try {
      // Force immediate redirect to prevent auth state issues
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('userData');
      window.sessionStorage.removeItem('token');
      window.sessionStorage.removeItem('userData');
      navigate('/signIn');
      // Then call the context logout for complete cleanup
      setTimeout(() => {
        logout();
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/signIn';
    }
  };

  // Force dark text globally within the drawer
  React.useEffect(() => {
    if (open) {
      // Add a style element to force dark text on all elements
      const styleEl = document.createElement('style');
      styleEl.id = 'mobile-menu-force-dark-text';
      styleEl.innerHTML = `
        .MuiDrawer-root .MuiDrawer-paper * {
          color: #333 !important;
        }
        .MuiDrawer-root .MuiDrawer-paper .MuiListItemText-primary {
          color: #333 !important;
        }
        .MuiDrawer-root .MuiDrawer-paper .MuiListItemText-secondary {
          color: #555 !important;
        }
        .MuiDrawer-root .MuiDrawer-paper .MuiListItemButton-root {
          color: #333 !important;
        }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        // Clean up on unmount or when drawer closes
        const el = document.getElementById('mobile-menu-force-dark-text');
        if (el) {
          document.head.removeChild(el);
        }
      };
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // Force background color on the entire drawer
        "& .MuiBackdrop-root": {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        "& .MuiPaper-root": {
          bgcolor: '#f5f5f5 !important',
          color: '#333 !important',
          backgroundImage: 'none !important'
        },
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none !important',
          bgcolor: '#f5f5f5 !important',
          width: { xs: '85%', sm: '320px' },
          color: '#333 !important',
          transition: 'all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          '& .MuiTypography-root': {
            color: '#333 !important'
          },
          '& .MuiSvgIcon-root': {
            color: '#555 !important'
          },
          '& .MuiListItemText-root .MuiTypography-root': {
            color: '#333 !important'
          }
        },
      }}
    >
      <Stack
        component="div"
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#f5f5f5 !important',
          color: '#333 !important',
        }}
      >
        <Stack 
          component="div"
          direction="row" 
          sx={{ p: 2, pb: 0, gap: 1, bgcolor: '#f5f5f5 !important', color: '#333 !important' }}
        >
          <Stack
            component="div"
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1, bgcolor: '#f5f5f5 !important', color: '#333 !important' }}
          >
            <Avatar
              sizes="small"
              alt={displayName}
              src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            />
            <Typography 
              component="p" 
              variant="h6" 
              sx={{ 
                color: '#333 !important',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              {displayName}
              {userRole && (
                <Typography 
                  component="span" 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    color: '#666 !important',
                    mt: 0.5,
                    fontSize: '0.75rem',
                  }}
                >
                  {userRole}
                </Typography>
              )}
            </Typography>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Stack 
          component="div"
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            bgcolor: '#f5f5f5 !important',
            color: '#333 !important',
            '& .MuiList-root': {
              bgcolor: '#f5f5f5 !important',
            }
          }}
        >
          <MenuContent />
          <Divider sx={{ my: 1 }} />
        </Stack>
        <Stack component="div" sx={{ p: 2, bgcolor: '#f5f5f5 !important' }}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
            sx={{ 
              textTransform: 'none',
              borderRadius: 1.5,
              py: 1,
              color: 'primary.main !important',
              borderColor: 'primary.main !important',
              bgcolor: 'rgba(255, 255, 255, 0.8) !important'
            }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
