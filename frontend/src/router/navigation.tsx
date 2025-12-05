import { type Navigation } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import DescriptionIcon from "@mui/icons-material/Description";
// import LayersIcon from "@mui/icons-material/Layers";
import IconButtonWithBadge from "../components/IconButtonBudget/IconButtonBudget";
import HistoryIcon from "@mui/icons-material/History";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ChatIcon from '@mui/icons-material/Chat';

export const NAVIGATION: Navigation = [
  {
    kind: "divider"
  },
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: " Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "orders",
    title: "Orders",
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
    kind: "divider"
  },
  {
    kind: "header",
    title: "Contact"
  },
  {
    segment: "chat",
    title: " Chat",
    icon: <ChatIcon />,
  },
  // {
  //   kind: "divider",
  // },
  // {
  //   kind: "header",
  //   title: "Analytics",
  // },
  // {
  //   segment: "reports",
  //   title: "Reports",
  //   icon: <BarChartIcon />,
  //   children: [
  //     {
  //       segment: "sales",
  //       title: "Sales",
  //       icon: <DescriptionIcon />,
  //     },
  //     {
  //       segment: "traffic",
  //       title: "Traffic",
  //       icon: <DescriptionIcon />,
  //     },
  //   ],
  // },
  // {
  //   segment: "integrations",
  //   title: "Integrations",
  //   icon: <LayersIcon />,
  // },
];
