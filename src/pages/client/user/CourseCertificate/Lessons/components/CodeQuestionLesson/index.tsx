import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs
} from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import { Resizable } from "re-resizable";
import classes from "./styles.module.scss";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import ProblemDetailSubmission from "pages/client/user/DetailProblem/components/Submission";
import ProblemDetailSolution from "pages/client/user/DetailProblem/components/ListSolution";
import ProblemDetailDescription from "pages/client/user/DetailProblem/components/Description";
import { useEffect, useMemo, useRef, useState } from "react";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "hooks";
import { ProgrammingLanguageEntity } from "models/coreService/entity/ProgrammingLanguageEntity";
import cloneDeep from "lodash.clonedeep";
import { ChapterResourceEntity } from "models/coreService/entity/ChapterResourceEntity";
import { routes } from "routes/routes";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import { setCodeQuestion } from "reduxes/CodeAssessmentService/CodeQuestion/Detail/DetailCodeQuestion";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { UUID } from "crypto";
import CodeIcon from "@mui/icons-material/Code";
import CodeEditor from "components/editor/CodeEditor";
import {
  setCpuTimeLimit,
  setLanguageId,
  setMemoryLimit,
  setSourceCode,
  setSystemLanguageId
} from "reduxes/CodeAssessmentService/CodeQuestion/Execute";
import TestCase from "pages/client/user/DetailProblem/components/TestCase";
import Result from "pages/client/user/DetailProblem/components/Result";

