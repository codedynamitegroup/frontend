import { Box, Checkbox, Grid, TextareaAutosize } from "@mui/material";
import Heading1 from "components/text/Heading1";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { routes } from "routes/routes";
import classes from "./styles.module.scss";
import CustomBreadCrumb from "components/common/Breadcrumb";
import TextTitle from "components/text/TextTitle";
import { InputPhone } from "components/common/inputs/InputPhone";
import InputTextField from "components/common/inputs/InputTextField";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "components/text/ErrorMessage";
import JoyButton from "@mui/joy/Button";
import { useDispatch } from "react-redux";
import i18next from "i18next";
import {
  OrganizationEntity,
  UpdateOrganizationByOrgAdminRequest,
  UpdateOrganizationBySystemAdminRequest
} from "models/authService/entity/organization";
import { OrganizationService } from "services/authService/OrganizationService";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth from "hooks/useAuth";

interface IFormDataType {
  organizationEmail: string;
  organizationDescription?: string;
  organizationName: string;
  organizationPhone: string;
  organizationUrl: string;
}

const EditOrganizationDetails = () => {
  const { t } = useTranslation();

  const { loggedUser } = useAuth();

  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  const schema = useMemo(() => {
    return yup.object().shape({
      organizationEmail: yup
        .string()
        .required(t("organization_email_required"))
        .email(t("email_invalid")),
      organizationDescription: yup.string(),
      organizationName: yup.string().required(t("organization_name_required")),
      organizationPhone: yup.string().required(t("organization_phone_required")),
      organizationUrl: yup.string().required(t("organization_url_required"))
    });
  }, [t]);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema)
  });
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [organization, setOrganization] = useState<OrganizationEntity>();

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const handleGetOrganizationById = useCallback(
    async (id: string) => {
      try {
        const organizationResponse = await OrganizationService.getOrganizationById(id);
        if (organizationResponse) {
          reset({
            organizationEmail: organizationResponse.email,
            organizationName: organizationResponse.name,
            organizationPhone: organizationResponse.phone,
            organizationUrl: organizationResponse.moodleUrl,
            organizationDescription: organizationResponse.description
          });
          setOrganization(organizationResponse);
        }
      } catch (error: any) {
        console.error("error", error);
      }
    },
    [reset]
  );

  useEffect(() => {
    if (loggedUser?.organization?.organizationId) {
      handleGetOrganizationById(loggedUser.organization.organizationId);
    }
  }, [handleGetOrganizationById, loggedUser]);

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };

    const updateOrganizationByOrgAdminRequest: UpdateOrganizationByOrgAdminRequest = {
      name: formSubmittedData.organizationName,
      description: formSubmittedData.organizationDescription,
      email: formSubmittedData.organizationEmail,
      phone: formSubmittedData.organizationPhone,
      moodleUrl: formSubmittedData.organizationUrl
    };
    await handleUpdateOrganization(updateOrganizationByOrgAdminRequest);
  };

  const handleUpdateOrganization = useCallback(
    async (updateOrganizationByOrgAdminRequest: UpdateOrganizationByOrgAdminRequest) => {
      setSubmitLoading(true);
      try {
        if (!loggedUser) {
          return;
        } else if (!loggedUser.organization.organizationId) {
          return;
        }
        await OrganizationService.updateOrganizationByOrgAdmin(
          loggedUser.organization.organizationId,
          updateOrganizationByOrgAdminRequest
        );
        setSubmitLoading(false);
        dispatch(setSuccessMess("Updated organization successfully"));
      } catch (error: any) {
        console.error("error", error);
        dispatch(
          setErrorMess("Organization is updated failed!!! please check your input information")
        );
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        setSubmitLoading(false);
      }
    },
    [dispatch, t, loggedUser]
  );

  return (
    <>
      <Box>
        <Box
          sx={{
            padding: "0px 20px 20px 20px"
          }}
        >
          <Heading1 translate-key='organization_information'>
            {t("organization_information")}
          </Heading1>
          <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
            <Grid container spacing={1} columns={12}>
              <Grid item xs={3}>
                <TextTitle translation-key='organization_phone'>
                  {t("organization_phone")}
                </TextTitle>
              </Grid>
              <Grid item xs={9} display={"flex"} flexDirection={"column"} gap={"10px"}>
                <Controller
                  control={control}
                  name='organizationPhone'
                  render={({ field }) => {
                    return (
                      <InputPhone
                        errorMessage={errors?.organizationPhone?.message}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    );
                  }}
                />
                {errors.organizationPhone?.message && (
                  <ErrorMessage>{errors.organizationPhone?.message}</ErrorMessage>
                )}
              </Grid>
            </Grid>
            <InputTextField
              title={t("common_updated_at")}
              type='text'
              value={standardlizeUTCStringToLocaleString(
                organization?.updatedAt as string,
                currentLang
              )}
              width='100%'
            />
            {organization?.updatedBy && (
              <InputTextField
                title={t("common_updated_by")}
                type='text'
                value={organization?.updatedBy.email}
                width='100%'
              />
            )}
            <InputTextField
              title={t("organization_email")}
              type='text'
              inputRef={register("organizationEmail")}
              errorMessage={errors?.organizationEmail?.message}
              width='100%'
            />
            <InputTextField
              title={t("organization_url")}
              type='text'
              inputRef={register("organizationUrl")}
              errorMessage={errors?.organizationUrl?.message}
              width='100%'
            />
            <InputTextField
              title={t("organization_name")}
              type='text'
              inputRef={register("organizationName")}
              width='100%'
              errorMessage={errors?.organizationName?.message}
            />
            <Grid container spacing={1} columns={12}>
              <Grid item xs={3} display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <TextTitle translation-key='common_description'>
                  {t("common_description")}
                </TextTitle>
              </Grid>
              <Grid
                item
                xs={9}
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                gap={"10px"}
              >
                <TextareaAutosize
                  aria-label='empty textarea'
                  translation-key='common_description'
                  placeholder={t("common_description")}
                  className={classes.textArea}
                  minRows={5}
                  {...register("organizationDescription")}
                  aria-invalid={errors.organizationDescription ? true : false}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <JoyButton
                loading={submitLoading}
                variant='solid'
                type='submit'
                translation-key='organization_update'
              >
                {t("organization_update")}
              </JoyButton>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EditOrganizationDetails;
