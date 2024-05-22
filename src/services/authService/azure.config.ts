interface MsalConfig {
  auth: {
    clientId: string;
    redirectUri: string;
    authority: string;
  };
  cache: {
    cacheLocation: string;
    storeAuthStateInCookie: boolean;
  };
}

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID || "",
    redirectUri: process.env.REACT_APP_MICROSOFT_REDIRECT_URL || "",
    authority: "https://login.microsoftonline.com/common"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
} as MsalConfig;

export const loginRequest = {
  scopes: ["user.read"]
};
