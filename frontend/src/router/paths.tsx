import Layout from "../views/Layout";


import { routes } from "./routes";

export const paths = [
  routes[0],
  {
    path: "/",
    element: <Layout />,
    children: routes.slice(1).map((route) => ({
      path: route.path,
      element: route.element,
    })),
  },
];
