import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/joy";
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Skeleton,
  Divider,
  CircularProgress
} from "@mui/material";
import Heading4 from "components/text/Heading4";
import { PostQuestionDetailList } from "models/coreService/entity/QuestionEntity";
import React, { useEffect, useState } from "react";
import PreviewQuestionSkeleton from "../PreviewSkeleton";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import { QuestionService } from "services/coreService/QuestionService";
import qtype from "utils/constant/Qtype";
import "./index.scss";
import { CoreCodeQuestion } from "models/coreService/entity/CoreCodeQuestionEntity";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import "./index.scss";
import Heading3 from "components/text/Heading3";
import Heading5 from "components/text/Heading5";
import CodeIcon from "@mui/icons-material/Code";
import JoySelect from "components/common/JoySelect";
import CodeEditor from "components/editor/CodeEditor";
import TestCase from "./components/TestCase";
import Result from "./components/Result";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
import { dispatch } from "d3";
import { useAppSelector } from "hooks";
import { useDispatch } from "react-redux";
import { setTestCases } from "reduxes/courseService/previewCodeQuestionTestCase";
import { ProgrammingLanguageEntity } from "models/coreService/entity/ProgrammingLanguageEntity";
import { debounce } from "lodash";
import { ExecuteService } from "services/codeAssessmentService/ExecuteService";
import { Judge0ResponseEntity } from "models/codeAssessmentService/entity/Judge0ResponseEntity";

