import { Login } from "../views/Home";

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