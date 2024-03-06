import { Box, Grid, Typography } from "@mui/material";
import { blue, grey, yellow } from "@mui/material/colors";
import TextEditor from "components/editor/TextEditor";
import { useState } from "react";

interface EssayExamQuestionProps {
  readOnly?: boolean;
  value?: string;
}

const EssayExamQuestion = ({ readOnly, value }: EssayExamQuestionProps) => {
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
          <Typography gutterBottom>Ai là cha của SE? Nêu những thành tựu nổi bật</Typography>
          <Box sx={{ background: "white", height: "200px" }}>
            <TextEditor value={value1} onChange={(val) => setValue1(val)} readOnly={readOnly} />
          </Box>

          {submitedValue1 && (
            <Typography sx={{ backgroundColor: yellow[100] }} gutterBottom>
              Nhận xét: Cha của SE là ....
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default EssayExamQuestion;
