import React, { useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Link } from "@mui/material";
import images from "config/images";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Heading1 from "components/text/Heading1";
import InputTextField from "components/common/inputs/InputTextField";
import LoadButton from "components/common/buttons/LoadingButton";
import { BtnType } from "components/common/buttons/Button";
import { UserService } from "services/authService/UserService";
import { ResetPasswordUserRequest } from "models/authService/entity/user";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";

interface IFormData {
  resetPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const dispatch = useDispatch();

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
  }, [t]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  const navigate = useNavigate();

  const handleForgotPassword = (data: IFormData) => {
    console.log(email, otp);
    if (!email || !otp) {
      dispatch(setErrorMess("Cannot find email or OTP code. Please try again."));
      return;
    }
    const resetPasswordUserRequest: ResetPasswordUserRequest = {
      email: email,
      password: data.resetPassword,
      otp: otp
    };
    setIsResetPasswordLoading(true);
    UserService.resetPassword(resetPasswordUserRequest)
      .then(async (res) => {
        dispatch(setSuccessMess("Password updated successfully. Please login."));
        navigate(routes.user.login.root);
      })
      .catch((error: any) => {
        dispatch(setErrorMess("Password update failed. Please try again later."));
        console.error("Failed to reset password", {
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
              <Heading1 translation-key='common_forget_password'>
                Nhập mật khẩu cần đặt lại
              </Heading1>
              <InputTextField
                label={t("common_password")}
                type='password'
                inputRef={register("resetPassword")}
                errorMessage={errors?.resetPassword?.message}
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
            <Box className={classes.back} mt={2}>
              <Link
                component={RouterLink}
                to={routes.user.forgot_password.root}
                translation-key='forget_password_back_link'
                className={classes.textLink}
              >{`< Trở về trang quên mật khẩu`}</Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
