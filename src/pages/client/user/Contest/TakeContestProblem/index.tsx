import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CodeIcon from "@mui/icons-material/Code";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PublishIcon from "@mui/icons-material/Publish";
import JoyButton from "@mui/joy/Button";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tabs
} from "@mui/material";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/system";
import CodeEditor from "components/editor/CodeEditor";
import ParagraphBody from "components/text/ParagraphBody";
import { UUID } from "crypto";
import { useAppDispatch, useAppSelector } from "hooks";
import useAuth from "hooks/useAuth";
import useBoxDimensions from "hooks/useBoxDimensions";
import cloneDeep from "lodash/cloneDeep";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { Judge0ResponseEntity } from "models/codeAssessmentService/entity/Judge0ResponseEntity";
import { ProgrammingLanguageEntity } from "models/coreService/entity/ProgrammingLanguageEntity";
import { Resizable } from "re-resizable";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-quill/dist/quill.bubble.css"; // hoặc 'react-quill/dist/quill.bubble.css' cho theme bubble
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import { setCodeQuestion } from "reduxes/CodeAssessmentService/CodeQuestion/Detail/DetailCodeQuestion";
import {
  setCpuTimeLimit,
  setLanguageId,
  setMemoryLimit,
  setSourceCode,
  setSystemLanguageId
} from "reduxes/CodeAssessmentService/CodeQuestion/Execute";
import {
  setExecuteError,
  setExecuteResultLoading,
  setResult
} from "reduxes/CodeAssessmentService/CodeQuestion/Execute/ExecuteResult";
import { setLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { ExecuteService } from "services/codeAssessmentService/ExecuteService";
import ProblemDetailDescription from "../../DetailProblem/components/Description";
import ProblemDetailSolution from "../../DetailProblem/components/ListSolution";
import Result from "../../DetailProblem/components/Result";
import ProblemDetailSubmission from "../../DetailProblem/components/Submission";
import TestCase from "../../DetailProblem/components/TestCase";
import classes from "./styles.module.scss";
import { ContestService } from "services/coreService/ContestService";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { setErrorMess } from "reduxes/AppStatus";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import moment from "moment";

export default function TakeContestProblem() {
  const auth = useAuth();
  const { problemId, contestId } = useParams<{
    problemId: UUID;
    contestId: string;
  }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const currentExecuteData = useAppSelector((state) => state.executeData);

  const [submissionLoading, setSubmisisonLoading] = useState(false);

  const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);

  const [contestDetails, setContestDetails] = useState<ContestEntity | null>(null);

  const isContestEnded = useMemo(() => {
    if (
      contestDetails &&
      contestDetails?.endTime &&
      moment(contestDetails.endTime).isBefore(moment())
    ) {
      dispatch(setErrorMess(t("contest_ended")));
      return true;
    }
    return false;
  }, [contestDetails, dispatch, t]);

  const handleGetContestById = useCallback(
    async (id: string) => {
      dispatch(setInititalLoading(true));
      try {
        const getContestDetailsResponse = await ContestService.getContestById(id);
        if (getContestDetailsResponse) {
          setContestDetails(getContestDetailsResponse);
        }
        dispatch(setInititalLoading(false));
      } catch (error: any) {
        console.log("error", error);
        dispatch(setInititalLoading(false));
      }
    },
    [dispatch]
  );

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

  const mapLanguages = new Map<string, { pLanguage: ProgrammingLanguageEntity; index: number }>();

  let [languageList, setLanguageList] = useState(cloneDeep(codeQuestion?.languages));

  languageList?.forEach((value, index) => {
    mapLanguages.set(value.id, { pLanguage: value, index });
  });

  useEffect(() => {
    if (problemId !== undefined) {
      dispatch(setLoading(true));
      CodeQuestionService.getDetailCodeQuestion(problemId)
        .then((data: CodeQuestionEntity) => {
          dispatch(setCodeQuestion(updateLanguageSourceCode(data)));
        })
        .catch((err) => console.log(err))
        .finally(() => dispatch(setLoading(false)));
    }
  }, [dispatch, problemId]);

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
  }, [dispatch, selectedLanguage]);

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

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (contestId && problemId)
      navigate(tabs[newTab].replace(":contestId", contestId).replace(":problemId", problemId));
  };

  const tabs: string[] = useMemo(() => {
    if (contestDetails?.isDisabledForum === true)
      return [
        routes.user.contest.detail.problems.description,
        routes.user.contest.detail.problems.submission
      ];
    else
      return [
        routes.user.contest.detail.problems.description,
        routes.user.contest.detail.problems.solution,
        routes.user.contest.detail.problems.submission
      ];
  }, [contestDetails?.isDisabledForum]);

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (contestId && problemId) {
      const index = tabs.findIndex((it) =>
        activeRoute(it.replace(":contestId", contestId).replace(":problemId", problemId))
      );
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const [testCaseTab, setTestCaseTab] = useState(0);
  const handleTestCaseChange = (event: any, newValue: any) => {
    setTestCaseTab(newValue);
  };

  const handleExecuteCode = () => {
    setTestCaseTab(1);
    dispatch(setExecuteResultLoading(true));
    if (currentExecuteData.test_cases) {
      Promise.all(
        currentExecuteData.test_cases.map((value) =>
          ExecuteService.execute(
            currentExecuteData.language_id,
            value.inputData,
            value.outputData,
            currentExecuteData.cpu_time_limit,
            currentExecuteData.memory_limit,
            currentExecuteData.source_code
          )
        )
      )
        .then((data: Judge0ResponseEntity[]) => {
          currentExecuteData.test_cases?.forEach((value, index) => {
            data[index].input_data = value.inputData;
            data[index].output_data = value.outputData;
          });
          // console.log(data);
          dispatch(setResult(data));
        })
        .catch((err) => {
          console.log("Execute error: ", err);
          let message: string | undefined = err.message;
          if (message === undefined) message = "Unexpected error";
          dispatch(setExecuteError(message));
        })
        .finally(() => dispatch(setExecuteResultLoading(false)));
    }
    // console.log("current data", currentExecuteData);
  };
  const handleSubmitCode = () => {
    if (
      problemId !== undefined &&
      contestId !== undefined &&
      currentExecuteData.source_code !== undefined &&
      currentExecuteData.system_language_id !== undefined
    ) {
      setSubmisisonLoading(true);
      CodeSubmissionService.createCodeSubmission({
        codeQuestionId: problemId,
        languageId: currentExecuteData.system_language_id,
        sourceCode: currentExecuteData.source_code,
        contestId
      })
        .then((data) => {
          console.log("create submit response", data);
          navigate(
            routes.user.contest.detail.problems.submission
              .replace(":problemId", problemId)
              .replace(":contestId", contestId)
          );
          // console.log("response data", data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setSubmisisonLoading(false));
    }
  };

  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { height: breadcrumbHeight } = useBoxDimensions({
    ref: breadcumpRef
  });

  const breadcumpWrapperRef = useRef<HTMLDivElement>(null);
  const { width: breadcumpWrapperWidth } = useBoxDimensions({
    ref: breadcumpWrapperRef
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const tabRef = useRef<HTMLDivElement>(null);
  const { height: tabHeight } = useBoxDimensions({
    ref: tabRef
  });
  const codeStubHeadRef = useRef<HTMLDivElement>(null);
  const { height: codeStubHeadHeight } = useBoxDimensions({
    ref: codeStubHeadRef
  });

  const [width001, setWidth001] = useState("50%");
  const [width002, setWidth002] = useState("50%");

  const [timer, setTimer] = useState<number | undefined>(undefined);

  const handleResize001 = (e: any, direction: any, ref: any, d: any) => {
    clearTimeout(timer);
    const newTimer = window.setTimeout(() => {
      const newWidth001 = ref.style.width;
      const newWidth002 = `${100 - parseFloat(newWidth001)}%`;

      setWidth001(newWidth001);
      setWidth002(newWidth002);
    }, 200);
    setTimer(newTimer);
  };

  const marginRef = useRef<number>(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (contestId) {
        handleGetContestById(contestId);
      }
    };
    fetchInitialData();
  }, [contestId, dispatch, handleGetContestById]);

  if (!contestId || !contestDetails || !problemId) return null;
  if (contestDetails.isRegistered !== true) {
    dispatch(setErrorMess(t("contest_not_registered")));
    navigate(routes.user.contest.detail.information.replace(":contestId", contestId));
  }
  return (
    <Box className={classes.root}>
      <Box
        className={classes.body}
        style={{
          height: `calc(100% - ${headerHeight + marginRef.current * 2}px)`,
          marginTop: `${headerHeight}px`,
          gap: `${marginRef.current}px`,
          marginBottom: `${marginRef.current}px`
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          {problemId && (
            <Box id={classes.breadcumpWrapper} ref={breadcumpWrapperRef}>
              <JoyButton
                className={classes.cursorPointer}
                onClick={() =>
                  navigate(
                    routes.user.contest.detail.problems.root.replace(":contestId", contestId ?? "")
                  )
                }
                color='primary'
                variant='plain'
                startDecorator={<ArrowBackIosNewIcon />}
                translate-key='contest_back_to_contest_problems_button'
              >
                {t("contest_back_to_contest_problems_button")}
              </JoyButton>
            </Box>
          )}
          <Box className={classes.submit}>
            {!auth.isLoggedIn && (
              <Button
                className={classes.runBtn}
                variant='contained'
                color='primary'
                translation-key='header_login_button'
                onClick={() =>
                  navigate(routes.user.login.root, {
                    state: {
                      navigateBack: problemId
                        ? routes.user.problem.detail.description.replace(":problemId", problemId)
                        : undefined
                    }
                  })
                }
                disabled={auth.isLoggedIn}
              >
                {t("header_login_button")}
              </Button>
            )}
            {auth.isLoggedIn && (
              <>
                <Button
                  className={classes.runBtn}
                  variant='contained'
                  color='primary'
                  translation-key='detail_problem_execute'
                  focusRipple
                  onClick={handleExecuteCode}
                  disabled={!auth.isLoggedIn || isContestEnded}
                >
                  <PlayArrowIcon />
                  {t("detail_problem_execute")}
                </Button>
                <Button
                  className={classes.submitBtn}
                  color='primary'
                  translation-key='detail_problem_submit'
                  onClick={handleSubmitCode}
                  focusRipple
                  disabled={!auth.isLoggedIn || isContestEnded}
                >
                  {submissionLoading && <CircularProgress size={20} />}
                  {!submissionLoading && <PublishIcon />} {t("detail_problem_submit")}
                </Button>
              </>
            )}
          </Box>
          <Box
            style={{
              width: `${breadcumpWrapperWidth}px`
            }}
          ></Box>
        </Box>
        <Grid
          container
          className={classes.codeContainer}
          style={{
            height: `calc(100% - ${breadcrumbHeight}px)`
          }}
        >
          <Resizable
            size={{ width: width001, height: "100%" }}
            minWidth={0}
            maxWidth={"100%"}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            onResize={handleResize001}
          >
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
                  {contestDetails?.isDisabledForum === true ? (
                    <>
                      {auth.isLoggedIn && (
                        <Tab
                          sx={{ textTransform: "none" }}
                          translation-key='detail_problem_submission'
                          label={<ParagraphBody>{t("detail_problem_submission")}</ParagraphBody>}
                          value={1}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {auth.isLoggedIn && (
                        <Tab
                          sx={{ textTransform: "none" }}
                          translation-key='detail_problem_discussion'
                          label={<ParagraphBody>{t("detail_problem_discussion")}</ParagraphBody>}
                          value={1}
                        />
                      )}
                      {auth.isLoggedIn && (
                        <Tab
                          sx={{ textTransform: "none" }}
                          translation-key='detail_problem_submission'
                          label={<ParagraphBody>{t("detail_problem_submission")}</ParagraphBody>}
                          value={2}
                        />
                      )}
                    </>
                  )}
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
                  {contestDetails?.isDisabledForum === true ? null : (
                    <Route path={"solution"} element={<ProblemDetailSolution />} />
                  )}
                  <Route
                    path={"submission"}
                    element={
                      <ProblemDetailSubmission
                        submissionLoading={submissionLoading}
                        contestInfo={{
                          contestId: contestId,
                          problemId: problemId
                        }}
                        isShareSolutionDisabled={contestDetails?.isDisabledForum}
                      />
                    }
                  />
                </Routes>
              </Box>
            </Box>
          </Resizable>

          <Resizable
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
                        <MenuItem key={value.id} value={value.id}>
                          {value.name}
                        </MenuItem>
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
                        {auth.isLoggedIn && (
                          <Tab
                            sx={{ textTransform: "none" }}
                            translation-key='detail_problem_result'
                            label={<ParagraphBody>{t("detail_problem_result")}</ParagraphBody>}
                            value={1}
                          />
                        )}
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
          </Resizable>
        </Grid>
      </Box>
    </Box>
  );
}
