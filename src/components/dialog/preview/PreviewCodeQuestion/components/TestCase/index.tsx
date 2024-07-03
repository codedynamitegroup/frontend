import { useEffect, useState } from "react";
import classes from "./styles.module.scss";
import { Box, Stack, TextField } from "@mui/material";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import AddIcon from "@mui/icons-material/Add";

import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import Chip from "@mui/joy/Chip";
import { Badge, IconButton } from "@mui/joy";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
import { useAppSelector } from "hooks";
import { setTestCases } from "reduxes/courseService/previewCodeQuestionTestCase";
import { useDispatch } from "react-redux";

interface PropsData {}

export default function TestCase(props: PropsData) {
  const dispatch = useDispatch();
  const testCases: TestCaseEntity[] = useAppSelector(
    (state) => state.previewCodeQuestionTestCase.testCases
  );
  const [focusTestCase, setFocusTestCase] = useState(0);

  const handleAddTestCase = () => {
    setFocusTestCase(testCases?.length ?? 0);
    if (testCases.length < 5) {
      let newList = [...testCases];
      newList.push({
        inputData: "",
        outputData: "",
        id: "sampleid",
        isSample: true
      });
      dispatch(setTestCases(newList));
    }
  };

  const handleDeleteTestCase = (index: number) => {
    if (index >= 0 && index < testCases.length) {
      if (index <= focusTestCase && focusTestCase !== 0) setFocusTestCase((value) => value - 1);
      let newList = [...testCases];
      newList.splice(index, 1);
      dispatch(setTestCases(newList));
    }
  };

  const handleChangeInputData = (value: string) => {
    if (!testCases) return;
    const newTestCases = [...testCases];
    newTestCases[focusTestCase] = { ...testCases?.[focusTestCase], inputData: value };
    dispatch(setTestCases(newTestCases));
  };

  const handleChangeOutputData = (value: string) => {
    if (!testCases) return;
    const newTestCases = [...testCases];
    newTestCases[focusTestCase] = { ...testCases?.[focusTestCase], outputData: value };
    dispatch(setTestCases(newTestCases));
  };

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
