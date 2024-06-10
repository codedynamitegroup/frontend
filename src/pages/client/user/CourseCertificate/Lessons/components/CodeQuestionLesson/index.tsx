import { Box, Tab, Tabs } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import { Resizable } from "re-resizable";
import classes from "./styles.module.scss";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import ProblemDetailSubmission from "pages/client/user/DetailProblem/components/Submission";
import ProblemDetailSolution from "pages/client/user/DetailProblem/components/ListSolution";
import ProblemDetailDescription from "pages/client/user/DetailProblem/components/Description";
import { useEffect, useRef, useState } from "react";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "hooks";
import { ProgrammingLanguageEntity } from "models/coreService/entity/ProgrammingLanguageEntity";
import cloneDeep from "lodash.clonedeep";
import { ChapterResourceEntity } from "models/coreService/entity/ChapterResourceEntity";

const CodeQuestionLesson = ({ lesson }: { lesson: ChapterResourceEntity | null }) => {
  const { t } = useTranslation();
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const { pathname } = useLocation();

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

  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [width001, setWidth001] = useState("50%");
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

  // useEffect(() => {
  // if (problemId !== undefined) {
  // dispatch(setLoading(true));
  // CodeQuestionService.getDetailCodeQuestion(problemId)
  //   .then((data: CodeQuestionEntity) => {
  //     dispatch(setCodeQuestion(updateLanguageSourceCode(data)));
  //   })
  //   .catch((err) => console.log(err))
  //   .finally(() => dispatch(setLoading(false)));
  // }
  // }, [dispatch]);

  console.log("lesson", lesson);

  return (
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
            value={0}
            onChange={() => {}}
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
    </Resizable>
  );
};

export default CodeQuestionLesson;
