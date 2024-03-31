import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  Box,
  Card,
  Chip,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
  Stack
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import Header from "components/Header";
import CustomDataGrid from "components/common/CustomDataGrid";
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import InputTextField from "components/common/inputs/InputTextField";
import SearchBar from "components/common/search/SearchBar";

import EditImageIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Button from "components/common/buttons/Button";
import CustomNumberInput from "components/common/inputs/CustomNumberInput";
import PreviewEssay from "components/dialog/preview/PreviewEssay";
import PreviewMultipleChoice from "components/dialog/preview/PreviewMultipleChoice";
import PreviewShortAnswer from "components/dialog/preview/PreviewShortAnswer";
import PreviewTrueFalse from "components/dialog/preview/PreviewTrueFalse";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import dayjs from "dayjs";
import useBoxDimensions from "hooks/useBoxDimensions";
import useWindowDimensions from "hooks/useWindowDimensions";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import { millisToHoursAndMinutesString } from "utils/time";
import classes from "./styles.module.scss";
import BasicSelect from "components/common/select/BasicSelect";
import { grey } from "@mui/material/colors";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const drawerWidth = 450;

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

enum EGradingStatus {
  GRADED,
  QUEUED,
  GRADING
}
export default function GradingExam() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [openPreviewMultipleChoiceDialog, setOpenPreviewMultipleChoiceDialog] =
    React.useState(false);
  const [openPreviewEssay, setOpenPreviewEssay] = React.useState(false);
  const [openPreviewShortAnswer, setOpenPreviewShortAnswer] = React.useState(false);
  const [openPreviewTrueFalse, setOpenPreviewTrueFalse] = React.useState(false);
  const [assignmentMaximumGrade, setAssignmentMaximumGrade] = React.useState(100);
  const [loading, setLoading] = React.useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = React.useState("");
  const examOpenTime = dayjs();
  const examCloseTime = dayjs();
  const examLimitTimeInMillis = 1000000;
  const examDescriptionRawHTML = `
    <div>
    <p>Đây là mô tả bài kiểm tra</p>
    </div>
    `;
  const [questionList, setQuestionList] = React.useState([
    {
      id: 4,
      name: "Trắc nghiệm lập trình C++",
      description: "Hãy cho biết con trỏ trong C++ là gì?",
      grade: 0,
      max_grade: 10,
      type: {
        value: qtype.multiple_choice.code,
        label: "Trắc nghiệm"
      },
      isOpenEditTitle: false
    },
    {
      id: 2,
      name: "Câu hỏi về phát triển phần mềm",
      description: "Who is the father of Software Engineering?",
      grade: 0,
      max_grade: 10,
      type: {
        value: qtype.essay.code,
        label: "Tự luận"
      },
      isOpenEditTitle: false
    },
    {
      id: 3,
      name: "Câu hỏi về phát triển phần mềm",
      description: "What is the full form of HTML?",
      grade: 0,
      max_grade: 10,
      type: {
        value: qtype.short_answer.code,
        label: "Trả lời ngắn"
      },
      isOpenEditTitle: false
    },
    {
      id: 1,
      name: "Câu hỏi về phát triển phần mềm",
      description: "HTML stands for Hyper Text Markup Language",
      grade: 0,
      max_grade: 10,
      type: {
        value: qtype.true_false.code,
        label: "Đúng/Sai"
      },
      isOpenEditTitle: false
    }
  ]);

  const handleToggleEditTitle = React.useCallback(
    (id: number) => {
      setQuestionList((prev) => {
        const newList = prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              isOpenEditTitle: !item.isOpenEditTitle
            };
          }
          return item;
        });
        return newList;
      });
    },
    [setQuestionList]
  );

  const tableHeading: GridColDef[] = React.useMemo(
    () =>
      [
        { field: "id", headerName: "STT", minWidth: 1 },
        {
          field: "name",
          headerName: t("exam_management_create_question_name"),
          minWidth: 250
        },
        {
          field: "grade",
          headerName: t("common_grade"),
          minWidth: 150,
          renderCell: (params) => {
            const maxGrade = questionList.find((item) => item.id === params.row.id)?.max_grade;
            const isOpenEditTitle = questionList.find(
              (item) => item.id === params.row.id
            )?.isOpenEditTitle;
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {isOpenEditTitle ? (
                  <CustomNumberInput
                    value={params.value || 0}
                    onChange={(value) => {
                      setQuestionList((prev) => {
                        const newList = prev.map((item) => {
                          if (item.id === params.row.id) {
                            return {
                              ...item,
                              grade: value
                            };
                          }
                          return item;
                        });
                        return newList;
                      });
                    }}
                    maxWidth='70px'
                    min={0}
                    max={maxGrade}
                    step={1}
                  />
                ) : (
                  <Typography align='center'>{params.value}</Typography>
                )}

                <Box>
                  {!isOpenEditTitle ? (
                    <IconButton
                      onClick={() => handleToggleEditTitle(params.row.id)}
                      className={classes.editTopicTitleImageContainer}
                    >
                      <EditImageIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleToggleEditTitle(params.row.id)}
                      className={classes.editTopicTitleImageContainer}
                    >
                      <SaveIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            );
          }
        },
        {
          field: "max_grade",
          headerName: t("assignment_management_max_score"),
          minWidth: 150
        },
        {
          field: "type",
          headerName: t("exam_management_create_question_type"),
          minWidth: 150,
          renderCell: (params) => <ParagraphBody>{params.value.label}</ParagraphBody>
        },
        {
          field: "action",
          headerName: t("common_action"),
          type: "actions",
          flex: 1,
          getActions: (params) => [
            <GridActionsCellItem
              onClick={() => {
                switch (params.row.type.value) {
                  case qtype.multiple_choice.code:
                    setOpenPreviewMultipleChoiceDialog(!openPreviewMultipleChoiceDialog);
                    break;
                  case qtype.essay.code:
                    setOpenPreviewEssay(!openPreviewEssay);
                    break;
                  case qtype.short_answer.code:
                    setOpenPreviewShortAnswer(!openPreviewShortAnswer);
                    break;
                  case qtype.true_false.code:
                    setOpenPreviewTrueFalse(!openPreviewTrueFalse);
                    break;
                }
              }}
              icon={<PreviewIcon />}
              label='Preview'
            />
          ]
        }
      ] as GridColDef[],
    [
      t,
      questionList,
      openPreviewMultipleChoiceDialog,
      openPreviewEssay,
      openPreviewShortAnswer,
      openPreviewTrueFalse,
      handleToggleEditTitle
    ]
  );
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

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  function handleClick() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Auto close drawer when screen width < 1080 and open drawer when screen width > 1080
  React.useEffect(() => {
    if (width < 1080) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);
  const [openChooseStudent, setOpenChooseStudent] = React.useState(false);
  const studentData = [
    { id: "123456", name: "Nguyễn văn A", status: EGradingStatus.GRADING },
    { id: "12346", name: "Nguyễn văn A", status: EGradingStatus.QUEUED },
    { id: "1234356", name: "Nguyễn văn A", status: EGradingStatus.GRADED }
  ];
  const chooseStudentHeading: GridColDef[] = [
    { field: "id", headerName: "Mssv", flex: 1 },
    { field: "name", headerName: "Tên", flex: 2 },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params) =>
        params.value === EGradingStatus.GRADED ? (
          <Chip label='Đã chấm' sx={{ backgroundColor: "#c7f7d4", color: "#00e676" }} />
        ) : params.value === EGradingStatus.QUEUED ? (
          <Chip label='Chưa chấm' />
        ) : (
          <Chip
            label='Đang chấm'
            sx={{ backgroundColor: "rgb(190, 215, 243)", color: "rgb(25, 118, 210)" }}
          />
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
  const [dumvalue, setDumvalue] = React.useState("123456789 - Nguyễn Văn A");
  const [gradingStatus, setGradingStatus] = React.useState(0);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const header2Ref = React.useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({
    ref: header2Ref
  });

  return (
    <>
      <>
        <PreviewMultipleChoice
          open={openPreviewMultipleChoiceDialog}
          setOpen={setOpenPreviewMultipleChoiceDialog}
          aria-labelledby={"customized-dialog-title1"}
          maxWidth='md'
          fullWidth
          value={"1"}
          readOnly={true}
        />
        <PreviewEssay
          grading={true}
          open={openPreviewEssay}
          setOpen={setOpenPreviewEssay}
          aria-labelledby={"customized-dialog-title2"}
          maxWidth='md'
          fullWidth
          value={"Cha đẻ của SE là Moses"}
          readOnly={true}
        />
        <PreviewShortAnswer
          open={openPreviewShortAnswer}
          setOpen={setOpenPreviewShortAnswer}
          aria-labelledby={"customized-dialog-title3"}
          maxWidth='md'
          fullWidth
          value={"Hyper Text Markup Language"}
          readOnly={true}
        />
        <PreviewTrueFalse
          open={openPreviewTrueFalse}
          setOpen={setOpenPreviewTrueFalse}
          aria-labelledby={"customized-dialog-title4"}
          maxWidth='md'
          fullWidth
          value={"1"}
          readOnly={true}
        />
      </>

      <Grid className={classes.root}>
        <Header ref={headerRef} />
        <Box
          className={classes.container}
          sx={{
            marginTop: `${headerHeight}px`
          }}
        >
          <CssBaseline />
          <AppBar
            position='fixed'
            sx={{
              top: `${headerHeight}px`,
              backgroundColor: "white"
            }}
            ref={header2Ref}
            open={open}
          >
            <Toolbar>
              <Box id={classes.breadcumpWrapper}>
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.course.management)}
                  translation-key='common_course_management'
                >
                  {t("common_course_management")}
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
                  translation-key='course_detail_assignment_list'
                >
                  {t("course_detail_assignment_list")}
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
                <ParagraphSmall colorname='--blue-500'>Đánh giá</ParagraphSmall>
              </Box>
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
              <Box className={classes.formBody}>
                <Heading1>Bài kiểm tra 1</Heading1>
                <ParagraphSmall fontWeight={"600"}>MSSV: 123456789</ParagraphSmall>
                <Card className={classes.pageActivityHeader}>
                  <Grid container direction='row' alignItems='center' gap={1}>
                    <Grid item>
                      <ParagraphSmall
                        fontWeight={"600"}
                        translation-key='course_assignment_detail_open_time'
                      >
                        {t("course_assignment_detail_open_time")}:
                      </ParagraphSmall>
                    </Grid>
                    <Grid item>
                      <ParagraphBody>
                        {examOpenTime
                          ?.toDate()
                          .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
                      </ParagraphBody>
                    </Grid>
                  </Grid>
                  <Grid container direction='row' alignItems='center' gap={1}>
                    <Grid item>
                      <ParagraphSmall
                        fontWeight={"600"}
                        translation-key='course_assignment_detail_close_time'
                      >
                        {t("course_assignment_detail_close_time")}:
                      </ParagraphSmall>
                    </Grid>
                    <Grid item>
                      <ParagraphBody>
                        {examCloseTime
                          ?.toDate()
                          .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
                      </ParagraphBody>
                    </Grid>
                  </Grid>
                  <Grid container direction='row' alignItems='center' gap={1}>
                    <Grid item>
                      <ParagraphSmall fontWeight={"600"} translation-key='common_do_time'>
                        {t("common_do_time")}:
                      </ParagraphSmall>
                    </Grid>
                    <Grid item>
                      <ParagraphBody>
                        {millisToHoursAndMinutesString(examLimitTimeInMillis)}
                      </ParagraphBody>
                    </Grid>
                  </Grid>
                  <Divider
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px"
                    }}
                  />
                  <Box className={classes.examDescription}>
                    <div dangerouslySetInnerHTML={{ __html: examDescriptionRawHTML }}></div>
                  </Box>
                </Card>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Heading2 translation-key='exam_management_create_question_list'>
                      {t("exam_management_create_question_list")}
                    </Heading2>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomDataGrid
                      dataList={questionList}
                      tableHeader={tableHeading}
                      onSelectData={rowSelectionHandler}
                      visibleColumn={visibleColumnList}
                      dataGridToolBar={dataGridToolbar}
                      page={page}
                      pageSize={pageSize}
                      totalElement={totalElement}
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
                top: `${headerHeight}px`
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
                  <ParagraphBody>123456789 - Nguyễn Văn A</ParagraphBody> <ArrowDropDownIcon />
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

                                <MenuItem value={1}>Đang chấm</MenuItem>
                                <MenuItem value={2}>Chưa chấm</MenuItem>
                                <MenuItem value={3}>Đã chấm</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                    <CustomDataGrid
                      dataList={studentData}
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
                      totalElement={totalElement}
                      onPaginationModelChange={pageChangeHandler}
                      showVerticalCellBorder={true}
                      getRowHeight={() => "auto"}
                      onClickRow={(params, event) => {
                        if (params.row.status === EGradingStatus.GRADING)
                          event.defaultMuiPrevented = true;
                        else setOpenChooseStudent(false);
                      }}
                      // slots={{toolbar:}}
                      // columnGroupingModel={columnGroupingModelPlus}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button btnType={BtnType.Primary} onClick={() => setOpenChooseStudent(false)}>
                      Đóng
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* <BasicSelect
                  labelId='select-assignment-submission-student-label'
                  value={dumvalue}
                  onHandleChange={(value) => setDumvalue(value)}
                  onClick={() => setOpenChooseStudent(true)}
                  items={[
                    {
                      value: "0",
                      label: "123456789 - Nguyễn Văn A",
                      customNode: (
                        <Box>
                          <TextTitle fontWeight={"500"}>Nguyễn Văn A</TextTitle>
                          <ParagraphBody colorname='--gray-50'>
                            MSSV: 123456789 - đã chấm
                          </ParagraphBody>
                        </Box>
                      )
                    },
                    {
                      value: "1",
                      label: "123456789 - Nguyễn Văn B",
                      customNode: (
                        <Box>
                          <TextTitle fontWeight={"500"}>Nguyễn Văn B</TextTitle>
                          <ParagraphBody colorname='--gray-50'>
                            MSSV: 123456789 - đang chấm
                          </ParagraphBody>
                        </Box>
                      )
                    },
                    {
                      value: "2",
                      label: "123456789 - Nguyễn Văn C",
                      customNode: (
                        <Box>
                          <TextTitle fontWeight={"500"}>Nguyễn Văn C</TextTitle>
                          <ParagraphBody colorname='--gray-50'>
                            MSSV: 123456789 - đang chấm
                          </ParagraphBody>
                        </Box>
                      )
                    },
                    {
                      value: "3",
                      label: "123456789 - Nguyễn Văn D",
                      customNode: (
                        <Box>
                          <TextTitle fontWeight={"500"}>Nguyễn Văn C</TextTitle>
                          <ParagraphBody colorname='--gray-50'>
                            MSSV: 123456789 - chưa chấm
                          </ParagraphBody>
                        </Box>
                      )
                    }
                  ]}
                  backgroundColor='#D9E2ED'
                /> */}
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='course_lecturer_score_on_range'>
                  {t("course_lecturer_score_on_range", { range: 100 })}
                </TextTitle>
                <InputTextField
                  type='number'
                  value={assignmentMaximumGrade}
                  onChange={(e) => setAssignmentMaximumGrade(parseInt(e.target.value))}
                  placeholder={t("exam_management_create_enter_score")}
                  backgroundColor='#D9E2ED'
                  translation-key='exam_management_create_enter_score'
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='course_lecturer_grade_comment'>
                  {t("course_lecturer_grade_comment")}
                </TextTitle>
                <Box className={classes.textEditor}>
                  <TextEditor
                    style={{
                      marginTop: "10px"
                    }}
                    value={assignmentFeedback}
                    onChange={setAssignmentFeedback}
                  />
                </Box>
              </Box>
              <LoadButton
                btnType={BtnType.Outlined}
                fullWidth
                style={{ marginTop: "20px" }}
                padding='10px'
                loading={loading}
                onClick={handleClick}
                translation-key='course_lecturer_evaluate'
              >
                {t("course_lecturer_evaluate")}
              </LoadButton>
            </Box>
          </Drawer>
        </Box>
      </Grid>
    </>
  );
}
