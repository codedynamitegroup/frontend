import { Box, Grid, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import TextEditor from "components/editor/TextEditor";

const EssayExamQuestion = () => {
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
            <TextEditor value='' />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default EssayExamQuestion;
