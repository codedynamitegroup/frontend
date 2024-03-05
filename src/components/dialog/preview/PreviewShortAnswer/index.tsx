import CloseIcon from "@mui/icons-material/Close";
import { Button, Textarea } from "@mui/joy";
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { blue, grey, yellow } from "@mui/material/colors";
import React, { useState } from "react";
interface PreviewMultipleChoiceProps extends DialogProps {
  readOnly?: boolean;
  value?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewShortAnswer = ({ setOpen, value, readOnly, ...props }: PreviewMultipleChoiceProps) => {
  const [value1, setValue1] = useState<string>(value || "");
  const [submitedValue1, setSubmitedValue1] = useState(false);

  return (
    <Dialog {...props}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={props["aria-labelledby"]}>
        Câu 1: Câu trả lời ngắn
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Grid container spacing={1}>
          <Grid item xs={12} md={2}>
            <Box sx={{ backgroundColor: grey[300] }} borderRadius={1} paddingX={3} paddingY={1}>
              <Typography gutterBottom>Câu hỏi 1</Typography>
              <Typography gutterBottom>Điểm có thể đạt được: 2</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={10}>
            <Box sx={{ backgroundColor: blue[100] }} borderRadius={1} paddingX={3} paddingY={3}>
              <Typography gutterBottom>What is the full form of HTML?</Typography>
              <Textarea
                sx={{ marginBottom: 1, backgroundColor: "white" }}
                minRows={1}
                maxRows={1}
                value={value1}
                readOnly={readOnly}
                onChange={(e) => setValue1(e.target.value)}
              />
              {submitedValue1 && (
                <Typography sx={{ backgroundColor: yellow[100] }} gutterBottom>
                  Hyper Text Markup Language
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      {!readOnly && (
        <Grid container justifyContent={"center"} marginY={1}>
          <Stack spacing={1} direction={{ xs: "column", md: "row" }}>
            <Button
              onClick={() => {
                setSubmitedValue1(false);
              }}
            >
              Bắt đầu lại
            </Button>
            <Button onClick={() => setSubmitedValue1(true)}>Kiểm tra kết quả</Button>
            <Button onClick={() => setOpen(false)}>Đóng preview</Button>
          </Stack>
        </Grid>
      )}
    </Dialog>
  );
};

export default PreviewShortAnswer;
