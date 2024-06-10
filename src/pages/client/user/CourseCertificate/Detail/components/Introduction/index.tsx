import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import ReactQuill from "react-quill";

interface Props {
  description: string;
}

const CourseCertificateIntroduction = ({ description }: Props) => {
  return (
    <Box id={classes.introduction}>
      <Box id={classes.courseDescription}>
        <Heading1 colorname='--blue-600'>Sơ lược về khóa học</Heading1>
        <ReactQuill value={description} readOnly={true} theme={"bubble"} />
      </Box>
    </Box>
  );
};

export default CourseCertificateIntroduction;
