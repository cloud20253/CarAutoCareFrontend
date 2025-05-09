import { useTheme } from "@mui/material/styles";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FaTools, FaClipboardList, FaCalendarAlt, FaShoppingCart } from "react-icons/fa";

const FaToolsIcon = FaTools as React.FC<{ size?: number; color?: string } & React.SVGProps<SVGSVGElement>>;
const FaClipboardListIcon = FaClipboardList as React.FC<{ size?: number; color?: string } & React.SVGProps<SVGSVGElement>>;
const FaCalendarAltIcon = FaCalendarAlt as React.FC<{ size?: number; color?: string } & React.SVGProps<SVGSVGElement>>;

const reportItems = [
  {
    text: "ADD New Stock Service",
    link: "/admin/transaction",
    icon: <FaToolsIcon size={40} color="#1976d2" />,
  },
  {
    text: "View All Stock",
    link: "/admin/transaction-list",
    icon: <FaClipboardListIcon size={40} color="#388e3c" />,
  },
];

export default function ReportCards() {
  const navigate = useNavigate();
  const theme = useTheme();                     
  const isDark = theme.palette.mode === "dark"; 

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
        Stock Management
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
        {reportItems.map((item, index) => (
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
              transition: "transform 0.3s ease-in-out",
              border: "none",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 4,
              },
            }}
          >
            <CardActionArea onClick={() => navigate(item.link)} sx={{ height: "100%" }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {item.icon}
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                  {item.text}
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
