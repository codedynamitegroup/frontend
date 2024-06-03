import React, { useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Link } from "@mui/material";
import images from "config/images";
import ParagraphBody from "components/text/ParagraphBody";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisteredRequest } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import Heading1 from "components/text/Heading1";
import InputTextField from "components/common/inputs/InputTextField";
import LoadButton from "components/common/buttons/LoadingButton";
import { BtnType } from "components/common/buttons/Button";

interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().required(t("email_required")).email(t("email_invalid")),
      password: yup
        .string()
        .required(t("password_required"))
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          t("password_invalid")
        ),
      confirmPassword: yup
        .string()
        .required(t("password_confirm_required"))
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          t("password_invalid")
        )
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
  const [isRegisteredLoading, setIsRegisteredLoading] = useState(false);

  const handleRegister = (data: any) => {
    const registerData: RegisteredRequest = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName
    };
    setIsRegisteredLoading(true);
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
        setIsRegisteredLoading(false);
      });
  };

  return (
    <Box id={classes.registerRoot}>
      <Container>
        <Grid container className={classes.registerContainer}>
          <Grid item xs={12} md={6}>
            <img src={images.login} alt='login' className={classes.imageLogin} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.form}>
              <Heading1 translation-key='header_register_button'>
                {t("header_register_button")}
              </Heading1>
              <form className={classes.formControl} onSubmit={handleSubmit(handleRegister)}>
                <InputTextField
                  label={t("Email")}
                  type='text'
                  inputRef={register("email")}
                  errorMessage={errors?.email?.message}
                  width='100%'
                />
                <InputTextField
                  label={t("first_name")}
                  type='text'
                  inputRef={register("firstName")}
                  errorMessage={errors?.firstName?.message}
                  width='100%'
                />
                <InputTextField
                  label={t("last_name")}
                  type='text'
                  inputRef={register("lastName")}
                  errorMessage={errors?.lastName?.message}
                  width='100%'
                />
                <InputTextField
                  label={t("common_password")}
                  type='password'
                  inputRef={register("password")}
                  errorMessage={errors?.password?.message}
                  width='100%'
                />
                <InputTextField
                  label={t("common_password_confirm")}
                  type='password'
                  inputRef={register("confirmPassword")}
                  errorMessage={errors?.confirmPassword?.message}
                  width='100%'
                />
                <LoadButton
                  loading={isRegisteredLoading}
                  btnType={BtnType.Primary}
                  colorname='--white'
                  autoFocus
                  translation-key='header_register_button'
                  isTypeSubmit
                >
                  {t("header_register_button")}
                </LoadButton>
                <Link
                  component={RouterLink}
                  to={routes.user.login.root}
                  variant='body2'
                  translation-key='register_have_account'
                  className={classes.textLink}
                >
                  {t("register_have_account")}
                </Link>
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
