import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import "config/i18n";
import { LinearProgress } from "@mui/material";
import "moment/locale/vi";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "services/authService/azure.config";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const pca = new PublicClientApplication(msalConfig);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={googleClientId}>
        <MsalProvider instance={pca}>
          <React.Suspense fallback={<LinearProgress />}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </React.Suspense>
        </MsalProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  </Provider>
);
