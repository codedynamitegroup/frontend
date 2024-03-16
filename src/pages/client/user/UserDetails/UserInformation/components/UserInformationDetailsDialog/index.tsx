import { Avatar, DialogProps, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import CustomDatePicker from "components/common/datetime/CustomDatePicker";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import BasicRadioGroup from "components/common/radio/BasicRadioGroup";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import images from "config/images";
import dayjs from "dayjs";
import { useState } from "react";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface UserInformationDetailsDialogProps extends DialogProps {
  initialData: {
    id: string;
    name: string;
    gender: string;
    email: string;
    dob: string;
  };
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  onHanldeChangePassword?: () => void;
}

const UserInformationDetailsDialog = ({
  initialData,
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  onHanldeChangePassword,
  ...props
}: UserInformationDetailsDialogProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState(initialData);

  const onHandleChangeGender = (value: string) => {
    setData((pre) => ({
      ...pre,
      gender: value
    }));
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='1000px'
      {...props}
    >
      <Box component='form' className={classes.formBody} autoComplete='off'>
        <InputTextField
          type='text'
          title={t("common_fullname")}
          value={data.name}
          onChange={(e) => {
            setData((pre) => ({ ...pre, name: e.target.value }));
          }}
          translation-key='common_fullname'
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='common_DOB'>{t("common_DOB")}</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <CustomDatePicker
              value={dayjs(data.dob, "DD/MM/YYYY")}
              onHandleValueChange={(newValue) => {
                setData((pre) => ({
                  ...pre,
                  dob: newValue?.format("DD/MM/YYYY") || ""
                }));
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='common_sex'>{t("common_sex")}</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <BasicRadioGroup
              ariaLabel='gender'
              value={data.gender}
              handleChange={onHandleChangeGender}
              items={[
                {
                  value: "0",
                  label: t("common_male")
                },
                {
                  value: "1",
                  label: t("common_female")
                }
              ]}
              translation-key={["common_female", "common_male"]}
            />
          </Grid>
        </Grid>
        <InputTextField
          type='email'
          title='Email'
          value={data.email}
          onChange={(e) => {
            setData((pre) => ({ ...pre, email: e.target.value }));
          }}
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='common_password'>{t("common_password")}</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Button
              btnType={BtnType.Text}
              onClick={() => {
                onHanldeChangePassword && onHanldeChangePassword();
              }}
              translation-key='user_detail_change_password'
            >
              {t("user_detail_change_password")}
            </Button>
          </Grid>
        </Grid>

        <Heading1 fontWeight={"500"} translation-key='user_detail_dialog_account_linked_title'>
          {t("user_detail_dialog_account_linked_title")}
        </Heading1>
        <Divider />

        <Grid container spacing={1} columns={12}>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            {images.logo.moodleLogo && (
              <Avatar
                alt='Google'
                src={images.logo.googleLogo}
                sx={{
                  width: "40px",
                  height: "40px"
                }}
              />
            )}
            <ParagraphBody
              sx={{
                marginLeft: "5px"
              }}
            >
              Google
            </ParagraphBody>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <ParagraphBody translation-key='user_detail_dialog_linked'>
              {t("user_detail_dialog_linked")}
            </ParagraphBody>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Button
              btnType={BtnType.Text}
              onClick={() => {}}
              translation-key='user_detail_dialog_remove_link'
            >
              {t("user_detail_dialog_remove_link")}
            </Button>
          </Grid>
        </Grid>
        <Divider />

        <Grid container spacing={1} columns={12}>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            {images.logo.moodleLogo && (
              <Avatar
                alt='Microsoft'
                src={images.logo.microsoftLogo}
                sx={{
                  width: "40px",
                  height: "40px"
                }}
              />
            )}
            <ParagraphBody
              sx={{
                marginLeft: "5px"
              }}
            >
              Microsoft
            </ParagraphBody>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <ParagraphBody translation-key='user_detail_dialog_not_linked'>
              {t("user_detail_dialog_not_linked")}
            </ParagraphBody>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Button
              btnType={BtnType.Text}
              onClick={() => {}}
              translation-key='user_detail_dialog_link'
            >
              {t("user_detail_dialog_link")}
            </Button>
          </Grid>
        </Grid>
        <Divider />
      </Box>
    </CustomDialog>
  );
};

export default UserInformationDetailsDialog;
