import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import NavigationMenu from './components/navigation/NavigationMenu';

// Mock token for testing - remove in production
const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTYW1Db25AZ21haWwuY29tIiwiZmlyc3RuYW1lIjoiU2FtIiwidXNlcklkIjoxMDAzMywiY29tcG9uZW50TmFtZXMiOlsiTWFuYWdlIFJlcGFpcnMiLCJNYW5hZ2UgVXNlciIsIlNlcnZpY2UgUXVldWUiLCJCb29raW5ncyIsIkNvdW50ZXIgU2FsZSIsIk1hbmFnZSBTdG9jayJdLCJhdXRob3JpdGllcyI6WyJFTVBMT1lFRSJdLCJyb2xlcyI6WyJFTVBMT1lFRSJdLCJpc0VuYWJsZSI6dHJ1ZSwiaWF0IjoxNzQ1MzA3MzY1LCJleHAiOjE3NDUzMTA5NjV9.D1R-Xr9u3WmJdGm9W4oyBDxD0vLVr2zZT9QYsZT62Kg";

interface DecodedToken {
  sub: string;
  firstname: string;
  userId: number;
  componentNames: string[];
  authorities: string[];
  roles: string[];
  isEnable: boolean;
  iat: number;
  exp: number;
}

interface User {
  isAuthenticated: boolean;
  name: string;
  role: string;
  components: string[];
}

const Header: React.FC<{ user: User, onLogout: () => void }> = ({ user, onLogout }) => {
  return (
    <Box sx={{ 
      bgcolor: '#2c3e50', 
      color: 'white', 
      p: 2, 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Box component="a" href="/" sx={{ textDecoration: 'none', color: 'white' }}>
        <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AutoCarCarePoint</Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box component="a" href="/" sx={{ color: 'white', textDecoration: 'none' }}>Home</Box>
        <Box component="a" href="/buy-accessories" sx={{ color: 'white', textDecoration: 'none' }}>Buy Accessories</Box>
        
        {user.isAuthenticated && (user.role === 'ADMIN' || user.role === 'EMPLOYEE') && (
          <Box component="a" href="/dashboard" sx={{ color: 'white', textDecoration: 'none' }}>Dashboard</Box>
        )}
        
        {user.isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>{user.name} ({user.role})</Box>
            <Box 
              component="button" 
              onClick={onLogout} 
              sx={{ 
                bgcolor: 'transparent',
                border: '1px solid white',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                cursor: 'pointer'
              }}
            >
              Logout
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  if (!user.isAuthenticated || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
    return <Box>Not authorized</Box>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <NavigationMenu components={user.components} />
    </Box>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>({
    isAuthenticated: false,
    name: '',
    role: '',
    components: []
  });

  useEffect(() => {
    // For testing purposes - in production, retrieve from localStorage
    // const token = localStorage.getItem('token');
    const token = mockToken;
    
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token:', decoded);
        
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUser({
            isAuthenticated: true,
            name: decoded.firstname,
            role: decoded.roles[0],
            components: decoded.componentNames
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    setUser({
      isAuthenticated: false,
      name: '',
      role: '',
      components: []
    });
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Header user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/" element={<Box>Home Page</Box>} />
          <Route path="/buy-accessories" element={<Box>Buy Accessories Page</Box>} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
