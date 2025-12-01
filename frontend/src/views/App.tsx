import { RouterProvider } from "react-router-dom";
import { router } from "../router";

export const App = () => {
  return (
    <main className="text-center">
        <RouterProvider router={router} />
    </main>
  );
};
