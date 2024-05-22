import React from "react";
import classes from "./styles.module.scss";
import { Box, Container, TextField } from "@mui/material";
import Heading5 from "components/text/Heading5";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import { useAppSelector } from "hooks";

export default function TestCase() {
  const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);

  return (
    <Box id={classes.root}>
      <Container>
        <Box className={classes.testCase}>
          <ParagraphExtraSmall>Input:</ParagraphExtraSmall>
          <TextField
            fullWidth
            multiline
            id='outlined-basic'
            variant='outlined'
            value={
              codeQuestion?.sampleTestCases && codeQuestion.sampleTestCases.length > 0
                ? codeQuestion?.sampleTestCases[0].inputData
                : ""
            }
            size='small'
            className={classes.input}
          />
        </Box>

        <Box className={classes.testCase}>
          <ParagraphExtraSmall>Output:</ParagraphExtraSmall>
          <TextField
            fullWidth
            multiline
            id='outlined-basic'
            variant='outlined'
            size='small'
            value={
              codeQuestion?.sampleTestCases && codeQuestion.sampleTestCases.length > 0
                ? codeQuestion?.sampleTestCases[0].outputData
                : ""
            }
            className={classes.input}
          />
        </Box>
      </Container>
    </Box>
  );
}
