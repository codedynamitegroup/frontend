import React, { useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Link } from "@mui/material";
import images from "config/images";
import { Link as RouterLink, useLocation } from "react-router-dom";
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
import { ResetPasswordUserRequest, VerifyOTPUserRequest } from "models/authService/entity/user";

interface IFormData {
  resetPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);
  const location = useLocation();
  // get params email
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const schema = useMemo(() => {
    return yup.object().shape({
      resetPassword: yup
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
        .oneOf([yup.ref("resetPassword")], t("password_confirm_not_match"))
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  const handleForgotPassword = (data: IFormData) => {
    const resetPasswordUserRequest: ResetPasswordUserRequest = {
      email: email || "",
      password: data.resetPassword,
      otp: otp || ""
    };
    setIsResetPasswordLoading(true);
    UserService.resetPassword(resetPasswordUserRequest)
      .then(async (res) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Cập nhật mật khẩu thành công.");
        setAlertType(AlertType.Success);
      })
      .catch((error: any) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Cập nhật mật khẩu thất bại! Hãy thử lại sau.");
        setAlertType(AlertType.Error);
        console.error("Failed to login", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        setIsResetPasswordLoading(false);
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
              <Heading1 translation-key='common_forget_password'>Nhập mã OTP</Heading1>
              <ParagraphBody translation-key='forget_password_description'>
                Vui lòng kiểm tra mã trong email của bạn. Mã này gồm 6 số.
              </ParagraphBody>
              <InputTextField
                label={t("common_password")}
                type='password'
                inputRef={register("resetPassword")}
                errorMessage={errors?.resetPassword?.message}
              />
              <InputTextField
                label={t("common_password_confirm")}
                type='password'
                inputRef={register("confirmPassword")}
                errorMessage={errors?.confirmPassword?.message}
              />
              <LoadButton
                loading={isResetPasswordLoading}
                btnType={BtnType.Primary}
                colorname='--white'
                autoFocus
                translation-key='common_send'
                isTypeSubmit
              >
                Gửi
              </LoadButton>
            </form>
            <Box className={classes.back}>
              <Link
                component={RouterLink}
                to={routes.user.forgot_password.root}
                translation-key='forget_password_back_link'
                className={classes.textLink}
              >{`< Trở về trang quên mật khẩu`}</Link>
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
