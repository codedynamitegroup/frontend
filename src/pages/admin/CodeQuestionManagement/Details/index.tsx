import { Box, Tab, Tabs } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button, { BtnType } from "components/common/buttons/Button";
import CodeQuestionInformation from "./components/Information";
import CodeQuestionTestCases from "./components/TestCases";
import CodeQuestionCodeStubs from "./components/CodeStubs";
import CodeQuestionLanguages from "./components/Languages";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import { useAppDispatch } from "hooks";
import { setLoading } from "reduxes/Loading";
import { CodeQuestionAdminEntity } from "models/codeAssessmentService/entity/CodeQuestionAdminEntity";
import { CodeQuestionFormData } from "./type/CodeQuestionFormData";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";

interface Props {}

const AdminCodeQuestionDetails = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const schema = useMemo(() => {
    return yup.object<CodeQuestionFormData>().shape({
      name: yup
        .string()
        .required(t("name_required"))
        .test(
          "not-blank",
          `${t("name_required")}`,
          (value) => value !== undefined && value.trim().length > 0
        )
      // problemStatement: yup.string()
      // inputFormat: yup.string().notRequired(),
      // outputFormat: yup.string().notRequired(),
      // contraints: yup.string().notRequired(),
      // isPublic: yup.boolean().notRequired(),
      // allowImport: yup.boolean().notRequired(),
      // difficulty: yup
      //   .mixed<QuestionDifficultyEnum>()
      //   .oneOf(Object.values(QuestionDifficultyEnum))
      //   .notRequired()
    });
  }, [t]);
  const codeQuestionFormMethod = useForm<CodeQuestionFormData>({
    resolver: yupResolver(schema)
  });
  const params = useParams<{ questionId: string }>();
  const codeQuestionId = params?.questionId;
  const [codeQuestion, setCodeQuestion] = useState<CodeQuestionAdminEntity | undefined>(undefined);

  const handleGetCodeQuestionById = useCallback(
    (codeQuestionId: string | undefined) => {
      if (codeQuestionId) {
        dispatch(setLoading(true));
        CodeQuestionService.getAdminDetailCodeQuestion(codeQuestionId)
          .then((data: CodeQuestionAdminEntity) => {
            codeQuestionFormMethod.setValue("name", data.name);
          })
          .catch((err) => console.log(err))
          .finally(() => {
            dispatch(setLoading(false));
          });
      }
    },
    [codeQuestionFormMethod, dispatch]
  );

  useEffect(() => {
    handleGetCodeQuestionById(codeQuestionId);
  }, [codeQuestionId]);
  useEffect(() => {
    console.log(codeQuestionId);
  }, []);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: string) => {
    setActiveTab(newTab);
  };

  const [activeTab, setActiveTab] = useState("0");
  const onSubmit = (data: CodeQuestionFormData) => {
    console.log(data);
  };
  return (
    <>
      <FormProvider {...codeQuestionFormMethod}>
        <form onSubmit={codeQuestionFormMethod.handleSubmit(onSubmit)}>
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
                    if (codeQuestionId) navigate(pathname);
                  }}
                >
                  name
                </span>
              </ParagraphBody>
            </Box>

            <Box className={classes.body}>
              <Heading1 fontWeight={"500"}>{codeQuestion?.name ?? "name"}</Heading1>
              <TabContext value={activeTab}>
                <Box sx={{ border: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange}>
                    <Tab
                      sx={{ textTransform: "none" }}
                      label={
                        <ParagraphBody translation-key='common_info'>
                          {t("common_info")}
                        </ParagraphBody>
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
                    <CodeQuestionInformation codeQuestion={codeQuestion} />
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
              <Button btnType={BtnType.Primary} type='submit' translation-key='common_save_changes'>
                {t("common_save_changes")}
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </>
  );
};

export default AdminCodeQuestionDetails;
