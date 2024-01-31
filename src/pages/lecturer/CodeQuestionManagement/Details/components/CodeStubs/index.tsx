import { Box } from "@mui/material";
import { memo } from "react";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";

type Props = {};

const CodeQuestionCodeStubs = memo((props: Props) => {
  return (
    <Box className={classes["body"]}>
      <ParagraphBody>Code stubs</ParagraphBody>
    </Box>
  );
});

export default CodeQuestionCodeStubs;
