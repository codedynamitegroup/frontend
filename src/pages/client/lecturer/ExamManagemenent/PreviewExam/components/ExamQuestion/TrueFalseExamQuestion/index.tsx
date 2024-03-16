import { Textarea } from "@mui/joy";
import { Box, Grid, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { useTranslation } from "react-i18next";

const TrueFalseExamQuestion = () => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={2}>
        <Box sx={{ backgroundColor: grey[300] }} borderRadius={1} paddingX={3} paddingY={1}>
          <Typography gutterBottom translation-key='common_question'>
            {t("common_question")} 1
          </Typography>
          <Typography gutterBottom translation-key='course_management_exam_preview_available'>
            {t("course_management_exam_preview_available")}: 2
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={10}>
        <Box sx={{ backgroundColor: blue[100] }} borderRadius={1} paddingX={3} paddingY={3}>
          <Typography gutterBottom>What is the full form of HTML?</Typography>
          <Textarea sx={{ marginBottom: 1, backgroundColor: "white" }} minRows={1} maxRows={1} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TrueFalseExamQuestion;
