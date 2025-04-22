import React, { useEffect, useState, useCallback } from "react";
import { keyframes } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { 
  Box, 
  Card, 
  CardActionArea, 
  Typography, 
  Container, 
  Paper, 
  Divider, 
  Grid, 
  Avatar,
  useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GarageIcon from '@mui/icons-material/Garage';
import BuildIcon from '@mui/icons-material/Build';
import StoreIcon from '@mui/icons-material/Store';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';

// Primary dashboard items - these are unique to the dashboard
const allComponents = [
  {
    value: "Purchase",
    icon: <AddShoppingCartIcon sx={{ color: "primary.main", fontSize: 40 }} />,
    url: "/admin/transaction",
    description: "Manage purchases and transactions",
  },
  {
    value: "Service Queue",
    icon: <ArticleIcon sx={{ color: "secondary.main", fontSize: 40 }} />,
    url: "/admin/vehicle?listType=serviceQueue",
    description: "View and manage pending services",
  },
  {
    value: "Bookings",
    icon: <GarageIcon sx={{ color: "success.main", fontSize: 40 }} />,
    url: "/admin/appointmentList",
    description: "Track all service appointments",
  },
  {
    value: "Vehicle Registration",
    icon: <GarageIcon sx={{ color: "info.main", fontSize: 40 }} />,
    url: "/admin/vehicle/add",
    description: "Register new vehicles",
  },
  {
    value: "Service History",
    icon: <FormatListBulletedIcon sx={{ color: "warning.main", fontSize: 40 }} />,
    url: "/admin/vehicle?listType=serviceHistory",
    description: "View completed service records",
  },
  {
    value: "Counter Sale",
    icon: <StoreIcon sx={{ color: "error.main", fontSize: 40 }} />,
    url: "/admin/counterSale",
    description: "Process direct sales transactions",
  },
  {
    value: "Quotation",
    icon: <DescriptionIcon sx={{ color: "primary.dark", fontSize: 40 }} />,
    url: "/admin/quatationlist",
    description: "Create and manage quotations",
  },
  {
    value: "Insurance",
    icon: <SecurityIcon sx={{ color: "secondary.dark", fontSize: 40 }} />,
    url: "/admin/insuranceList",
    description: "Handle insurance claims and policies",
  },
  {
    value: "Job Card",
    icon: <DescriptionIcon sx={{ color: "success.dark", fontSize: 40 }} />,
    url: "/admin/jobCardgrid",
    description: "Manage job cards",
  },
  {
    value: "Spares",
    icon: <InventoryIcon sx={{ color: "warning.dark", fontSize: 40 }} />,
    url: "/admin/manage-stock",
    description: "Manage spare parts",
  },
  {
    value: "Services",
    icon: <BuildIcon sx={{ color: "info.dark", fontSize: 40 }} />,
    url: "/admin/services",
    description: "Manage services",
  },
];

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.5);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
`;

// Add a new glow keyframe animation
const glow = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(66, 153, 225, 0.5), 0 0 20px rgba(66, 153, 225, 0);
  }
  50% {
    box-shadow: 0 0 15px rgba(66, 153, 225, 0.7), 0 0 30px rgba(66, 153, 225, 0.4);
  }
  100% {
    box-shadow: 0 0 10px rgba(66, 153, 225, 0.5), 0 0 20px rgba(66, 153, 225, 0);
  }
`;

// Get color for card based on index
const getCardGlowColor = (index: number) => {
  const colors = [
    'rgba(99, 102, 241, 0.8)', // indigo
    'rgba(236, 72, 153, 0.8)', // pink
    'rgba(59, 130, 246, 0.8)', // blue
    'rgba(16, 185, 129, 0.8)', // green
    'rgba(245, 158, 11, 0.8)', // amber
    'rgba(239, 68, 68, 0.8)',  // red
    'rgba(139, 92, 246, 0.8)', // purple
    'rgba(14, 165, 233, 0.8)'  // sky
  ];
  return colors[index % colors.length];
};

