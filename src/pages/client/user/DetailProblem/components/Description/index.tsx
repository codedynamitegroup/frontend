import { Box } from "@mui/material";
import TextEditor from "components/editor/TextEditor";
import { useEffect, useState } from "react";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import { useAppSelector } from "hooks";

type Props = {};

const ProblemDetailDescription = (props: Props) => {
  const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);

  return (
    <Box id={classes.introduction}>
      <Box id={classes.courseDescription}>
        <Heading3>{codeQuestion?.name}</Heading3>
        <TextEditor value={codeQuestion?.problemStatement} readOnly={true} />
      </Box>
    </Box>
  );
};

export default ProblemDetailDescription;
