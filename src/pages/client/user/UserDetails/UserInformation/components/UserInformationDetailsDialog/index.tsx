import { Avatar, DialogProps, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import images from "config/images";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { User } from "models/authService/entity/user";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setLogin } from "reduxes/Auth";
import { format, parse } from "date-fns";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserService } from "services/authService/UserService";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import ErrorMessage from "components/text/ErrorMessage";
import JoyButton from "@mui/joy/Button";
import { InputPhone } from "components/common/inputs/InputPhone";
interface IFormDataUpdateProfileUser {
  firstName: string;
  lastName: string;
  dob?: string;
  phone: string;
}

interface UserInformationDetailsDialogProps extends DialogProps {
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
  const user: User = useSelector(selectCurrentUser);
  const [data, setData] = useState<User>(user);
  const [isUpdateProfileLoading, setIsUpdateProfileLoading] = useState(false);
  const accessToken = localStorage.getItem("access_token");
  const provider = localStorage.getItem("provider");

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup.string().required(t("first_name_required")),
      lastName: yup.string().required(t("last_name_required")),
      dob: yup.string(),
      phone: yup
        .string()
        .matches(/^\+?[1-9][0-9]{7,14}$/, t("phone_number_invalid"))
        .required(t("phone_required"))
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<IFormDataUpdateProfileUser>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (user) {
      setData(user);
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        dob: format(user.dob ? user.dob : Date.now(), "dd-MM-yyyy"),
        phone: user.phone
      });
    }
  }, [user]);

  const dispatch = useDispatch();

  const handleUpdateProfileUser = async (data: IFormDataUpdateProfileUser) => {
    console.log(data);
    setIsUpdateProfileLoading(true);
    UserService.updateProfileUser({
      email: user?.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob ? parse(data.dob, "dd-MM-yyyy", new Date()) : undefined,
      phone: data.phone
    })
      .then((res) => {
        dispatch(setSuccessMess("User updated successfully"));
        UserService.getUserByEmail()
          .then((response) => {
            const user: User = response;
            dispatch(
              setLogin({ user: user, token: accessToken, provider: provider ? provider : null })
            );
          })
          .catch((error) => {
            console.error("Failed to get user by email", error);
          });
      })
      .catch((error) => {
        dispatch(setErrorMess("User updated failed. Please try again later."));
        console.error("Failed to update profile", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        setIsUpdateProfileLoading(false);
      });
  };

  return (
    <CustomDialog
      open={open}
      handleClose={() => {
        handleClose();
      }}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      actionsDisabled
      minWidth='1000px'
      {...props}
    >
      <Box
        component='form'
        className={classes.formBody}
        onSubmit={handleSubmit(handleUpdateProfileUser)}
      >
        <InputTextField type='email' title='Email' disabled width='100%' value={data?.email} />
        <InputTextField
          type='text'
          title={t("common_name")}
          inputRef={register("firstName")}
          translation-key='common_name'
          width='100%'
          errorMessage={errors?.firstName?.message}
        />
        <InputTextField
          type='text'
          title={t("last_name")}
          inputRef={register("lastName")}
          translation-key='last_name'
          width='100%'
          errorMessage={errors?.lastName?.message}
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={4}>
            <TextTitle translation-key='common_phone'>{t("common_phone")}</TextTitle>
          </Grid>
          <Grid item xs={7} display={"flex"} flexDirection={"column"} gap={"10px"}>
            <Controller
              control={control}
              name='phone'
              render={({ field }) => {
                return (
                  <InputPhone
                    label={t("common_phone")}
                    errorMessage={errors?.phone?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />
            {errors.phone?.message && <ErrorMessage>{errors.phone?.message}</ErrorMessage>}
          </Grid>
        </Grid>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={4}>
            <TextTitle translation-key='common_DOB'>{t("common_DOB")}</TextTitle>
          </Grid>
          <Grid item xs={7}>
            <Controller
              control={control}
              name='dob'
              render={({ field }) => {
                return (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={"Date"}
                      value={dayjs(field.value, "DD/MM/YYYY")}
                      inputRef={field.ref}
                      onChange={(date) => {
                        if (date?.isValid()) {
                          field.onChange(format(date?.toDate(), "dd-MM-yyyy"));
                        }
                      }}
                    />
                  </LocalizationProvider>
                );
              }}
            />
            {errors.dob?.message && <ErrorMessage>{errors.dob?.message}</ErrorMessage>}
          </Grid>
        </Grid>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={4}></Grid>
          <Grid item xs={7}>
            <JoyButton
              loading={isUpdateProfileLoading}
              variant='solid'
              type='submit'
              translation-key='common_update'
              sx={{ padding: "10px 40px" }}
            >
              {t("common_update")}
            </JoyButton>
          </Grid>
        </Grid>

        <Heading1 fontWeight={"500"} translation-key='user_detail_dialog_account_linked_title'>
          {t("user_detail_dialog_account_linked_title")}
        </Heading1>
        <Divider />

        {user && (
          <>
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
                xs={9}
                sx={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {user?.isLinkedWithGoogle ? (
                  <ParagraphBody translation-key='user_detail_dialog_linked'>
                    {t("user_detail_dialog_linked")}
                  </ParagraphBody>
                ) : (
                  <ParagraphBody translation-key='user_detail_dialog_not_linked'>
                    {t("user_detail_dialog_not_linked")}
                  </ParagraphBody>
                )}
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
                xs={9}
                sx={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {user?.isLinkedWithMicrosoft ? (
                  <ParagraphBody translation-key='user_detail_dialog_linked'>
                    {t("user_detail_dialog_linked")}
                  </ParagraphBody>
                ) : (
                  <ParagraphBody translation-key='user_detail_dialog_not_linked'>
                    {t("user_detail_dialog_not_linked")}
                  </ParagraphBody>
                )}
              </Grid>
            </Grid>
            <Divider />
          </>
        )}
      </Box>
    </CustomDialog>
  );
};

export default UserInformationDetailsDialog;
