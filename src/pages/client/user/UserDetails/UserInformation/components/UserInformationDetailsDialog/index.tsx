import { Avatar, DialogProps, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { BtnType } from "components/common/buttons/Button";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import BasicRadioGroup from "components/common/radio/BasicRadioGroup";
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
import LoadButton from "components/common/buttons/LoadingButton";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";

interface IFormDataUpdateProfileUser {
  firstName: string;
  lastName: string;
  dob?: string;
  phone?: string;
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

  // const onHandleChangeGender = (value: string) => {
  //   setData((pre) => ({
  //     ...pre,
  //     gender: value
  //   }));
  // };

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup.string().required(t("first_name_required")),
      // .matches(
      //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      //   t("email_invalid")
      // ),
      lastName: yup.string().required(t("last_name_required")),
      dob: yup.string(),
      phone: yup.string().matches(/^\+?[1-9][0-9]{7,14}$/, t("phone_number_invalid"))
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
        dob: format(user.dob, "dd-MM-yyyy"),
        phone: user.phone
      });
    }
  }, [user]);

  const dispatch = useDispatch();

  const handleUpdateProfileUser = async (data: IFormDataUpdateProfileUser) => {
    setIsUpdateProfileLoading(true);
    UserService.updateProfileUser({
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
        <InputTextField type='email' title='Email' readOnly width='100%' value={data?.email} />
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
        <InputTextField
          type='text'
          title={t("common_phone")}
          inputRef={register("phone")}
          translation-key='common_phone'
          width='100%'
          errorMessage={errors?.phone?.message}
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='common_DOB'>{t("common_DOB")}</TextTitle>
          </Grid>
          <Grid item xs={9}>
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
            {/* <CustomDatePicker
              value={dayjs(format(data?.dob, "dd-MM-yyyy"), "DD/MM/YYYY")}
              onHandleValueChange={(newValue) => {
                // setData((pre) => ({
                //   ...pre,
                //   dob: newValue?.format("DD/MM/YYYY") || ""
                // }));
              }}
            /> */}
          </Grid>
        </Grid>
        {/* <Grid container spacing={1} columns={12}>
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
        </Grid> */}
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}></Grid>
          <Grid item xs={9}>
            <LoadButton
              loading={isUpdateProfileLoading}
              btnType={BtnType.Primary}
              colorname='--white'
              autoFocus
              translation-key='common_update'
              isTypeSubmit
              width='100%'
            >
              {t("common_update")}
            </LoadButton>
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
              {/* <Grid
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
          </Grid> */}
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
              {/* <Grid
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
          </Grid> */}
            </Grid>
            <Divider />
          </>
        )}
      </Box>
    </CustomDialog>
  );
};

export default UserInformationDetailsDialog;
