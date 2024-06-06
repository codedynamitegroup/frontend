import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Button, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import images from "config/images";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { UserService } from "services/authService/UserService";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";
import MicrosoftLogin from "react-microsoft-login";
import { loginRequest } from "services/authService/azure.config";
import { AuthenticationResult } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginRequest, User } from "models/authService/entity/user";
import Heading1 from "components/text/Heading1";
import InputTextField from "components/common/inputs/InputTextField";
import LoadButton from "components/common/buttons/LoadingButton";
import { BtnType } from "components/common/buttons/Button";
import { loginStatus, selectCurrentUser } from "reduxes/Auth";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";

interface IFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { t } = useTranslation();
  const microsoftClientId = process.env.REACT_APP_MICROSOFT_CLIENT_ID || "";
  const { instance } = useMsal();
  const userLogged: User = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [isLoggedLoading, setIsLoggedLoading] = useState(false);
  const dispatch = useDispatch();

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().required(t("email_required")).email(t("email_invalid")),
      password: yup
        .string()
        .required(t("password_required"))
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          t("password_invalid")
        )
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  const microsoftLoggedHandler = (error: any, result: any) => {
    signInWithMicrosoft();
  };

  useEffect(() => {
    if (userLogged) {
      navigate(routes.user.dashboard.root);
    }
  }, [userLogged, navigate]);

  const signInWithMicrosoft = async () => {
    const accounts = instance.getAllAccounts();

    if (accounts.length === 0) {
      return;
    }

    const request = {
      ...loginRequest,
      account: accounts[0]
    };

    setIsLoggedLoading(true);
    const accessToken = await instance
      .acquireTokenSilent(request)
      .then((response: AuthenticationResult) => {
        return response.accessToken;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoggedLoading(false);
      });

    if (!accessToken) {
      return;
    }

    setIsLoggedLoading(true);
    UserService.singleSignOn(accessToken, ESocialLoginProvider.MICROSOFT)
      .then((response) => {
        localStorage.setItem("access_token", response.accessToken);
        localStorage.setItem("refresh_token", response.refreshToken);
        localStorage.setItem("provider", ESocialLoginProvider.MICROSOFT);
        dispatch(loginStatus(true));
        dispatch(setSuccessMess("Login successfully"));
        navigate(routes.user.dashboard.root);
      })
      .catch((error: any) => {
        dispatch(setErrorMess("Failed to login!! Please try again later"));
        console.error("Failed to login", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        setIsLoggedLoading(false);
      });
  };

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      setIsLoggedLoading(true);
      UserService.singleSignOn(tokenResponse.access_token, ESocialLoginProvider.GOOGLE)
        .then((response) => {
          localStorage.setItem("access_token", response.accessToken);
          localStorage.setItem("refresh_token", response.refreshToken);
          localStorage.setItem("provider", ESocialLoginProvider.GOOGLE);
          dispatch(loginStatus(true));
          dispatch(setSuccessMess("Login successfully"));
          navigate(routes.user.dashboard.root);
        })
        .catch((error: any) => {
          dispatch(setErrorMess("Failed to login!! Please try again later"));
          console.error("Failed to login", {
            code: error.response?.code || 503,
            status: error.response?.status || "Service Unavailable",
            message: error.response?.message || error.message
          });
        })
        .finally(() => {
          setIsLoggedLoading(false);
        });
    },
    onError: (error: any) => {
      console.log(error);
    },
    flow: "implicit"
  });

  const handleLogin = (data: IFormData) => {
    const loginData: LoginRequest = {
      email: data.email,
      password: data.password
    };
    setIsLoggedLoading(true);
    UserService.login(loginData)
      .then(async (response) => {
        localStorage.setItem("access_token", response.accessToken);
        localStorage.setItem("refresh_token", response.refreshToken);
        dispatch(loginStatus(true));
        dispatch(setSuccessMess("Login successfully"));
        navigate(routes.user.dashboard.root);
      })
      .catch((error: any) => {
        dispatch(setErrorMess("Failed to login!! Please check your email and password"));
        console.error("Failed to login", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        setIsLoggedLoading(false);
      });
  };

  return (
    <Box id={classes.loginRoot}>
      <Container>
        <Grid container className={classes.loginContainer}>
          <Grid item xs={12} md={6}>
            <img src={images.login} alt='login' className={classes.imageLogin} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.form}>
              <Heading1 translation-key='header_login_button'>{t("header_login_button")}</Heading1>
              <form className={classes.formControl} onSubmit={handleSubmit(handleLogin)}>
                <InputTextField
                  label={t("Email")}
                  type='text'
                  inputRef={register("email")}
                  width='100%'
                  errorMessage={errors?.email?.message}
                />
                <InputTextField
                  label={t("common_password")}
                  type='password'
                  inputRef={register("password")}
                  width='100%'
                  errorMessage={errors?.password?.message}
                />
                <LoadButton
                  loading={isLoggedLoading}
                  btnType={BtnType.Primary}
                  colorname='--white'
                  autoFocus
                  translation-key='header_login_button'
                  isTypeSubmit
                >
                  {t("header_login_button")}
                </LoadButton>
                <Box className={classes.option}>
                  <Link
                    component={RouterLink}
                    to={routes.user.register.root}
                    variant='body2'
                    className={classes.textLink}
                    translation-key='login_register_account'
                  >
                    {t("login_register_account")}
                  </Link>
                  <Link
                    component={RouterLink}
                    to={routes.user.forgot_password.root}
                    variant='body2'
                    translation-key='common_forget_password'
                    className={classes.textLink}
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
