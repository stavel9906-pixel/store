import { type Navigation } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import IconButtonWithBadge from "../components/IconButtonBudget/IconButtonBudget";
import HistoryIcon from "@mui/icons-material/History";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";

export const NAVIGATION: Navigation = [
  {
    kind: "divider",
  },
  {
    segment: "home",
    title: " Home",
    icon: <HomeIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "products",
    title: " Products",
    icon: <DashboardIcon />,
  },
  {
    segment: "order",
    title: "Order",
    icon: <IconButtonWithBadge />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "More Details",
  },
  {
    segment: "history",
    title: " History",
    icon: <HistoryIcon />,
  },
  {
    segment: "profile",
    title: " Profile",
    icon: <AccountBoxIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Contact",
  },
  {
    segment: "chat",
    title: " Chat",
    icon: <ChatIcon />,
  },
];
