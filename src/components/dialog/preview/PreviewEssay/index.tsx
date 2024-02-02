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
import { Button, Textarea } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useRef } from "react";
import { blue, grey, red, yellow } from "@mui/material/colors";
interface PreviewMultipleChoiceProps extends DialogProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewEssay = ({ setOpen, ...props }: PreviewMultipleChoiceProps) => {
  const [value1, setValue1] = useState<String>();
  const [submitedValue1, setSubmitedValue1] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue1((event.target as HTMLInputElement).value);
  };
  return (
    <Dialog {...props}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={props["aria-labelledby"]}>
        Câu 1: Tự luận
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
            <Box sx={{ backgroundColor: blue[100] }} borderRadius={1} paddingX={3} paddingY={1}>
              <Typography gutterBottom>Ai là cha của SE? Nêu những thành tựu nổi bật</Typography>
              <Textarea sx={{ marginBottom: 1, backgroundColor: "white" }} minRows={5} />
              {submitedValue1 && (
                <Typography sx={{ backgroundColor: yellow[100] }} gutterBottom>
                  Nhận xét: Cha của SE là ....
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
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
    </Dialog>
  );
};

export default PreviewEssay;
