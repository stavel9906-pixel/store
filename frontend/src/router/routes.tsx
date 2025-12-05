import HorizontalLinearStepper from "../views/Stepper";
import { Home } from "../views/Home";
import { Login } from "../views/Login/Login";
import { History } from "../views/History";
import { Profile } from "../views/Profile";
import Chat from "../views/Chat";

export interface Page {
  path: string;
  element: JSX.Element;
  name: string;
}

export const routes: Page[] = [
  {
    path: "/login",
    element: <Login />,
    name: "התחברות",
  },
  {
    path: "/dashboard",
    element: <Home />,
    name: "dashboard",
  },
  {
    path: "/orders",
    element: <HorizontalLinearStepper />,
    name: "orders",
  },
  {
    path: "/history",
    element: <History />,
    name: "history",
  },
  {
    path: "/profile",
    element: <Profile />,
    name: "profile",
  },
  {
    path: "/chat",
    element: <Chat />,
    name: "chat",
  },
];
