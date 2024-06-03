import { DialogProps, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import { useMemo, useState } from "react";
import classes from "./styles.module.scss";
import images from "config/images";
import { useTranslation } from "react-i18next";
import { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { UserService } from "services/authService/UserService";
import LoadButton from "components/common/buttons/LoadingButton";

interface IFormDataUpdatePassword {
  oldPassword: string;
  newPassword: string;
  renewPassword: string;
}

interface UserPasswordChangeDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
}

const UserPasswordChangeDialog = ({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  ...props
}: UserPasswordChangeDialogProps) => {
  const { t } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      oldPassword: yup
        .string()
        .required(t("password_old_required"))
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          t("password_invalid")
        ),
      newPassword: yup
        .string()
        .required(t("password_required"))
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          t("password_invalid")
        ),
      renewPassword: yup
        .string()
        .required(t("password_confirm_required"))
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          t("password_invalid")
        )
        .oneOf([yup.ref("newPassword")], t("password_confirm_not_match"))
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IFormDataUpdatePassword>({
    resolver: yupResolver(schema)
  });
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);
  const [isUpdatedPasswordLoading, setIsUpdatedPasswordLoading] = useState(false);

  const handleUpdatePassword = (data: IFormDataUpdatePassword) => {
    setIsUpdatedPasswordLoading(true);
    UserService.updatePasswordUser({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    })
      .then((res) => {
        console.log(res);
        setOpenSnackbarAlert(true);
        setAlertContent("Cập nhật mật khẩu thành công");
        setAlertType(AlertType.Success);
      })
      .catch((error) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Cập nhật mật khẩu thất bại!! Hãy thử lại");
        setAlertType(AlertType.Error);
        console.error("Failed to update profile", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        setIsUpdatedPasswordLoading(false);
      });
  };

  return (
    <CustomDialog
      open={open}
      handleClose={() => {
        reset({
          oldPassword: "",
          newPassword: "",
          renewPassword: ""
        });
        handleClose();
      }}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      actionsDisabled
      minWidth='600px'
      {...props}
    >
      <Box
        component='form'
        className={classes.formBody}
        onSubmit={handleSubmit(handleUpdatePassword)}
      >
        <img
          src={images.changePasswordThumbnail}
          alt='password'
          style={{
            margin: "auto",
            width: "200px",
            height: "200px"
          }}
        />
        <InputTextField
          title={t("user_detail_old_password")}
          type='password'
          inputRef={register("oldPassword")}
          width='100%'
          errorMessage={errors?.oldPassword?.message}
        />
        <InputTextField
          title={t("user_detail_new_password")}
          type='password'
          inputRef={register("newPassword")}
          width='100%'
          errorMessage={errors?.newPassword?.message}
        />
        <InputTextField
          title={t("user_detail_re_enter_new_password")}
          type='password'
          inputRef={register("renewPassword")}
          width='100%'
          errorMessage={errors?.renewPassword?.message}
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}></Grid>
          <Grid item xs={9}>
            <LoadButton
              loading={isUpdatedPasswordLoading}
              btnType={BtnType.Primary}
              colorname='--white'
              autoFocus
              translation-key='user_detail_change_password'
              width='100%'
              isTypeSubmit
            >
              {t("user_detail_change_password")}
            </LoadButton>
          </Grid>
        </Grid>
        <SnackbarAlert
          open={openSnackbarAlert}
          setOpen={setOpenSnackbarAlert}
          type={alertType}
          content={alertContent}
        />
      </Box>
    </CustomDialog>
  );
};

export default UserPasswordChangeDialog;
