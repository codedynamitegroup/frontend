import { Textarea } from "@mui/joy";
import { Box, Grid, Typography } from "@mui/material";
import { blue, grey, yellow } from "@mui/material/colors";
import { useState } from "react";

interface ShortAnswerExamQuestionProps {
  readOnly?: boolean;
  value?: string;
}

const ShortAnswerExamQuestion = ({ readOnly, value }: ShortAnswerExamQuestionProps) => {
  const [value1, setValue1] = useState<string>(value || "");
  const [submitedValue1, setSubmitedValue1] = useState(false);

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
  );
};

export default ShortAnswerExamQuestion;
