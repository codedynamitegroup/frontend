import ParagraphBody from "components/text/ParagraphBody";
import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import TextEditor from "components/editor/TextEditor";
import { useState } from "react";

interface Props {}

const CourseCertificateIntroduction = (props: Props) => {
  const [description, setDescription] = useState<string>(
    "Gồm 2 số nguyên a và b cách nhau bởi dấu cách, được nhập từ bàn phím"
  );

  return (
    <Box id={classes.introduction}>
      <Box id={classes.courseDescription}>
        <TextEditor value={description} onChange={setDescription} readOnly={true} />
      </Box>
    </Box>
  );
};

export default CourseCertificateIntroduction;
