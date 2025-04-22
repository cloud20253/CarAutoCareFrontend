import { keyframes } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  },
  {
    value: "Service Queue",
    icon: <ArticleIcon sx={{ color: "secondary.main", fontSize: 40 }} />,
    url: "/admin/vehicle?listType=serviceQueue",
  },
  {
    value: "Bookings",
    icon: <GarageIcon sx={{ color: "success.main", fontSize: 40 }} />,
    url: "/admin/appointmentList",
  },
  {
    value: "Vehicle Registration",
    icon: <GarageIcon sx={{ color: "info.main", fontSize: 40 }} />,
    url: "/admin/vehicle/add",
  },
  {
    value: "Service History",
    icon: <FormatListBulletedIcon sx={{ color: "warning.main", fontSize: 40 }} />,
    url: "/admin/vehicle?listType=serviceHistory",
  },
  {
    value: "Counter Sale",
    icon: <StoreIcon sx={{ color: "error.main", fontSize: 40 }} />,
    url: "/admin/counterSale",
  },
  {
    value: "Quotation",
    icon: <DescriptionIcon sx={{ color: "primary.dark", fontSize: 40 }} />,
    url: "/admin/quatationlist",
  },
  {
    value: "Insurance",
    icon: <SecurityIcon sx={{ color: "secondary.dark", fontSize: 40 }} />,
    url: "/admin/insuranceList",
  },
  // Removing duplicate items that are already in the side menu
  // {
  //   value: "Manage User",
  //   icon: <PersonIcon sx={{ color: "error.main", fontSize: 40 }} />,
  //   url: "/admin/employeeManagement",
  // },
  // {
  //   value: "Manage Repairs",
  //   icon: <BuildIcon sx={{ color: "success.main", fontSize: 40 }} />,
  //   url: "/admin/repairs",
  // },
  // {
  //   value: "Manage Stock",
  //   icon: <InventoryIcon sx={{ color: "info.main", fontSize: 40 }} />,
  //   url: "/admin/stock",
  // },
];

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [userRole, setUserRole] = useState("");
  const [authorizedComponents, setAuthorizedComponents] = useState<string[]>([]);
  const [filteredComponents, setFilteredComponents] = useState(allComponents);

  useEffect(() => {
    // Get user role and permissions from localStorage
    const storedDecodedToken = localStorage.getItem("userData");
    if (storedDecodedToken) {
      try {
        const parsedToken = JSON.parse(storedDecodedToken);
        const role = parsedToken.authorities[0];
        setUserRole(role);
        
        // If role is ADMIN, show all components
        if (role === "ADMIN") {
          setFilteredComponents(allComponents);
        } else {
          // For EMPLOYEE, filter based on authorized components
          const userComponents = parsedToken.componentNames || [];
          setAuthorizedComponents(userComponents);
          
          // Filter components based on user's permissions
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 5,
        px: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4}>
        AUTO CAR CARE POINT
      </Typography>

      {userRole === "EMPLOYEE" && (
        <Typography variant="subtitle1" mb={2} color="text.secondary">
          You have access to {authorizedComponents.length} components
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          maxWidth: "1000px",
        }}
      >
        {filteredComponents.map((card, index) => (
          <Card
            key={index}
            sx={{
              width: 220,
              height: 150,
              backgroundColor: "transparent",
              borderRadius: 3,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              border: "none",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 4,
              },
              opacity: 0,
              animation: `${fadeIn} 0.5s ease-in-out forwards`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <CardActionArea onClick={() => navigate(card.url)} sx={{ height: "100%" }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {card.icon}
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                  {card.value}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {filteredComponents.length === 0 && (
        <Typography variant="h6" sx={{ mt: 5, color: "text.secondary" }}>
          You don't have access to any components. Please contact your administrator.
        </Typography>
      )}

      <Typography variant="body2" sx={{ mt: 5 }}>
        Copyright © AutoCarCarePoint 2025.
      </Typography>
    </Box>
  );
}
