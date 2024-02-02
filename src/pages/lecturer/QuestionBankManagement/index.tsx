import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  DialogProps,
  Grid,
  Stack
} from "@mui/material";
import { Button } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { blue, grey, red, yellow } from "@mui/material/colors";
import { userInfo } from "os";
import PreviewMultipleChoice from "components/dialog/preview/PreviewMultipleChoice";
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
