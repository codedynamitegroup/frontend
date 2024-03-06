import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { useState } from "react";

const MultipleChoiceExamQuestion = () => {
  const [value1, setValue1] = useState<String>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue1((event.target as HTMLInputElement).value);
  };
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={2}>
        <Box sx={{ backgroundColor: grey[300] }} borderRadius={1} paddingX={3} paddingY={1}>
          <Typography gutterBottom>Câu hỏi 1</Typography>
          <Typography gutterBottom>Điểm có thể đạt được: 2</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={10}>
        <Box sx={{ backgroundColor: blue[100] }} borderRadius={1} paddingX={3} paddingY={3}>
          <Typography gutterBottom>Con trỏ là gì?</Typography>
          <Typography>Chọn một trong các đáp án sau:</Typography>
          <FormControl>
            <RadioGroup name='radio-buttons-group' value={value1} onChange={handleChange}>
              <FormControlLabel
                value='1'
                control={<Radio />}
                label={"Tham trị đến địa chỉ bộ nhớ"}
              />
              <FormControlLabel
                value='2'
                control={<Radio />}
                label='Một kiểu dữ liệu dùng để lưu trữ các giá trị có thể thay đổi'
              />
              <FormControlLabel
                value='3'
                control={<Radio />}
                label='Tham chiếu đến địa chỉ bộ nhớ'
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MultipleChoiceExamQuestion;
