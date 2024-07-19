import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  Box,
  Card,
  Checkbox,
  CssBaseline,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  Toolbar
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { GridActionsCellItem } from "@mui/x-data-grid/components/cell/GridActionsCellItem";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import Header from "components/Header";
import CustomDataGrid from "components/common/CustomDataGrid";
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import MenuPopup from "components/common/menu/MenuPopup";
import BasicSelect from "components/common/select/BasicSelect";
import PreviewEssay from "components/dialog/preview/PreviewEssay";
import PreviewMultipleChoice from "components/dialog/preview/PreviewMultipleChoice";
import PreviewShortAnswer from "components/dialog/preview/PreviewShortAnswer";
import PreviewTrueFalse from "components/dialog/preview/PreviewTrueFalse";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import ParagraphSmall from "components/text/ParagraphSmall";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import useWindowDimensions from "hooks/useWindowDimensions";
import QuestionsFeatureBar from "./components/FeatureBar";
import PickQuestionFromQuestionBankDialog from "./components/PickQuestionFromQuestionBankDialog";
import PickQuestionTypeToAddDialog from "./components/PickQuestionTypeToAddDialog";
import classes from "./styles.module.scss";
import { GridRowParams } from "@mui/x-data-grid";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import { ExamCreateRequest, ExamEntity } from "models/courseService/entity/ExamEntity";
import { ExamService } from "services/courseService/ExamService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import {
  QuestionClone,
  QuestionCloneRequest,
  QuestionEntity
} from "models/coreService/entity/QuestionEntity";
import moment from "moment";
import {
  clearExamCreate,
  clearQuestionCreate,
  deleteQuestionCreate,
  setQuestionCreateFromBank
} from "reduxes/coreService/questionCreate";
import { QuestionTypeEnum } from "models/coreService/enum/QuestionTypeEnum";
import { setCategories } from "reduxes/courseService/questionBankCategory";
import { QuestionBankCategoryService } from "services/courseService/QuestionBankCategoryService";
import { QuestionService } from "services/coreService/QuestionService";
import { OrganizationEntity } from "models/coreService/entity/OrganizationEntity";
import { AnswerOfQuestion } from "models/coreService/entity/AnswerOfQuestionEntity";
import { UserEntity } from "models/coreService/entity/UserEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { useEffect, useState } from "react";
import qtype from "utils/constant/Qtype";
import PreviewCodeQuestion from "components/dialog/preview/PreviewCodeQuestion";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CourseService } from "services/courseService/CourseService";
import { CourseDetailEntity } from "models/courseService/entity/detail/CourseDetailEntity";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import { setSuccessMess } from "reduxes/AppStatus";
import CustomBreadCrumb from "components/common/Breadcrumb";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import { SectionService } from "services/courseService/SectionService";
import { SectionEntity } from "models/courseService/entity/SectionEntity";

const drawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  width: `calc(100% - ${drawerWidth}px)`,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  }),
  /**
   * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
   * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
   * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
   * proper interaction with the underlying content.
   */
  position: "relative"
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start"
}));

export const OVERDUE_HANDLING = {
  AUTOSUBMIT: "AUTOSUBMIT",
  GRACEPERIOD: "GRACEPERIOD",
  AUTOABANDON: "AUTOABANDON"
};

interface FormData {
  name: string;
  intro: string;
  maxScore: number;
  timeOpen: Date;
  timeClose: Date;
  timeLimit: number;
  timeLimitUnit: string;
  overdueHandling: string;
  maxAttempts: string;
  sectionId: string;
}

