import { Box, Divider, Stack } from "@mui/material";
import TextEditor from "components/editor/TextEditor";
import { useEffect, useState } from "react";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import { useAppSelector } from "hooks";
import Heading5 from "components/text/Heading5";

type Props = {};

const ProblemDetailDescription = (props: Props) => {
  const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);

  return (
    <Box id={classes.introduction}>
      <Box id={classes.courseDescription}>
        <Stack spacing={2}>
          <Box>
            <Heading3>{codeQuestion?.name}</Heading3>
            <TextEditor value={codeQuestion?.problemStatement} readOnly={true} />
          </Box>

          <Box>
            <Heading5>Input format</Heading5>
            <TextEditor value={codeQuestion?.inputFormat} readOnly={true} />
            <Heading5>Output format</Heading5>
            <TextEditor value={codeQuestion?.outputFormat} readOnly={true} />
          </Box>

          <Box>
            <Heading5>Constraint</Heading5>
            <TextEditor value={codeQuestion?.constraints} readOnly={true} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProblemDetailDescription;
