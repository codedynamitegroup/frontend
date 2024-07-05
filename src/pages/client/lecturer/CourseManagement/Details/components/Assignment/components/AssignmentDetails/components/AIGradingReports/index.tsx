import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classes from "./styles.module.scss";
import { Box, Chip, Container, Grid, IconButton, Stack } from "@mui/material";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import useBoxDimensions from "hooks/useBoxDimensions";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useDispatch } from "react-redux";
import CustomDataGrid from "components/common/CustomDataGrid";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
import { RootState } from "store";
import ParagraphBody from "components/text/ParagraphBody";
import Heading5 from "components/text/Heading5";
import { AssignmentService } from "services/courseService/AssignmentService";
import {
  AssignmentAIGradeEssayEntity,
  AssignmentAIGradeEssayStatus
} from "models/courseService/entity/AssignmentAIGradeEssayEntity";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import i18next from "i18next";
import Buttons from "components/Buttons";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Heading2 from "components/text/Heading2";
import { setErrorMess } from "reduxes/AppStatus";

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
      headerName: t("common_language"),
      headerClassName: classes.dataGridHeader,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_language")}
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
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_status")}
          </Heading5>
        );
      },
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
      flex: 0.5,
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
      flex: 0.5,
      align: "center",
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_action")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return params.row.status === AssignmentAIGradeEssayStatus.SUCCESS ? (
          <IconButton
            onClick={() => {
              try {
                const submissions = JSON.parse(params.row.feedbackSubmissions);
                console.log(submissions[0]?.studentSubmissionId);
                navigate(
                  routes.lecturer.assignment.ai_grading_report_detail
                    .replace(":reportId", params.row.id)
                    .replace(":assignmentId", assignmentId || "")
                    .replace(":courseId", courseId || "")
                    .replace(":submissionId", submissions[0]?.studentSubmissionId)
                );
              } catch (e) {
                dispatch(setErrorMess("Report has some errors! Do it later!"));
              }
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

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const stickyFooterRef = useRef<HTMLDivElement>(null);
  const { height: stickyFooterHeight } = useBoxDimensions({ ref: stickyFooterRef });

  return (
    <>
      <Box className={classes.root} ref={rootRef}>
        <Header />

        <Box
          sx={{
            marginTop: `${sidebarStatus.headerHeight}px`,
            paddingTop: "20px",
            paddingBottom: `${stickyFooterHeight}px`
          }}
        >
          <Grid container justifyContent='center' sx={{}} gap={5}>
            <Grid item xs={12}>
              <Container maxWidth='lg' className={classes.container} sx={{}}>
                <Grid container justifyContent='center' paddingTop={"10px"} spacing={2}>
                  <Grid item xs={12}>
                    <Buttons
                      children={t("common_back")}
                      btnType={"Blue"}
                      onClick={() => {
                        navigate(
                          routes.lecturer.assignment.detail
                            .replace(":courseId", courseId || "")
                            .replace(":assignmentId", assignmentId || "")
                        );
                      }}
                      startIcon={
                        <ChevronLeftIcon
                          sx={{
                            color: "white"
                          }}
                        />
                      }
                      width='fit-content'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Heading2 translation-key='grading_config_choose_report'>
                      {t("grading_config_choose_report")}
                    </Heading2>
                  </Grid>
                  <Grid item xs={12}>
                    <ParagraphBody translation-key='grading_config_choose_report_note'>
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
