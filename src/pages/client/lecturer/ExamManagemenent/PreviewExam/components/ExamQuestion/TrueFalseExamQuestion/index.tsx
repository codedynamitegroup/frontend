import { Textarea } from "@mui/joy";
import { Box, Grid, Typography, FormControlLabel, Checkbox, Stack } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import FlagIcon from "@mui/icons-material/Flag";

import ParagraphBody from "components/text/ParagraphBody";
const TrueFalseExamQuestion = () => {
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
          <Typography gutterBottom>What is the full form of HTML?</Typography>
          <Textarea sx={{ marginBottom: 1, backgroundColor: "white" }} minRows={1} maxRows={1} />
        </Box>
        <FormControlLabel
          control={<Checkbox />}
          label={
            <Stack direction={"row"} alignItems={"center"}>
              <ParagraphBody>Gắn cờ</ParagraphBody> <FlagIcon sx={{ color: "red" }} />
            </Stack>
          }
        />
      </Grid>
    </Grid>
  );
};

export default TrueFalseExamQuestion;
