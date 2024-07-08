import { Box, CircularProgress, Tab, Tabs } from "@mui/material";
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
import isQuillEmpty from "utils/coreService/isQuillEmpty";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import { TagService } from "services/codeAssessmentService/TagService";
import { ProgrammingLanguageEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageEntity";
import { ProgrammingLanuageService } from "services/codeAssessmentService/ProgrammingLanguageService";
import { ProgrammingLanguageAdminEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageAdminEntity";
import { TestCaseSerivce } from "services/codeAssessmentService/TestCaseService";
import FormSchema from "./schema/formSchema";

interface Props {}
const checkEmptyString = (value: string) => value !== undefined && value.trim().length > 0;
const AdminCodeQuestionDetails = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [codeQuestion, setCodeQuestion] = useState<CodeQuestionAdminEntity | undefined>(undefined);
  const [tags, setTags] = useState<TagEntity[]>([]);
  const [programmingLanguage, setProgrammingLanguage] = useState<ProgrammingLanguageAdminEntity[]>(
    []
  );
  const codeQuestionFormMethod = useForm<CodeQuestionFormData>({
    resolver: yupResolver(FormSchema()),
    defaultValues: useMemo(
      () => ({
        name: codeQuestion?.name ?? "",
        problemStatement: codeQuestion?.problemStatement ?? "",
        difficulty: codeQuestion?.difficulty ?? QuestionDifficultyEnum.EASY,
        inputFormat: codeQuestion?.inputFormat ?? "",
        outputFormat: codeQuestion?.outputFormat ?? "",
        constraints: codeQuestion?.constraints ?? "None",
        maxGrade: codeQuestion?.maxGrade ?? 1,
        isPublic: codeQuestion?.isPublic ?? true,
        allowImport: codeQuestion?.allowImport ?? false,
        testCases: codeQuestion?.testCases ?? [],
        tags: codeQuestion?.tags ?? [],
        programmingLanguages: codeQuestion?.programmingLanguages ?? []
      }),
      [codeQuestion]
    )
  });
  const params = useParams<{ codeQuestionId: string }>();
  const codeQuestionId = params?.codeQuestionId;

  useEffect(() => {
    codeQuestionFormMethod.reset({
      name: codeQuestion?.name ?? "",
      difficulty: codeQuestion?.difficulty ?? QuestionDifficultyEnum.EASY,
      problemStatement: codeQuestion?.problemStatement ?? "",
      inputFormat: codeQuestion?.inputFormat ?? "",
      outputFormat: codeQuestion?.outputFormat ?? "",
      constraints: codeQuestion?.constraints ?? "None",
      maxGrade: codeQuestion?.maxGrade ?? 1,
      isPublic: codeQuestion?.isPublic ?? true,
      allowImport: codeQuestion?.allowImport ?? false,
      testCases: codeQuestion?.testCases ?? [],
      tags: codeQuestion?.tags ?? [],
      programmingLanguages: codeQuestion?.programmingLanguages ?? programmingLanguage
    });
  }, [codeQuestion, codeQuestionFormMethod, programmingLanguage]);
  const isEdit = codeQuestionId !== undefined && codeQuestionId !== null;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    const getAllTag = async (): Promise<TagEntity[]> => {
      let data: TagEntity[] = await TagService.getAllTag(false);
      return data;
    };
    const handleGetCodeQuestionById = async (
      codeQuestionId: string | undefined
    ): Promise<CodeQuestionAdminEntity | undefined> => {
      if (codeQuestionId) {
        const data: CodeQuestionAdminEntity =
          await CodeQuestionService.getAdminDetailCodeQuestion(codeQuestionId);
        return data;
      }
      return undefined;
    };
    const getActiveProgrammingLanguage = async (): Promise<ProgrammingLanguageAdminEntity[]> => {
      let data: ProgrammingLanguageAdminEntity[] =
        await ProgrammingLanuageService.getProgrammingLanguages(true);
      return data;
    };
    const handleFetchData = async () => {
      dispatch(setLoading(true));
      try {
        if (isEdit) {
          let data = await Promise.all([
            handleGetCodeQuestionById(codeQuestionId),
            getAllTag(),
            getActiveProgrammingLanguage()
          ]);
          let codeQuestion = data[0];

          let programmingLanguage = data[2];

          if (codeQuestion !== undefined) {
            //map current language to the language set
            let currentLanguage = new Map<string, ProgrammingLanguageAdminEntity>();

            codeQuestion.programmingLanguages.forEach((value) =>
              currentLanguage.set(value.id, value)
            );
            programmingLanguage.forEach((value) => {
              if (currentLanguage.has(value.id)) {
                let current = currentLanguage.get(value.id);
                if (current !== undefined) {
                  value.choosen = true;
                  value.memoryLimit = current.memoryLimit;
                  value.timeLimit = current.timeLimit;
                  value.bodyCode = current.bodyCode;
                }
              } else {
                value.choosen = false;
              }
            });
            codeQuestion.programmingLanguages = programmingLanguage;
          }
          setCodeQuestion(codeQuestion);
          setProgrammingLanguage(programmingLanguage);
          setTags(data[1]);
        } else {
          let data = await Promise.all([getAllTag(), getActiveProgrammingLanguage()]);
          setProgrammingLanguage(data[1]);
          setTags(data[0]);
        }
      } catch (err) {
        console.error(err);
        navigate("/admin/code-questions");
      } finally {
        dispatch(setLoading(false));
      }
    };
    handleFetchData();
  }, [codeQuestionId, dispatch, isEdit, navigate]);

  const handleChange = (_: React.SyntheticEvent, newTab: string) => {
    setActiveTab(newTab);
  };

  // console.log(codeQuestion);
  const [activeTab, setActiveTab] = useState("0");
  console.log(codeQuestionFormMethod.formState.errors);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const onSubmit = async (data: CodeQuestionFormData) => {
    if (isEdit) {
      const dirtyFields = codeQuestionFormMethod.formState.dirtyFields;
      const dirtyInformationField = [
        dirtyFields.name,
        dirtyFields.difficulty,
        dirtyFields.problemStatement,
        dirtyFields.inputFormat,
        dirtyFields.outputFormat,
        dirtyFields.constraints,
        dirtyFields.maxGrade,
        dirtyFields.isPublic,
        dirtyFields.allowImport
      ];
      const isDirtyInform = dirtyInformationField.some((value) => value === true);
      const isDirtyTags = dirtyFields.tags?.some((value) => value === true);
      const isDirtyLanguages = dirtyFields.programmingLanguages?.some((value) =>
        Object.values(value).some((val) => val === true)
      );
      const isDirtyTestCase = dirtyFields.testCases?.some((value) =>
        Object.values(value).some((val) => val === true)
      );

      setLoadingSubmit(true);
      try {
        let updateInform: Promise<any> | undefined = undefined;
        if (isDirtyInform && codeQuestionId !== undefined) {
          updateInform = CodeQuestionService.updateCodeQuestion(codeQuestionId, {
            name: data.name,
            difficulty: data.difficulty,
            problemStatement: data.problemStatement,
            inputFormat: data.inputFormat,
            outputFormat: data.outputFormat,
            constraints: data.constraints,
            maxGrade: data.maxGrade,
            isPublic: data.isPublic,
            allowImport: data.allowImport
          });
        }

        let updateTestCases: Promise<any> | undefined = undefined;
        let dirtyTC = dirtyFields?.testCases;
        console.log("here");

        if (isDirtyTestCase && codeQuestion !== undefined) {
          console.log("here");
          const dataTC = data.testCases;
          let mapTCs = new Map<string, TestCaseEntity>();
          dataTC.forEach((value) => {
            if (value.id !== "new") mapTCs.set(value.id, value);
          });
          let updatedTC = dataTC.filter(
            (value, index) =>
              value.id !== "new" &&
              dirtyTC !== undefined &&
              Object.values(dirtyTC[index]).some((val) => val === true)
          );
          let newTC = dataTC.filter((value) => value.id === "new");
          let deletedTC = codeQuestion.testCases
            .filter((value) => !mapTCs.has(value.id))
            .map((value) => value.id);
          updateTestCases = TestCaseSerivce.updateTestCases({
            codeQuestionId: codeQuestion.id,
            newTestCases: newTC.map((value) => ({
              inputData: value.inputData,
              outputData: value.outputData,
              isSample: value.isSample
            })),
            updatedTestCases: updatedTC.map((value) => ({
              inputData: value.inputData,
              outputData: value.outputData,
              isSample: value.isSample,
              id: value.id
            })),
            deletedTestCasesId: deletedTC
          });
        }
        await Promise.all([updateInform, updateTestCases]);
      } finally {
        setLoadingSubmit(false);
      }
    }
    console.log("dirty", codeQuestionFormMethod.formState.dirtyFields);
    console.log(data);
    console.log(codeQuestionFormMethod.getValues("testCases"));
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
                  {isEdit ? codeQuestion?.name ?? "" : "create code question"}
                </span>
              </ParagraphBody>
            </Box>

            <Box className={classes.body}>
              <Heading1 fontWeight={"500"}>{codeQuestion?.name ?? "name"}</Heading1>
              <TabContext value={activeTab}>
                <Box sx={{ border: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange} className={classes.tabs}>
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
                    <CodeQuestionInformation codeQuestion={codeQuestion} tags={tags} />
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
                </Box>
              </TabContext>
            </Box>
          </Box>
          <Box className={classes.stickyFooterContainer}>
            <Box className={classes.phantom} />
            <Box className={classes.stickyFooterItem}>
              <Button btnType={BtnType.Primary} type='submit' translation-key='common_save_changes'>
                {loadingSubmit ? <CircularProgress size={20} /> : t("common_save_changes")}
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </>
  );
};

export default AdminCodeQuestionDetails;
