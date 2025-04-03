import { keyframes } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GarageIcon from '@mui/icons-material/Garage';

const data = [
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
    value: "Booking",
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
    icon: <GarageIcon sx={{ color: "error.main", fontSize: 40 }} />,
    url: "/admin/counterSale",
  },
  {
    value: "Quotation",
    icon: <GarageIcon sx={{ color: "primary.dark", fontSize: 40 }} />,
    url: "/admin/quatation",
  },
  {
    value: "Insurance",
    icon: <GarageIcon sx={{ color: "secondary.dark", fontSize: 40 }} />,
    url: "/admin/vehicle",
  },
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

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          maxWidth: "1000px",
        }}
      >
        {data.map((card, index) => (
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

      <Typography variant="body2" sx={{ mt: 5 }}>
        Copyright © AutoCarCarePoint 2025.
      </Typography>
    </Box>
  );
}
