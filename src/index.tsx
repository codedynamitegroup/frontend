import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import "config/i18n";
import { LinearProgress } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <React.Suspense fallback={<LinearProgress />}>
        <App />
      </React.Suspense>
    </React.StrictMode>
  </Provider>
);
