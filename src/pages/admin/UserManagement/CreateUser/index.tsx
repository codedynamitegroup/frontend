import { yupResolver } from "@hookform/resolvers/yup";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Card, Divider, Grid } from "@mui/material";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useCallback, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import * as yup from "yup";
import classes from "./styles.module.scss";
import JoyButton from "@mui/joy/Button";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import BasicSelect from "components/common/select/BasicSelect";
import { ERoleName } from "models/authService/entity/role";
import TextTitle from "components/text/TextTitle";
import { CreatedUserByAdminRequest } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";
import { clearUsers } from "reduxes/authService/user";

interface IFormDataType {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  roleName: string;
}

const CreateUser = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
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
      roleName: yup.string().required("Role is required")
    });
  }, [t]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    register
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      roleName: ERoleName.USER
    }
  });

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };
    const createUserByAdminData: CreatedUserByAdminRequest = {
      email: formSubmittedData.email,
      password: formSubmittedData.password,
      firstName: formSubmittedData.firstName,
      lastName: formSubmittedData.lastName,
      roleName: formSubmittedData.roleName
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
        dispatch(clearUsers());
        navigate(routes.admin.users.root);
      } catch (error: any) {
        console.error("error", error);
        dispatch(setErrorMess("User creation failed!!! please check your input information"));
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess("Please sign in to continue"));
        }
        setSubmitLoading(false);
      }
    },
    [t]
  );

  const roleNameList = useMemo(
    () => [
      { value: ERoleName.ADMIN, label: t("role_system_admin") },
      { value: ERoleName.USER, label: t("role_user") },
      { value: ERoleName.LECTURER_MOODLE, label: t("role_lecturer") },
      { value: ERoleName.STUDENT_MOODLE, label: t("role_student") },
      { value: ERoleName.ADMIN_MOODLE, label: t("role_org_admin") }
    ],
    [t]
  );
  return (
    <>
      <Card
        sx={{
          margin: "20px",
          // padding: "20px",
          "& .MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "4px"
          },
          gap: "20px"
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.admin.users.root)}
              translation-key='user_management'
            >
              {t("user_management")}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall colorname='--blue-500' translate-key='user_create'>
              {t("user_create")}
            </ParagraphSmall>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            padding: "20px"
          }}
        >
          <Heading1 translate-key='user_create'>{t("user_create")}</Heading1>
          <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
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
            <Grid container>
              <Grid item xs={3} alignContent={"center"}>
                <TextTitle translation-key='common_role'>{t("common_role")}</TextTitle>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name='roleName'
                  render={({ field: { onChange, value } }) => (
                    <BasicSelect
                      labelId='roleName'
                      width='200px'
                      borderRadius='12px'
                      title={t("common_role")}
                      value={value}
                      onHandleChange={onChange}
                      items={roleNameList}
                    />
                  )}
                />
              </Grid>
            </Grid>

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
      </Card>
    </>
  );
};

export default CreateUser;
