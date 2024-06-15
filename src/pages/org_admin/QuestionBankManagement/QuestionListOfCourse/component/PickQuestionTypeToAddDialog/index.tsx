import { FormControl, Grid } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import CustomDialog from "components/common/dialogs/CustomDialog";
import BasicRadioGroup from "components/common/radio/BasicRadioGroup";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useTranslation } from "react-i18next";
import qtype from "utils/constant/Qtype";

interface PickQuestionTypeToAddDialogProps extends DialogProps {
  title?: string;
  questionType: string;
  handleChangeQuestionType: (value: string) => void;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
}

export default function PickQuestionTypeToAddDialog({
  open,
  title,
  questionType,
  handleChangeQuestionType,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  ...props
}: PickQuestionTypeToAddDialogProps) {
  const { t } = useTranslation();
  const [isChoosen, setIsChoosen] = React.useState(
    Object.values(qtype)
      .map((value) => value.code)
      .some((value) => value === questionType)
  );
  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      confirmDisabled={!isChoosen}
      {...props}
    >
      <Grid container spacing={1} columns={12} minWidth='450px'>
        <Grid item xs={6}>
          <TextTitle paddingBottom='10px' translation-key='common_question'>
            {t("common_question")}
          </TextTitle>
          <FormControl
            component='fieldset'
            sx={{
              maxHeight: "200px",
              overflowY: "auto"
            }}
          >
            <BasicRadioGroup
              ariaLabel='question-type'
              value={questionType}
              handleChange={(value) => {
                setIsChoosen(true);
                handleChangeQuestionType(value);
              }}
              items={[
                { value: "essay", label: t("common_question_type_essay") },
                { value: "multiple-choice", label: t("common_question_type_multi_choice") },
                { value: "short-answer", label: t("common_question_type_short") },
                { value: "true-false", label: t("common_question_type_yes_no") },
                { value: "code", label: t("common_question_type_code") }
              ]}
              translation-key={[
                "common_question_type_essay",
                "common_question_type_short",
                "common_question_type_multi_choice",
                "common_question_type_yes_no",
                "common_question_type_code"
              ]}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <ParagraphBody
            translation-key={[
              "common_question_type_yes_no",
              "common_question_type_multi_choice",
              "common_question_type_short",
              "common_question",
              "common_question_type_essay",
              "common_question_type_code"
            ]}
          >
            {/* Display the description of the selected question type description */}
            {questionType === "essay" &&
              `${t("common_question_type_essay")} ${t("common_question")}`}
            {questionType === "multiple-choice" &&
              `${t("common_question_type_multi_choice")} ${t("common_question")}`}
            {questionType === "short-answer" &&
              `${t("common_question_type_short")} ${t("common_question")}`}
            {questionType === "true-false" &&
              `${t("common_question_type_yes_no")} ${t("common_question")}`}
            {questionType === "code" && `${t("common_question_type_code")} ${t("common_question")}`}
          </ParagraphBody>
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
