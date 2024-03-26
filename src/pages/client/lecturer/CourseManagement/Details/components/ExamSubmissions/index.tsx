import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Slider,
  Stack,
  TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  GridCallbackDetails,
  GridColDef,
  GridColumnGroupingModel,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import axios from "axios";
import CustomDataGrid from "components/common/CustomDataGrid";
import Button, { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import Heading1 from "components/text/Heading1";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import i18next from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import CreateExistedReportConfirmDialog from "./components/CreateExistedReportConfirmDialog";
import ExamSubmissionFeatureBar from "./components/FeatureBar";
import MultiSelectCodeQuestionsDialog from "./components/MultiSelectCodeQuestionsDialog";
import SubmissionBarChart from "./components/SubmissionChart";
import classes from "./styles.module.scss";

export enum SubmissionStatusSubmitted {
  SUBMITTED = "Đã nộp",
  NOT_SUBMITTED = "Chưa nộp"
}

export enum SubmissionStatusGraded {
  GRADED = "Đã chấm",
  NOT_GRADED = "Chưa chấm"
}

const LecturerCourseExamSubmissions = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [isMultiSelectCodeQuestionsDialogOpen, setIsMultiSelectCodeQuestionsDialogOpen] =
    useState(false);
  const [isCreateExistedReportConfirmDialogOpen, setIsCreateExistedReportConfirmDialogOpen] =
    useState(false);
  const navigate = useNavigate();
  const totalSubmissionCount = 20;
  const totalStudent = 30;
  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    console.log(selectedRowId);
  };
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const page = 0;
  const pageSize = 5;
  const totalElement = 100;
  const [isPlagiarismDetectionLoading, setIsPlagiarismDetectionLoading] = useState(false);
  const [isCheckReportExistLoading, setIsCheckReportExistLoading] = useState(false);

  const submissionDataset = [
    {
      student: 59,
      range: "0.00 - 5.00"
    },
    {
      student: 50,
      range: "5.00 - 6.00"
    },
    {
      student: 47,
      range: "6.00 - 7.00"
    },
    {
      student: 54,
      range: "7.00 - 8.00"
    },
    {
      student: 57,
      range: "8.00 - 9.00"
    },
    {
      student: 60,
      range: "9.00 - 10.00"
    },
    {
      student: 59,
      range: "10.00 - 11.00"
    },
    {
      student: 65,
      range: "11.00 - 12.00"
    },
    {
      student: 51,
      range: "12.00 - 13.00"
    },
    {
      student: 60,
      range: "13.00 - 14.00"
    },
    {
      student: 67,
      range: "14.00 - 15.00"
    },
    {
      student: 61,
      range: "15.00 - 16.00"
    }
  ];

  const examData = {
    id: 1,
    org_id: "f47ac10b-58cc-4372-a567-0e02b2c3d477",
    max_grade: 30,
    questions: [
      {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d495",
        title: "Tính tổng các số lẻ từ 1 đến n",
        checkCheating: false,
        max_grade: 10,
        type: qtype.source_code
      },
      {
        id: "2",
        title: "Thuật toán là gì",
        max_grade: 10,
        type: qtype.essay
      },
      {
        id: "3",
        title: "HTML stands for Hyper Text Markup Language",
        max_grade: 10,
        type: qtype.multiple_choice
      }
    ]
  };
  const filterExamQuestionData = examData.questions.map((value) => ({
    question: value.title,
    questionId: value.id
  }));
  filterExamQuestionData.unshift({ question: "Câu hỏi 11 đến 20", questionId: "-1" });

  const submissionList = [
    {
      id: 1,
      student_name: "Nguyễn Đinh Quang Khánh",
      student_email: "khanhndq2002@gmail.com",
      status: {
        submission_status_submitted: SubmissionStatusSubmitted.SUBMITTED,
        grade_status: SubmissionStatusGraded.GRADED,
        late_submission: {
          is_late: true,
          late_duration: "1 ngày 2 giờ"
        }
      },
      last_submission_time: "Saturday, 3 February 2024, 9:46 AM",
      last_grade_time: "Saturday, 3 February 2024, 9:46 AM",
      current_final_grade: 0,
      grades: [
        {
          question_id: "f47ac10b-58cc-4372-a567-0e02b2c3d495",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 10
        },
        {
          question_id: "2",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 8
        },
        {
          question_id: "3",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 5
        }
      ]
    },
    {
      id: 2,
      student_name: "Nguyễn Quốc Tuấn",
      student_email: "tuannguyen@gmail.com",
      status: {
        submission_status_submitted: SubmissionStatusSubmitted.NOT_SUBMITTED,
        grade_status: SubmissionStatusGraded.NOT_GRADED,
        late_submission: {
          is_late: false,
          late_duration: "1 ngày 2 giờ"
        }
      },
      last_submission_time: "Saturday, 3 February 2024, 9:46 AM",
      last_grade_time: "Saturday, 3 February 2024, 9:46 AM",
      current_final_grade: 10,
      grades: [
        {
          question_id: "f47ac10b-58cc-4372-a567-0e02b2c3d495",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 8
        },
        {
          question_id: "2",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 10
        },
        {
          question_id: "3",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 9
        }
      ]
    }
  ];

  const tableHeading: GridColDef[] = [
    {
      field: "student_name",
      headerName: `${t("common_fullname")} ${i18next.format(t("common_student"), "lowercase")}`,
      width: 200
    },
    { field: "student_email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: t("common_status"),
      width: 250,
      renderCell: (params) => {
        return (
          <Box padding='5px' width='100%'>
            <Box
              sx={{
                padding: "5px",
                backgroundColor:
                  params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                    ? "var(--green-300)"
                    : "#f5f5f5",
                fontSize: "17px"
              }}
            >
              {params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                ? "Đã nộp"
                : "Chưa nộp"}
            </Box>
            <Box
              sx={{
                padding: "5px",
                backgroundColor: "#EFCFCF",
                fontSize: "17px",
                display: params.value.late_submission.is_late ? "block" : "none"
              }}
            >
              {"Quá hạn "}
              {params.value.late_submission.late_duration}
            </Box>
            <Box
              sx={{
                padding: "5px",
                backgroundColor:
                  params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                    ? "var(--green-300)"
                    : "#f5f5f5",
                fontSize: "17px",
                display:
                  params.value.grade_status === SubmissionStatusGraded.GRADED ? "block" : "none"
              }}
            >
              {params.value.grade_status === SubmissionStatusGraded.GRADED
                ? "Đã chấm"
                : "Chưa chấm"}
            </Box>
          </Box>
        );
      }
    },
    {
      field: "last_submission_time",
      headerName: t("course_lecturer_sub_last_submission_time"),
      width: 200
    },
    {
      field: "last_grade_time",
      headerName: t("course_lecturer_sub_last_grading_time"),
      width: 200
    },
    {
      field: "current_final_grade",
      headerName: t("common_final_grade"),
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              padding: "10px 0"
            }}
          >
            <Button
              btnType={BtnType.Primary}
              onClick={() => {
                navigate(routes.lecturer.exam.grading);
              }}
              margin='0 0 10px 0'
              translation-key='course_lecturer_assignment_grading'
            >
              {t("course_lecturer_assignment_grading")}
            </Button>
            <TextTitle>
              {params.value} / {examData.max_grade}
            </TextTitle>
          </Box>
        );
      }
    }
  ];

  const fetchPlagiarismDetectionForCodeQuestion = async (
    reportName: string,
    codeQuestionIds: string[]
  ) => {
    const codePlagiarismDetectionApiUrl =
      process.env.REACT_APP_CODE_PLAGIARISM_DETECTION_API_URL || "";
    setIsPlagiarismDetectionLoading(true);
    setIsCheckReportExistLoading(true);
    const codeSubmissionsData = {
      report_name: reportName,
      language: "Python",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d482",
      code_question_ids: codeQuestionIds
    };

    try {
      const response = await axios.post(
        `${codePlagiarismDetectionApiUrl}/reports`,
        codeSubmissionsData
      );
      setIsPlagiarismDetectionLoading(false);
      setIsCheckReportExistLoading(false);
      return response.data;
    } catch (error) {
      setIsPlagiarismDetectionLoading(false);
      setIsCheckReportExistLoading(false);
      throw error;
    }
  };

  const onHandlePlagiarismDetection = async (reportName: string, codeQuestionIds: string[]) => {
    try {
      const result = await fetchPlagiarismDetectionForCodeQuestion(reportName, codeQuestionIds);
      if (result.status === "success") {
        navigate(
          `${routes.lecturer.exam.code_plagiarism_detection.replace("reportId", result.data.id)}`,
          {
            state: {
              report: result.data
            }
          }
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchAllCodeQuestionsByOrgId = async (orgId: string) => {
  //   const codePlagiarismDetectionApiUrl =
  //     process.env.REACT_APP_CODE_PLAGIARISM_DETECTION_API_URL || "";
  //   setIsPlagiarismDetectionLoading(true);

  //   try {
  //     const response = await axios.get(`${codePlagiarismDetectionApiUrl}`);
  //     setIsPlagiarismDetectionLoading(false);
  //     return response.data;
  //   } catch (error) {
  //     setIsPlagiarismDetectionLoading(false);
  //     throw error;
  //   }
  // };

  const fetchCheckCodeQuestionIdsReportExists = async (codeQuestionIds: string[]) => {
    const codePlagiarismDetectionApiUrl =
      process.env.REACT_APP_CODE_PLAGIARISM_DETECTION_API_URL || "";
    setIsCheckReportExistLoading(true);
    try {
      const response = await axios.post(
        `${codePlagiarismDetectionApiUrl}/reports/check-code-question-ids-exist`,
        {
          code_question_ids: codeQuestionIds
        }
      );
      setIsCheckReportExistLoading(false);
      return response.data;
    } catch (error) {
      setIsCheckReportExistLoading(false);
      throw error;
    }
  };

  const onHandleReportExists = async (reportName: string, codeQuestionIds: string[]) => {
    try {
      if (!codeQuestionIds.length) return;
      const result = await fetchCheckCodeQuestionIdsReportExists(codeQuestionIds);
      if (result.status === "success") {
        if (result.data) {
          handleOpenCreateExistedReportConfirmDialog();
        } else {
          onHandlePlagiarismDetection(reportName, codeQuestionIds);
        }
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };
  const [openFilterSettingDialog, setOpenFilterSettingDialog] = useState(false);
  const handleCloseDialog = () => setOpenFilterSettingDialog(false);
  const [sliderValue, setSliderValue] = useState<number[]>([1, examData.questions.length]);
  const [filterValues, setFilterValues] = useState<number[][]>([[1, 1]]);
  const [tableHeadingPlus, setTableHeadingPlus] = useState<GridColDef[]>([]);

  const checkCheatingTableHeading: GridColDef[] = [
    { field: "title", headerName: "Câu hỏi", flex: 4 },
    {
      field: "checkCheating",
      headerName: "Trạng thái",
      flex: 4,
      renderCell: (params) => (
        <Box marginY={"10px"}>{params.value ? "Chưa kiểm tra" : "Đã kiểm tra"}</Box>
      )
    },
    {
      field: "action",
      headerName: "Hành động",
      flex: 4,
      type: "actions",
      renderCell: (params) => {
        return (
          <Button
            btnType={BtnType.Primary}
            onClick={handleOpenMultiSelectCodeQuestionsDialog}
            translation-key='common_check_cheating'
          >
            Tạo báo cáo gian lận
          </Button>
        );
      }
    }
  ];

  const handleOpenMultiSelectCodeQuestionsDialog = useCallback(() => {
    setIsMultiSelectCodeQuestionsDialogOpen(true);
  }, []);

  const handleCloseMultiSelectCodeQuestionsDialog = useCallback(() => {
    setIsMultiSelectCodeQuestionsDialogOpen(false);
  }, []);

  const handleOpenCreateExistedReportConfirmDialog = useCallback(() => {
    setIsCreateExistedReportConfirmDialogOpen(true);
  }, []);

  const handleCloseCreateExistedReportConfirmDialog = useCallback(() => {
    setIsCreateExistedReportConfirmDialogOpen(false);
  }, []);

  const [openCheckCheating, setOpenCheckCheeting] = useState(false);
  useEffect(() => {
    const filterSet = new Set<number>();
    const tableHeadingTemp: GridColDef[] = [];
    const columnGroupingModelTemp: GridColumnGroupingModel = [];

    filterValues.forEach((value) => {
      const start = value[0];
      const end = value[1];
      for (let i = start; i <= end; i++) {
        if (!filterSet.has(i)) {
          filterSet.add(i);
          const question = examData.questions[i - 1];
          tableHeadingTemp.push({
            field: `question-${question.id}`,
            headerName: question.title,
            width: 180,
            renderCell: () => {
              for (let i = 0; i < submissionList.length; i++) {
                for (let j = 0; j < submissionList[i].grades.length; j++) {
                  if (submissionList[i].grades[j].question_id === question.id) {
                    return (
                      <TextTitle>
                        {submissionList[i].grades[j].current_grade} / {question.max_grade}
                      </TextTitle>
                    );
                  }
                }
              }
            }
          });
          columnGroupingModelTemp.push({
            groupId: `question-${question.id}-plagiarism-detection`,
            children: [
              {
                groupId: `question-${question.id}-type`,
                children: [{ field: `question-${question.id}` }],
                headerName: currentLang === "en" ? question.type.en_name : question.type.vi_name
              }
            ],
            renderHeaderGroup() {
              if (question.type.code === qtype.source_code.code) {
                return (
                  <LoadButton
                    loading={isPlagiarismDetectionLoading}
                    btnType={BtnType.Outlined}
                    onClick={handleOpenMultiSelectCodeQuestionsDialog}
                    translation-key='common_check_cheating'
                  >
                    {t("common_check_cheating")}
                  </LoadButton>
                );
              } else if (question.type.code === "essay") {
                return (
                  <Button
                    btnType={BtnType.Outlined}
                    onClick={() => {
                      navigate(`${routes.lecturer.exam.ai_scroring}?questionId=${question.id}`);
                    }}
                    translation-key='common_AI_grading'
                  >
                    {t("common_AI_grading")}
                  </Button>
                );
              } else {
                return null;
              }
            }
          });
        }
      }
    });
    setTableHeadingPlus(tableHeadingTemp);
  }, [filterValues]);

  return (
    <>
      <MultiSelectCodeQuestionsDialog
        open={isMultiSelectCodeQuestionsDialogOpen}
        handleClose={handleCloseMultiSelectCodeQuestionsDialog}
        title={"Tạo báo cáo gian lận"}
        cancelText={"Hủy"}
        confirmText={"Xác nhận"}
        isConfirmLoading={isCheckReportExistLoading}
        onHanldeConfirm={() => {
          onHandleReportExists("Báo cáo gian lận mới", [
            "f47ac10b-58cc-4372-a567-0e02b2c3d495",
            "f47ac10b-58cc-4372-a567-0e02b2c3d496",
            "f47ac10b-58cc-4372-a567-0e02b2c3d497"
          ]);
        }}
        onHandleCancel={handleCloseMultiSelectCodeQuestionsDialog}
      />
      <CreateExistedReportConfirmDialog
        open={isCreateExistedReportConfirmDialogOpen}
        handleClose={handleCloseCreateExistedReportConfirmDialog}
        title={"Xác nhận ghi đè báo cáo gian lận"}
        cancelText={"Xem lại"}
        confirmText={"Xác nhận"}
        isConfirmLoading={isPlagiarismDetectionLoading}
        onHanldeConfirm={() => {
          onHandlePlagiarismDetection("Báo cáo gian lận mới", [
            "f47ac10b-58cc-4372-a567-0e02b2c3d495",
            "f47ac10b-58cc-4372-a567-0e02b2c3d496",
            "f47ac10b-58cc-4372-a567-0e02b2c3d497"
          ]);
        }}
        onHandleCancel={() => {}}
      />
      <Box className={classes.examBody}>
        <Button
          btnType={BtnType.Primary}
          onClick={() => {
            navigate(routes.lecturer.exam.detail);
          }}
          startIcon={
            <ChevronLeftIcon
              sx={{
                color: "white"
              }}
            />
          }
          width='fit-content'
        >
          <ParagraphBody translation-key='common_back'>{t("common_back")}</ParagraphBody>
        </Button>
        <Heading1>Bài kiểm tra cuối kỳ</Heading1>
        <ParagraphBody translation-key='course_lecturer_sub_num_of_student'>
          {t("course_lecturer_sub_num_of_student")}: {totalSubmissionCount}/{totalStudent}
        </ParagraphBody>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SubmissionBarChart
            dataset={submissionDataset}
            xAxis={[{ scaleType: "band", dataKey: "range" }]}
            width={1000}
            height={500}
          />
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Heading1 translation-key='course_lecturer_submission_list'>
              {t("course_lecturer_submission_list")}
            </Heading1>
          </Grid>
          <Grid item xs={12}>
            <ExamSubmissionFeatureBar />
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} alignItems={"center"}>
              <Heading4>Lọc câu hỏi</Heading4>
              <IconButton onClick={() => setOpenFilterSettingDialog(true)}>
                <AddCircleIcon />
              </IconButton>
            </Stack>
            <Dialog
              open={openFilterSettingDialog}
              onClose={handleCloseDialog}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
              fullWidth={true}
            >
              <DialogContent>
                <Box marginTop={"16px"}>
                  <Grid container>
                    <Grid container justifyContent={"space-between"} xs={12} alignItems={"center"}>
                      <TextField
                        placeholder='Từ'
                        value={sliderValue[0]}
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>Câu</InputAdornment>,
                          inputProps: { min: 1, max: examData.questions.length }
                        }}
                        onChange={(e) => {
                          let min = parseInt(e.target.value);
                          let max = sliderValue[1];
                          let temp = 0;
                          if (min > max) {
                            temp = min;
                            min = max;
                            max = temp;
                          }
                          setSliderValue([min, max]);
                        }}
                        type='number'
                      />
                      <ParagraphBody>đến</ParagraphBody>
                      <TextField
                        placeholder='Đến'
                        value={sliderValue[1]}
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>Câu</InputAdornment>,
                          inputProps: { min: 1, max: examData.questions.length }
                        }}
                        onChange={(e) => {
                          let max = parseInt(e.target.value);
                          let min = sliderValue[0];
                          let temp = 0;
                          if (min > max) {
                            temp = min;
                            min = max;
                            max = temp;
                          }
                          setSliderValue([min, max]);
                        }}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Slider
                        value={sliderValue}
                        onChange={(e, val) => {
                          console.log(val);
                          setSliderValue(val as number[]);
                        }}
                        min={1}
                        max={examData.questions.length}
                        defaultValue={[1, examData.questions.length]}
                        valueLabelDisplay='auto'
                      />
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button btnType={BtnType.Primary} onClick={handleCloseDialog}>
                  Đóng
                </Button>
                <Button
                  btnType={BtnType.Primary}
                  onClick={() => {
                    handleCloseDialog();
                    setFilterValues([...filterValues, sliderValue]);
                  }}
                >
                  Lưu
                </Button>
              </DialogActions>
            </Dialog>

            <Stack spacing={1} flexWrap={"wrap"} direction={"row"}>
              {filterValues.map((value, index) => (
                <Chip
                  key={index}
                  label={`Câu ${value[0] === value[1] ? value[0] : `${value[0]} - ${value[1]}`}`}
                  onDelete={() => {
                    const temp = [...filterValues];
                    temp.splice(index, 1);
                    setFilterValues(temp);
                  }}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} marginTop={3}>
            <LoadButton
              // loading={isPlagiarismDetectionLoading}
              btnType={BtnType.Outlined}
              onClick={() => setOpenCheckCheeting(true)}
              translation-key='common_check_cheating'
            >
              {t("common_check_cheating")}
            </LoadButton>
            <Dialog
              open={openCheckCheating}
              onClose={() => setOpenCheckCheeting(false)}
              fullWidth={true}
            >
              <DialogTitle>Kiểm tra gian lận</DialogTitle>
              <DialogContent>
                <CustomDataGrid
                  dataList={examData.questions.filter(
                    (value) => value.type.code === qtype.source_code.code
                  )}
                  tableHeader={checkCheatingTableHeading}
                  onSelectData={rowSelectionHandler}
                  // visibleColumn={visibleColumnList}
                  dataGridToolBar={dataGridToolbar}
                  page={page}
                  pageSize={pageSize}
                  totalElement={totalElement}
                  onPaginationModelChange={pageChangeHandler}
                  showVerticalCellBorder={true}
                  getRowHeight={() => "auto"}
                  // onClickRow={rowClickHandler}
                  // slots={{toolbar:}}
                  // columnGroupingModel={columnGroupingModelPlus}
                />
              </DialogContent>
              <DialogActions>
                <Button btnType={BtnType.Outlined} onClick={() => setOpenCheckCheeting(false)}>
                  Đóng
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>

          <Grid item xs={12}>
            <CustomDataGrid
              dataList={submissionList}
              tableHeader={[...tableHeading, ...tableHeadingPlus]}
              onSelectData={rowSelectionHandler}
              visibleColumn={visibleColumnList}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={pageSize}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={true}
              getRowHeight={() => "auto"}
              onClickRow={rowClickHandler}
              // slots={{toolbar:}}
              // columnGroupingModel={columnGroupingModelPlus}
            />
          </Grid>
        </Grid>
      </Box>
      {/* <Box className={classes.examBody}>
        <Button
          btnType={BtnType.Primary}
          onClick={() => {
            navigate(routes.lecturer.exam.detail);
          }}
          startIcon={
            <ChevronLeftIcon
              sx={{
                color: "white"
              }}
            />
          }
          width='fit-content'
        >
          <ParagraphBody translation-key='common_back'>{t("common_back")}</ParagraphBody>
        </Button>
        <Heading1>Bài kiểm tra cuối kỳ</Heading1>
        <ParagraphBody translation-key='course_lecturer_sub_num_of_student'>
          {t("course_lecturer_sub_num_of_student")}: {totalSubmissionCount}/{totalStudent}
        </ParagraphBody>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SubmissionBarChart
            dataset={submissionDataset}
            xAxis={[{ scaleType: "band", dataKey: "range" }]}
            width={1000}
            height={500}
          />
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Heading1 translation-key='course_lecturer_submission_list'>
              {t("course_lecturer_submission_list")}
            </Heading1>
          </Grid>
          <Grid item xs={12}>
            <ExamSubmissionFeatureBar />
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} alignItems={"center"}>
              <Heading4>Lọc câu hỏi</Heading4>
              <IconButton onClick={() => setOpenFilterSettingDialog(true)}>
                <AddCircleIcon />
              </IconButton>
            </Stack>
            <Dialog
              open={openFilterSettingDialog}
              onClose={handleCloseDialog}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
              fullWidth={true}
            >
              <DialogContent>
                <Box marginTop={"16px"}>
                  <Stack direction={"row"} alignItems={"end"}>
                    <ParagraphBody>Câu {sliderValue[0]} </ParagraphBody>
                    <Stack flex={9} alignItems={"center"} marginX={4}>
                      <ParagraphBody>đến</ParagraphBody>
                      <Slider
                        value={sliderValue}
                        onChange={(e, val) => {
                          console.log(val);
                          setSliderValue(val as number[]);
                        }}
                        min={1}
                        max={examData.questions.length}
                        defaultValue={[1, examData.questions.length]}
                        valueLabelDisplay='auto'
                      />
                    </Stack>

                    <ParagraphBody>{sliderValue[1]}</ParagraphBody>
                  </Stack>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button btnType={BtnType.Primary} onClick={handleCloseDialog}>
                  Đóng
                </Button>
                <Button
                  btnType={BtnType.Primary}
                  onClick={() => {
                    handleCloseDialog();
                    setFilterValues([...filterValues, sliderValue]);
                  }}
                >
                  Lưu
                </Button>
              </DialogActions>
            </Dialog>

            <Stack spacing={1} flexWrap={"wrap"} direction={"row"}>
              {filterValues.map((value, index) => (
                <Chip
                  key={index}
                  label={`Câu ${value[0] === value[1] ? value[0] : `${value[0]} - ${value[1]}`}`}
                  onDelete={() => {
                    const temp = [...filterValues];
                    temp.splice(index, 1);
                    setFilterValues(temp);
                  }}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <CustomDataGrid
              dataList={submissionList}
              tableHeader={[...tableHeading, ...tableHeadingPlus]}
              onSelectData={rowSelectionHandler}
              visibleColumn={visibleColumnList}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={pageSize}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={true}
              getRowHeight={() => "auto"}
              onClickRow={rowClickHandler}
            />
          </Grid>
        </Grid>
      </Box> */}
    </>
  );
};

export default LecturerCourseExamSubmissions;
