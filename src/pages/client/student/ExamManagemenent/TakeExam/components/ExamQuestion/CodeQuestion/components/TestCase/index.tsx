import { useState } from "react";
import classes from "./styles.module.scss";
import { Box, Chip, Container, IconButton, Stack, TextField } from "@mui/material";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import { useAppSelector, useAppDispatch } from "hooks";
import AddIcon from "@mui/icons-material/Add";
import {
  addTestCase,
  deleteTestCase,
  setInputData,
  setOutputData
} from "reduxes/TakeExam/TakeExamCodeQuestion";

interface PropsData {
  questionId: string;
}

export default function TestCase(props: PropsData) {
  const { questionId } = props;
  const testCases = useAppSelector(
    (state) => state.takeExamCodeQuestion.codeQuestion?.[questionId]?.testCase
  );
  const [focusTestCase, setFocusTestCase] = useState(0);
  const dispatch = useAppDispatch();

  const handleAddTestCase = () => {
    setFocusTestCase(testCases?.length ?? 0);
    dispatch(addTestCase({ questionId }));
  };

  const handleDeleteTestCase = (index: number) => {
    if (focusTestCase !== 0) setFocusTestCase((prev) => prev - 1);
    dispatch(deleteTestCase({ questionId, index }));
  };

  const handleChangeInputData = (value: string) => {
    dispatch(setInputData({ questionId: questionId, index: focusTestCase, value: value }));
  };

  const handleChangeOutputData = (value: string) => {
    dispatch(setOutputData({ questionId: questionId, index: focusTestCase, value: value }));
  };

  return (
    <Box id={classes.root}>
      <Container sx={{ marginTop: 1 }}>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          {testCases?.map((_, index) => (
            <Chip
              key={index}
              sx={{ border: focusTestCase === index ? 1 : 0 }}
              label={`Case ${index + 1}`}
              onDelete={() => handleDeleteTestCase(index)}
              onClick={() => setFocusTestCase(index)}
            ></Chip>
          ))}
          {(testCases?.length ?? 0) < 5 && (
            <IconButton onClick={handleAddTestCase}>
              <AddIcon />
            </IconButton>
          )}
        </Stack>
        {(testCases?.length ?? 0) > 0 && (
          <>
            <Box className={classes.testCase}>
              <ParagraphExtraSmall>Input:</ParagraphExtraSmall>
              <TextField
                fullWidth
                multiline
                id='outlined-basic'
                variant='outlined'
                onChange={(e) => handleChangeInputData(e.target.value)}
                value={testCases?.[focusTestCase]?.inputData || ""}
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
                onChange={(e) => handleChangeOutputData(e.target.value)}
                value={testCases?.[focusTestCase]?.outputData || ""}
                className={classes.input}
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
