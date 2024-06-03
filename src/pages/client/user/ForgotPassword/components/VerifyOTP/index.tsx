import React, { useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Link } from "@mui/material";
import images from "config/images";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Heading1 from "components/text/Heading1";
import LoadButton from "components/common/buttons/LoadingButton";
import { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/text/ParagraphBody";
import { UserService } from "services/authService/UserService";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { VerifyOTPUserRequest } from "models/authService/entity/user";
import OtpInput from "react-otp-input";
import ErrorMessage from "components/text/ErrorMessage";

interface IFormData {
  otp: string;
}

export default function VerifyOTP() {
  const { t } = useTranslation();
  const [isVerifyOTPLoading, setIsVerifyOTPLoading] = useState(false);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const schema = useMemo(() => {
    return yup.object().shape({
      otp: yup
        .string()
        .required("Vui lòng nhập mã otp")
        .matches(/^\d{6}$/, "Mã OTP phải có 6 chữ số.")
    });
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  const navigate = useNavigate();

  const handleForgotPassword = (data: IFormData) => {
    if (!email) {
      setOpenSnackbarAlert(true);
      setAlertContent("Không tìm thấy email. Vui lòng thử lại.");
      setAlertType(AlertType.Error);
      return;
    }
    const verifyOTPData: VerifyOTPUserRequest = {
      email: email,
      otp: data.otp
    };
    setIsVerifyOTPLoading(true);
    UserService.verifyOTP(verifyOTPData)
      .then(async (response) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Xác nhận OTP thành công.");
        setAlertType(AlertType.Success);
        navigate(`${routes.user.forgot_password.reset_password}?email=${email}&otp=${data.otp}`);
      })
      .catch((error: any) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Gửi xác nhận OTP thất bại! Kiểm tra lại thông tin OTP.");
        setAlertType(AlertType.Error);
        console.error("Failed to verify OTP", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        setIsVerifyOTPLoading(false);
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
              <Controller
                control={control}
                name='otp'
                render={({ field }) => {
                  return (
                    <Box className={classes.otpInput}>
                      <OtpInput
                        value={field.value}
                        onChange={field.onChange}
                        inputType='number'
                        numInputs={6}
                        renderSeparator={<span style={{ width: "8px" }}></span>}
                        shouldAutoFocus={true}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                          border: "1px solid var(--gray-50)",
                          borderRadius: "8px",
                          width: "54px",
                          height: "54px",
                          fontSize: "18px",
                          color: "blue",
                          fontWeight: "500"
                        }}
                      />
                    </Box>
                  );
                }}
              />
              <ErrorMessage>{errors?.otp?.message}</ErrorMessage>
              <LoadButton
                loading={isVerifyOTPLoading}
                btnType={BtnType.Primary}
                colorname='--white'
                autoFocus
                translation-key='common_send'
                isTypeSubmit
              >
                Tiếp tục
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
