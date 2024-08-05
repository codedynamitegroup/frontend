import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Grid } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import Heading1 from "components/text/Heading1";
import StepperComponent from "../../../components/StepperComponent";
import DataInput from "./components/DataInput";
import SynchronizeMoodle from "./components/SynchronizeMoodle";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth from "hooks/useAuth";
import GuideWebhook from "./components/GuideWebhook";
import { OrganizationService } from "services/authService/OrganizationService";
import { UpdateOrganizationByOrgAdminRequest } from "models/authService/entity/organization";

const SynchronizeManagement = () => {
  const { t } = useTranslation();
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

  const onSubmit = (data: any) => {
    console.log(data);
    // const updateOrganizationCommand: UpdateOrganizationByOrgAdminRequest = {
    //   moodleUrl: data.url,
    //   apiKey: data.apiKey
    // };
    // updateOrganization(loggedUser.organization.organizationId, updateOrganizationCommand);
  };

  return (
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
  );
};

export default SynchronizeManagement;
