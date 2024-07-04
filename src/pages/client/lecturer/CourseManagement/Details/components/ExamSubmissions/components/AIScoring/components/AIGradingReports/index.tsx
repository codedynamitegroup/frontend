import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classes from "./styles.module.scss";
import {
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Stack,
  Toolbar
} from "@mui/material";
import Header from "components/Header";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { useTranslation } from "react-i18next";
import StepButton from "@mui/material/StepButton";
import useBoxDimensions from "hooks/useBoxDimensions";
import { styled } from "@mui/material/styles";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import ParagraphSmall from "components/text/ParagraphSmall";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import AddIcon from "@mui/icons-material/Add";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useDispatch } from "react-redux";
import CustomDataGrid from "components/common/CustomDataGrid";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
import { RootState } from "store";
import ParagraphBody from "components/text/ParagraphBody";
import Heading5 from "components/text/Heading5";
import { RubricUserEntity } from "models/courseService/entity/RubricUserEntity";
import { AssignmentService } from "services/courseService/AssignmentService";
import { CreateReportEssayAICommand } from "models/courseService/entity/create/CreateReportEssayAICommand";
import { setSuccessMess } from "reduxes/AppStatus";
import {
  AssignmentAIGradeEssayEntity,
  AssignmentAIGradeEssayStatus
} from "models/courseService/entity/AssignmentAIGradeEssayEntity";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import i18next from "i18next";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface AssignmentAIReportProps {
  id: string;
  no: number;
  question: string;
  status: AssignmentAIGradeEssayStatus;
  feedbackLanguage: string;
  feedbackSubmissions: string;
  createdAt: string;
}

