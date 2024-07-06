import { Box, Grid } from "@mui/material";
import Heading1 from "components/text/Heading1";
import React from "react";
import { useTranslation } from "react-i18next";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StepperComponent from "../../../components/StepperComponent";
import DataInput from "./components/DataInput";
import SynchronizeMoodle from "./components/SynchronizeMoodle";

const SynchronizeManagement = () => {
  const { t } = useTranslation();

  const steps = ["Nhập thông tin", "Đồng bộ", "Webhook"];

  const getContentPage = (index: number) => {
    switch (index) {
      case 0:
        return <DataInput />;
      case 1:
        return <SynchronizeMoodle />;
      case 2:
        return <div>Webhook</div>;
      default:
        return <DataInput />;
    }
  };

  return (
    <>
      <Box>
        <Grid
          container
          spacing={2}
          sx={{
            padding: "20px"
          }}
        >
          <Grid item xs={12}>
            <Heading1 translate-key='data_synchronization'>{t("data_synchronization")}</Heading1>
          </Grid>
          <Grid item xs={12}>
            <StepperComponent steps={steps} getContentPage={getContentPage} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SynchronizeManagement;
