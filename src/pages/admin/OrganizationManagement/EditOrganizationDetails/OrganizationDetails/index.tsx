import React, { useCallback, useEffect, useMemo, useState } from "react";
import { clearOrganizations } from "reduxes/authService/organization";
import TextEditor from "components/editor/TextEditor";
import {
  OrganizationEntity,
  UpdateOrganizationBySystemAdminRequest
} from "models/authService/entity/organization";
import JoyButton from "@mui/joy/Button";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import TextTitle from "components/text/TextTitle";
import ErrorMessage from "components/text/ErrorMessage";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "components/common/inputs/InputTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import i18next from "i18next";
import { OrganizationService } from "services/authService/OrganizationService";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import { Box, Checkbox, Grid } from "@mui/material";
type Props = {};

interface IFormDataType {
  isVerified: boolean;
  isDeleted: boolean;
}

const OrganizationDetails = (props: Props) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      isVerified: yup.boolean().required(t("organization_is_verified_required")),
      isDeleted: yup.boolean().required(t("organization_is_deleted_required"))
    });
  }, [t]);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    register
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema)
  });
  const { organizationId } = useParams<{ organizationId: string }>();
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
        console.log(organizationResponse);
        if (organizationResponse) {
          reset({
            isVerified: organizationResponse.isVerified,
            isDeleted: organizationResponse.isDeleted
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
    if (organizationId && !organization) {
      console.log(organizationId);
      handleGetOrganizationById(organizationId);
    }
  }, [organization, handleGetOrganizationById, organizationId]);

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };
    const updateOrganizationBySystemAdminData: UpdateOrganizationBySystemAdminRequest = {
      isVerified: formSubmittedData.isVerified,
      isDeleted: formSubmittedData.isDeleted
    };
    await handleUpdateOrganization(updateOrganizationBySystemAdminData);
  };

  const handleUpdateOrganization = useCallback(
    async (updateOrganizationBySystemAdminRequest: UpdateOrganizationBySystemAdminRequest) => {
      setSubmitLoading(true);
      try {
        if (!organizationId) {
          return;
        }
        await OrganizationService.updateOrganizationBySystemAdmin(
          organizationId,
          updateOrganizationBySystemAdminRequest
        );
        setSubmitLoading(false);
        dispatch(setSuccessMess("Updated organization successfully"));
        dispatch(clearOrganizations());
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
    [dispatch, t, organizationId]
  );

  return (
    <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={4}>
          <TextTitle translation-key='organization_phone'>{t("organization_phone")}</TextTitle>
        </Grid>
        <Grid item xs={7} display={"flex"} flexDirection={"column"} gap={"10px"}>
          <PhoneInput
            placeholder='Enter phone number'
            value={organization?.phone}
            onChange={() => {}}
            disabled
            className={classes.phoneInput}
          />
        </Grid>
      </Grid>
      <InputTextField
        title={t("common_created_at")}
        type='text'
        disabled
        value={standardlizeUTCStringToLocaleString(organization?.createdAt as string, currentLang)}
        width='100%'
      />
      <InputTextField
        title={t("common_created_by")}
        type='text'
        disabled
        value={organization?.createdBy.email}
        width='100%'
      />
      <InputTextField
        title={t("common_updated_at")}
        type='text'
        disabled
        value={standardlizeUTCStringToLocaleString(organization?.updatedAt as string, currentLang)}
        width='100%'
      />
      <InputTextField
        title={t("common_updated_by")}
        type='text'
        disabled
        value={organization?.updatedBy.email}
        width='100%'
      />
      <InputTextField
        title={t("organization_email")}
        type='text'
        disabled
        value={organization?.email}
        width='100%'
      />
      <InputTextField
        title={t("organization_url")}
        type='text'
        disabled
        value={organization?.moodleUrl}
        width='100%'
      />
      <InputTextField
        title={t("organization_name")}
        type='text'
        disabled
        value={organization?.name}
        width='100%'
      />
      <Grid container spacing={1} columns={12}>
        <Grid item xs={4} display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <TextTitle translation-key='common_description'>{t("common_description")}</TextTitle>
        </Grid>
        <Grid item xs={7} display={"flex"} flexDirection={"row"} alignItems={"center"} gap={"10px"}>
          <TextEditor
            maxLines={6}
            roundedBorder
            translation-key='common_description'
            value={organization?.description}
            readOnly={true}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={4} display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <TextTitle translation-key='common_is_verified'>{t("common_is_verified")}</TextTitle>
        </Grid>
        <Grid item xs={7} display={"flex"} flexDirection={"row"} alignItems={"center"} gap={"10px"}>
          <Controller
            control={control}
            name='isVerified'
            render={({ field }) => {
              return <Checkbox size='large' checked={!!field.value} {...field} name='isVerified' />;
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={4} display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <TextTitle translation-key='common_is_blocked'>{t("common_is_blocked")}</TextTitle>
        </Grid>
        <Grid item xs={7} display={"flex"} flexDirection={"row"} alignItems={"center"} gap={"10px"}>
          <Controller
            control={control}
            name='isDeleted'
            render={({ field }) => {
              return <Checkbox size='large' checked={!!field.value} {...field} name='isDeleted' />;
            }}
          />
          {errors.isDeleted?.message && <ErrorMessage>{errors.isDeleted?.message}</ErrorMessage>}
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
  );
};

export default OrganizationDetails;
