import { yupResolver } from "@hookform/resolvers/yup";

import { Box, Grid } from "@mui/material";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import { useCallback, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import * as yup from "yup";
import classes from "./styles.module.scss";
import JoyButton from "@mui/joy/Button";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { ERoleName } from "models/authService/entity/role";
import TextTitle from "components/text/TextTitle";
import { CreatedUserByAdminRequest } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";
import { clearOrgUsers } from "reduxes/authService/user";
import PhoneInput from "react-phone-number-input";
import ErrorMessage from "components/text/ErrorMessage";
import InputSelect from "components/common/inputs/InputSelect";
import { IOptionItem } from "models/general";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button, { BtnType } from "components/common/buttons/Button";

interface IFormDataType {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  roleName: IOptionItem;
  phone: string;
}

const CreateUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().required(t("email_required")).email(t("email_invalid")),
      password: yup
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
        .oneOf([yup.ref("password")], t("password_confirm_not_match")),
      firstName: yup.string().required(t("first_name_required")),
      lastName: yup.string().required(t("last_name_required")),
      roleName: yup
        .object()
        .shape({
          id: yup.string().required(t("role_required")),
          name: yup.string().required(t("role_required"))
        })
        .required(t("role_required")),
      phone: yup
        .string()
        .matches(/^\+?[1-9][0-9]{7,14}$/, t("phone_number_invalid"))
        .required(t("phone_required"))
    });
  }, [t]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    register
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema)
  });

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };
    const createUserByAdminData: CreatedUserByAdminRequest = {
      organizationId: organizationId,
      email: formSubmittedData.email,
      password: formSubmittedData.password,
      firstName: formSubmittedData.firstName,
      lastName: formSubmittedData.lastName,
      roleName: formSubmittedData.roleName.id,
      phone: formSubmittedData.phone
    };
    await handleCreateUser(createUserByAdminData);
  };

  const handleCreateUser = useCallback(
    async (createUserByAdminData: CreatedUserByAdminRequest) => {
      setSubmitLoading(true);
      try {
        await UserService.createUserByAdmin(createUserByAdminData);
        setSubmitLoading(false);
        dispatch(setSuccessMess("Created user successfully"));
        dispatch(clearOrgUsers());
        if (organizationId)
          navigate(
            routes.admin.organizations.edit.list_users.replace(":organizationId", organizationId)
          );
      } catch (error: any) {
        console.error("error", error);
        dispatch(setErrorMess("User creation failed!!! please check your input information"));
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        setSubmitLoading(false);
      }
    },
    [t]
  );

  const roleNameList: IOptionItem[] = useMemo(
    () => [
      { id: ERoleName.LECTURER_MOODLE, name: t("role_lecturer") },
      { id: ERoleName.STUDENT_MOODLE, name: t("role_student") },
      { id: ERoleName.ADMIN_MOODLE, name: t("role_org_admin") }
    ],
    [t]
  );

  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          btnType={BtnType.Text}
          onClick={() => {
            if (organizationId) {
              navigate(
                routes.admin.organizations.edit.list_users.replace(
                  ":organizationId",
                  organizationId
                )
              );
            }
          }}
        >
          Quay lại
        </Button>

        <Heading1 translate-key='user_create'>{t("user_create")}</Heading1>
        <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
          <InputSelect
            fullWidth
            title={t("common_role")}
            name='roleName'
            control={control}
            selectProps={{
              options: roleNameList
            }}
            errorMessage={(errors.roleName as any)?.id?.message}
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
                    <PhoneInput
                      value={field.value}
                      placeholder='Enter phone number'
                      onChange={field.onChange}
                      className={classes.phoneInput}
                      defaultCountry='VN'
                    />
                  );
                }}
              />
              {errors.phone?.message && <ErrorMessage>{errors.phone?.message}</ErrorMessage>}
            </Grid>
          </Grid>

          <InputTextField
            title={t("Email")}
            type='text'
            inputRef={register("email")}
            errorMessage={errors?.email?.message}
            width='100%'
          />
          <InputTextField
            title={t("first_name")}
            type='text'
            inputRef={register("firstName")}
            errorMessage={errors?.firstName?.message}
            width='100%'
          />
          <InputTextField
            title={t("last_name")}
            type='text'
            inputRef={register("lastName")}
            errorMessage={errors?.lastName?.message}
            width='100%'
          />
          <InputTextField
            title={t("common_password")}
            type='password'
            inputRef={register("password")}
            errorMessage={errors?.password?.message}
            width='100%'
          />
          <InputTextField
            title={t("common_password_confirm")}
            type='password'
            inputRef={register("confirmPassword")}
            errorMessage={errors?.confirmPassword?.message}
            width='100%'
          />

          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <JoyButton
              loading={submitLoading}
              variant='solid'
              type='submit'
              translation-key='user_create'
            >
              {t("user_create")}
            </JoyButton>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default CreateUser;
