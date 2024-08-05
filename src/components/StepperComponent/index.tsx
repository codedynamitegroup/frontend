import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { FormProvider, useFormContext } from "react-hook-form";
import { RootState } from "store";
import { useSelector } from "react-redux";
import images from "config/images";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { OrganizationService } from "services/authService/OrganizationService";
import { UpdateOrganizationByOrgAdminRequest } from "models/authService/entity/organization";
import { useCallback } from "react";
import useAuth from "hooks/useAuth";

interface Props {
  steps: string[];
  getContentPage: (step: number) => React.ReactNode;
}

const StepperComponent: React.FC<Props> = ({ steps, getContentPage }) => {
  const schema = yup.object().shape({
    moodleUrl: yup.string().url("Invalid URL format").required("URL is required"),
    apiKey: yup
      .string()
      .required("API Key is required")
      .matches(
        /^[a-f0-9]{32}$/,
        "The API Key must follow the format, for example: cdf90b5bf53bcae577c60419702dbee7"
      )
  });
  const methods = useForm({
    resolver: yupResolver(schema)
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const { loggedUser } = useAuth();

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    if (activeStep === 0) {
      const data = methods.getValues();
      const updateOrganizationCommand: UpdateOrganizationByOrgAdminRequest = {
        moodleUrl: data.moodleUrl,
        apiKey: data.apiKey
      };
      updateOrganization(loggedUser.organization.organizationId, updateOrganizationCommand);
    }

    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const updateOrganization = useCallback(
    async (id: string, data: UpdateOrganizationByOrgAdminRequest) => {
      try {
        const response = await OrganizationService.updateOrganizationByOrgAdmin(id, data);
        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    []
  );

  return (
    <FormProvider {...methods}>
      <form className={classes.root} onSubmit={methods.handleSubmit(handleComplete)}>
        <Box className={classes.container}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color='inherit' onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <Box className={classes.stepWrapper}>
            {allStepsCompleted() ? (
              <Box className={classes.successMessage}>
                <Typography>Bạn đã đồng bộ thành công</Typography>
                <img src={images.org_admin.clap} alt='clap' className={classes.successImage} />
              </Box>
            ) : (
              <Box>{getContentPage(activeStep)}</Box>
            )}
          </Box>
        </Box>
        {completedSteps() !== totalSteps() && (
          <Box
            sx={{
              width: sidebarStatus.isOpen ? `calc(100% - ${sidebarStatus.sidebarWidth}px)` : "100%"
            }}
            className={classes.fixedBottom}
          >
            <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box />
            {activeStep !== steps.length && (
              <Button variant='contained' type='submit'>
                {completedSteps() === totalSteps() - 1 ? "Hoàn thành" : "Continue"}
              </Button>
            )}
          </Box>
        )}
      </form>
    </FormProvider>
  );
};

export default StepperComponent;