const AIGradingReports = () => {
  const page = 0;
  const pageSize = 5;
  const totalElement = 100;
  const drawerWidth = 450;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement>(null);

  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const gridHeader: GridColDef[] = [
    {
      field: "no",
      headerName: "STT",
      headerClassName: classes.dataGridHeader,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("STT")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphBody width={"auto"}>{params.row.no}</ParagraphBody>;
      },
      flex: 0.2
    },

    {
      field: "feedbackLanguage",
      headerName: t("feedback_language"),
      headerClassName: classes.dataGridHeader,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("feedback_language")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphBody width={"auto"}>{params.row.feedbackLanguage}</ParagraphBody>;
      },
      flex: 1
    },
    {
      field: "status",
      headerName: t("common_status"),
      headerClassName: classes.dataGridHeader,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Stack direction={"row"}>
            <Chip
              label={params.value}
              className={
                params.value.status === AssignmentAIGradeEssayStatus.SUCCESS
                  ? classes.graded
                  : classes.queue
              }
            />
          </Stack>
        );
      }
    },
    {
      field: "createdAt",
      headerName: t("common_create_at"),
      headerClassName: classes.dataGridHeader,
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_create_at")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphBody width={"auto"}>
            {standardlizeUTCStringToLocaleString(params.row.createdAt as string, currentLang)}
          </ParagraphBody>
        );
      }
    },
    {
      field: "action",
      headerName: t("common_action"),
      headerClassName: classes.dataGridHeader,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        return params.row.status === AssignmentAIGradeEssayStatus.SUCCESS ? (
          <IconButton
            onClick={() => {
              try {
                const submissions = JSON.parse(params.row.feedbackSubmissions);
                console.log(routes.lecturer.assignment.ai_grading_report_detail);
                navigate(
                  routes.lecturer.assignment.ai_grading_report_detail
                    .replace(":reportId", params.row.id)
                    .replace(":assignmentId", assignmentId || "")
                    .replace(":courseId", courseId || "")
                    .replace(":submissionId", submissions[0]?.studentSubmissionId)
                );
              } catch (e) {}
            }}
          >
            <VisibilityIcon color='primary' />
          </IconButton>
        ) : (
          <IconButton disabled>
            <VisibilityOffIcon />
          </IconButton>
        );
      }
    }
  ];
  const visibleColumnList = {
    id: true,
    name: true,
    Exam: true,
    course: true,
    status: true,
    createAt: true
  };
  const { courseId } = useParams<{ courseId: string }>();
  const { assignmentId } = useParams<{ assignmentId: string }>();

  // const [gradeScale, setGradeScale] = React.useState("letter");

  // const handleGradeScaleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setGradeScale((event.target as HTMLInputElement).value);
  // };

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};

  // const handleAddCriteria = () => {
  //   dispatch(openCriteria());
  // };

  const [assignmentAIReports, setAssignmentAIReports] = useState<AssignmentAIGradeEssayEntity[]>(
    []
  );

  const getAllAIReportsByAssignment = useCallback(async () => {
    await AssignmentService.getAllAIReportsByAssignment(assignmentId || "", {})
      .then((res) => {
        setAssignmentAIReports(res.aiGradeAssignmentReports);
      })
      .catch((err) => {});
  }, [assignmentId]);

  useEffect(() => {
    getAllAIReportsByAssignment();
  }, [getAllAIReportsByAssignment]);

  const assignmentAIReportsListTable: AssignmentAIReportProps[] = useMemo(() => {
    if (assignmentAIReports.length > 0) {
      return assignmentAIReports.map((assignmentAIReport, index) => ({
        id: assignmentAIReport.id,
        no: index + 1,
        question: assignmentAIReport.question,
        status: assignmentAIReport.status,
        feedbackLanguage: assignmentAIReport.feedbackLanguage,
        feedbackSubmissions: assignmentAIReport.feedbackSubmissions,
        createdAt: assignmentAIReport.createdAt
      }));
    } else {
      return [];
    }
  }, [assignmentAIReports]);

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

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const header2Ref = useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({ ref: header2Ref });

  const stickyFooterRef = useRef<HTMLDivElement>(null);
  const { height: stickyFooterHeight } = useBoxDimensions({ ref: stickyFooterRef });

  return (
    <>
      <Box className={classes.root} ref={rootRef}>
        <Header />
        <Box>
          <CssBaseline />
          <AppBar
            position='fixed'
            className={classes.tabs}
            sx={{
              marginTop: `${sidebarStatus.headerHeight}px`,
              backgroundColor: "white"
            }}
            ref={header2Ref}
            open={false}
          >
            <Toolbar>
              <Box id={classes.breadcumpWrapper}>
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.course.management)}
                >
                  Quản lý khoá học
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.course.information)}
                >
                  CS202 - Nhập môn lập trình
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.course.assignment)}
                >
                  Danh sách bài tập
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.exam.detail)}
                >
                  Bài kiểm tra cuối kỳ
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.exam.submissions)}
                >
                  Danh sách bài nộp
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall colorname='--blue-500'>Chấm điểm AI</ParagraphSmall>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
        <CssBaseline />

        <Box
          sx={{
            marginTop: `${sidebarStatus.headerHeight + header2Height}px`,
            paddingTop: "20px",
            paddingBottom: `${stickyFooterHeight}px`
          }}
        >
          <Grid container justifyContent='center' sx={{}} gap={5}>
            <Grid item xs={12}>
              <Container maxWidth='lg' className={classes.container} sx={{}}>
                <Grid container justifyContent='center' paddingTop={"10px"} spacing={2}>
                  <Grid item xs={12}>
                    <ParagraphBody
                      className={classes.generalDescription}
                      translation-key='grading_config_choose_report_note'
                    >
                      {t("grading_config_choose_report_note")}
                    </ParagraphBody>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomDataGrid
                      sx={{
                        "& .MuiDataGrid-cell": {
                          border: "none"
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: "#f5f9fb"
                        },
                        "& .MuiDataGrid-toolbarContainer": {
                          backgroundColor: "#f5f9fb"
                        }
                      }}
                      dataList={assignmentAIReportsListTable}
                      tableHeader={gridHeader}
                      page={page}
                      pageSize={pageSize}
                      totalElement={totalElement}
                      onSelectData={rowSelectionHandler}
                      onPaginationModelChange={pageChangeHandler}
                      showVerticalCellBorder={false}
                      visibleColumn={visibleColumnList}
                    />
                  </Grid>
                </Grid>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default AIGradingReports;
