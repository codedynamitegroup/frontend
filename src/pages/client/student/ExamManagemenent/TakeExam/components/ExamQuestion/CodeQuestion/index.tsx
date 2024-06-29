import { Grid, Stack, Divider, Box, CircularProgress } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import Heading4 from "components/text/Heading4";
import Button from "@mui/joy/Button";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import { useDispatch } from "react-redux";
import { setAnswered, setFlag } from "reduxes/TakeExam";
import { debounce } from "lodash";
import CodeEditor from "components/editor/CodeEditor";
import CodeIcon from "@mui/icons-material/Code";
import JoySelect from "components/common/JoySelect";
import { useEffect, useMemo, useState } from "react";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import TestCase from "./components/TestCase";
import Result from "./components/Result";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import { useAppSelector } from "hooks";
import Heading5 from "components/text/Heading5";
import ReactQuill from "react-quill";
import { ViewUpdate } from "@uiw/react-codemirror";
import { ProgrammingLanguageEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageEntity";
import {
  initCode,
  setCode,
  setCodeQuestionExamResult,
  setCodeQuestionExamResultError
} from "reduxes/TakeExam/TakeExamCodeQuestion";
import { ExecuteService } from "services/codeAssessmentService/ExecuteService";
import { Judge0ResponseEntity } from "models/codeAssessmentService/entity/Judge0ResponseEntity";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import { decodeBase64, encodeBase64 } from "utils/base64";

interface Props {
  page: number;
  questionCode: CodeQuestionEntity;
  questionState: any;
  questionId: string;
}

interface LanguageMap {
  [key: string]: ProgrammingLanguageEntity;
}

const CodeExamQuestion = (props: Props) => {
  const { page, questionCode, questionState, questionId } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFlagged = questionState?.flag;
  const codeQuestionLanguageState = useAppSelector(
    (state) => state.takeExamCodeQuestion.codeQuestion[questionId]
  );
  const testCases = useAppSelector(
    (state) => state.takeExamCodeQuestion.codeQuestion?.[questionId]?.testCase
  );
  const [executeLoading, setExecuteLoading] = useState<boolean>(false);

  const flagQuestionHandle = () => {
    if (isFlagged !== undefined) dispatch(setFlag({ id: questionId, flag: !isFlagged }));
  };

  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
  const debouncedHandleOnInputChange = debounce((value: string, viewUpdate: ViewUpdate) => {
    let isAnswered = true;
    if (value === "") isAnswered = false;
    if (!selectedLanguage) return;

    dispatch(
      setAnswered({
        id: questionId,
        answered: isAnswered,
        content: JSON.stringify({
          languageId: selectedLanguage,
          codeQuestionId: questionCode.id,
          code: encodeBase64(value)
        })
      })
    );
    dispatch(
      setCode({
        questionId: questionId,
        languageId: selectedLanguage || "",
        code: value
      })
    );
  }, 250);

  const languageSelectOptions = questionCode?.languages.map((language) => ({
    label: language.name,
    value: language.id
  }));
  const languageMap = useMemo(() => {
    return questionCode?.languages.reduce((acc: LanguageMap, cur: ProgrammingLanguageEntity) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
  }, [questionCode]);

  const [codeFormat, setCodeFormat] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedLanguage && codeFormat === undefined && languageMap?.[selectedLanguage]) {
      setCodeFormat(
        `${languageMap?.[selectedLanguage]?.headCode}\n\n${languageMap?.[selectedLanguage]?.bodyCode}\n\n${languageMap?.[selectedLanguage]?.tailCode}`
      );
      return;
    }
    const content = JSON.parse(questionState.content);
    setSelectedLanguage(content.languageId);
    setCodeFormat(decodeBase64(content.code));
  }, [selectedLanguage]);

  useEffect(() => {}, []);

  const handleLanguageChange = (newValue: any) => {
    dispatch(
      setAnswered({
        id: questionId,
        answered: true,
        content: JSON.stringify({
          languageId: newValue,
          codeQuestionId: questionCode.id,
          code: encodeBase64(codeQuestionLanguageState?.codes?.[newValue].code || "")
        })
      })
    );
    setSelectedLanguage(newValue);
  };

  useEffect(() => {
    if (
      codeQuestionLanguageState?.codes === undefined ||
      codeQuestionLanguageState?.codes === null ||
      Object.keys(codeQuestionLanguageState?.codes).length === 0
    ) {
      if (questionCode?.languages)
        dispatch(
          initCode({
            questionId: questionId,
            codeLanguageDataList: questionCode?.languages.map((language) => {
              return {
                judge0Id: language.judge0Id,
                languageId: language.id,
                code: `${language.headCode}\n\n${language.bodyCode}\n\n${language.tailCode}`,
                cpuLimit: language.timeLimit,
                memoryLimit: language.memoryLimit
              };
            })
          })
        );
    }
  }, [codeQuestionLanguageState?.codes, dispatch, questionCode?.languages, questionId]);

  const handleExecuteCode = () => {
    setExecuteLoading(true);
    if (selectedLanguage) {
      Promise.all(
        testCases.map((testCase) =>
          ExecuteService.execute(
            codeQuestionLanguageState.codes[selectedLanguage].judge0Id,
            testCase.inputData,
            testCase.outputData,
            codeQuestionLanguageState.codes[selectedLanguage].cpuLimit,
            codeQuestionLanguageState.codes[selectedLanguage].memoryLimit,
            decodeBase64(codeQuestionLanguageState.codes[selectedLanguage].code)
          )
        )
      )
        .then((judge0Response: Judge0ResponseEntity[]) => {
          testCases.forEach((testCase, index) => {
            judge0Response[index].input_data = testCase.inputData;
            judge0Response[index].output_data = testCase.outputData;
          });

          dispatch(setCodeQuestionExamResult({ questionId: questionId, result: judge0Response }));
        })
        .catch((error) => {
          let message: string | undefined = error.message;
          if (message === undefined) message = "Unexpected error";
          console.log(error);
          dispatch(setCodeQuestionExamResultError({ questionId: questionId, error: message }));
        })
        .finally(() => {
          setExecuteLoading(false);
        });
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Heading4>{`${t("common_question")} ${page + 1}`}</Heading4>
          <Button
            variant={isFlagged ? "soft" : "outlined"}
            color='primary'
            startDecorator={isFlagged ? <FlagIcon /> : <FlagOutlinedIcon />}
            onClick={flagQuestionHandle}
          >
            {isFlagged ? t("common_remove_flag") : t("common_flag")}
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} spacing={2}>
          <Box
            sx={{ backgroundColor: questionState?.answered ? "#e6eaf7" : "#FDF6EA" }}
            borderRadius={1}
            padding={".35rem 1rem"}
          >
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {questionState?.answered ? t("common_answer_saved") : t("common_not_answered")}
            </ParagraphBody>
          </Box>
          <Box sx={{ backgroundColor: "#f5f5f5" }} borderRadius={1} padding={".35rem 1rem"}>
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {t("common_score_can_achieve")}
              {": "}
              {/* {questionShortAnswer.question.defaultMark} */}
              MARK STRING
            </ParagraphBody>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={12}>
        <Box id={classes.introduction}>
          <Box id={classes.courseDescription}>
            <Stack spacing={2}>
              <Box>
                <Heading3>{questionCode?.name}</Heading3>
                <ReactQuill
                  value={questionCode?.problemStatement || ""}
                  readOnly={true}
                  theme={"bubble"}
                />
              </Box>

              <Box>
                <Heading5>Input format</Heading5>
                <ReactQuill
                  value={questionCode?.inputFormat || ""}
                  readOnly={true}
                  theme={"bubble"}
                />
                <Heading5>Output format</Heading5>
                <ReactQuill
                  value={questionCode?.outputFormat || ""}
                  readOnly={true}
                  theme={"bubble"}
                />
              </Box>

              <Box>
                <Heading5>Constraint</Heading5>
                <ReactQuill
                  value={questionCode?.constraints || ""}
                  readOnly={true}
                  theme={"bubble"}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
        <ParagraphBody fontSize={".875rem"} textAlign={"left"} fontWeight={"600"} color={"#212121"}>
          {t("common_answer")}
        </ParagraphBody>

        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "12px"
          }}
        >
          <Box
            display={"flex"}
            flexDirection='row'
            justifyContent={"space-between"}
            alignItems='center'
            sx={{
              backgroundColor: "var(--gray-1)",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              padding: "10px"
            }}
          >
            <CodeIcon />

            <Box display={"flex"} flexDirection='row'>
              <Button
                variant='solid'
                color='success'
                sx={{
                  marginRight: "10px"
                }}
                onClick={handleExecuteCode}
                loading={executeLoading}
              >
                Execute
              </Button>
              <JoySelect
                value={selectedLanguage || ""}
                onChange={(newValue: any) => handleLanguageChange(newValue)}
                options={languageSelectOptions || []}
                width='200px'
              />
            </Box>
          </Box>
          <Box
            sx={{
              height: "400px",
              padding: "10px"
            }}
          >
            <CodeEditor
              value={codeFormat}
              highlightActiveLine
              autoFocus={false}
              maxHeight='400px'
              onChange={debouncedHandleOnInputChange}
              defaultValue={codeFormat}
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                marginTop: "20px"
              }}
            >
              {/* <Tabs
            aria-label='Basic tabs'
            defaultValue={tabValue}
            value={tabValue}
            onChange={(event, newValue) => setTabValue(Number(newValue) || 0)}
            sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              "& .Mui-selected:first-of-type": {
                borderTopLeftRadius: "12px"
              },
              "& MuiTab-horizontal:first-of-type:hover": {
                borderTopLeftRadius: "12px"
              }
            }}
          >
            <TabList>
              <Tab>Test case</Tab>
              <Tab>Result</Tab>
            </TabList>
            <TabPanel value={0}>
              <TestCase questionId={questionId} />
            </TabPanel>
            <TabPanel value={1}>
              <Result questionId={questionId} loading={executeLoading} />
            </TabPanel>
          </Tabs> */}
              <Box
                sx={{
                  backgroundColor: "var(--gray-1)",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  padding: "10px"
                }}
                display='flex'
                flexDirection={"row"}
                alignItems='center'
                gap={1}
              >
                <BugReportRoundedIcon
                  sx={{
                    fontSize: "15px"
                  }}
                />
                <Heading5>Testcase</Heading5>
              </Box>
              <Box
                sx={{
                  padding: "20px 10px"
                }}
              >
                <TestCase questionId={questionId} sampleTestCases={questionCode?.sampleTestCases} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                marginTop: "20px"
              }}
            >
              <Box
                sx={{
                  backgroundColor: "var(--gray-1)",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  padding: "10px"
                }}
                display='flex'
                flexDirection={"row"}
                alignItems='center'
                gap={1}
              >
                {executeLoading ? (
                  <CircularProgress size={15} />
                ) : (
                  <CheckBoxRoundedIcon
                    sx={{
                      fontSize: "15px"
                    }}
                  />
                )}
                <Heading5>Result</Heading5>
              </Box>
              <Box
                sx={{
                  padding: "20px 10px"
                }}
              >
                <Result questionId={questionId} loading={executeLoading} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CodeExamQuestion;
