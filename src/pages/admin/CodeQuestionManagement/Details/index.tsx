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
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";

interface Props {}

const AdminCodeQuestionDetails = (props: Props) => {
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
    message: "",
    qtype: ""
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

  const handleChange = (_: React.SyntheticEvent, newTab: string) => {
    setActiveTab(newTab);
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

  const [activeTab, setActiveTab] = useState("0");
  console.log("im here");
  return (
    <>
      <Box>
        <Box className={classes.tabWrapper}>
          <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
            <span
              translation-key='code_management_title'
              onClick={() => navigate("/admin/code-questions")}
            >
              {t("code_management_title")}
            </span>
            {" > "}
            <span
              onClick={() => {
                if (questionId) navigate(pathname);
              }}
            >
              name
            </span>
          </ParagraphBody>
        </Box>

        <Box className={classes.body}>
          <Heading1 fontWeight={"500"}>{question.name}</Heading1>
          <TabContext value={activeTab}>
            <Box sx={{ border: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                <Tab
                  sx={{ textTransform: "none" }}
                  label={
                    <ParagraphBody translation-key='common_info'>{t("common_info")}</ParagraphBody>
                  }
                  value='0'
                />
                <Tab
                  sx={{ textTransform: "none" }}
                  label={<ParagraphBody>Test cases</ParagraphBody>}
                  value='1'
                />
                <Tab
                  sx={{ textTransform: "none" }}
                  label={
                    <ParagraphBody translation-key='code_management_detail_stub'>
                      {t("code_management_detail_stub")}
                    </ParagraphBody>
                  }
                  value='2'
                />
                <Tab
                  sx={{ textTransform: "none" }}
                  label={
                    <ParagraphBody translation-key='common_language'>
                      {t("common_language")}
                    </ParagraphBody>
                  }
                  value='3'
                />
              </TabList>
            </Box>
            <Box id={classes.codeQuestionDetailBody}>
              <TabPanel value='0'>
                <CodeQuestionInformation question={question} />
              </TabPanel>
              <TabPanel value='1'>
                <CodeQuestionTestCases />
              </TabPanel>
              <TabPanel value='2'>
                <CodeQuestionCodeStubs />
              </TabPanel>
              <TabPanel value='3'>
                <CodeQuestionLanguages />
              </TabPanel>
              {/* <Routes>
              <Route
                path={"information"}
                element={<CodeQuestionInformation question={question} />}
              />
              <Route path={"test-cases"} element={<CodeQuestionTestCases />} />
              <Route path={"code-stubs"} element={<CodeQuestionCodeStubs />} />
              <Route path={"languages"} element={<CodeQuestionLanguages />} />
            </Routes> */}
            </Box>
          </TabContext>
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
};

export default AdminCodeQuestionDetails;
