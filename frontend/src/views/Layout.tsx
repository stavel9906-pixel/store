import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { NAVIGATION } from "../router/navigation";
import {
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";

const CustomAppTitle = () => (
  <CardContent sx={{ display: "flex", alignItems: "center" }}>
    <CardMedia
      component="img"
      sx={{ width: "3%" }}
      image="/src/images/icon.webp"
      alt="Logo"
    />
    <Typography sx={{ fontWeight: "bold", fontSize: 25 }}>The</Typography>
    <Typography sx={{ color: "text.secondary", fontSize: 25 }}>Mall</Typography>
  </CardContent>
);

const Layout: FC = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const CustomToolbarActions = () => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Theme">
        <ThemeSwitcher />
      </Tooltip>
      <IconButton color="primary" onClick={handleLogOut}>
        <LogoutIcon />
      </IconButton>
    </Stack>
  );

  // useEffect(() => {
  //   if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  return (
    <AppProvider navigation={NAVIGATION}>
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          toolbarActions: CustomToolbarActions,
        }}
        sx={{ backgroundColor: "#b2d8dfff" }}
      >
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
};
 
export default Layout;