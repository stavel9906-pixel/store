import HorizontalLinearStepper from "../views/Stepper";
import { Home } from "../views/Home";
import { Login } from "../views/Login/Login";

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
];
