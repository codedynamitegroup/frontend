import { FormControl, Grid } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import CustomDialog from "components/common/dialogs/CustomDialog";
import BasicRadioGroup from "components/common/radio/BasicRadioGroup";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";

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
  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      {...props}
    >
      <Grid container spacing={1} columns={12} minWidth='450px'>
        <Grid item xs={6}>
          <TextTitle paddingBottom='10px'>Câu hỏi</TextTitle>
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
              handleChange={handleChangeQuestionType}
              items={[
                { value: "essay", label: "Tự luận" },
                { value: "multiple-choice", label: "Trắc nghiệm" },
                { value: "short-answer", label: "Trả lời ngắn" },
                { value: "true-false", label: "Đúng/Sai" }
              ]}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <ParagraphBody>
            {/* Display the description of the selected question type description */}
            {questionType === "essay" && "Câu hỏi tự luận"}
            {questionType === "multiple-choice" && "Câu hỏi trắc nghiệm"}
            {questionType === "short-answer" && "Câu hỏi trả lời ngắn"}
            {questionType === "true-false" && "Câu hỏi đúng/sai"}
          </ParagraphBody>
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
