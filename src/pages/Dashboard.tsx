import React, { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardActionArea, CardContent, Typography, Container, Paper, Divider, Grid, Avatar } from "@mui/material";
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
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [authorizedComponents, setAuthorizedComponents] = useState<string[]>([]);
  const [filteredComponents, setFilteredComponents] = useState(allComponents);

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
          
          const filtered = allComponents.filter(component => 
            userComponents.includes(component.value)
          );
          
          setFilteredComponents(filtered);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to bottom right, #1a202c, #2d3748)' 
          : 'linear-gradient(to bottom right, #f7fafc, #ebf4ff)',
        color: theme.palette.text.primary,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: 'primary.main',
                mr: 2,
                animation: `${pulse} 2s infinite`
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : "A"}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {getGreeting()}, {userName || "User"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {userRole === "ADMIN" ? "Administrator" : "Employee"} Dashboard
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h4" fontWeight="bold" mb={1} align="center">
        AUTO CAR CARE POINT
      </Typography>
        </Paper>

        {userRole === "EMPLOYEE" && (
          <Box sx={{ mb: 4, animation: `${fadeIn} 0.6s ease-out` }}>
            <Paper 
              elevation={0} 
        sx={{
                p: 2, 
                borderRadius: 2,
                bgcolor: 'info.main',
                color: 'white',
              }}
            >
              <Typography variant="body1">
                You have access to {authorizedComponents.length} service modules
              </Typography>
            </Paper>
          </Box>
        )}

        <Grid container spacing={3}>
          {filteredComponents.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card
            sx={{
                  height: 160,
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
                    transform: "translateY(-10px) scale(1.02)",
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
                  animationDelay: `${0.2 + index * 0.1}s`,
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
                    p: 2,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Box 
                    className="icon-container"
                    sx={{ 
                      p: 2, 
                      borderRadius: '50%', 
                      mb: 2,
                      display: 'inline-flex',
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.15)' 
                        : 'rgba(255,255,255,0.8)',
                      transition: "all 0.5s ease",
                      transform: "scale(1)",
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography 
                    className="card-title"
                    variant="h6" 
                    fontWeight="bold"
                    align="center"
                    sx={{ 
                      transition: "all 0.3s ease",
                      position: "relative",
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
            mt: 6, 
            pt: 3, 
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
