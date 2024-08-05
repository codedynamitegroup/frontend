import { yupResolver } from "@hookform/resolvers/yup";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, CircularProgress, Container, Grid, Tab } from "@mui/material";
import CustomBreadCrumb from "components/common/Breadcrumb";
import Button, { BtnType } from "components/common/buttons/Button";
import Header from "components/Header";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import { useAppDispatch } from "hooks";
import useAuth from "hooks/useAuth";
import i18next from "i18next";
import { CodeQuestionAdminEntity } from "models/codeAssessmentService/entity/CodeQuestionAdminEntity";
import { ProgrammingLanguageAdminEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageAdminEntity";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
import { PostQuestionDetailList } from "models/coreService/entity/QuestionEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { CourseDetailEntity } from "models/courseService/entity/detail/CourseDetailEntity";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { setLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import { ProgrammingLanuageService } from "services/codeAssessmentService/ProgrammingLanguageService";
import { TagService } from "services/codeAssessmentService/TagService";
import { TestCaseSerivce } from "services/codeAssessmentService/TestCaseService";
import { QuestionService } from "services/coreService/QuestionService";
import { CourseService } from "services/courseService/CourseService";
import { RootState } from "store";
import qtype from "utils/constant/Qtype";
import CodeQuestionCodeStubs from "./components/CodeStubs";
import CodeQuestionInformation from "./components/Information";
import CodeQuestionLanguages from "./components/Languages";
import CodeQuestionTestCases from "./components/TestCases";
import FormSchema from "./schema/FormSchema";
import classes from "./styles.module.scss";
import { CodeQuestionFormData } from "./type/CodeQuestionFormData";
import { CoreCodeQuestionService } from "services/coreService/CoreCodeQuestionService";
import { QuestionTypeEnum } from "models/coreService/enum/QuestionTypeEnum";
import { setQuestionCreate, updateQuestionCreate } from "reduxes/coreService/questionCreate";

interface Props {
  isCloneData?: boolean;
}

const LecturerCodeQuestionDetails = ({ isCloneData }: Props) => {
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);
  const [headerHeight, setHeaderHeight] = useState(sidebarStatus.headerHeight);
  const { loggedUser } = useAuth();
  const location = useLocation();
  const isCreateExam = location.state?.isCreateExam;
  const locationCourseId = location.state?.courseId;
  const locationExamId = location.state?.examId;
  const isQuestionBank = location.state?.isQuestionBank;
  const isLecturerCreateQuestionBank = location.state?.isLecturerCreateQuestionBank;
  const categoryName = location.state?.categoryName;
  const [courseData, setCourseData] = useState<CourseDetailEntity>();

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

  const handleGetQuestionDetail = async (questionId: string) => {
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
      console.log(error);
    }
  };

  const [codeQuestionId, setCodeQuestionId] = useState<string | undefined>(undefined);
  const params = useParams<{
    questionId: string;
    categoryId: string;
    courseId: string;
    examId: string;
  }>();
  const courseId = params.courseId ?? locationCourseId;
  const examId = params.examId ?? locationExamId;
  useEffect(() => {
    const fetchQuestionDetail = async () => {
      if (params.questionId) {
        const res = await handleGetQuestionDetail(params.questionId);
        if (res) {
          setCodeQuestionId(res.questionResponses[0].qtypeCodeQuestion.id);
        }
      }
    };
    fetchQuestionDetail();
  }, [params.questionId]);

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
  // const { pathname } = useLocation();
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

          let programmingLanguage = data[2].map((value) => ({ ...value, choosen: false }));

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
          setProgrammingLanguage(data[1].map((value) => ({ ...value, choosen: false })));
          setTags(data[0]);
        }
      } catch (err) {
        dispatch(setErrorMess(t("common_page_can_not_open")));
        if (isLecturerCreateQuestionBank)
          navigate(
            routes.lecturer.question_bank.detail.replace(":categoryId", params.categoryId ?? "")
          );
        else if (isQuestionBank)
          navigate(
            routes.lecturer.question_bank.detail.replace(":categoryId", params.categoryId ?? "")
          );
        else if (isCreateExam === true)
          navigate(routes.lecturer.exam.create.replace(":courseId", courseId ?? ""));
        else
          navigate(
            routes.lecturer.exam.edit
              .replace(":courseId", courseId ?? "")
              .replace(":examId", examId ?? "")
          );
      } finally {
        dispatch(setLoading(false));
      }
    };
    handleFetchData();
  }, [
    codeQuestionId,
    courseId,
    dispatch,
    examId,
    isCreateExam,
    isEdit,
    isLecturerCreateQuestionBank,
    isQuestionBank,
    navigate,
    params.categoryId,
    t
  ]);

  const handleChange = (_: React.SyntheticEvent, newTab: string) => {
    setActiveTab(newTab);
  };

  const [activeTab, setActiveTab] = useState("0");

  const getQuestionByQuestionId = async (questionId: string) => {
    try {
      const response = await QuestionService.getQuestionsByQuestionId(questionId);
      dispatch(setQuestionCreate(response));
    } catch (error) {
      console.log(error);
    }
  };

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const onSubmit = async (data: CodeQuestionFormData) => {
    setLoadingSubmit(true);
    try {
      if (isEdit && isCloneData !== true) {
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
        const isDirtyTags: boolean | boolean[] | undefined = dirtyFields.tags;
        const isDirtyLanguages = dirtyFields.programmingLanguages?.some((value) =>
          Object.values(value).some((val) => val === true)
        );
        const isDirtyTestCase =
          dirtyFields.testCases?.some((value) =>
            Object.values(value).some((val) => val === true)
          ) ||
          (codeQuestion !== undefined &&
            codeQuestion.testCases !== undefined &&
            data.testCases.length < codeQuestion.testCases.length); //remove does not make dirty field dirty

        setLoadingSubmit(true);

        let updateInform: Promise<any> | undefined = undefined;
        if ((isDirtyInform || isDirtyTags) && codeQuestionId !== undefined) {
          let dataTagMap = new Set<string>();
          data.tags.forEach((value) => dataTagMap.add(value));
          let deleteTagIds = codeQuestion?.tags.filter((value) => !dataTagMap.has(value));
          updateInform = CodeQuestionService.updateCodeQuestion(codeQuestionId, {
            categoryBankId: isQuestionBank ? params.categoryId : undefined,
            name: data.name,
            difficulty: data.difficulty,
            problemStatement: data.problemStatement,
            inputFormat: data.inputFormat,
            outputFormat: data.outputFormat,
            constraints: data.constraints,
            maxGrade: data.maxGrade,
            isPublic: data.isPublic,
            allowImport: data.allowImport,
            newTagIds: data.tags ?? [],
            deletedTagIds: deleteTagIds ?? [],
            isQuestionBank: false
          });
        }

        let updateTestCases: Promise<any> | undefined = undefined;
        let dirtyTC = dirtyFields?.testCases;

        if (isDirtyTestCase && codeQuestion !== undefined) {
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
        let updateLanguages: Promise<any> | undefined = undefined;

        if (isDirtyLanguages && codeQuestion !== undefined) {
          let updatedLanguages = data.programmingLanguages
            .filter((value) => value.choosen)
            .map((value) => ({
              id: value.id,
              timeLimit: value.timeLimit,
              memoryLimit: value.memoryLimit,
              bodyCode: value.bodyCode ?? ""
            }));
          let deletedLangaugeIds = data.programmingLanguages
            .filter((value) => !value.choosen)
            .map((value) => value.id);
          updateLanguages = CodeQuestionService.updateProgrammingLanguageOfCodeQuestion(
            codeQuestion.id,
            {
              updatedLanguages,
              deletedLangaugeIds
            }
          );
        }

        await Promise.all([updateInform, updateTestCases, updateLanguages]);
        if (!isLecturerCreateQuestionBank && !isQuestionBank) {
          dispatch(
            updateQuestionCreate({
              id: params.questionId ?? "",
              name: data.name,
              description: data.problemStatement,
              maxScore: data.maxGrade
            })
          );
        }
      } else {
        const res = await CoreCodeQuestionService.createCodeQuestionInCore({
          organizationId: loggedUser?.organization.organizationId,
          createdBy: loggedUser?.userId,
          updatedBy: loggedUser?.userId,
          difficulty: data.difficulty,
          name: data.name,
          questionText: data.problemStatement,
          generalFeedback: "",
          defaultMark: data.maxGrade,
          qType: QuestionTypeEnum.CODE,
          dslTemplate: "",
          questionBankCategoryId: isQuestionBank ? params.categoryId : undefined,
          inputFormat: data.inputFormat,
          outputFormat: data.outputFormat,
          constraint: data.constraints,
          isPublic: data.isPublic,
          allowImport: data.allowImport
        });
        if (res) {
          getQuestionByQuestionId(res.questionId ?? "");
        }
      }
    } catch (err) {
      console.error(err);
      dispatch(setErrorMess(t("common_can_not_save")));
    } finally {
      setLoadingSubmit(false);
      dispatch(setSuccessMess(t(isEdit ? "common_update_success" : "common_create_success")));

      if (isLecturerCreateQuestionBank)
        navigate(
          routes.lecturer.question_bank.detail.replace(":categoryId", params.categoryId ?? "")
        );
      else if (isQuestionBank)
        navigate(
          routes.lecturer.question_bank.detail.replace(":categoryId", params.categoryId ?? "")
        );
      else if (isCreateExam === true)
        navigate(routes.lecturer.exam.create.replace(":courseId", courseId ?? ""));
      else
        navigate(
          routes.lecturer.exam.edit
            .replace(":courseId", courseId ?? "")
            .replace(":examId", examId ?? "")
        );
    }
  };

  const getCouseData = async (courseId: string) => {
    try {
      const response = await CourseService.getCourseDetail(courseId);
      setCourseData(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (courseId) getCouseData(courseId);
    };

    fetchData();
  }, [courseId]);

  const breadCrumbData = isQuestionBank
    ? [
        {
          navLink: routes.lecturer.question_bank.path,
          label: i18next.format(t("common_question_bank"), "firstUppercase")
        },
        {
          navLink: `/lecturer/question-bank-management/${params["categoryId"]}`,
          label: categoryName
        }
      ]
    : isCreateExam === true
      ? [
          {
            navLink: routes.lecturer.course.management,
            label: t("common_course_management")
          },
          {
            navLink: routes.lecturer.course.information.replace(":courseId", courseId ?? ""),
            label: courseData?.name
          },
          {
            navLink: routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""),
            label: t("common_type_assignment")
          },
          {
            navLink: routes.lecturer.exam.create.replace(":courseId", courseId ?? ""),
            label: t("course_lecturer_assignment_create_exam")
          }
        ]
      : [
          {
            navLink: routes.lecturer.course.management,
            label: t("common_course_management")
          },
          {
            navLink: routes.lecturer.course.information.replace(":courseId", courseId ?? ""),
            label: courseData?.name
          },
          {
            navLink: routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""),
            label: t("common_type_assignment")
          },
          {
            navLink: routes.lecturer.exam.edit
              .replace(":courseId", courseId ?? "")
              .replace(":examId", examId ?? ""),
            label: t("course_lecturer_assignment_edit_exam")
          }
        ];
  return (
    <Grid className={classes.root}>
      <Header />
      <Container style={{ marginTop: `${headerHeight}px` }} className={classes.container}>
        <FormProvider {...codeQuestionFormMethod}>
          <form onSubmit={codeQuestionFormMethod.handleSubmit(onSubmit)}>
            <Box>
              <Box className={classes.body}>
                <CustomBreadCrumb
                  breadCrumbData={breadCrumbData}
                  lastBreadCrumbLabel={t("create_question_code")}
                />
                {isEdit && isCloneData !== true && (
                  <Heading1 fontWeight={"500"}>{codeQuestion?.name ?? "name"}</Heading1>
                )}
                <TabContext value={activeTab}>
                  {isEdit === true && (
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
                  )}

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
                <Button
                  btnType={BtnType.Primary}
                  type='submit'
                  translation-key='common_save_changes'
                >
                  {loadingSubmit ? <CircularProgress size={20} /> : t("common_save_changes")}
                </Button>
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Container>
    </Grid>
  );
};

export default LecturerCodeQuestionDetails;