// Define colors for card borders
const getCardBorderGlow = (index: number, isDark: boolean) => {
  const color = getCardGlowColor(index);
  return isDark 
    ? `0 0 15px ${color}, inset 0 0 10px ${color.replace('0.8', '0.3')}`
    : `0 0 15px ${color.replace('0.8', '0.5')}, inset 0 0 5px ${color.replace('0.8', '0.2')}`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [authorizedComponents, setAuthorizedComponents] = useState<string[]>([]);
  const [filteredComponents, setFilteredComponents] = useState(allComponents);
  
  const findMatchingComponents = useCallback((componentNames: string[]) => {
    // First try to match exact names
    const exactMatches = allComponents.filter(component => 
      componentNames.includes(component.value)
    );
    
    // If we don't have enough exact matches, try partial matches
    if (exactMatches.length < componentNames.length) {
      const remainingNames = componentNames.filter(
        name => !exactMatches.some(match => match.value === name)
      );
      
      const partialMatches = allComponents.filter(component => 
        !exactMatches.some(match => match.value === component.value) && // Avoid duplicates
        remainingNames.some(name => 
          component.value.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(component.value.toLowerCase())
        )
      );
      
      // If we still don't have enough components, add some defaults
      if (exactMatches.length + partialMatches.length < componentNames.length) {
        const defaultComponents = allComponents.slice(0, componentNames.length - (exactMatches.length + partialMatches.length));
        return [...exactMatches, ...partialMatches, ...defaultComponents];
      }
      
      return [...exactMatches, ...partialMatches];
    }
    
    return exactMatches;
  }, []);

  useEffect(() => {
    const storedDecodedToken = localStorage.getItem("userData");
    if (storedDecodedToken) {
      try {
        const parsedToken = JSON.parse(storedDecodedToken);
        const role = parsedToken.authorities[0];
        setUserRole(role);
        setUserName(parsedToken.firstname || "");
        
        if (role === "ADMIN") {
          setFilteredComponents(allComponents);
        } else {
          const userComponents = parsedToken.componentNames || [];
          setAuthorizedComponents(userComponents);
          
          // Use the helper function to find matching components
          const matchedComponents = findMatchingComponents(userComponents);
          setFilteredComponents(matchedComponents);
          
          console.log("User has access to:", userComponents);
          console.log("Matched components:", matchedComponents.map(c => c.value));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [findMatchingComponents]);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate grid column sizes based on number of components
  const getGridColumns = () => {
    const count = filteredComponents.length;
    
    if (isMobile) {
      return count <= 2 ? 12 : 6; // 1 or a max of 2 columns on mobile
    } else if (isTablet) {
      if (count <= 3) return 4; // 3 columns
      return 4; // 3 columns  
    } else {
      if (count <= 4) return 3; // 4 columns
      if (count <= 8) return 3; // 4 columns
      return 2; // 6 columns for many items
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: '100%',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to bottom right, #1a202c, #2d3748)' 
          : 'linear-gradient(to bottom right, #f7fafc, #ebf4ff)',
        color: theme.palette.text.primary,
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 }
      }}
    >
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Paper 
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            width: '100%',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(0, 0, 0, 0))' 
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(255,255,255,0.7)',
            animation: `${fadeIn} 0.5s ease-out`,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            mb: 2 
          }}>
            <Avatar 
              sx={{ 
                width: { xs: 48, sm: 56 }, 
                height: { xs: 48, sm: 56 }, 
                bgcolor: 'primary.main',
                mr: { xs: 0, sm: 2 },
                mb: { xs: 1, sm: 0 },
                animation: `${pulse} 2s infinite`
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : "A"}
            </Avatar>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h5" fontWeight="bold">
                {getGreeting()}, {userName || "User"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {userRole === "ADMIN" ? "Administrator" : "Employee"} Dashboard
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            mb={1} 
            align="center"
            sx={{ fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2rem' } }}
          >
            AUTO CAR CARE POINT
          </Typography>
        </Paper>

        {userRole === "EMPLOYEE" && (
          <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, animation: `${fadeIn} 0.6s ease-out` }}>
            <Paper 
              elevation={0} 
              sx={{
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: 2,
                bgcolor: 'info.main',
                color: 'white',
                textAlign: 'center',
                width: '100%'
              }}
            >
              <Typography variant="body1">
                You have access to {authorizedComponents.length} service modules
              </Typography>
            </Paper>
          </Box>
        )}

        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', mx: 'auto' }}>
          {filteredComponents.map((card, index) => (
            <Grid item xs={getGridColumns()} sm={4} md={3} key={index}>
              <Card
                sx={{
                  height: { xs: 130, sm: 150 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.9) 100%)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(0,0,0,0.05)',
                  "&::before": {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                    background: theme.palette.mode === 'dark'
                      ? 'radial-gradient(circle at center, rgba(30,64,175,0.15) 0%, rgba(15,23,42,0) 70%)'
                      : 'radial-gradient(circle at center, rgba(191,219,254,0.5) 0%, rgba(255,255,255,0) 70%)'
                  },
                  "&:hover": {
                    transform: "translateY(-5px) scale(1.02)",
                    boxShadow: (theme) => getCardBorderGlow(index, theme.palette.mode === 'dark'),
                    borderColor: getCardGlowColor(index).replace('0.8', '0.3'),
                    "&::before": {
                      opacity: 1
                    },
                    "& .icon-container": {
                      transform: "scale(1.1) rotate(5deg)",
                      boxShadow: `0 0 20px ${getCardGlowColor(index)}`,
                    },
                    "& .card-title": {
                      textShadow: `0 0 8px ${getCardGlowColor(index).replace('0.8', '0.5')}`,
                      transform: "translateY(2px)",
                    }
                  },
                  opacity: 0,
                  animation: `${fadeIn} 0.5s ease-out forwards`,
                  animationDelay: `${0.1 + index * 0.05}s`,
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(card.url)} 
                  sx={{ 
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 1, sm: 2 },
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Box 
                    className="icon-container"
                    sx={{ 
                      p: { xs: 1, sm: 1.5 }, 
                      borderRadius: '50%', 
                      mb: { xs: 1, sm: 1.5 },
                      display: 'inline-flex',
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.15)' 
                        : 'rgba(255,255,255,0.8)',
                      transition: "all 0.5s ease",
                      transform: "scale(1)",
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    {React.cloneElement(card.icon, { 
                      sx: { 
                        ...card.icon.props.sx,
                        fontSize: isMobile ? 24 : 32
                      }
                    })}
                  </Box>
                  <Typography 
                    className="card-title"
                    variant={isMobile ? "subtitle1" : "h6"}
                    fontWeight="bold"
                    align="center"
                    sx={{ 
                      transition: "all 0.3s ease",
                      position: "relative",
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -4,
                        left: "50%",
                        width: "0%",
                        height: "2px",
                        bgcolor: getCardGlowColor(index),
                        transform: "translateX(-50%)",
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": {
                        width: "70%"
                      }
                    }}
                  >
                    {card.value}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredComponents.length === 0 && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mt: 4, 
              borderRadius: 2, 
              textAlign: 'center',
              animation: `${fadeIn} 0.7s ease-out`,
            }}
          >
            <Typography variant="h6" color="error">
              You don't have access to any components. Please contact your administrator.
            </Typography>
          </Paper>
        )}

        <Box 
          sx={{ 
            mt: { xs: 4, sm: 5, md: 6 }, 
            pt: 2, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            textAlign: 'center',
            animation: `${fadeIn} 0.8s ease-out`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Copyright © Auto Car Care Point {new Date().getFullYear()}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
