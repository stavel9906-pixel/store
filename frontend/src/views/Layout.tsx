import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { NAVIGATION } from "../router/navigation";
import { CardContent, CardMedia, IconButton, Typography, Stack, Tooltip } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";

const CustomAppTitle = () => (
  <CardContent sx={{ display: "flex", alignItems: "center" }}>
    <CardMedia
      component="img"
      sx={{ width: 40 }}
      image="/src/images/icon.webp"
      alt="Logo"
    />
    <Typography sx={{ fontWeight: "bold", fontSize: 25 }}>The</Typography>
    <Typography sx={{ color: "text.secondary", fontSize: 25 }}>Mall</Typography>
  </CardContent>
);

const CustomToolbarActions = () => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Tooltip title="Theme">
      <ThemeSwitcher />
    </Tooltip>
    <IconButton color="primary">
      <AccountBoxIcon />
    </IconButton>
  </Stack>
);

const Layout: FC = () => {
  return (
    <AppProvider navigation={NAVIGATION}>
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,       
          toolbarActions: CustomToolbarActions, 
        }}
        sx={{ backgroundColor: "#e1f9fdff" }}
      >
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
};

export default Layout;
