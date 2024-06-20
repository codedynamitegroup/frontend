import { yupResolver } from "@hookform/resolvers/yup";

import { Avatar, Box, Grid } from "@mui/material";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
import { AssignUserToOrganizationRequest } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";
import InputSelect from "components/common/inputs/InputSelect";
import { IOptionItem } from "models/general";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button, { BtnType } from "components/common/buttons/Button";
import AssignUserToOrganizationDialog, { UserManagementProps } from "./components/AssignUserDialog";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import i18next from "i18next";
import { generateHSLColorByRandomText } from "utils/generateColorByText";

interface IFormDataType {
  roleName: IOptionItem;
}

const AssignUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userSelected, setUserSelected] = useState<UserManagementProps>();
  const dispatch = useDispatch<AppDispatch>();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  const { organizationId } = useParams<{ organizationId: string }>();
  const schema = useMemo(() => {
    return yup.object().shape({
      roleName: yup
        .object()
        .shape({
          id: yup.string().required(t("role_required")),
          name: yup.string().required(t("role_required"))
        })
        .required(t("role_required"))
    });
  }, [t]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema)
  });

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };
    if (!userSelected?.userId || !organizationId) {
      dispatch(setErrorMess("Please select a user to assign to organization"));
      return;
    }
    const assignUserToOrganizationData: AssignUserToOrganizationRequest = {
      roleName: formSubmittedData.roleName.id,
      organizationId: organizationId
    };
    await handleCreateUser(userSelected.userId, assignUserToOrganizationData);
  };

  const handleCreateUser = useCallback(
    async (userId: string, assignUserToOrganizationData: AssignUserToOrganizationRequest) => {
      setSubmitLoading(true);
      try {
        await UserService.assignUserToOrganization(userId, assignUserToOrganizationData);
        setSubmitLoading(false);
        dispatch(setSuccessMess("User assigned successfully!!!"));
        if (organizationId)
          navigate(
            routes.admin.organizations.edit.list_users.replace(":organizationId", organizationId)
          );
      } catch (error: any) {
        console.error("error", error);
        dispatch(setErrorMess("User assignation failed!!! please check your input information"));
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

  const [isOpenedAddUserDialog, setIsOpenedAddUserDialog] = useState(false);

  const handleOpenAddUserDialog = () => {
    setIsOpenedAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setIsOpenedAddUserDialog(false);
  };

  const handleUserSelected = (user: UserManagementProps) => {
    setUserSelected(user);
    reset({
      roleName: roleNameList.find((role) => role.name === user.roleName)
    });
  };

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  return (
    <>
      {isOpenedAddUserDialog && (
        <AssignUserToOrganizationDialog
          open={isOpenedAddUserDialog}
          title={t("user_select_from_list")}
          handleClose={handleCloseAddUserDialog}
          handleUserSelected={handleUserSelected}
          maxWidth='md'
        />
      )}

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

        <Box id={classes.titleWrapper}>
          <Heading1 translate-key='user_assign_to_organization'>
            {t("user_assign_to_organization")}
          </Heading1>
          <Button
            btnType={BtnType.Outlined}
            translate-key='user_select_from_list'
            onClick={handleOpenAddUserDialog}
          >
            {t("user_select_from_list")}
          </Button>
        </Box>
        <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
          <Grid container columns={12} justifyContent={"center"}>
            <Avatar
              sx={{
                bgcolor: `${generateHSLColorByRandomText(`${userSelected?.firstName} ${userSelected?.lastName}`)}`,
                width: 150,
                height: 150,
                fontSize: "60px"
              }}
              alt={userSelected?.email}
              src={userSelected?.avatarUrl}
            >
              {userSelected?.firstName.charAt(0)}
            </Avatar>
          </Grid>
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
          <InputTextField
            title={t("common_last_login")}
            type='text'
            disabled
            value={standardlizeUTCStringToLocaleString(
              userSelected?.lastLogin as string,
              currentLang
            )}
            width='100%'
          />
          <InputTextField
            title={t("Email")}
            type='text'
            disabled
            value={userSelected?.email}
            width='100%'
          />
          <InputTextField
            title={t("first_name")}
            type='text'
            disabled
            value={userSelected?.firstName}
            width='100%'
          />
          <InputTextField
            title={t("last_name")}
            type='text'
            disabled
            value={userSelected?.lastLogin}
            width='100%'
          />
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <JoyButton
              loading={submitLoading}
              variant='solid'
              type='submit'
              translation-key='user_assign_to_organization'
            >
              {t("user_assign_to_organization")}
            </JoyButton>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default AssignUser;
