import { Button } from "@mui/joy";
import { Box, DialogProps } from "@mui/material";
import PreviewMultipleChoice from "components/dialog/preview/PreviewMultipleChoice";
import { useState } from "react";
const QuestionBankManagement = () => {
  const [open1, setOpen1] = useState(false);
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("md");

  return (
    <Box>
      <Button onClick={() => setOpen1(true)}>Preview trắc nghiệm</Button>
      <PreviewMultipleChoice
        open={open1}
        toggleOpen={setOpen1}
        aria-labelledby={"customized-dialog-title"}
        maxWidth={maxWidth}
        fullWidth
      />
    </Box>
  );
};

export default QuestionBankManagement;
