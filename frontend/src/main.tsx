import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SelectedConvoyProvider } from "./context/SelectedConvoy";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="text-center">
      <SelectedConvoyProvider>
        <RouterProvider router={router} />
      </SelectedConvoyProvider>
    </main>
  </React.StrictMode>
);
