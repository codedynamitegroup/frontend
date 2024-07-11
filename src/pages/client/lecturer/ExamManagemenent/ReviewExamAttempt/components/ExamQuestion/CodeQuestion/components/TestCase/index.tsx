import { useEffect, useState } from "react";
import classes from "./styles.module.scss";
import { Box, Stack, TextField } from "@mui/material";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import { useAppSelector, useAppDispatch } from "hooks";
import AddIcon from "@mui/icons-material/Add";
import {
  addTestCase,
  deleteTestCase,
  setInputData,
  setOutputData,
  setSampleTestCase
} from "reduxes/TakeExam/TakeExamCodeQuestion";
import { debounce } from "lodash";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import Chip from "@mui/joy/Chip";
import { Badge, IconButton } from "@mui/joy";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";

interface PropsData {
  questionId: string;
  sampleTestCases?: TestCaseEntity[];
}

export default function TestCase(props: PropsData) {
  const { questionId, sampleTestCases } = props;
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

  const handleChangeInputData = debounce((value: string) => {
    dispatch(setInputData({ questionId: questionId, index: focusTestCase, value: value }));
  }, 0);

  const handleChangeOutputData = debounce((value: string) => {
    dispatch(setOutputData({ questionId: questionId, index: focusTestCase, value: value }));
  }, 0);

  useEffect(() => {
    if (testCases?.length === 0) {
      dispatch(setSampleTestCase({ questionId, sampleTestCases: sampleTestCases || [] }));
    }
  }, [dispatch, questionId, sampleTestCases, testCases?.length]);

  return (
    <Box id={classes.root}>
      <Stack direction={"row"} spacing={3} alignItems={"center"}>
        {testCases?.map((_, index) => (
          <Badge
            key={index}
            color='neutral'
            variant='plain'
            size='sm'
            badgeContent={
              <IconButton
                onClick={() => handleDeleteTestCase(index)}
                sx={{
                  padding: "2px",
                  borderRadius: "100%",
                  minHeight: "fit-content",
                  minWidth: "fit-content",
                  ":hover": {
                    backgroundColor: "white",
                    borderRadius: "100%",
                    color: "var(--gray-30)"
                  }
                }}
              >
                <HighlightOffRoundedIcon
                  sx={{
                    padding: 0,
                    fontSize: "16px",
                    ":hover": {
                      borderRadius: "100%"
                    }
                  }}
                />
              </IconButton>
            }
            invisible={testCases?.length <= 1}
            sx={{
              minHeight: "fit-content",
              minWidth: "fit-content",
              width: "fit-content",
              height: "fit-content"
            }}
          >
            <Chip
              size='lg'
              color='neutral'
              variant={focusTestCase === index ? "solid" : "soft"}
              onClick={() => setFocusTestCase(index)}
              sx={{
                borderRadius: "8px",
                padding: "5px 10px"
              }}
            >
              {`Case ${index + 1}`}
            </Chip>
          </Badge>
        ))}
        {(testCases?.length ?? 0) < 5 && (
          <IconButton onClick={handleAddTestCase} variant='soft' color='primary'>
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
              sx={{
                borderRadius: "8px"
              }}
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
    </Box>
  );
}
