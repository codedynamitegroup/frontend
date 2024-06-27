import { Grid, Stack, Divider, Box } from "@mui/material";
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
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
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
import { initCode, setCode, setSelectedLanguageId } from "reduxes/TakeExam/TakeExamCodeQuestion";

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
  const [currentCode, setCurrentCode] = useState<string>("");

  const flagQuestionHandle = () => {
    if (isFlagged !== undefined) dispatch(setFlag({ id: questionId, flag: !isFlagged }));
  };

  const debouncedHandleOnInputChange = debounce((value: string, viewUpdate: ViewUpdate) => {
    let isAnswered = true;
    if (value === "") isAnswered = false;

    dispatch(
      setAnswered({
        id: questionId,
        answered: isAnswered,
        content: JSON.stringify({
          languageId: selectedLanguage,
          code: value
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
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
  const [tabValue, setTabValue] = useState(0);
  const languageMap = useMemo(() => {
    return questionCode?.languages.reduce((acc: LanguageMap, cur: ProgrammingLanguageEntity) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
  }, [questionCode]);

  const codeFormat = useMemo(() => {
    if (selectedLanguage === undefined) return "";
    if (codeQuestionLanguageState.codes && codeQuestionLanguageState.codes[selectedLanguage]) {
      return codeQuestionLanguageState.codes[selectedLanguage];
    }
    return `${languageMap?.[selectedLanguage]?.headCode}\n\n${languageMap?.[selectedLanguage]?.bodyCode}\n\n${languageMap?.[selectedLanguage]?.tailCode}`;
  }, [languageMap, selectedLanguage]);

  const handleLanguageChange = (newValue: any) => {
    dispatch(setSelectedLanguageId({ questionId: questionId, selectedLanguageId: newValue }));
    dispatch(
      setAnswered({
        id: questionId,
        answered: true,
        content: JSON.stringify({
          languageId: newValue,
          code: codeQuestionLanguageState?.codes?.[newValue] || ""
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
            languageIdList: questionCode?.languages.map((language) => language.id)
          })
        );
    }
    if (selectedLanguage === undefined && questionCode?.languages?.length) {
      if (codeQuestionLanguageState?.selectedLanguageId)
        setSelectedLanguage(codeQuestionLanguageState?.selectedLanguageId);
      else setSelectedLanguage(questionCode?.languages[0]?.id);
    }
  }, [codeQuestionLanguageState?.codes, dispatch, questionCode?.languages, questionId]);

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
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            marginTop: "20px"
          }}
        >
          <Tabs
            aria-label='Basic tabs'
            defaultValue={tabValue}
            value={tabValue}
            onChange={(event, newValue) => setTabValue(Number(newValue) || 0)}
            sx={{
              borderRadius: "12px",

              "& .Mui-selected": {
                borderTopLeftRadius: tabValue === 0 ? "12px" : "0px"
              },
              "& hover": {
                borderTopLeftRadius: tabValue === 0 ? "12px" : "0px"
              }
            }}
          >
            <TabList>
              <Tab>Test case</Tab>
              <Tab>Result</Tab>
            </TabList>
            <TabPanel value={0}>
              <TestCase />
            </TabPanel>
            <TabPanel value={1}>
              <Result />
            </TabPanel>
          </Tabs>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CodeExamQuestion;

const parseQuestionData = (questionData: string) => {
  try {
    return JSON.parse(questionData);
  } catch (error) {
    return {};
  }
};