interface PreviewCodeQuestionProps extends DialogProps {
  questionId: string;
  readOnly?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewCodeQuestion = ({
  questionId,
  setOpen,
  readOnly,
  ...props
}: PreviewCodeQuestionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isFlagged, setIsFlagged] = useState(false);
  const [answered, setIsAnswered] = useState(false);
  const [questionDetail, setQuestionDetail] = useState<CoreCodeQuestion>();
  const [codeQuestionDetail, setCodeQuestionDetail] = useState<CodeQuestionEntity>();
  const [executeLoading, setExecuteLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [codeByLanguageList, setCodeByLanguageList] = useState<{
    [key: string]: string;
  }>({});
  const [result, setResult] = useState<Judge0ResponseEntity[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [languageSelectOptions, setLanguageSelectOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const testCases = useAppSelector((state) => state.previewCodeQuestionTestCase.testCases);

  const handleGetQuestionDetail = async () => {
    try {
      const questionCommands: PostQuestionDetailList = {
        questionCommands: [
          {
            questionId: questionId,
            qtype: qtype.source_code.code
          }
        ]
      };

      const response = await QuestionService.getQuestionDetail(questionCommands);

      return response;
    } catch (error) {
      setOpen(false);
      setShowSkeleton(false);

      console.log(error);
    }
  };

  const handleGetCodeQuestionDetail = async (codeQuestionId: string) => {
    try {
      const res = CodeQuestionService.getDetailCodeQuestion([codeQuestionId]);
      setShowSkeleton(false);

      return res;
    } catch (error) {
      setOpen(false);
      setShowSkeleton(false);

      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await handleGetQuestionDetail();

      setQuestionDetail(res.questionResponses[0].qtypeCodeQuestion);

      try {
        const codeRes = await handleGetCodeQuestionDetail(
          res.questionResponses[0].qtypeCodeQuestion.id
        );

        if (codeRes.length <= 0) {
          setOpen(false);
          return;
        }
        dispatch(setTestCases(codeRes[0].sampleTestCases));
        setCodeQuestionDetail(codeRes[0]);

        const languageList: ProgrammingLanguageEntity[] = codeRes[0].languages;
        setLanguageSelectOptions(
          languageList.map((language) => ({
            label: language.name,
            value: language.id
          }))
        );
        setSelectedLanguage(languageList[0].id);
        setCodeByLanguageList(
          languageList.reduce((acc: any, cur: any) => {
            acc[cur.id] = `${cur.headCode}\n${cur.bodyCode}\n${cur.tailCode}`;
            return acc;
          }, {})
        );
      } catch (error) {
        setOpen(false);
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleLanguageChange = (newValue: any) => {
    setSelectedLanguage(newValue);
  };
  const handleExecuteCode = () => {
    setResult([]);
    setError(null);
    setExecuteLoading(true);

    if (selectedLanguage) {
      Promise.all(
        testCases.map((testCase) => {
          const language = codeQuestionDetail?.languages.find(
            (language) => language.id === selectedLanguage
          );
          if (!language) return Promise.reject(new Error("Language not found"));

          return ExecuteService.execute(
            language?.judge0Id,
            testCase.inputData,
            testCase.outputData,
            language?.timeLimit,
            language?.memoryLimit,
            codeByLanguageList[selectedLanguage] || ""
          );
        })
      )
        .then((judge0Response: Judge0ResponseEntity[]) => {
          testCases.forEach((testCase, index) => {
            judge0Response[index].input_data = testCase.inputData;
            judge0Response[index].output_data = testCase.outputData;
          });
          setResult((prev) => [...prev, ...judge0Response]);
          setError(null);
        })
        .catch((error) => {
          let message: string | undefined = error.message;
          if (message === undefined) message = "Unexpected error";

          setError(message);
          console.log(error);
        })
        .finally(() => {
          setExecuteLoading(false);
        });
    }
  };
  const debouncedHandleOnInputChange = debounce((newValue: string) => {
    if (!selectedLanguage) return;

    const newCodeByLanguageList = { ...codeByLanguageList };
    newCodeByLanguageList[selectedLanguage] = newValue;
    setCodeByLanguageList(newCodeByLanguageList);
  }, 250);

  return (
    <Dialog {...props}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={props["aria-labelledby"]}>
        {showSkeleton ? (
          <>
            <Skeleton variant='text' width={400} height={50} />
          </>
        ) : (
          //   `Preview question: ${multipleChoiceQuestionDetail?.question.name}`
          `Preview Question: `
        )}
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {showSkeleton ? (
          <PreviewQuestionSkeleton showSkeleton={showSkeleton} />
        ) : (
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Heading4>{`${t("common_question")} ${1}`}</Heading4>
                <Button
                  variant={isFlagged ? "soft" : "outlined"}
                  color='primary'
                  startDecorator={isFlagged ? <FlagIcon /> : <FlagOutlinedIcon />}
                  onClick={() => setIsFlagged(!isFlagged)}
                >
                  {isFlagged ? t("common_remove_flag") : t("common_flag")}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
              <Stack direction={"row"} spacing={2}>
                <Box
                  sx={{ backgroundColor: answered ? "#e6eaf7" : "#FDF6EA" }}
                  borderRadius={1}
                  padding={".35rem 1rem"}
                >
                  <ParagraphBody fontSize={"12px"} color={"#212121"}>
                    {answered ? t("common_answer_saved") : t("common_not_answered")}
                  </ParagraphBody>
                </Box>
                <Box sx={{ backgroundColor: "#f5f5f5" }} borderRadius={1} padding={".35rem 1rem"}>
                  <ParagraphBody fontSize={"12px"} color={"#212121"}>
                    {t("common_score_can_achieve")}
                    {`: ${questionDetail?.question.defaultMark}`}
                  </ParagraphBody>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={12}>
              <Box id={"introduction"}>
                <Box id={"courseDescription"}>
                  <Stack spacing={2}>
                    <Box>
                      <Heading3>{codeQuestionDetail?.name}</Heading3>
                      <ReactQuill
                        value={codeQuestionDetail?.problemStatement || ""}
                        readOnly={true}
                        theme={"bubble"}
                      />
                    </Box>

                    <Box>
                      <Heading5>Input format</Heading5>
                      <ReactQuill
                        value={codeQuestionDetail?.inputFormat || ""}
                        readOnly={true}
                        theme={"bubble"}
                      />
                      <Heading5>Output format</Heading5>
                      <ReactQuill
                        value={codeQuestionDetail?.outputFormat || ""}
                        readOnly={true}
                        theme={"bubble"}
                      />
                    </Box>

                    <Box>
                      <Heading5>Constraint</Heading5>
                      <ReactQuill
                        value={codeQuestionDetail?.constraints || ""}
                        readOnly={true}
                        theme={"bubble"}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Box>
              <ParagraphBody
                fontSize={".875rem"}
                textAlign={"left"}
                fontWeight={"600"}
                color={"#212121"}
              >
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
                    value={codeByLanguageList[selectedLanguage || ""] || ""}
                    highlightActiveLine
                    autoFocus={false}
                    maxHeight='400px'
                    onChange={debouncedHandleOnInputChange}
                    defaultValue={codeByLanguageList[selectedLanguage || ""] || ""}
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
                      <TestCase />
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
                      <Result result={result} error={error} loading={executeLoading} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreviewCodeQuestion;
