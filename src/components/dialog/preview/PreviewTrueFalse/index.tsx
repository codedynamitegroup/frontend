import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/joy";
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from "@mui/material";
import { blue, grey, red, yellow } from "@mui/material/colors";
import React, { useState } from "react";
interface PreviewMultipleChoiceProps extends DialogProps {
  readOnly?: boolean;
  value?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewTrueFalse = ({ setOpen, value, readOnly, ...props }: PreviewMultipleChoiceProps) => {
  const [value1, setValue1] = useState<string>(value || "");
  const [submitedValue1, setSubmitedValue1] = useState<string>(value || "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue1((event.target as HTMLInputElement).value);
  };
  return (
    <Dialog {...props}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={props["aria-labelledby"]}>
        Câu 1: Lựa chọn đúng sai
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
              <Typography gutterBottom>HTML stands for Hyper Text Markup Language</Typography>
              <FormControl>
                <RadioGroup
                  name='radio-buttons-group'
                  value={value1}
                  onChange={readOnly ? undefined : handleChange}
                >
                  <FormControlLabel
                    value='1'
                    control={<Radio />}
                    label={
                      <Stack direction={"row"} spacing={1}>
                        <Box
                          sx={{ backgroundColor: submitedValue1 === "1" ? red[100] : undefined }}
                        >
                          False
                        </Box>
                        {submitedValue1 === "1" && (
                          <Box sx={{ backgroundColor: yellow[100] }}>
                            Đáp án 1 không đúng vì ...
                          </Box>
                        )}
                      </Stack>
                    }
                  />
                  <FormControlLabel value='2' control={<Radio />} label='True' />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      {!readOnly && (
        <Grid container justifyContent={"center"} marginY={1}>
          <Stack spacing={1} direction={{ xs: "column", md: "row" }}>
            <Button
              onClick={() => {
                setSubmitedValue1("");
                setValue1("");
              }}
            >
              Bắt đầu lại
            </Button>
            <Button onClick={() => setSubmitedValue1(value1)}>Kiểm tra kết quả</Button>
            <Button onClick={() => setOpen(false)}>Đóng preview</Button>
          </Stack>
        </Grid>
      )}
    </Dialog>
  );
};

export default PreviewTrueFalse;
