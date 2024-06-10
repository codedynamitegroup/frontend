import { useEffect, useState, useRef } from "react";
import classes from "./styles.module.scss";
import { Box, Chip, Container, IconButton, Stack, TextField } from "@mui/material";
import Heading5 from "components/text/Heading5";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import { useAppSelector, useAppDispatch } from "hooks";
import { setTestCases as setExeTestCases } from "reduxes/CodeAssessmentService/CodeQuestion/Execute";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
import { setSampleTestCases } from "reduxes/CodeAssessmentService/CodeQuestion/Detail/DetailCodeQuestion";
import AddIcon from "@mui/icons-material/Add";
import cloneDeep from "lodash.clonedeep";

export default function TestCase() {
  const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);
  let [testCases, setTestCases] = useState<TestCaseEntity[]>([]);
  const [focusTestCase, setFocusTestCase] = useState(0);
  const dispatch = useAppDispatch();

  const onUnmount = useRef<() => void>(() => {});
  onUnmount.current = () => {
    dispatch(setSampleTestCases(testCases));
  };
  useEffect(() => {
    return () => onUnmount.current();
  }, []);

  useEffect(() => {
    if (codeQuestion?.sampleTestCases && codeQuestion.sampleTestCases.length > 0) {
      setTestCases(codeQuestion.sampleTestCases);
      // dispatch(setStdin(codeQuestion?.sampleTestCases[0].inputData));
      // dispatch(setExpectedOutput(codeQuestion?.sampleTestCases[0].outputData));
    }
  }, [codeQuestion?.sampleTestCases]);
  useEffect(() => {
    dispatch(setExeTestCases(testCases));
  }, [testCases]);
  const handleDeleteTestCase = (index: number) => {
    if (index >= 0 && index < testCases.length) {
      if (index <= focusTestCase && focusTestCase !== 0) setFocusTestCase((value) => value - 1);
      let newList = [...testCases];
      newList.splice(index, 1);
      setTestCases(newList);
    }
  };
  const handleAddTestCase = () => {
    if (testCases.length < 5) {
      let newList = [...testCases];
      newList.push({
        inputData: "",
        outputData: "",
        id: "sampleid",
        isSample: true
      });
      setTestCases(newList);
    }
  };

  return (
    <Box id={classes.root}>
      <Container sx={{ marginTop: 1 }}>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          {testCases.map((_, index) => (
            <Chip
              sx={{ border: focusTestCase === index ? 1 : 0 }}
              label={`Case ${index + 1}`}
              onDelete={() => handleDeleteTestCase(index)}
              onClick={() => setFocusTestCase(index)}
            ></Chip>
          ))}
          {testCases.length < 5 && (
            <IconButton onClick={handleAddTestCase}>
              <AddIcon />
            </IconButton>
          )}
        </Stack>
        {testCases.length > 0 && (
          <>
            <Box className={classes.testCase}>
              <ParagraphExtraSmall>Input:</ParagraphExtraSmall>
              <TextField
                fullWidth
                multiline
                id='outlined-basic'
                variant='outlined'
                onChange={(e) => {
                  let newList = cloneDeep(testCases);
                  newList[focusTestCase].inputData = e.target.value;
                  setTestCases(newList);
                }}
                value={testCases[focusTestCase].inputData}
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
                onChange={(e) => {
                  let newList = cloneDeep(testCases);
                  newList[focusTestCase].outputData = e.target.value;
                  setTestCases(newList);
                }}
                value={testCases[focusTestCase].outputData}
                className={classes.input}
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