const CodeQuestionLesson = ({ lesson }: { lesson: ChapterResourceEntity | null }) => {
  const { t } = useTranslation();
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const { pathname } = useLocation();

  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const currentExecuteData = useAppSelector((state) => state.executeData);

  const [submissionLoading, setSubmisisonLoading] = useState(false);

  const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);

  const mapLanguages = new Map<string, { pLanguage: ProgrammingLanguageEntity; index: number }>();

  let [languageList, setLanguageList] = useState(cloneDeep(codeQuestion?.languages));

  languageList?.forEach((value, index) => {
    mapLanguages.set(value.id, { pLanguage: value, index });
  });

  const tabs: string[] = useMemo(() => {
    return [
      routes.user.course_certificate.detail.lesson.description,
      routes.user.course_certificate.detail.lesson.solution,
      routes.user.course_certificate.detail.lesson.submission
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (courseId && lessonId) {
      const index = tabs.findIndex((it) =>
        activeRoute(it.replace(":courseId", courseId).replace(":lessonId", lessonId))
      );
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (courseId && lessonId) {
      navigate(tabs[newTab].replace(":courseId", courseId).replace(":lessonId", lessonId));
    }
  };

  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [width001, setWidth001] = useState("100%");
  const [width002, setWidth002] = useState("50%");

  const tabRef = useRef<HTMLDivElement>(null);
  const { height: tabHeight } = useBoxDimensions({
    ref: tabRef
  });

  const handleResize001 = (e: any, direction: any, ref: any, d: any) => {
    clearTimeout(timer);
    const newTimer = window.setTimeout(() => {
      const newWidth001 = ref.style.width;
      const newWidth002 = `${100 - parseFloat(newWidth001)}%`;

      setWidth001(newWidth001);
      setWidth002(newWidth002);
    }, 100);
    setTimer(newTimer);
  };

  const updateLanguageSourceCode = (data: CodeQuestionEntity): CodeQuestionEntity => {
    const submissinMapWithLangIdKeyAndSourceCodeValue = new Map<UUID, string>();
    data.codeSubmissions?.forEach((value) => {
      submissinMapWithLangIdKeyAndSourceCodeValue.set(value.languageId, value.sourceCode);
    });
    data.languages = data.languages.map((value) => {
      const sourceCode: string | undefined = submissinMapWithLangIdKeyAndSourceCodeValue.get(
        value.id
      );
      if (sourceCode !== undefined) value.sourceCode = sourceCode;
      else value.sourceCode = `${value.headCode}\n${value.bodyCode}\n${value.tailCode}`;
      return value;
    });
    return data;
  };

  const codeStubHeadRef = useRef<HTMLDivElement>(null);
  const { height: codeStubHeadHeight } = useBoxDimensions({
    ref: codeStubHeadRef
  });

  useEffect(() => {
    if (lesson !== undefined) {
      // dispatch(setLoading(true));
      setIsQuestionLoading(true);
      CodeQuestionService.getDetailCodeQuestion(lesson?.question?.codeQuestionId || "")
        .then((data: CodeQuestionEntity) => {
          dispatch(setCodeQuestion(updateLanguageSourceCode(data)));
        })
        .catch((err) => console.log(err))
        .finally(() => setIsQuestionLoading(false));
    }
  }, [dispatch, lesson]);

  const [testCaseTab, setTestCaseTab] = useState(0);
  const handleTestCaseChange = (event: any, newValue: any) => {
    setTestCaseTab(newValue);
  };

  const [selectedLanguage, setSelectedLanguage] = useState<{ id: string; sourceCode: string }>({
    id: "",
    sourceCode: ""
  });

  useEffect(() => {
    setSelectedLanguage(
      codeQuestion?.languages !== undefined && codeQuestion?.languages.length > 0
        ? {
            id: codeQuestion?.languages[0].id,
            sourceCode: codeQuestion?.languages[0].sourceCode ?? ""
          }
        : { id: "", sourceCode: "" }
    );
    setLanguageList(codeQuestion?.languages);
  }, [codeQuestion?.languages]);

  useEffect(() => {
    const language = mapLanguages.get(selectedLanguage.id);
    if (
      language !== undefined &&
      language.pLanguage.headCode !== undefined &&
      language.pLanguage.tailCode !== undefined
    ) {
      // const headCode: string = language.pLanguage.headCode;
      // const bodyCode: string = selectedLanguage.sourceCode;
      // const tailCode: string = language.pLanguage.tailCode;
      const sourceCode: string = selectedLanguage.sourceCode;
      dispatch(setSourceCode(sourceCode));
      // dispatch(setHeadBodyTailCode({ headCode, bodyCode, tailCode }));
      dispatch(setLanguageId(language.pLanguage.judge0Id));
      dispatch(setSystemLanguageId(language.pLanguage.id));
      dispatch(setCpuTimeLimit(language.pLanguage.timeLimit));
      dispatch(setMemoryLimit(language.pLanguage.memoryLimit));
    }
  }, [selectedLanguage]);

  const handleChangeLanguage = (event: SelectChangeEvent) => {
    const newSelectedLanguageId = event.target.value;
    const oldLanguage = mapLanguages.get(selectedLanguage.id);
    if (oldLanguage !== undefined && languageList !== undefined) {
      console.log(selectedLanguage.sourceCode);
      let newLangList = languageList.map((value, index) => {
        if (index === oldLanguage.index)
          return { ...value, sourceCode: selectedLanguage.sourceCode };
        return value;
      });
      setLanguageList(newLangList);
    }

    const newLanguage = mapLanguages.get(newSelectedLanguageId);
    setSelectedLanguage({
      id: newSelectedLanguageId,
      sourceCode: newLanguage?.pLanguage.sourceCode ? newLanguage?.pLanguage.sourceCode : ""
    });
  };
  const onSourceCodeChange = (value: string) => {
    setSelectedLanguage({ id: selectedLanguage.id, sourceCode: value });
  };

  return (
    <>
      {isQuestionLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "10px"
          }}
        >
          <CircularProgress />
          <ParagraphBody translate-key='common_loading'>{t("common_loading")}</ParagraphBody>
        </Box>
      ) : (
        // <Resizable
        //   size={{ width: width001, height: "100%" }}
        //   minWidth={0}
        //   maxWidth={"100%"}
        //   enable={{
        //     top: false,
        //     right: true,
        //     bottom: false,
        //     left: false,
        //     topRight: false,
        //     bottomRight: false,
        //     bottomLeft: false,
        //     topLeft: false
        //   }}
        //   onResize={handleResize001}
        // >
        <Box className={classes.leftBody}>
          <Box id={classes.tabWrapper} ref={tabRef}>
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label='basic tabs example'
              className={classes.tabs}
            >
              <Tab
                sx={{ textTransform: "none" }}
                translation-key='detail_problem_description'
                label={<ParagraphBody>{t("detail_problem_description")}</ParagraphBody>}
                value={0}
              />
              <Tab
                sx={{ textTransform: "none" }}
                translation-key='detail_problem_discussion'
                label={<ParagraphBody>{t("detail_problem_discussion")}</ParagraphBody>}
                value={1}
              />
              <Tab
                sx={{ textTransform: "none" }}
                translation-key='detail_problem_submission'
                label={<ParagraphBody>{t("detail_problem_submission")}</ParagraphBody>}
                value={2}
              />
            </Tabs>
          </Box>

          <Box
            id={classes.tabBody}
            style={{
              height: `calc(100% - ${tabHeight}px)`
            }}
          >
            <Routes>
              <Route path={"description"} element={<ProblemDetailDescription />} />
              <Route path={"solution"} element={<ProblemDetailSolution />} />
              <Route
                path={"submission"}
                element={<ProblemDetailSubmission submissionLoading={submissionLoading} />}
              />
            </Routes>
          </Box>
        </Box>
        // </Resizable>
      )}

      {/* <Resizable
        size={{ width: width002, height: "100%" }}
        minWidth={0}
        maxWidth={"100%"}
        enable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
        // onResize={handleResize002}
      >
        <Box className={classes.rightBody}>
          <Box className={classes.codeStubContainer}>
            <Box id={classes.codeStubHead} ref={codeStubHeadRef}>
              <CodeIcon />
              <FormControl>
                <Select
                  value={selectedLanguage.id}
                  onChange={handleChangeLanguage}
                  sx={{ bgcolor: "white", width: "150px", height: "40px" }}
                >
                  {codeQuestion?.languages.map((value: ProgrammingLanguageEntity) => (
                    <MenuItem value={value.id}>{value.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              style={{
                height: `calc(100% - ${codeStubHeadHeight}px)`,
                overflow: "auto"
              }}
            >
              <CodeEditor value={selectedLanguage.sourceCode} onChange={onSourceCodeChange} />
            </Box>
          </Box>
          <Box className={classes.codeTestcaseContainer}>
            <Box className={classes.testcaseContainer}>
              <Box className={classes.testcaseBody}>
                <Box id={classes.tabWrapper} ref={tabRef}>
                  <Tabs
                    value={testCaseTab}
                    onChange={handleTestCaseChange}
                    aria-label='basic tabs example'
                    className={classes.tabs}
                  >
                    <Tab
                      sx={{ textTransform: "none" }}
                      label={<ParagraphBody>Test Cases</ParagraphBody>}
                      value={0}
                    />
                    <Tab
                      sx={{ textTransform: "none" }}
                      translation-key='detail_problem_result'
                      label={<ParagraphBody>{t("detail_problem_result")}</ParagraphBody>}
                      value={1}
                    />
                  </Tabs>
                </Box>

                <Box
                  className={classes.tabBody}
                  style={{
                    height: `calc(50% - ${tabHeight}px)`
                  }}
                >
                  {testCaseTab === 0 ? <TestCase /> : <Result />}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Resizable> */}
    </>
  );
};

export default CodeQuestionLesson;
