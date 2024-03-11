import { DialogProps, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import TextTitle from "components/text/TextTitle";
import { useState } from "react";
import classes from "./styles.module.scss";
import images from "config/images";
import { useTranslation } from "react-i18next";

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
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    reNewPassword: ""
  });

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='600px'
      {...props}
    >
      <Box component='form' className={classes.formBody} autoComplete='off'>
        <img
          src={images.changePasswordThumbnail}
          alt='password'
          style={{
            margin: "auto",
            width: "200px",
            height: "200px"
          }}
        />
        <Grid
          container
          spacing={1}
          columns={12}
          sx={{
            display: "flex",
            direction: "row",
            alignItems: "center"
          }}
        >
          <Grid item xs={3}>
            <TextTitle translation-key='user_detail_old_password'>
              {t("user_detail_old_password")}
            </TextTitle>
          </Grid>
          <Grid item xs={9}>
            <InputTextField
              type='password'
              value={data.oldPassword}
              onChange={(e) => {
                setData((pre) => ({
                  ...pre,
                  oldPassword: e.target.value
                }));
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          columns={12}
          sx={{
            display: "flex",
            direction: "row",
            alignItems: "center"
          }}
        >
          <Grid item xs={3}>
            <TextTitle translation-key='user_detail_new_password'>
              {t("user_detail_new_password")}
            </TextTitle>
          </Grid>
          <Grid item xs={9}>
            <InputTextField
              type='password'
              value={data.newPassword}
              onChange={(e) => {
                setData((pre) => ({
                  ...pre,
                  newPassword: e.target.value
                }));
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          columns={12}
          sx={{
            display: "flex",
            direction: "row",
            alignItems: "center"
          }}
        >
          <Grid item xs={3}>
            <TextTitle translation-key='user_detail_re_enter_new_password'>
              {t("user_detail_re_enter_new_password")}
            </TextTitle>
          </Grid>
          <Grid item xs={9}>
            <InputTextField
              type='password'
              value={data.reNewPassword}
              onChange={(e) => {
                setData((pre) => ({
                  ...pre,
                  reNewPassword: e.target.value
                }));
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
    </CustomDialog>
  );
};

export default UserPasswordChangeDialog;
