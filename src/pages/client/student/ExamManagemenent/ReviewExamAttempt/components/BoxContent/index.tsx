import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";

interface PropsData {
  textTitle: string;
  textContent: string;
  icon: React.ReactNode;
}

const ExamReviewBoxContent = (props: PropsData) => {
  const { textTitle, textContent, icon } = props;

  return (
    <Box
      sx={{
        borderRadius: "5px",
        border: "1px solid #E1E1E1",
        padding: "10px 20px 10px 20px",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between"
      }}
    >
      {icon}
      <Box sx={{ marginLeft: "5px" }}>
        <ParagraphBody className={classes.boxTextTitle}>{textTitle}</ParagraphBody>
        <ParagraphBody className={classes.boxTextContent}>{textContent}</ParagraphBody>
      </Box>
    </Box>
  );
};

export default ExamReviewBoxContent;
