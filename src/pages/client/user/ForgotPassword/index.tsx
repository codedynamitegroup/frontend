import React, { useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Link } from "@mui/material";
import images from "config/images";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Heading1 from "components/text/Heading1";
import InputTextField from "components/common/inputs/InputTextField";
import LoadButton from "components/common/buttons/LoadingButton";
import { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/text/ParagraphBody";
import { UserService } from "services/authService/UserService";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";

interface IFormData {
  email: string;
}

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);
  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().required(t("email_required")).email(t("email_invalid"))
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  const handleForgotPassword = (data: IFormData) => {
    setIsForgotPasswordLoading(true);
    UserService.forgotPassword(data.email)
      .then(async (response) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Gửi email thành công, vui lại kiểm tra email của bạn.");
        setAlertType(AlertType.Success);
      })
      .catch((error: any) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Gửi email thất bại! Kiểm tra lại thông tin email.");
        setAlertType(AlertType.Error);
        console.error("Failed to login", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        setIsForgotPasswordLoading(false);
      });
  };
  return (
    <Box id={classes.forgotPasswordRoot}>
      <Container>
        <Grid container className={classes.forgotPasswordContainer}>
          <Grid item xs={12} md={6}>
            <img src={images.forgotpassword} alt='forgot' className={classes.imageLogin} />
          </Grid>
          <Grid item xs={12} md={6} className={classes.centerForm}>
            <form className={classes.formControl} onSubmit={handleSubmit(handleForgotPassword)}>
              <Heading1 translation-key='common_forget_password'>
                {t("common_forget_password")}
              </Heading1>
              <ParagraphBody translation-key='forget_password_description'>
                {t("forget_password_description")}
              </ParagraphBody>
              <InputTextField
                label={t("Email")}
                type='text'
                inputRef={register("email")}
                errorMessage={errors?.email?.message}
                width='100%'
              />
              <LoadButton
                loading={isForgotPasswordLoading}
                btnType={BtnType.Primary}
                colorname='--white'
                autoFocus
                translation-key='common_send'
                isTypeSubmit
              >
                {t("common_send")}
              </LoadButton>
            </form>
            <Box className={classes.back}>
              <Link
                component={RouterLink}
                to={routes.user.login.root}
                translation-key='forget_password_back_link'
                className={classes.textLink}
              >{`< ${t("forget_password_back_link")}`}</Link>
            </Box>
          </Grid>
          <SnackbarAlert
            open={openSnackbarAlert}
            setOpen={setOpenSnackbarAlert}
            type={alertType}
            content={alertContent}
          />
        </Grid>
      </Container>
    </Box>
  );
}