export default function ExamEdit() {
  const { courseId } = useParams();
  const { examId } = useParams<{ examId: string }>();
  const questionCreate = useSelector((state: RootState) => state.questionCreate);
  const questionBankCategoriesState = useSelector((state: RootState) => state.questionBankCategory);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [examTimeLimitUnit, setExamTimeLimitUnit] = React.useState("seconds");
  const [examTimeLimitEnabled, setExamTimeLimitEnabled] = React.useState(true);
  const [isAddNewQuestionDialogOpen, setIsAddNewQuestionDialogOpen] = React.useState(false);
  const [isAddQuestionFromBankDialogOpen, setIsAddQuestionFromBankDialogOpen] =
    React.useState(false);
  const [questionType, setQuestionType] = React.useState("essay");
  const [loading, setLoading] = React.useState(false);
  const [assignmentAvailability, setAssignmentAvailability] = React.useState("0");
  const [openPreviewMultipleChoiceDialog, setOpenPreviewMultipleChoiceDialog] =
    React.useState(false);
  const [openPreviewEssay, setOpenPreviewEssay] = React.useState(false);
  const [openPreviewShortAnswer, setOpenPreviewShortAnswer] = React.useState(false);
  const [questionPreview, setQuestionPreview] = React.useState<QuestionEntity>();
  const [openPreviewTrueFalse, setOpenPreviewTrueFalse] = React.useState(false);
  const [openPreviewCodeQuestion, setOpenPreviewCodeQuestion] = React.useState(false);
  const [previewQuestionId, setPreviewQuestionId] = React.useState<string>("");
  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);
  const header2Ref = React.useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({
    ref: header2Ref
  });
  const [submitCount, setSubmitCount] = useState(0);
  const [courseData, setCourseData] = useState<CourseDetailEntity>();
  const [exam, setExam] = useState<ExamEntity>();
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedQuestionId, setDeletedQuestionId] = useState<string>("");
  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const [sections, setSections] = useState<SectionEntity[]>([]);

  const tableHeading: GridColDef[] = React.useMemo(
    () => [
      { field: "id", headerName: "STT", minWidth: 1 },
      {
        field: "name",
        headerName: t("exam_management_create_question_name"),
        flex: 0.7,
        minWidth: 150
      },
      {
        field: "questionText",
        headerName: t("exam_management_create_question_description"),
        renderCell: (params) => (
          <Box
            height={"100%"}
            overflow={"auto"}
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
          >
            <ReactQuill value={params.value ?? ""} readOnly={true} theme={"bubble"} />
          </Box>
        ),
        flex: 2,
        minWidth: 300
      },
      {
        field: "defaultMark",
        headerName: t("assignment_management_max_score"),
        minWidth: 50
      },
      {
        field: "qtypeText",
        headerName: t("exam_management_create_question_type"),
        flex: 2,
        minWidth: 150
        // renderCell: (params) => <ParagraphBody>{params.value.label}</ParagraphBody>
      },
      {
        field: "action",
        headerName: t("common_action"),
        type: "actions",
        flex: 2,
        minWidth: 150,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            onClick={() => {
              let navigateString = "";

              if (params.row.qtype === qtype.essay.code) {
                navigateString = routes.lecturer.exam.edit_essay_question;
              } else if (params.row.qtype === qtype.multiple_choice.code) {
                navigateString = routes.lecturer.exam.edit_multi_question;
              } else if (params.row.qtype === qtype.short_answer.code) {
                navigateString = routes.lecturer.exam.edit_short_question;
              } else if (params.row.qtype === qtype.true_false.code) {
                navigateString = routes.lecturer.exam.edit_true_false_question;
              } else if (params.row.qtype === qtype.source_code.code) {
                navigateString = routes.lecturer.exam.edit_code_question;
              }

              navigate(
                `${navigateString
                  .replace(":courseId", courseId ?? "")
                  .replace(":examId", examId ?? "")
                  .replace(":questionId", params.row.id ?? "")}`,
                {
                  state: { isLecturerEditQuestion: true }
                }
              );
            }}
          />,
          <GridActionsCellItem
            onClick={() => {
              setPreviewQuestionId(params.row.id);
              switch (params.row.qtype) {
                case qtype.multiple_choice.code:
                  setOpenPreviewMultipleChoiceDialog(!openPreviewMultipleChoiceDialog);
                  break;
                case qtype.essay.code:
                  setOpenPreviewEssay(!openPreviewEssay);
                  break;
                case qtype.short_answer.code:
                  setQuestionPreview(params.row);
                  setOpenPreviewShortAnswer(!openPreviewShortAnswer);
                  break;
                case qtype.true_false.code:
                  setOpenPreviewTrueFalse(!openPreviewTrueFalse);
                  break;
                case qtype.source_code.code:
                  setOpenPreviewCodeQuestion(!openPreviewCodeQuestion);
                  break;
              }
            }}
            icon={<PreviewIcon />}
            label='Preview'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={() => {
              setDeletedQuestionId(params.row.id);
              setIsOpenConfirmDelete(true);
            }}
          />
        ]
      }
    ],
    [
      openPreviewEssay,
      openPreviewMultipleChoiceDialog,
      openPreviewShortAnswer,
      openPreviewTrueFalse,
      openPreviewCodeQuestion,
      t
    ]
  );

  const handleGetExamById = async (examId: string) => {
    try {
      const response = await ExamService.getExamById(examId);
      setExam(response);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    if (examId) {
      handleGetExamById(examId);
      handleGetExamQuestionById(examId);
    }
  }, [examId]);

  useEffect(() => {
    const fetchData = async () => {
      getCouseData(courseId ?? "");
      getSection(courseId ?? "");
    };

    fetchData();
  }, [courseId]);

  useEffect(() => {
    if (width < 1080) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

  const getSection = async (courseId: string) => {
    try {
      const response = await SectionService.getSectionsByCourseId(courseId);
      setSections(response.sections);
    } catch (error) {
      console.log(error);
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

  const submitHandler = async (data: any) => {
    setLoading(true);
    const questionIds = questionCreate.questionCreate.map((item) => ({
      questionId: item.id,
      page: 0
    }));

    const formSubmitData: FormData = { ...data };
    const timeLimitUnit = formSubmitData.timeLimit;

    const timeLimit = (() => {
      switch (formSubmitData.timeLimitUnit) {
        case "weeks":
          return formSubmitData.timeLimit * 604800;
        case "days":
          return formSubmitData.timeLimit * 86400;
        case "hours":
          return formSubmitData.timeLimit * 3600;
        case "minutes":
          return formSubmitData.timeLimit * 60;
        case "seconds":
          return formSubmitData.timeLimit;
        default:
          return 0;
      }
    })();

    const newExam: ExamCreateRequest = {
      courseId: courseId ?? "",
      name: formSubmitData.name,
      intro: formSubmitData.intro,
      score: formSubmitData.maxScore,
      maxScore: formSubmitData.maxScore,
      timeOpen: new Date(formSubmitData.timeOpen),
      timeClose: new Date(formSubmitData.timeClose),
      timeLimit: timeLimit,
      timeLimitUnit: timeLimitUnit,
      unit: formSubmitData.timeLimitUnit,
      overdueHandling: formSubmitData.overdueHandling,
      canRedoQuestions: true,
      maxAttempts: Number(formSubmitData.maxAttempts),
      shuffleQuestions: questionCreate.shuffleQuestions,
      gradeMethod: "QUIZ_GRADEHIGHEST",
      questionIds: questionIds,
      sectionId: formSubmitData.sectionId
    };

    ExamService.editExam(examId ?? "", newExam)
      .then((response) => {
        console.log(response);
        dispatch(clearQuestionCreate());
        dispatch(clearExamCreate());
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        navigate(routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""));
      });
  };

  const handleGetExamQuestionById = async (id: string) => {
    try {
      const response = await ExamService.getExamQuestionById(id, null);
      dispatch(setQuestionCreateFromBank(response.questions));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetQuestionBankCategories = async ({
    search = "",
    pageNo = 0,
    pageSize = 99
  }: {
    search?: string;
    pageNo?: number;
    pageSize?: number;
  }) => {
    try {
      const getQuestionBankCategoryResponse =
        await QuestionBankCategoryService.getQuestionBankCategories({
          search,
          pageNo,
          pageSize
        });
      dispatch(setCategories(getQuestionBankCategoryResponse));
    } catch (error) {
      console.log(error);
    }
  };

  const rowSelectionHandler = () => {};
  const pageChangeHandler = (model: GridPaginationModel) => {
    console.log(model);
  };

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenAddNewQuestionDialog = () => {
    setIsAddNewQuestionDialogOpen(true);
  };

  const handleCloseAddNewQuestionDialog = () => {
    setIsAddNewQuestionDialogOpen(false);
  };

  const handleOpenAddQuestionFromBankDialog = () => {
    handleGetQuestionBankCategories({});
    setIsAddQuestionFromBankDialogOpen(true);
  };

  const handleCloseAddQuestionFromBankDialog = () => {
    setIsAddQuestionFromBankDialogOpen(false);
  };

  const handleComfirmQuestionFromBankDialog = async (questionIds: QuestionClone[]) => {
    const questions: QuestionCloneRequest = {
      questions: questionIds
    };
    const response = await QuestionService.cloneQuestionByIdIn(questions);

    const questionCreate: QuestionEntity[] = response.questions.map(
      (item: {
        id: string;
        organization: OrganizationEntity;
        difficulty: QuestionDifficultyEnum;
        name: string;
        questionText: string;
        generalFeedback: string;
        defaultMark: number;
        pass?: boolean;
        createdBy: UserEntity;
        updatedBy: UserEntity;
        qtype: QuestionTypeEnum;
        answers: AnswerOfQuestion[];
        createdAt: Date;
        updatedAt: Date;
      }) => ({
        id: item.id,
        organization: item.organization,
        difficulty: item.difficulty,
        name: item.name,
        questionText: item.questionText,
        generalFeedback: item.generalFeedback,
        defaultMark: item.defaultMark,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        qtype: item.qtype,
        answers: item.answers,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })
    );

    dispatch(setQuestionCreateFromBank(questionCreate));
    handleCloseAddQuestionFromBankDialog();
  };

  const onCreateNewQuestion = async (popupState: any) => {
    handleOpenAddNewQuestionDialog();
    popupState.close();
  };

  const onAddQuestionFromBank = async (popupState: any) => {
    handleOpenAddQuestionFromBankDialog();
    popupState.close();
  };

  const handleChangeQuestionType = (value: string) => {
    setQuestionType(value);
  };

  const onClickConfirmAddNewQuestion = () => {
    switch (questionType) {
      case "essay":
        navigate(routes.lecturer.question.essay.create, { state: { courseId: courseId } });
        break;
      case "multiple-choice":
        navigate(routes.lecturer.question.multiple_choice.create, {
          state: { courseId: courseId }
        });
        break;
      case "short-answer":
        navigate(routes.lecturer.question.short_answer.create, { state: { courseId: courseId } });
        break;
      case "true-false":
        navigate(routes.lecturer.question.true_false.create, { state: { courseId: courseId } });
        break;
      case "code":
        navigate(routes.lecturer.question.code.create, {
          state: { courseId: courseId, isCreateExam: false, examId: examId }
        });
        break;
      default:
        break;
    }
    handleCloseAddNewQuestionDialog();
  };

  const schema = React.useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t("exam_name_required")),
      intro: yup.string().required(t("exam_description_required")),
      maxScore: yup
        .number()
        .required(t("exam_max_score_required"))
        .min(1, t("exam_max_score_invalid")),
      timeOpen: yup.date().required(t("exam_time_open_required")),
      timeClose: yup.date().required(t("exam_time_close_required")),
      timeLimit: yup.number().required(t("exam_time_limit_required")),
      timeLimitUnit: yup.string().required(t("exam_time_limit_unit_required")),
      overdueHandling: yup.string().required(t("exam_overdue_handling_required")),
      maxAttempts: yup.string().required("exam_max_attempt_invalid"),
      sectionId: yup.string().required("exam_section_required")
    });
  }, [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      intro: "",
      maxScore: 0,
      timeOpen: new Date(),
      timeClose: new Date(),
      timeLimit: 0,
      timeLimitUnit: "minutes",
      overdueHandling: OVERDUE_HANDLING.AUTOSUBMIT,
      maxAttempts: "0",
      sectionId: ""
    }
  });

  useEffect(() => {
    if (exam) {
      reset({
        name: exam.name,
        intro: exam.intro,
        maxScore: exam.maxScores,
        timeOpen: new Date(exam.timeOpen),
        timeClose: new Date(exam.timeClose),
        timeLimit: exam.timeLimitUnit,
        timeLimitUnit: exam.unit,
        overdueHandling: exam.overdueHanding,
        maxAttempts: exam.maxAttempts?.toString() ?? "0",
        sectionId: exam.sectionId ?? ""
      });
    }
  }, [exam, reset]);

  return (
    <>
      <PickQuestionTypeToAddDialog
        open={isAddNewQuestionDialogOpen}
        handleClose={handleCloseAddNewQuestionDialog}
        title={t("exam_management_create_new_question")}
        cancelText={t("common_cancel")}
        confirmText={t("common_add")}
        onHanldeConfirm={onClickConfirmAddNewQuestion}
        onHandleCancel={handleCloseAddNewQuestionDialog}
        questionType={questionType}
        handleChangeQuestionType={handleChangeQuestionType}
        translation-key={["exam_management_create_new_question", "common_cancel", "common_add"]}
      />
      {openPreviewMultipleChoiceDialog && (
        <PreviewMultipleChoice
          questionId={previewQuestionId}
          open={openPreviewMultipleChoiceDialog}
          setOpen={setOpenPreviewMultipleChoiceDialog}
          aria-labelledby={"customized-dialog-title1"}
          maxWidth='md'
          fullWidth
        />
      )}
      {openPreviewEssay && (
        <PreviewEssay
          questionId={previewQuestionId}
          open={openPreviewEssay}
          setOpen={setOpenPreviewEssay}
          aria-labelledby={"customized-dialog-title2"}
          maxWidth='md'
          fullWidth
        />
      )}
      {openPreviewShortAnswer && (
        <PreviewShortAnswer
          open={openPreviewShortAnswer}
          questionId={previewQuestionId}
          setOpen={setOpenPreviewShortAnswer}
          aria-labelledby={"customized-dialog-title3"}
          maxWidth='md'
          fullWidth
        />
      )}
      {openPreviewTrueFalse && (
        <PreviewTrueFalse
          questionId={previewQuestionId}
          open={openPreviewTrueFalse}
          setOpen={setOpenPreviewTrueFalse}
          aria-labelledby={"customized-dialog-title4"}
          maxWidth='md'
          fullWidth
        />
      )}
      {openPreviewCodeQuestion && (
        <PreviewCodeQuestion
          questionId={previewQuestionId}
          open={openPreviewCodeQuestion}
          setOpen={setOpenPreviewCodeQuestion}
          aria-labelledby={"customized-dialog-title5"}
          maxWidth='md'
          fullWidth
        />
      )}

      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this question from exam?'
        onCancel={onCancelConfirmDelete}
        onDelete={async () => {
          dispatch(deleteQuestionCreate(deletedQuestionId));
          setIsOpenConfirmDelete(false);
          dispatch(setSuccessMess("Delete question successfully"));
        }}
      />

      <PickQuestionFromQuestionBankDialog
        open={isAddQuestionFromBankDialogOpen}
        handleClose={handleCloseAddQuestionFromBankDialog}
        title={t("exam_management_create_from_bank")}
        cancelText={t("common_cancel")}
        confirmText={t("common_add")}
        onHanldeConfirm={handleComfirmQuestionFromBankDialog}
        onHandleCancel={handleCloseAddQuestionFromBankDialog}
        categoryPickTitle={t("exam_management_create_from_bank_choose_topic")}
        categoryList={questionBankCategoriesState.categories.questionBankCategories.map(
          (item, index) => ({
            value: item.id,
            label: item.name
          })
        )}
        translation-key={[
          "exam_management_create_from_bank",
          "common_cancel",
          "common_add",
          "exam_management_create_from_bank_choose_topic"
        ]}
      />

      <form onSubmit={handleSubmit(submitHandler, () => setSubmitCount((count) => count + 1))}>
        <Grid className={classes.root}>
          <Header />
          <Box
            className={classes.container}
            sx={{
              marginTop: `${sidebarStatus.headerHeight}px`
            }}
          >
            <CssBaseline />
            <AppBar
              position='fixed'
              sx={{
                top: `${sidebarStatus.headerHeight + 1}px`,
                backgroundColor: "white",
                boxShadow: "0px 2px 4px #00000026"
              }}
              ref={header2Ref}
              open={open}
            >
              <Toolbar>
                <CustomBreadCrumb
                  breadCrumbData={[
                    {
                      label: t("common_course_management"),
                      navLink: routes.lecturer.course.management
                    },
                    {
                      label: courseData?.name ?? "",
                      navLink: routes.lecturer.course.information.replace(
                        ":courseId",
                        courseId ?? ""
                      )
                    },
                    {
                      label: t("course_detail_assignment_list"),
                      navLink: routes.lecturer.course.assignment.replace(
                        ":courseId",
                        courseId ?? ""
                      )
                    }
                  ]}
                  lastBreadCrumbLabel={t("course_lecturer_assignment_edit_exam")}
                />

                <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  edge='end'
                  onClick={handleDrawerOpen}
                  sx={{ ...(open && { display: "none" }) }}
                >
                  <MenuIcon color='action' />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Main
              open={open}
              className={classes.mainContent}
              sx={{
                height: `calc(100% - ${header2Height}px)`,
                marginTop: `${header2Height}px`
              }}
            >
              <Card>
                <Box component='form' className={classes.formBody} autoComplete='off'>
                  <Heading1
                    fontWeight={"500"}
                    translation-key='course_lecturer_assignment_edit_exam'
                  >
                    {t("course_lecturer_assignment_edit_exam")}
                  </Heading1>
                  <Controller
                    control={control}
                    name='name'
                    rules={{ required: t("exam_name_required") }}
                    render={({ field }) => (
                      <InputTextFieldColumn
                        type='text'
                        title={t("common_exam_name")}
                        titleRequired={true}
                        useDefaultTitleStyle
                        error={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("exam_management_create_enter_exam_name")}
                        backgroundColor='white'
                        translation-key={[
                          "common_exam_name",
                          "exam_management_create_enter_exam_name"
                        ]}
                      />
                    )}
                  />
                  <Grid item xs={3} className={classes.textEditor}>
                    <TitleWithInfoTip
                      title={t("common_exam_description")}
                      titleRequired
                      fontSize='12px'
                      color='var(--gray-60)'
                      gutterBottom
                      fontWeight='600'
                    />
                    <Controller
                      control={control}
                      name='intro'
                      rules={{ required: t("exam_description_required") }}
                      render={({ field }) => (
                        <TextEditor
                          openDialog
                          type='text'
                          title={t("common_exam_description")}
                          roundedBorder={true}
                          required
                          error={Boolean(errors.intro)}
                          errorMessage={errors.intro?.message}
                          placeholder={t("common_exam_description")}
                          backgroundColor='white'
                          translation-key={["common_exam_description"]}
                          tooltipDescription={t("question_default_score_description")}
                          {...field}
                          submitCount={submitCount}
                        />
                      )}
                    />
                  </Grid>
                  <MenuPopup
                    style={{
                      marginTop: "20px"
                    }}
                    popupId='add-question-popup'
                    triggerButtonText={t("common_add_question")}
                    triggerButtonProps={{
                      width: "150px"
                    }}
                    btnType={BtnType.Outlined}
                    menuItems={[
                      {
                        label: t("exam_management_create_new_question"),
                        onClick: onCreateNewQuestion
                      },
                      {
                        label: t("exam_management_create_from_bank"),
                        onClick: onAddQuestionFromBank
                      }
                    ]}
                    translation-key={[
                      "common_add_question",
                      "exam_management_create_new_question",
                      "exam_management_create_from_bank"
                    ]}
                  />
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Heading1
                        fontWeight={"500"}
                        translation-key='exam_management_create_question_list'
                      >
                        {t("exam_management_create_question_list")}
                      </Heading1>
                    </Grid>
                    <Grid item xs={12}>
                      <QuestionsFeatureBar
                        // colSearchLabel='Tìm kiếm theo cột'
                        shuffleQuestionsLabel={t("exam_management_create_question_scramble")}
                        // colItems={[
                        //   { label: "Tên câu hỏi", value: "name" },
                        //   { label: "Kiểu", value: "type" }
                        // ]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomDataGrid
                        dataList={questionCreate.questionCreate
                          .filter((item) =>
                            item.name
                              .toLowerCase()
                              .includes(questionCreate.searchQuestion.toLowerCase())
                          )
                          .map((item, index) => ({
                            stt: item.id,
                            qtypeText:
                              item.qtype === QuestionTypeEnum.SHORT_ANSWER
                                ? "câu hỏi ngắn"
                                : item.qtype === QuestionTypeEnum.MULTIPLE_CHOICE
                                  ? "câu hỏi trắc nghiệm"
                                  : item.qtype === QuestionTypeEnum.ESSAY
                                    ? "câu hỏi tự luận"
                                    : item.qtype === QuestionTypeEnum.TRUE_FALSE
                                      ? "câu hỏi đúng/sai"
                                      : item.qtype === QuestionTypeEnum.CODE
                                        ? "câu hỏi code"
                                        : "",
                            ...item
                          }))}
                        tableHeader={tableHeading}
                        onSelectData={rowSelectionHandler}
                        visibleColumn={visibleColumnList}
                        dataGridToolBar={dataGridToolbar}
                        page={1}
                        pageSize={10}
                        totalElement={questionCreate.questionCreate.length}
                        onPaginationModelChange={pageChangeHandler}
                        showVerticalCellBorder={false}
                        onClickRow={rowClickHandler}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Main>
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  position: "fixed",
                  height: `calc(100% - ${sidebarStatus.headerHeight + 1}px)`,
                  top: `${sidebarStatus.headerHeight + 1}px`
                }
              }}
              variant='persistent'
              anchor='right'
              open={open}
            >
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <Box className={classes.drawerBody}>
                <Box className={classes.drawerFieldContainer}>
                  <Controller
                    defaultValue={questionCreate.maxScore}
                    control={control}
                    name='maxScore'
                    rules={{ required: t("exam_max_score_required") }}
                    render={({ field }) => (
                      <InputTextFieldColumn
                        type='number'
                        title={t("assignment_management_max_score")}
                        titleRequired={true}
                        useDefaultTitleStyle
                        error={Boolean(errors.maxScore)}
                        errorMessage={errors.maxScore?.message}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("exam_management_create_enter_score")}
                        backgroundColor='#FBFCFE'
                        translation-key={[
                          "assignment_management_max_score",
                          "exam_management_create_enter_score"
                        ]}
                      />
                    )}
                  />
                </Box>
                <Box className={classes.drawerFieldContainer}>
                  <TitleWithInfoTip
                    title={t("course_assignment_detail_open_time")}
                    titleRequired
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                  />
                  <Controller
                    defaultValue={new Date()}
                    control={control}
                    name='timeOpen'
                    rules={{ required: t("exam_time_open_required") }}
                    render={({ field }) => (
                      <CustomDateTimePicker
                        value={moment(field.value)}
                        onHandleValueChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                      />
                    )}
                  />
                </Box>
                <Box className={classes.drawerFieldContainer}>
                  <TitleWithInfoTip
                    title={t("course_assignment_detail_close_time")}
                    titleRequired
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                  />
                  <Controller
                    defaultValue={new Date()}
                    control={control}
                    name='timeClose'
                    rules={{ required: t("exam_time_close_required") }}
                    render={({ field }) => (
                      <CustomDateTimePicker
                        value={moment(field.value)}
                        onHandleValueChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                      />
                    )}
                  />
                </Box>
                <Box className={classes.drawerFieldContainer}>
                  <Grid container spacing={1} gap={1} columns={12}>
                    <Grid item xs={4}>
                      <Controller
                        defaultValue={0}
                        control={control}
                        name='timeLimit'
                        rules={{ required: t("exam_time_limit_required") }}
                        render={({ field }) => (
                          <InputTextFieldColumn
                            disabled={!examTimeLimitEnabled}
                            type='number'
                            title={t("common_do_time")}
                            useDefaultTitleStyle
                            error={Boolean(errors.timeLimit)}
                            errorMessage={errors.timeLimit?.message}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("common_do_time")}
                            backgroundColor='#FBFCFE'
                            translation-key={["common_do_time"]}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TitleWithInfoTip
                        title={"Đơn vị"}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
                      />
                      <Controller
                        defaultValue='minutes'
                        control={control}
                        name='timeLimitUnit'
                        render={({ field: { value, onChange } }) => (
                          <BasicSelect
                            disabled={!examTimeLimitEnabled}
                            labelId='select-exam-time-limit-unit-label'
                            value={value}
                            onHandleChange={(value) => onChange(value)}
                            items={[
                              {
                                value: "weeks",
                                label: t("contest_detail_feature_week")
                              },
                              {
                                value: "days",
                                label: t("contest_detail_feature_day")
                              },
                              {
                                value: "hours",
                                label: t("contest_detail_feature_hour")
                              },
                              {
                                value: "minutes",
                                label: t("contest_detail_feature_minute")
                              },
                              {
                                value: "seconds",
                                label: t("contest_detail_feature_second")
                              }
                            ]}
                            backgroundColor='#FBFCFE'
                            translation-key={[
                              "contest_detail_feature_week",
                              "contest_detail_feature_day",
                              "contest_detail_feature_hour",
                              "contest_detail_feature_minute",
                              "contest_detail_feature_second"
                            ]}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormControlLabel
                        style={{ marginTop: "7px" }}
                        control={
                          <Checkbox
                            checked={examTimeLimitEnabled}
                            onChange={(e) => setExamTimeLimitEnabled(e.target.checked)}
                          />
                        }
                        label={t("common_turn_on")}
                        translation-key='common_turn_on'
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className={classes.drawerFieldContainer}>
                  <TitleWithInfoTip
                    title={t("exam_management_create_when_time_end")}
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                    titleRequired
                  />
                  <Controller
                    defaultValue={OVERDUE_HANDLING.AUTOSUBMIT.toString()}
                    control={control}
                    name='overdueHandling'
                    rules={{ required: t("exam_overdue_handling_required") }}
                    render={({ field: { value, onChange } }) => (
                      <BasicSelect
                        labelId='select-assignment-overdue-handling-label'
                        value={value}
                        onHandleChange={(value) => onChange(value)}
                        items={[
                          {
                            value: OVERDUE_HANDLING.AUTOSUBMIT,
                            label: t("exam_management_create_when_time_end_auto")
                          },
                          {
                            value: OVERDUE_HANDLING.AUTOABANDON,
                            label: t("exam_management_create_when_time_end_delete")
                          }
                        ]}
                        backgroundColor='#FBFCFE'
                        translation-key={[
                          "exam_management_create_when_time_end_auto",
                          "exam_management_create_when_time_end_delete"
                        ]}
                      />
                    )}
                  />
                </Box>
                <Box className={classes.drawerFieldContainer}>
                  <TitleWithInfoTip
                    title={t("exam_management_create_retry_num")}
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    titleRequired
                    fontWeight='600'
                  />

                  <Controller
                    control={control}
                    name='maxAttempts'
                    rules={{ required: "exam_max_attempt_invalid" }}
                    render={({ field: { value, onChange } }) => (
                      <BasicSelect
                        labelId='select-assignment-max-attempts-label'
                        value={value}
                        onHandleChange={(value) => onChange(value)}
                        items={[
                          {
                            value: "0",
                            label: t("exam_management_create_retry_num_infinite")
                          },
                          ...Array.from(Array(10).keys()).map((i) => ({
                            value: (i + 1).toString(),
                            label: (i + 1).toString()
                          }))
                        ]}
                        backgroundColor='#FBFCFE'
                        translation-key={[
                          "exam_management_create_retry_num_infinite",
                          "exam_management_create_retry_num"
                        ]}
                      />
                    )}
                  />
                </Box>
                <Box className={classes.drawerFieldContainer}>
                  <TitleWithInfoTip
                    title={t("asingment_management_possibility")}
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                    titleRequired
                  />
                  <BasicSelect
                    labelId='select-assignment-availability-label'
                    value={assignmentAvailability}
                    onHandleChange={(value) => setAssignmentAvailability(value)}
                    items={[
                      {
                        value: "0",
                        label: t("asingment_management_possibility_show")
                      },
                      {
                        value: "1",
                        label: t("asingment_management_possibility_hind_can_not_access")
                      }
                      // {
                      //   value: "2",
                      //   label: t("asingment_management_possibility_hide_can_access")
                      // }
                    ]}
                    backgroundColor='#FBFCFE'
                    translation-key={[
                      "asingment_management_possibility_hind_can_not_access",
                      "asingment_management_possibility_show",
                      "asingment_management_possibility_hide_can_access"
                    ]}
                  />
                </Box>

                <Box className={classes.drawerFieldContainer}>
                  <TitleWithInfoTip
                    title={t("common_filter_topic")}
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                    titleRequired
                  />
                  <Controller
                    control={control}
                    name='sectionId'
                    rules={{ required: "exam_section_required" }}
                    render={({ field: { value, onChange } }) => (
                      <BasicSelect
                        labelId='select-assignment-section-label'
                        value={value}
                        onHandleChange={(value) => onChange(value)}
                        items={
                          sections && Array.isArray(sections)
                            ? sections.map((item) => ({
                                value: item.sectionId,
                                label: item.name
                              }))
                            : []
                        }
                        backgroundColor='#FBFCFE'
                      />
                    )}
                  />
                </Box>
                <LoadButton
                  btnType={BtnType.Outlined}
                  fullWidth
                  style={{ marginTop: "20px" }}
                  padding='10px'
                  loading={loading}
                  onClick={handleSubmit(submitHandler)}
                  translation-key='course_lecturer_assignment_edit_exam'
                >
                  {t("course_lecturer_assignment_edit_exam")}
                </LoadButton>
              </Box>
            </Drawer>
          </Box>
        </Grid>
      </form>
    </>
  );
}
