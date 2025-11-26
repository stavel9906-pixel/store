import { Login } from "../views/Login/Login";

export interface Page {
  path: string;
  element: JSX.Element;
  name: string;
  isShown: boolean;
}

export const routes: Page[] = [
  {
    path: "/",
    element: <Login />,
    name: "התחברות",
    isShown: true,
  },
  {
    path: "/other",
    element: <h1>other</h1>,
    name: "מפה",
    isShown: true,
  },
];
