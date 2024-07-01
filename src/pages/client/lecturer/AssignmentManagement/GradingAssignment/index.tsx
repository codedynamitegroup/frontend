import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  Stack
} from "@mui/material";
import Header from "components/Header";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import InputTextField from "components/common/inputs/InputTextField";
import BasicSelect from "components/common/select/BasicSelect";
import TextEditor from "components/editor/TextEditor";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "hooks/useWindowDimensions";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";
import { SubmissionAssignmentService } from "services/courseService/SubmissionAssignmentService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSubmissionAssignments } from "reduxes/courseService/submission_assignment";
import { RootState } from "store";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { UpdateSubmissionAssignment } from "models/courseService/entity/update/UpdateSubmissionAssignment";
import { CreateSubmissionGradeCommand } from "models/courseService/entity/create/CreateSubmissionGradeCommand";
import { SubmissionGradeService } from "services/courseService/SubmissionGradeService";
import { UpdateSubmissionGradeCommand } from "models/courseService/entity/update/UpdateSubmissionGradeCommand";
import { AssignmentResourceEntity } from "models/courseService/entity/AssignmentResourceEntity";
import ParagraphBody from "components/text/ParagraphBody";
import CustomBreadCrumb from "components/common/Breadcrumb";
import useBoxDimensions from "hooks/useBoxDimensions";
import { SubmissionAssignmentEntity } from "models/courseService/entity/SubmissionAssignmentEntity";
import { grey } from "@mui/material/colors";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper } from "@mui/material";
import SearchBar from "components/common/search/SearchBar";
import CustomDataGrid from "components/common/CustomDataGrid";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
enum EGradingStatus {
  GRADED,
  QUEUED,
  GRADING
}
export default function AssignmentGrading() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [assignmentTypes, setAssignmentTypes] = React.useState([
    t("common_submission_type_file"),
    t("common_submission_type_online_text")
  ]);
  const [assignmentMaximumGrade, setAssignmentMaximumGrade] = React.useState("");
  const [assignmentFeedback, setAssignmentFeedback] = React.useState("");
  const { courseId, assignmentId, submissionId } = useParams<{
    courseId: string;
    assignmentId: string;
    submissionId: string;
  }>();
  const [assignmentSubmissionStudent, setAssignmentSubmissionStudent] = React.useState(
    submissionId?.toString() ?? ""
  );
  const [studentSubmissionCurrent, setStudentSubmissionCurrent] =
    React.useState<SubmissionAssignmentEntity | null>(null);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);

  const [openChooseStudent, setOpenChooseStudent] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [gradingStatus, setGradingStatus] = React.useState(0);

  const submissionAssignmentState = useSelector((state: RootState) => state.submissionAssignment);
  const assignmentState = useSelector((state: RootState) => state.assignment);
  const dispatch = useDispatch();

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const totalElements = React.useMemo(
    () => submissionAssignmentState.totalPages || 0,
    [submissionAssignmentState.totalPages]
  );

  const [searchValue, setSearchValue] = React.useState("");

  // Auto close drawer when screen width < 1080 and open drawer when screen width > 1080
  React.useEffect(() => {
    if (width < 1080) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

  const handleSave = async (continueToNext = false) => {
    const submissionGrade = submissionAssignmentState.submissionAssignments.find(
      (submission) => submission.id === assignmentSubmissionStudent
    )?.submissionGrade;
    if (submissionGrade) {
      const updateSubmissionGrade: UpdateSubmissionGradeCommand = {
        grade: Number(assignmentMaximumGrade),
        timeModified: new Date().toISOString()
      };
      await SubmissionGradeService.updateSubmissionGrade(
        updateSubmissionGrade,
        submissionGrade.id ?? ""
      );
      const submissionAssignment: UpdateSubmissionAssignment = {
        feedback: assignmentFeedback
      };
      await SubmissionAssignmentService.update(submissionAssignment, submissionId ?? "");
      setOpenSuccessSnackbar(true);
      setTimeout(() => {
        setOpenSuccessSnackbar(false);
      }, 2000);
    } else {
      const submissionGrade: CreateSubmissionGradeCommand = {
        submissionAssignmentId: submissionId ?? "",
        grade: Number(assignmentMaximumGrade),
        timeCreated: new Date().toISOString(),
        timeModified: new Date().toISOString()
      };
      await createSubmissionGrade(submissionGrade);
      const submissionAssignment: UpdateSubmissionAssignment = {
        isGraded: true,
        feedback: assignmentFeedback
      };
      await SubmissionAssignmentService.update(submissionAssignment, submissionId ?? "");
      setOpenSuccessSnackbar(true);
      setTimeout(() => {
        setOpenSuccessSnackbar(false);
      }, 2000);
    }

    if (continueToNext) {
      navigateToNextStudent();
    }
  };

  const createSubmissionGrade = async (createSubmissionGrade: CreateSubmissionGradeCommand) => {
    try {
      const response = await SubmissionGradeService.createSubmissionGrade(createSubmissionGrade);
      if (response) {
        return response;
      }
    } catch (error) {
      console.error("Failed to create submission grade", error);
    }
  };

  const handleGetSubmissionAssignmentByAssignment = useCallback(
    async (
      assignmentId: string,
      isGraded: Boolean | null = null,
      search: string = "",
      pageNo: number = 0,
      pageSize: number = 10
    ) => {
      dispatch(setLoading(true));
      try {
        const response = await SubmissionAssignmentService.getSubmissionAssignmentByAssignmentId(
          assignmentId,
          {
            isGraded,
            search,
            pageNo,
            pageSize
          }
        );
        console.log(response);
        dispatch(setSubmissionAssignments(response));
      } catch (error) {
        console.error("Failed to fetch submission assignment", error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (assignmentId) {
      handleGetSubmissionAssignmentByAssignment(
        assignmentId,
        gradingStatus === 0 ? null : gradingStatus === 1 ? false : true
      );
    }
  }, [
    assignmentId,
    handleGetSubmissionAssignmentByAssignment,
    gradingStatus,
    searchValue,
    openChooseStudent
  ]);

  useEffect(() => {
    if (assignmentSubmissionStudent) {
      navigate(
        routes.lecturer.assignment.grading
          .replace(":assignmentId", assignmentId ?? "")
          .replace(":courseId", courseId ?? "")
          .replace(":submissionId", assignmentSubmissionStudent)
      );
    }
  }, [assignmentSubmissionStudent, assignmentId, courseId, navigate]);

  useEffect(() => {
    const fetchSubmissionAssignment = async () => {
      const response = await SubmissionAssignmentService.getSubmissionAssignmentById(
        assignmentSubmissionStudent
      );
      setStudentSubmissionCurrent(response);
      const grade = response.submissionGrade?.grade ?? -1;
      setAssignmentMaximumGrade(grade === -1 ? "" : grade.toString());
      setAssignmentFeedback(response?.feedback ?? "");
    };
    fetchSubmissionAssignment();
  }, [assignmentSubmissionStudent]);

  const navigateToNextStudent = () => {
    const currentIndex = submissionAssignmentState.submissionAssignments.findIndex(
      (submission) => submission.id === assignmentSubmissionStudent
    );
    const nextIndex = (currentIndex + 1) % submissionAssignmentState.submissionAssignments.length;
    const nextStudentId = submissionAssignmentState.submissionAssignments[nextIndex].id;
    setAssignmentSubmissionStudent(nextStudentId);
  };

  function addAttributesAndStylesToImages(html: string, className: string, css: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Thêm thuộc tính và class vào các thẻ <img>
    const images = doc.getElementsByTagName("img");
    for (let img of images) {
      img.classList.add(className);
    }

    // Tạo thẻ <style> và thêm CSS
    const style = doc.createElement("style");
    style.textContent = css;
    doc.head.appendChild(style);

    return doc.documentElement.outerHTML;
  }
  const css = `
.custom-class {
    max-width: 100%;
    height: auto;
}
`;
  const content = submissionAssignmentState.submissionAssignments.find(
    (submission) => submission.id === assignmentSubmissionStudent
  )?.content;

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    console.log(selectedRowId);
  };
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    if (assignmentId) {
      handleGetSubmissionAssignmentByAssignment(
        assignmentId,
        gradingStatus === 0 ? null : gradingStatus === 1 ? false : true,
        searchValue,
        model.page,
        model.pageSize
      );
    }
  };

  const rowClickHandler = (params: GridRowParams<any>) => {};
  const chooseStudentHeading: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 2 },
    { field: "name", headerName: "Tên", flex: 1.5 },
    {
      field: "status",
      headerName: "Trạng thái nộp bài",
      flex: 1,
      renderCell: (params) =>
        params.value === "SUBMITTED" ? (
          <Chip label='Đã nộp' sx={{ backgroundColor: "#c7f7d4", color: "#00e676" }} />
        ) : (
          <Chip label='Chưa nộp' />
        )
    },
    {
      field: "statusGrade",
      headerName: "Trạng thái chấm",
      flex: 1,
      renderCell: (params) =>
        params.value === "GRADED" ? (
          <Chip label='Đã chấm' sx={{ backgroundColor: "#c7f7d4", color: "#00e676" }} />
        ) : (
          <Chip label='Chưa chấm' />
        )
    }
    // {
    //   field: "action",
    //   type: "actions",
    //   headerName: "Hành động",
    //   getActions: (params) => [
    //     <IconButton onClick={() => setOpenChooseStudent(false)}>
    //       <VisibilityIcon />
    //     </IconButton>
    //   ]
    // }
  ];

  return (
    <Grid className={classes.root}>
      <Header />
      {submissionAssignmentState.isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "10px"
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            className={classes.contentContainer}
            sx={{
              marginTop: `${sidebarStatus.headerHeight}px`
            }}
          >
            <Container
              sx={{
                padding: "0",
                display: "flex",
                justifyContent: "flex-start"
              }}
            >
              <CustomBreadCrumb
                breadCrumbData={[
                  {
                    navLink: routes.lecturer.course.management,
                    label: "Quản lý khoá học"
                  },
                  {
                    navLink: routes.lecturer.course.information.replace(
                      ":courseId",
                      courseId ?? ""
                    ),
                    label: "CS202 - Nhập môn lập trình"
                  },
                  {
                    navLink: routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""),
                    label: "Danh sách bài tập"
                  },
                  {
                    navLink: routes.lecturer.assignment.detail
                      .replace(":assignmentId", assignmentId ?? "")
                      .replace(":courseId", courseId ?? ""),
                    label: submissionAssignmentState.submissionAssignments[0]?.assignmentName
                  }
                ]}
                lastBreadCrumbLabel='Đánh giá'
              />
            </Container>{" "}
            <Container
              sx={{
                backgroundColor: "white",
                marginTop: "5px",
                height: "fit-content",
                padding: "16px"
              }}
              className={classes.gradeContainer}
            >
              {/* <BasicSelect
                labelId='select-assignment-submission-student-label'
                value={assignmentSubmissionStudent}
                onHandleChange={(value) => setAssignmentSubmissionStudent(value)}
                items={submissionAssignmentState.submissionAssignments.map((submission) => ({
                  value: submission.id,
                  label: submission.user.fullName,
                  customNode: (
                    <Box>
                      <TextTitle fontWeight={"500"}>{submission.user.fullName}</TextTitle>
                      <ParagraphBody colorname='--gray-500'>{submission.user.email}</ParagraphBody>
                    </Box>
                  )
                }))}
                backgroundColor='var(--gray-2)'
              /> */}
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='common_student'>{t("common_student")}</TextTitle>

                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  border={1}
                  borderRadius={1}
                  padding={1}
                  sx={{ backgroundColor: "rgb(217, 226, 237)", ":hover": { cursor: "pointer" } }}
                  onClick={() => setOpenChooseStudent(true)}
                >
                  <ParagraphBody>{studentSubmissionCurrent?.user.fullName}</ParagraphBody>{" "}
                  <ArrowDropDownIcon />
                </Stack>
                <Dialog
                  open={openChooseStudent}
                  onClose={() => setOpenChooseStudent(false)}
                  fullWidth={true}
                  maxWidth='md'
                >
                  <DialogTitle>Chọn sinh viên</DialogTitle>
                  <DialogContent>
                    <Paper className={classes.containerPaper}>
                      <Box className={classes.searchWrapper}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <SearchBar onSearchClick={() => null} maxWidth='100%' />
                          </Grid>
                          <Grid item xs={3}>
                            <FormControl className={classes.colSearchContainer} size='small'>
                              <InputLabel id='filter-status'>Lọc</InputLabel>
                              <Select
                                labelId='filter-status'
                                id='colSearchSelect'
                                value={gradingStatus}
                                label='Lọc'
                                onChange={(e) => setGradingStatus(e.target.value as number)}
                              >
                                <MenuItem value={0}>Tất cả</MenuItem>
                                <MenuItem value={1}>Chưa chấm</MenuItem>
                                <MenuItem value={2}>Đã chấm</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                    <CustomDataGrid
                      dataList={submissionAssignmentState.submissionAssignments.map(
                        (item, index) => ({
                          ...item,
                          id: item.id,
                          email: item.user.email,
                          name: item.user.fullName,
                          status: item?.submitTime ? "SUBMITTED" : "NOT_SUBMITTED",
                          statusGrade: item?.submissionGrade ? "GRADED" : "NOT_GRADED"
                        })
                      )}
                      personalSx={true}
                      sx={{
                        "& .MuiDataGrid-cell:nth-last-child(n+2)": {
                          padding: "16px"
                        },
                        "& .normal-row:hover": {
                          cursor: "pointer"
                        },
                        "& .disable-row": {
                          backgroundColor: grey[100]
                        }
                      }}
                      getRowClassName={(params) => {
                        if (params.row.status === EGradingStatus.GRADING) return "disable-row";
                        else return "normal-row";
                      }}
                      tableHeader={chooseStudentHeading}
                      onSelectData={rowSelectionHandler}
                      // visibleColumn={visibleColumnList}
                      dataGridToolBar={dataGridToolbar}
                      page={page}
                      pageSize={pageSize}
                      totalElement={totalElements}
                      onPaginationModelChange={pageChangeHandler}
                      showVerticalCellBorder={true}
                      getRowHeight={() => "auto"}
                      onClickRow={(params, event) => {
                        console.log(params.row, event, "click row");

                        if (params.row.status === "NOT_SUBMITTED") {
                          setDialogOpen(true);
                          return;
                        }

                        setStudentSubmissionCurrent(params.row);
                        navigate(
                          routes.lecturer.assignment.grading
                            .replace(":submissionId", params.row.id)
                            .replace(":assignmentId", assignmentId || "")
                            .replace(":courseId", courseId || "")
                        );
                        setOpenChooseStudent(false);
                      }}
                      // slots={{toolbar:}}
                      // columnGroupingModel={columnGroupingModelPlus}
                    />
                  </DialogContent>
                  <DialogActions>
                    {/* <Button btnType={BtnType.Primary} onClick={() => setOpenChooseStudent(false)}>
                      Đóng
                    </Button> */}
                  </DialogActions>
                </Dialog>
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='course_lecturer_grading_assignment_type'>
                  {t("course_lecturer_grading_assignment_type")}
                </TextTitle>
                <Stack
                  translation-key={[
                    "common_submission_type_file",
                    "common_submission_type_online_text"
                  ]}
                  direction='row'
                  spacing={1}
                >
                  {assignmentTypes.map((type) => {
                    return <Chip label={type} />;
                  })}
                </Stack>
              </Box>
              {assignmentState.assignmentDetails?.type === "BOTH" ? (
                <>
                  <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                    <TextTitle translation-key='course_lecturer_submission_online_text'>
                      {t("course_lecturer_submission_online_text")}
                    </TextTitle>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: content
                          ? addAttributesAndStylesToImages(content, "custom-class", css)
                          : `<span style="color: red;">${t("no_data")}</span>`
                      }}
                    />
                  </Box>

                  <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                    <TextTitle translation-key='course_lecturer_submission_file'>
                      {t("course_lecturer_submission_file")}
                    </TextTitle>
                    {submissionAssignmentState.submissionAssignments.find(
                      (submission) => submission.id === assignmentSubmissionStudent
                    )?.submissionAssignmentFiles.length != 0 ? (
                      <CustomFileList
                        files={
                          submissionAssignmentState.submissionAssignments
                            .find((submission) => submission.id === assignmentSubmissionStudent)
                            ?.submissionAssignmentFiles?.map(
                              (attachment: AssignmentResourceEntity) => {
                                let f: File = new File([""], attachment.fileName, {
                                  lastModified: new Date(attachment.timemodified).getTime()
                                });
                                return {
                                  id: attachment.id,
                                  name: attachment.fileName,
                                  downloadUrl: attachment.fileUrl,
                                  size: attachment.fileSize,
                                  type: attachment.mimetype,
                                  file: f
                                };
                              }
                            ) ?? []
                        }
                        treeView={false}
                      />
                    ) : (
                      <span style={{ color: "red" }}>{t("no_data")}</span>
                    )}
                  </Box>
                </>
              ) : assignmentState.assignmentDetails?.type === "FILE" ? (
                <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                  <TextTitle translation-key='course_lecturer_submission_file'>
                    {t("course_lecturer_submission_file")}
                  </TextTitle>
                  {submissionAssignmentState.submissionAssignments.find(
                    (submission) => submission.id === assignmentSubmissionStudent
                  )?.submissionAssignmentFiles.length != 0 ? (
                    <CustomFileList
                      files={
                        submissionAssignmentState.submissionAssignments
                          .find((submission) => submission.id === assignmentSubmissionStudent)
                          ?.submissionAssignmentFiles?.map(
                            (attachment: AssignmentResourceEntity) => {
                              let f: File = new File([""], attachment.fileName, {
                                lastModified: new Date(attachment.timemodified).getTime()
                              });
                              return {
                                id: attachment.id,
                                name: attachment.fileName,
                                downloadUrl: attachment.fileUrl,
                                size: attachment.fileSize,
                                type: attachment.mimetype,
                                file: f
                              };
                            }
                          ) ?? []
                      }
                      treeView={false}
                    />
                  ) : (
                    <span style={{ color: "red" }}>{t("no_data")}</span>
                  )}
                </Box>
              ) : (
                <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                  <TextTitle translation-key='course_lecturer_submission_online_text'>
                    {t("course_lecturer_submission_online_text")}
                  </TextTitle>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content
                        ? addAttributesAndStylesToImages(content, "custom-class", css)
                        : `<span style="color: red;">${t("no_data")}</span>`
                    }}
                  />
                </Box>
              )}
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='course_lecturer_score_on_range'>
                  {t("course_lecturer_score_on_range", { range: 100 })}
                </TextTitle>
                <InputTextField
                  type='number'
                  value={assignmentMaximumGrade}
                  onChange={(e) => setAssignmentMaximumGrade(e.target.value)}
                  placeholder='Nhập điểm'
                  backgroundColor='white'
                />
              </Box>
              <Box className={classes.feedbackContainer}>
                <TextTitle translation-key='course_lecturer_grade_comment'>
                  {t("course_lecturer_grade_comment")}
                </TextTitle>
                <Box className={classes.textEditor}>
                  <TextEditor
                    style={{
                      marginTop: "10px",
                      height: "300px" // Updated height for TextEditor
                    }}
                    value={assignmentFeedback}
                    onChange={setAssignmentFeedback}
                  />
                </Box>
              </Box>
            </Container>
          </Box>
        </>
      )}
      <Box className={classes.stickyBottom}>
        <Button
          variant='contained'
          color='primary'
          className={classes.btnGrade}
          onClick={() => handleSave()}
        >
          Lưu thay đổi
        </Button>
        <Button
          variant='contained'
          color='primary'
          className={classes.btnGrade}
          onClick={() => handleSave(true)}
        >
          Lưu và tiếp tục
        </Button>
        {/* <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={openSuccessSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSuccessSnackbar(false)}
        >
          <Alert
            severity='success'
            sx={{ width: "100%" }}
            onClose={() => setOpenSuccessSnackbar(false)}
          >
            {"Chấm thành công"}
          </Alert>
        </Snackbar> */}
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={openSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSuccessSnackbar(false)}
      >
        <Alert
          severity='success'
          sx={{ width: "100%" }}
          onClose={() => setOpenSuccessSnackbar(false)}
        >
          {studentSubmissionCurrent?.isGraded
            ? t("update_grading_successful_assignment")
            : t("grading_successful_assignment")}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity='error' sx={{ width: "100%" }} onClose={() => setOpenErrorSnackbar(false)}>
          {t("grading_failed_assignment")}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
