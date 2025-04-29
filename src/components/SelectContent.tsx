import * as React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled, keyframes } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';

// Keyframes for animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`;

const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled component for the logo container
const LogoContainer = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  gap: theme.spacing(1.5),
  padding: theme.spacing(1),
  width: 'auto',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(66, 165, 245, 0.1)' 
      : 'rgba(25, 118, 210, 0.08)',
    '& .car-icon': {
      transform: 'translateZ(5px)',
    },
    '& .gear-icon': {
      transform: 'rotate(45deg)',
    },
    '& .logo-text': {
      backgroundSize: '200% auto',
      animation: `${shine} 2s linear infinite`,
    }
  }
}));

// Styled car icon container
const CarIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #2196f3, #0d47a1)',
  color: theme.palette.primary.contrastText,
  borderRadius: '12px',
  width: 38,
  height: 38,
  boxShadow: '0 3px 6px rgba(33, 150, 243, 0.3)',
  position: 'relative',
  zIndex: 1,
  transform: 'translateZ(0)',
  transition: 'all 0.3s ease',
  animation: `${float} 3s ease-in-out infinite`,
}));

// Styled gear icon for car maintenance theme
const GearIcon = styled(SettingsIcon)(({ theme }) => ({
  position: 'absolute',
  fontSize: '1rem',
  top: -4,
  right: -4,
  color: theme.palette.primary.light,
  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
  transition: 'transform 0.4s ease',
  transform: 'rotate(0deg)',
}));

export default function SelectContent() {
  return (
    <LogoContainer to="/">
      <CarIconContainer>
        <DirectionsCarIcon 
          className="car-icon"
          fontSize="small" 
          sx={{ 
            transform: 'translateZ(0)',
            transition: 'transform 0.3s ease'
          }} 
        />
        <GearIcon className="gear-icon" />
      </CarIconContainer>
      <Typography 
        variant="subtitle1" 
        fontWeight="bold"
        className="logo-text"
        sx={{ 
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
          background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 0.5,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }}
      >
        AutoCarCarePoint
      </Typography>
    </LogoContainer>
  );
}
