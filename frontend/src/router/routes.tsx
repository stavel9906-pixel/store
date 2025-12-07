import { Products } from "../views/Products";
import { Login } from "../views/Login/Login";
import { History } from "../views/History";
import { Profile } from "../views/Profile";
import { ChatPage } from "../views/Chat/Chat";
import { HorizontalLinerStepper } from "../views/Stepper";
import { Home } from "../views/Home/Home";

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
    path: "/products",
    element: <Products />,
    name: "products",
  },
  {
    path: "/order",
    element: <HorizontalLinerStepper />,
    name: "order",
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
    element: <ChatPage />,
    name: "chat",
  },
  {
    path: "/home",
    element: <Home />,
    name: "home",
  },
];
