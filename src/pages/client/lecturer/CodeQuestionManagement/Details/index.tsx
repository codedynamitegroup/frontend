import { Box, Tab, Tabs } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import { memo, useEffect, useMemo, useState } from "react";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import Button, { BtnType } from "components/common/buttons/Button";
import CodeQuestionInformation from "./components/Information";
import CodeQuestionTestCases from "./components/TestCases";
import CodeQuestionCodeStubs from "./components/CodeStubs";
import CodeQuestionLanguages from "./components/Languages";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import { QuestionService } from "services/courseService/QuestionService";
import { QuestionEntity } from "models/courseService/entity/QuestionEntity";

interface Props {}

const LecturerCodeQuestionDetails = memo((props: Props) => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<QuestionEntity>({
    id: "",
    organizationId: "",
    difficulty: "",
    name: "",
    questionText: "",
    generalFeedback: "",
    defaultMark: 0,
    createdAt: "",
    updatedAt: "",
    message: ""
  });

  const handleGetQuestionById = async (id: string) => {
    try {
      const response = await QuestionService.getQuestionById(id);
      setQuestion(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await handleGetQuestionById(questionId ?? "");
    };
    fetchInitialData();
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (questionId) navigate(tabs[newTab].replace(":questionId", questionId));
  };

  const tabs: string[] = useMemo(() => {
    return [
      routes.lecturer.code_question.information,
      routes.lecturer.code_question.test_cases,
      routes.lecturer.code_question.code_stubs,
      routes.lecturer.code_question.languages
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (questionId) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":questionId", questionId)));
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  return (
    <>
      <Box>
        <Box className={classes.tabWrapper}>
          <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
            <span
              translation-key='code_management_title'
              onClick={() => navigate(routes.lecturer.code_question.management)}
            >
              {t("code_management_title")}
            </span>
            {">"}
            <span
              onClick={() => {
                if (questionId) navigate(pathname);
              }}
            >
              {question.name}
            </span>
          </ParagraphBody>
        </Box>

        <Box className={classes.body}>
          <Heading1 fontWeight={"500"}>{question.name}</Heading1>
          <Box sx={{ border: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label='basic tabs example'
              className={classes.tabs}
            >
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translation-key='common_info'>{t("common_info")}</ParagraphBody>
                }
                value={0}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Test cases</ParagraphBody>}
                value={1}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translation-key='code_management_detail_stub'>
                    {t("code_management_detail_stub")}
                  </ParagraphBody>
                }
                value={2}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translation-key='common_language'>
                    {t("common_language")}
                  </ParagraphBody>
                }
                value={3}
              />
            </Tabs>
          </Box>
          <Box id={classes.codeQuestionDetailBody}>
            <Routes>
              <Route
                path={"information"}
                element={<CodeQuestionInformation question={question} />}
              />
              <Route path={"test-cases"} element={<CodeQuestionTestCases />} />
              <Route path={"code-stubs"} element={<CodeQuestionCodeStubs />} />
              <Route path={"languages"} element={<CodeQuestionLanguages />} />
            </Routes>
          </Box>
        </Box>
      </Box>
      <Box className={classes.stickyFooterContainer}>
        <Box className={classes.phantom} />
        <Box className={classes.stickyFooterItem}>
          <Button btnType={BtnType.Primary} translation-key='common_save_changes'>
            {t("common_save_changes")}
          </Button>
        </Box>
      </Box>
    </>
  );
});

export default LecturerCodeQuestionDetails;
