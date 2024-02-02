import * as React from "react";
import { Grid } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import CustomDialog from "components/common/dialogs/CustomDialog";
import BasicSelect from "components/common/select/BasicSelect";
import TextTitle from "components/text/TextTitle";

interface PickQuestionFromQuestionBankDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  categoryPickTitle?: string;
  categoryList?: {
    value: string;
    label: string;
  }[];
}

export default function PickQuestionFromQuestionBankDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  categoryPickTitle,
  categoryList,
  ...props
}: PickQuestionFromQuestionBankDialogProps) {
  const [category, setCategory] = React.useState("0");

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='750px'
      {...props}
    >
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle>{categoryPickTitle || ""}</TextTitle>
        </Grid>
        <Grid item xs={9}>
          <BasicSelect
            labelId='category-label'
            value={category}
            onHandleChange={handleCategoryChange}
            items={categoryList}
            backgroundColor='white'
            style={{
              marginTop: "0px"
            }}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
