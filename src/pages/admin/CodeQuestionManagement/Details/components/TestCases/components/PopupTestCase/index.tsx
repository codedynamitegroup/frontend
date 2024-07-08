import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  TextField,
  styled
} from "@mui/material";
import Heading4 from "components/text/Heading4";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./styles.module.scss";
import TextTitle from "components/text/TextTitle";
import { Dispatch, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Textarea } from "@mui/joy";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  useFieldArray,
  useForm,
  useFormContext
} from "react-hook-form";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
import ErrorMessage from "components/text/ErrorMessage";

interface TestCasePopupProps {
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  itemIndex: number;
  addNewMethod: (data: TestCaseEntity) => void;
  updateMethod: (index: number, data: TestCaseEntity) => void;
}

type TestCaseFormValue = {
  testCases: TestCaseEntity[];
};

export const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));
const checkEmptyString = (value: string) => value !== undefined && value.trim().length > 0;

const TestCasePopup = ({
  setOpen,
  open,
  itemIndex,
  addNewMethod,
  updateMethod
}: TestCasePopupProps) => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      yup.object<TestCaseEntity>().shape({
        id: yup.string().required(),
        inputData: yup
          .string()
          .required(t("code_management_input_data_required"))
          .test("not-blank", t("code_management_input_data_required"), checkEmptyString),
        outputData: yup
          .string()
          .required(t("code_management_output_format_required"))
          .test("not-blank", t("code_management_output_format_required"), checkEmptyString),
        isSample: yup.boolean().required()
        // score: yup.number().required()
      }),
    [t]
  );
  const { control: codeQuestionControl, getValues: getTestCaseValue } =
    useFormContext<TestCaseFormValue>();
  const emptyTC = useMemo(
    () => ({
      id: "new",
      inputData: "",
      outputData: "",
      // score: 0,
      sample: false
    }),
    []
  );
  const {
    handleSubmit: handleTestCaseSubmit,
    control: testCaseControl,
    formState: { errors: testCaseErrors },
    reset: resetTestCase,
    trigger,
    getValues
  } = useForm<TestCaseEntity>({
    resolver: yupResolver(schema),
    defaultValues: emptyTC
  });
  const tcLength = getTestCaseValue("testCases").length;
  const isAddNew = useMemo(
    (): boolean => !(itemIndex > -1 && itemIndex < tcLength),
    [itemIndex, tcLength]
  );
  const onClose = () => {
    setOpen(false);
  };
  const handleSaveTC = async () => {
    const check = await trigger();
    // console.log(check);
    if (check) {
      const data = getValues();
      // console.log(isAddNew);
      if (isAddNew) {
        addNewMethod(data);
      } else {
        updateMethod(itemIndex, data);
      }
    }
    onClose();
  };
  useEffect(() => {
    if (isAddNew) {
      resetTestCase(emptyTC);
    } else {
      resetTestCase(getTestCaseValue(`testCases.${itemIndex}`));
    }
  }, [itemIndex, getTestCaseValue, isAddNew, resetTestCase, emptyTC]);

  return (
    <CustomDialog
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle className={classes.dialogTitle}>
        {itemIndex > -1 && itemIndex < tcLength ? (
          <Heading4 translation-key='code_management_detail_update_test_case'>
            {t("code_management_detail_update_test_case")}
          </Heading4>
        ) : (
          <Heading4 translation-key='code_management_detail_add_test_case'>
            {t("code_management_detail_add_test_case")}
          </Heading4>
        )}

        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Grid container spacing={2}>
            {/* <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
              <FormControl>
                <Grid container>
                  <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                    <TextTitle translation-key='common_score'>{t("common_score")}</TextTitle>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={score}
                      type='number'
                      size='small'
                      onChange={handleScoreChange}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid> */}
            <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
              <FormControl>
                <Grid container>
                  <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
                    <TextTitle translation-key='common_sample'>{t("common_sample")}</TextTitle>
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name='isSample'
                      control={testCaseControl}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          color='primary'
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 35 } }}
                          checked={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
          <FormControl fullWidth className={classes.inputContainer}>
            <TextTitle>{t("detail_problem_input")}</TextTitle>
            <Controller
              name='inputData'
              control={testCaseControl}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  value={value}
                  onChange={onChange}
                  sx={{ backgroundColor: "white" }}
                  minRows={5}
                  maxRows={5}
                />
              )}
            />
          </FormControl>
          {testCaseErrors.inputData?.message && (
            <ErrorMessage>{testCaseErrors.inputData?.message}</ErrorMessage>
          )}
          <FormControl fullWidth className={classes.inputContainer}>
            <TextTitle translation-key='detail_problem_output'>
              {t("detail_problem_output")}
            </TextTitle>
            <Controller
              name='outputData'
              control={testCaseControl}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  value={value}
                  onChange={onChange}
                  sx={{ backgroundColor: "white" }}
                  minRows={5}
                  maxRows={5}
                />
              )}
            />
          </FormControl>
          {testCaseErrors.outputData?.message && (
            <ErrorMessage>{testCaseErrors.outputData?.message}</ErrorMessage>
          )}
          <Box className={classes.btnWrapper}>
            <Button btnType={BtnType.Outlined} onClick={onClose} translation-key='common_cancel'>
              {t("common_cancel")}
            </Button>

            <Button
              btnType={BtnType.Primary}
              translation-key='common_update'
              onClick={handleSaveTC}
            >
              {i18next.format(t("common_update"), "firstUppercase")}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </CustomDialog>
  );
};

export default TestCasePopup;
