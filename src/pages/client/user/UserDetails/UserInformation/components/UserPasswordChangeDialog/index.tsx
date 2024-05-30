import { DialogProps, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import TextTitle from "components/text/TextTitle";
import { useMemo, useState } from "react";
import classes from "./styles.module.scss";
import images from "config/images";
import { useTranslation } from "react-i18next";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
    control,
    formState: { errors }
  } = useForm<IFormDataUpdatePassword>({
    resolver: yupResolver(schema)
  });

  const handleUpdatePassword = (data: IFormDataUpdatePassword) => {
    console.log(data);
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
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
          errorMessage={errors?.oldPassword?.message}
        />
        <InputTextField
          title={t("user_detail_new_password")}
          type='password'
          inputRef={register("newPassword")}
          errorMessage={errors?.newPassword?.message}
        />
        <InputTextField
          title={t("user_detail_re_enter_new_password")}
          type='password'
          inputRef={register("renewPassword")}
          errorMessage={errors?.renewPassword?.message}
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}></Grid>
          <Grid item xs={9}>
            <Button
              btnType={BtnType.Primary}
              isTypeSubmit
              fullWidth
              translation-key='user_detail_change_password'
            >
              {t("user_detail_change_password")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </CustomDialog>
  );
};

export default UserPasswordChangeDialog;
