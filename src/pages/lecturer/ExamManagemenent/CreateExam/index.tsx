import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
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
  Link,
  Toolbar
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { GridActionsCellItem } from "@mui/x-data-grid/components/cell/GridActionsCellItem";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import Header from "components/Header";
import CustomDataGrid from "components/common/CustomDataGrid";
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import BasicDateTimePicker from "components/common/datetime/BasicDateTimePicker";
import InputTextField from "components/common/inputs/InputTextField";
import MenuPopup from "components/common/menu/MenuPopup";
import BasicSelect from "components/common/select/BasicSelect";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "utils/useWindowDimensions";
import QuestionsFeatureBar from "./components/FeatureBar";
import PickQuestionTypeToAddDialog from "./components/PickQuestionTypeToAddDialog";
import classes from "./styles.module.scss";
import PickQuestionFromQuestionBankDialog from "./components/PickQuestionFromQuestionBankDialog";
import { routes } from "routes/routes";
import PreviewIcon from "@mui/icons-material/Preview";
import PreviewMultipleChoice from "components/dialog/preview/PreviewMultipleChoice";
import qtype from "utils/constant/Qtype";
import PreviewEssay from "components/dialog/preview/PreviewEssay";
import PreviewShortAnswer from "components/dialog/preview/PreviewShortAnswer";
import PreviewTrueFalse from "components/dialog/preview/PreviewTrueFalse";

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
  AUTOSUBMIT: "autosubmit",
  GRACEPERIOD: "graceperiod",
  AUTOABANDON: "autoabandon"
};

