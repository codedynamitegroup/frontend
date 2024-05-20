import React, { useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import images from "config/images";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "components/text/ErrorMessage";
import { RegisteredRequest } from "models/authService/entity/user";
import { setLoading } from "reduxes/Loading";
import { useDispatch } from "react-redux";
import { UserService } from "services/authService/UserService";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";

interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function Register() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().required(t("email_required")).email(t("email_invalid")),
      password: yup
        .string()
        .required(t("password_required"))
        .min(6, t("password_min_length", { lengthNum: 6 })),
      confirmPassword: yup
        .string()
        .required(t("password_confirm_required"))
        .min(6, t("password_confirm_min_length", { lengthNum: 6 }))
        .oneOf([yup.ref("password")], t("password_confirm_not_match")),
      firstName: yup.string().required(t("first_name_required")),
      lastName: yup.string().required(t("last_name_required"))
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);

  const handleRegister = (data: any) => {
    const registerData: RegisteredRequest = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName
    };
    dispatch(setLoading(true));
    UserService.register(registerData)
      .then(async (response) => {
        navigate(routes.user.login.root);
      })
      .catch((error: any) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Tài khoản đã tồn tại!!!");
        setAlertType(AlertType.Error);
        console.error("Failed to register", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

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
                translation-key='header_register_button'
              >
                {t("header_register_button")}
              </Typography>
              <form className={classes.formControl} onSubmit={handleSubmit(handleRegister)}>
                <TextField
                  label='Email'
                  margin='normal'
                  variant='outlined'
                  error={Boolean(errors?.email)}
                  {...register("email")}
                />
                <ErrorMessage>{errors?.email?.message}</ErrorMessage>
                <TextField
                  label={t("common_password")}
                  margin='normal'
                  type='password'
                  variant='outlined'
                  translation-key='common_password'
                  {...register("password")}
                  error={Boolean(errors?.password)}
                />
                <ErrorMessage>{errors?.password?.message}</ErrorMessage>
                <TextField
                  label={t("common_password_confirm")}
                  margin='normal'
                  type='password'
                  variant='outlined'
                  translation-key='common_password_confirm'
                  {...register("confirmPassword")}
                  error={Boolean(errors?.confirmPassword)}
                />
                <ErrorMessage>{errors?.confirmPassword?.message}</ErrorMessage>
                <TextField
                  label={t("first_name")}
                  translation-key='first_name'
                  margin='normal'
                  type='text'
                  variant='outlined'
                  {...register("firstName")}
                  error={Boolean(errors?.firstName)}
                />
                <ErrorMessage>{errors?.firstName?.message}</ErrorMessage>
                <TextField
                  label={t("last_name")}
                  translation-key='last_name'
                  margin='normal'
                  type='text'
                  variant='outlined'
                  {...register("lastName")}
                  error={Boolean(errors?.lastName)}
                />
                <ErrorMessage>{errors?.lastName?.message}</ErrorMessage>
                <Button
                  className={classes.submit}
                  color='primary'
                  type='submit'
                  variant='contained'
                  translation-key='header_register_button'
                >
                  {t("header_register_button")}
                </Button>
                <Link
                  component={RouterLink}
                  to={routes.user.login.root}
                  variant='body2'
                  translation-key='register_have_account'
                >
                  {t("register_have_account")}
                </Link>
                <ParagraphBody translation-key='register_login_alternative'>
                  {t("register_login_alternative")}
                </ParagraphBody>
                <Box className={classes.social}>
                  <Button className={`${classes.socialIconGoogle} ${classes.socialIcon}`}>
                    <FontAwesomeIcon icon={faGoogle} />
                  </Button>
                  <Button className={`${classes.socialIconMicrosoft} ${classes.socialIcon}`}>
                    <FontAwesomeIcon icon={faMicrosoft} />
                  </Button>
                </Box>
              </form>
            </Box>
            <SnackbarAlert
              open={openSnackbarAlert}
              setOpen={setOpenSnackbarAlert}
              type={alertType}
              content={alertContent}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
