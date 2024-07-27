// File: src/containers/SynchronizeManagement/index.tsx

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import Heading1 from "components/text/Heading1";
import StepperComponent from "../../../components/StepperComponent";
import DataInput from "./components/DataInput";
import SynchronizeMoodle from "./components/SynchronizeMoodle";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateOrganizationCommand } from "models/courseService/entity/update/UpdateOrganizationCommand";
import { OrganizationService } from "services/courseService/OrganizationService";
import useAuth from "hooks/useAuth";
import GuideWebhook from "./components/GuideWebhook";

const schema = yup.object().shape({
  url: yup.string().url("Invalid URL format").required("URL is required"),
  apiKey: yup
    .string()
    .required("API Key is required")
    .matches(
      /^[a-f0-9]{32}$/,
      "The API Key must follow the format, for example: cdf90b5bf53bcae577c60419702dbee7"
    )
});
const SynchronizeManagement = () => {
  const { t } = useTranslation();
  const methods = useForm({
    resolver: yupResolver(schema)
  });
  const { loggedUser } = useAuth();

  const steps = ["Enter information", "Synchronize", "Webhook"];

  const getContentPage = (index: number) => {
    switch (index) {
      case 0:
        return <DataInput />;
      case 1:
        return <SynchronizeMoodle />;
      case 2:
        return <GuideWebhook />;
      default:
        return <DataInput />;
    }
  };

  const updateOrganization = useCallback(async (id: string, data: UpdateOrganizationCommand) => {
    try {
      const response = await OrganizationService.updateOrganization(id, data);
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const onSubmit = (data: any) => {
    const updateOrganizationCommand: UpdateOrganizationCommand = {
      moodleUrl: data.url,
      apiKey: data.apiKey
    };
    updateOrganization(loggedUser.organization.organizationId, updateOrganizationCommand);
  };

  return (
    <FormProvider {...methods}>
      <Box component='form' onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <Heading1 marginLeft={4} translate-key='data_synchronization'>
              {t("data_synchronization")}
            </Heading1>
          </Grid>
          <Grid item xs={12}>
            <StepperComponent steps={steps} getContentPage={getContentPage} />
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
};

export default SynchronizeManagement;
