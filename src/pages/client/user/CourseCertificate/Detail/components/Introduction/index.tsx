import { Box } from "@mui/material";
import Heading2 from "components/text/Heading2";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import classes from "./styles.module.scss";

interface Props {
  description: string;
}

const CourseCertificateIntroduction = ({ description }: Props) => {
  const { t } = useTranslation();

  return (
    <Box id={classes.introduction}>
      <Box
        id={classes.courseDescription}
        translation-key='certificate_detail_certification_information'
      >
        <ReactQuill value={description} readOnly={true} theme={"bubble"} />
      </Box>
    </Box>
  );
};

export default CourseCertificateIntroduction;
