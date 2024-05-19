import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import images from "config/images";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { UserLogginService } from "services/authService/UserLogginService";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";
import MicrosoftLogin from "react-microsoft-login";
import { loginRequest } from "services/authService/azure.config";
import { AuthenticationResult } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

export default function Login() {
  const { t } = useTranslation();
  const microsoftLoggedHandler = (error: any, result: any) => {
    signInWithMicrosoft();
  };
  const [email, setEmail] = useState("");
  const microsoftClientId = process.env.REACT_APP_MICROSOFT_CLIENT_ID || "";
  const { instance } = useMsal();

  const signInWithMicrosoft = async () => {
    const accounts = instance.getAllAccounts();

    if (accounts.length === 0) {
      return undefined;
    }

    const request = {
      ...loginRequest,
      account: accounts[0]
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    const accessToken = await instance
      .acquireTokenSilent(request)
      .then((response: AuthenticationResult) => {
        return response.accessToken;
      })
      .catch((error) => {
        console.error(error);
      });

    if (!accessToken) {
      return;
    }

    UserLogginService.singleSignOn(accessToken, ESocialLoginProvider.MICROSOFT)
      .then((response) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.error("Failed to login", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      });
  };

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      UserLogginService.singleSignOn(tokenResponse.access_token, ESocialLoginProvider.GOOGLE)
        .then((response) => {
          console.log(response);
        })
        .catch((error: any) => {
          console.error("Failed to login", {
            code: error.response?.code || 503,
            status: error.response?.status || "Service Unavailable",
            message: error.response?.message || error.message
          });
        });
    },
    flow: "implicit"
  });

  return (
    <Box className={classes.container}>
      <Container>
        <Grid container className={classes.loginContainer}>
          <Grid item xs={12} md={6}>
            <img src={images.login} alt='login' className={classes.imageLogin} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.form}>
              <Typography
                variant='h4'
                className={classes.title}
                translation-key='header_login_button'
              >
                {t("header_login_button")}
              </Typography>
              <form className={classes.formControl}>
                <TextField
                  label='Email'
                  margin='normal'
                  name='email'
                  required
                  variant='outlined'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label={t("common_password")}
                  margin='normal'
                  name='password'
                  required
                  type='password'
                  variant='outlined'
                  translation-key='common_password'
                />
                <Button
                  className={classes.submit}
                  color='primary'
                  type='submit'
                  variant='contained'
                  translation-key='header_login_button'
                >
                  {t("header_login_button")}
                </Button>
                <Box className={classes.option}>
                  <Link
                    component={RouterLink}
                    to={routes.user.register.root}
                    variant='body2'
                    translation-key='login_register_account'
                  >
                    {t("login_register_account")}
                  </Link>
                  <Link
                    component={RouterLink}
                    to={routes.user.forgot_password.root}
                    variant='body2'
                    translation-key='common_forget_password'
                  >
                    {t("common_forget_password")}
                  </Link>
                </Box>
                <ParagraphBody translation-key='register_login_alternative'>
                  {t("register_login_alternative")}
                </ParagraphBody>
                <Box className={classes.social}>
                  <Button
                    onClick={() => signInWithGoogle()}
                    className={`${classes.socialIconGoogle} ${classes.socialIcon}`}
                  >
                    <FontAwesomeIcon icon={faGoogle} />
                  </Button>
                  <MicrosoftLogin
                    clientId={microsoftClientId}
                    redirectUri={process.env.REACT_APP_MICROSOFT_REDIRECT_URL || ""}
                    authCallback={microsoftLoggedHandler}
                    children={
                      <Button className={`${classes.socialIconMicrosoft} ${classes.socialIcon}`}>
                        <FontAwesomeIcon icon={faMicrosoft} />
                      </Button>
                    }
                  />
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
