import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProductsAmountCartProvider } from "./context/ProductsAmountCart";
import { App } from "./views/App";
import { OrderIdProvider } from "./context/OrderId";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OrderIdProvider>
      <ProductsAmountCartProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ProductsAmountCartProvider>
    </OrderIdProvider>
  </React.StrictMode>
);
