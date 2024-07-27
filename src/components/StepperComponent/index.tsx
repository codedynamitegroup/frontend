import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { useFormContext } from "react-hook-form";
import { RootState } from "store";
import { useSelector } from "react-redux";
import images from "config/images";

interface Props {
  steps: string[];
  getContentPage: (step: number) => React.ReactNode;
}

const StepperComponent: React.FC<Props> = ({ steps, getContentPage }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});
  const { handleSubmit, trigger } = useFormContext();
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) return;

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
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Grid item xs={12} className={classes.root}>
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
      {completedSteps() != totalSteps() && (
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
            <Button type='submit' variant='contained' onClick={handleComplete}>
              {completedSteps() === totalSteps() - 1 ? "Hoàn thành" : "Continue"}
            </Button>
          )}
        </Box>
      )}
    </Grid>
  );
};

export default StepperComponent;
