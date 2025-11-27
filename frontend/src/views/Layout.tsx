import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { NAVIGATION } from "../router/navigation";
import { CardContent, CardMedia, Typography } from "@mui/material";

const SmallerSymbol = () => {
  return (
        <CardContent sx={{ display: 'flex'}}>
          <CardMedia
        component="img"
        sx={{ width: 40 }}
        image="/src/images/icon.webp"
        alt="Live from space album cover"
      />
      
          <Typography sx={{fontWeight: 'bold', fontSize: 25}}>
            The
          </Typography>
          <Typography
            sx={{ color: 'text.secondary', fontSize: 25 }}
          >
            Mall
          </Typography>
        </CardContent>
  );
};

const Layout: FC = () => {
  return (
    <>
      <AppProvider navigation={NAVIGATION}>
        <DashboardLayout
          slots={{
            appTitle: SmallerSymbol,
          }}
        >
          {/* כאן כל דף אחר נטען */}
          <Outlet />
        </DashboardLayout>
      </AppProvider>
    </>
  );
};

export default Layout;