export default function ExamCreated() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [examName, setExamName] = React.useState("");
  const [examDescription, setExamDescription] = React.useState("");
  const [examMaximumGrade, setExamMaximumGrade] = React.useState(100);
  const [examOpenTime, setExamOpenTime] = React.useState<Dayjs | null>(dayjs());
  const [examCloseTime, setExamCloseTime] = React.useState<Dayjs | null>(dayjs());
  const [examTimeLimitUnit, setExamTimeLimitUnit] = React.useState("minutes");
  const [examTimeLimitNumber, setExamTimeLimitNumber] = React.useState(0);
  const [examTimeLimitEnabled, setExamTimeLimitEnabled] = React.useState(false);
  const [assignmentSection, setAssignmentSection] = React.useState("0");
  const [overdueHandling, setOverdueHandling] = React.useState<string>(OVERDUE_HANDLING.AUTOSUBMIT);
  const [maxAttempts, setMaxAttempts] = React.useState(0);
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
  const [openPreviewTrueFalse, setOpenPreviewTrueFalse] = React.useState(false);
  const questionList = [
    {
      id: 4,
      name: "Trắc nghiệm lập trình C++",
      description: "Hãy cho biết con trỏ trong C++ là gì?",
      max_grade: 10,
      type: {
        value: qtype.multiple_choice.code,
        label: "Trắc nghiệm"
      }
    },
    {
      id: 2,
      name: "Câu hỏi về phát triển phần mềm",
      description: "Who is the father of Software Engineering?",
      max_grade: 10,
      type: {
        value: qtype.essay.code,
        label: "Tự luận"
      }
    },
    {
      id: 3,
      name: "Câu hỏi về phát triển phần mềm",
      description: "What is the full form of HTML?",
      max_grade: 10,
      type: {
        value: qtype.short_answer.code,
        label: "Trả lời ngắn"
      }
    },
    {
      id: 1,
      name: "Câu hỏi về phát triển phần mềm",
      description: "HTML stands for Hyper Text Markup Language",
      max_grade: 10,
      type: {
        value: qtype.true_false.code,
        label: "Đúng/Sai"
      }
    }
  ];
  const tableHeading: GridColDef[] = React.useMemo(
    () => [
      { field: "id", headerName: "STT", minWidth: 1 },
      {
        field: "name",
        headerName: "Tên câu hỏi",
        minWidth: 250,
        renderCell: (params) => <Link href={`${params.row.id}`}>{params.value}</Link>
      },
      {
        field: "description",
        headerName: "Mô tả câu hỏi",
        minWidth: 500
      },
      {
        field: "max_grade",
        headerName: "Điểm tối đa",
        minWidth: 50,
        renderCell: (params) => (
          <InputTextField
            type='number'
            value={params.value}
            onChange={(e) => console.log(e.target.value)}
            placeholder='Nhập điểm tối đa'
            backgroundColor='white'
          />
        )
      },
      {
        field: "type",
        headerName: "Kiểu",
        minWidth: 150,
        renderCell: (params) => <ParagraphBody>{params.value.label}</ParagraphBody>
      },
      {
        field: "action",
        headerName: "Hành động",
        type: "actions",
        minWidth: 200,
        getActions: (params) => [
          <GridActionsCellItem icon={<EditIcon />} label='Edit' />,
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
          />,
          <GridActionsCellItem icon={<DeleteIcon />} label='Delete' />
        ]
      }
    ],
    []
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

  const handleOpenAddNewQuestionDialog = () => {
    setIsAddNewQuestionDialogOpen(true);
  };

  const handleCloseAddNewQuestionDialog = () => {
    setIsAddNewQuestionDialogOpen(false);
  };

  const handleOpenAddQuestionFromBankDialog = () => {
    setIsAddQuestionFromBankDialogOpen(true);
  };

  const handleCloseAddQuestionFromBankDialog = () => {
    setIsAddQuestionFromBankDialogOpen(false);
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
        navigate(routes.lecturer.question.essay.create);
        break;
      case "multiple-choice":
        navigate(routes.lecturer.question.multiple_choice.create);
        break;
      case "short-answer":
        navigate(routes.lecturer.question.short_answer.create);
        break;
      case "true-false":
        navigate(routes.lecturer.question.true_false.create);
        break;
      default:
        break;
    }
    handleCloseAddNewQuestionDialog();
  };

  // Auto close drawer when screen width < 1080 and open drawer when screen width > 1080
  React.useEffect(() => {
    if (width < 1080) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

  return (
    <>
      <PickQuestionTypeToAddDialog
        open={isAddNewQuestionDialogOpen}
        handleClose={handleCloseAddNewQuestionDialog}
        title='Chọn kiểu câu hỏi muốn thêm'
        cancelText='Hủy bỏ'
        confirmText='Thêm'
        onHanldeConfirm={onClickConfirmAddNewQuestion}
        onHandleCancel={handleCloseAddNewQuestionDialog}
        questionType={questionType}
        handleChangeQuestionType={handleChangeQuestionType}
      />
      <PreviewMultipleChoice
        open={openPreviewMultipleChoiceDialog}
        setOpen={setOpenPreviewMultipleChoiceDialog}
        aria-labelledby={"customized-dialog-title1"}
        maxWidth='md'
        fullWidth
      />
      <PreviewEssay
        open={openPreviewEssay}
        setOpen={setOpenPreviewEssay}
        aria-labelledby={"customized-dialog-title2"}
        maxWidth='md'
        fullWidth
      />
      <PreviewShortAnswer
        open={openPreviewShortAnswer}
        setOpen={setOpenPreviewShortAnswer}
        aria-labelledby={"customized-dialog-title3"}
        maxWidth='md'
        fullWidth
      />
      <PreviewTrueFalse
        open={openPreviewTrueFalse}
        setOpen={setOpenPreviewTrueFalse}
        aria-labelledby={"customized-dialog-title4"}
        maxWidth='md'
        fullWidth
      />

      <PickQuestionFromQuestionBankDialog
        open={isAddQuestionFromBankDialogOpen}
        handleClose={handleCloseAddQuestionFromBankDialog}
        title='Thêm từ ngân hàng câu hỏi'
        cancelText='Hủy bỏ'
        confirmText='Thêm'
        onHanldeConfirm={handleCloseAddQuestionFromBankDialog}
        onHandleCancel={handleCloseAddQuestionFromBankDialog}
        categoryPickTitle='Chọn danh mục'
        categoryList={[
          {
            value: "0",
            label: "Danh mục 1"
          },
          {
            value: "1",
            label: "Danh mục 2"
          },
          {
            value: "2",
            label: "Danh mục 3"
          }
        ]}
      />
      <Grid className={classes.root}>
        <Header />
        <Box className={classes.container}>
          <CssBaseline />
          <AppBar
            position='absolute'
            sx={{
              // margin top to avoid appbar overlap with content
              marginTop: "64px",
              backgroundColor: "white"
            }}
            open={open}
          >
            <Toolbar>
              <Box className={classes.tabWrapper}>
                <ParagraphBody
                  className={classes.linkLevel}
                  colorName='--gray-50'
                  fontWeight={"600"}
                >
                  {/* TODO */}
                  <span onClick={() => navigate(routes.lecturer.course.management)}>
                    Quản lý khoá học
                  </span>{" "}
                  {"> "}
                  <span onClick={() => navigate("/")}>CS202 - Nhập môn lập trình</span> {"> "}
                  <span onClick={() => navigate(routes.lecturer.course.assignment)}>
                    Xem bài tập
                  </span>{" "}
                  {"> "}
                  <span onClick={() => navigate(routes.lecturer.exam.create)}>
                    Tạo bài kiểm tra
                  </span>
                </ParagraphBody>
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
          <Main open={open} className={classes.mainContent}>
            <DrawerHeader />
            <Card>
              <Box component='form' className={classes.formBody} autoComplete='off'>
                <Heading1 fontWeight={"500"}>Tạo bài kiểm tra</Heading1>
                <InputTextField
                  type='text'
                  title='Tên bài kiểm tra'
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder='Nhập tên bài kiểm tra'
                  backgroundColor='white'
                />
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={3}>
                    <TextTitle>Mô tả bài kiểm tra</TextTitle>
                  </Grid>
                  <Grid item xs={9}>
                    <TextEditor value={examDescription} onChange={setExamDescription} />
                  </Grid>
                </Grid>
                <MenuPopup
                  style={{
                    marginTop: "20px"
                  }}
                  popupId='add-question-popup'
                  triggerButtonText='Thêm câu hỏi'
                  triggerButtonProps={{
                    width: "150px"
                  }}
                  btnType={BtnType.Outlined}
                  menuItems={[
                    {
                      label: "Tạo câu hỏi mới",
                      onClick: onCreateNewQuestion
                    },
                    {
                      label: "Từ ngân hàng câu hỏi",
                      onClick: onAddQuestionFromBank
                    }
                  ]}
                />
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Heading1 fontWeight={"500"}>Danh sách câu hỏi</Heading1>
                  </Grid>
                  <Grid item xs={12}>
                    <QuestionsFeatureBar
                      colSearchLabel='Tìm kiếm theo cột'
                      shuffleQuestionsLabel='Xáo trộn câu hỏi'
                      colItems={[
                        { label: "Tên câu hỏi", value: "name" },
                        { label: "Kiểu", value: "type" }
                      ]}
                    />
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
                position: "relative",
                top: "-20px"
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
                <TextTitle>Điểm tối đa</TextTitle>
                <InputTextField
                  type='number'
                  value={examMaximumGrade}
                  onChange={(e) => setExamMaximumGrade(parseInt(e.target.value))}
                  placeholder='Nhập điểm tối đa'
                  backgroundColor='#D9E2ED'
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Thời gian mở bài kiểm tra</TextTitle>
                <BasicDateTimePicker
                  value={examOpenTime}
                  onHandleValueChange={(newValue) => {
                    setExamOpenTime(newValue);
                  }}
                  backgroundColor='#D9E2ED'
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Thời gian đóng bài kiểm tra</TextTitle>
                <BasicDateTimePicker
                  value={examCloseTime}
                  onHandleValueChange={(newValue) => {
                    setExamCloseTime(newValue);
                  }}
                  backgroundColor='#D9E2ED'
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Thời gian làm bài</TextTitle>
                <Grid container spacing={1} gap={1} columns={12}>
                  <Grid item xs={4}>
                    <InputTextField
                      type='number'
                      value={examTimeLimitNumber}
                      onChange={(e) => setExamTimeLimitNumber(parseInt(e.target.value))}
                      placeholder='Nhập số lượng'
                      disabled={!examTimeLimitEnabled}
                      backgroundColor='#D9E2ED'
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <BasicSelect
                      labelId='select-exam-time-limit-unit-label'
                      value={examTimeLimitUnit}
                      onHandleChange={(value) => setExamTimeLimitUnit(value)}
                      style={{ marginTop: "8px" }}
                      items={[
                        {
                          value: "weeks",
                          label: "Tuần"
                        },
                        {
                          value: "days",
                          label: "Ngày"
                        },
                        {
                          value: "hours",
                          label: "Giờ"
                        },
                        {
                          value: "minutes",
                          label: "Phút"
                        },
                        {
                          value: "seconds",
                          label: "Giây"
                        }
                      ]}
                      disabled={!examTimeLimitEnabled}
                      backgroundColor='#D9E2ED'
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
                      label='Bật'
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Khi hết thời gian</TextTitle>
                <BasicSelect
                  labelId='select-assignment-overdue-handling-label'
                  value={overdueHandling}
                  onHandleChange={(value) => setOverdueHandling(value)}
                  items={[
                    {
                      value: OVERDUE_HANDLING.AUTOSUBMIT,
                      label: "Nộp bài tự động khi hết thời gian"
                    },
                    {
                      value: OVERDUE_HANDLING.GRACEPERIOD,
                      label:
                        "Có khoảng thời gian ngắn để nộp bài khi hết thời gian, nhưng không thể thay đổi bài làm"
                    },
                    {
                      value: OVERDUE_HANDLING.AUTOABANDON,
                      label: "Tự động hủy bài làm khi hết thời gian"
                    }
                  ]}
                  backgroundColor='#D9E2ED'
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Số lần làm lại tối đa</TextTitle>
                <BasicSelect
                  labelId='select-assignment-max-attempts-label'
                  value={maxAttempts.toString()}
                  onHandleChange={(value) => setMaxAttempts(Number(value))}
                  items={[
                    {
                      value: "0",
                      label: "Không giới hạn số lần làm lại"
                    },
                    ...Array.from(Array(10).keys()).map((i) => ({
                      value: (i + 1).toString(),
                      label: (i + 1).toString()
                    }))
                  ]}
                  backgroundColor='#D9E2ED'
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Tính khả dụng</TextTitle>
                <BasicSelect
                  labelId='select-assignment-availability-label'
                  value={assignmentAvailability}
                  onHandleChange={(value) => setAssignmentAvailability(value)}
                  items={[
                    {
                      value: "0",
                      label: "Hiện và có thể truy cập trên trang khoá học"
                    },
                    {
                      value: "1",
                      label: "Ẩn và không thể truy cập trên trang khoá học"
                    },
                    {
                      value: "2",
                      label: "Ẩn nhưng có thể truy cập nếu giảng viên cung cấp đường dẫn"
                    }
                  ]}
                  backgroundColor='#D9E2ED'
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Chủ đề</TextTitle>
                <BasicSelect
                  labelId='select-assignment-section-label'
                  value={assignmentSection}
                  onHandleChange={(value) => setAssignmentSection(value)}
                  items={[
                    {
                      value: "0",
                      label: "Chủ đề 1"
                    },
                    {
                      value: "1",
                      label: "Chủ đề 2"
                    },
                    {
                      value: "2",
                      label: "Chủ đề 3"
                    }
                  ]}
                  backgroundColor='#D9E2ED'
                />
              </Box>
              <LoadButton
                btnType={BtnType.Outlined}
                fullWidth
                style={{ marginTop: "20px" }}
                padding='10px'
                loading={loading}
                onClick={handleClick}
              >
                Tạo bài kiểm tra
              </LoadButton>
            </Box>
          </Drawer>
        </Box>
      </Grid>
    </>
  );
}
