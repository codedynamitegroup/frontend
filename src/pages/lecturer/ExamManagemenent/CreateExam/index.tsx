import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Card,
  Checkbox,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Toolbar
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import Header from "components/Header";
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import BasicDateTimePicker from "components/common/datetime/BasicDateTimePicker";
import InputTextField from "components/common/inputs/InputTextField";
import MenuPopup from "components/common/menu/MenuPopup";
import BasicRadioGroup from "components/common/radio/BasicRadioGroup";
import BasicSelect from "components/common/select/BasicSelect";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "utils/useWindowDimensions";
import PickQuestionTypeToAddDialog from "./components/PickQuestionTypeToAddDialog";
import classes from "./styles.module.scss";

const drawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
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
  const [questionType, setQuestionType] = React.useState("essay");

  const [loading, setLoading] = React.useState(false);
  const [assignmentAvailability, setAssignmentAvailability] = React.useState("0");

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

  const onCreateNewQuestion = async (popupState: any) => {
    console.log("Tạo câu hỏi mới");
    handleOpenAddNewQuestionDialog();
    popupState.close();
  };

  const onAddQuestionFromBank = async (popupState: any) => {
    console.log("Từ ngân hàng câu hỏi");
    popupState.close();
  };

  const handleChangeQuestionType = (value: string) => {
    setQuestionType(value);
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
        onHanldeConfirm={handleCloseAddNewQuestionDialog}
      >
        <Grid container spacing={1} columns={12} minWidth='450px'>
          <Grid item xs={6}>
            <TextTitle paddingBottom='10px'>Câu hỏi</TextTitle>
            <FormControl
              component='fieldset'
              sx={{
                maxHeight: "200px",
                overflowY: "auto"
              }}
            >
              <BasicRadioGroup
                ariaLabel='question-type'
                value={questionType}
                handleChangeQuestionType={handleChangeQuestionType}
                items={[
                  { value: "essay", label: "Essay" },
                  { value: "multiple-choice", label: "Multiple choice" },
                  { value: "short-answer", label: "Short answer" },
                  { value: "true-false", label: "True/False" }
                ]}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <ParagraphBody>
              {/* Display the description of the selected question type description */}
              {questionType === "essay" && "Câu hỏi tự luận"}
              {questionType === "multiple-choice" && "Câu hỏi trắc nghiệm"}
              {questionType === "short-answer" && "Câu hỏi trả lời ngắn"}
              {questionType === "true-false" && "Câu hỏi đúng/sai"}
            </ParagraphBody>
          </Grid>
        </Grid>
      </PickQuestionTypeToAddDialog>
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
                  <span onClick={() => navigate("/")}>Quản lý khoá học</span> {"> "}
                  <span onClick={() => navigate("/")}>CS202 - Nhập môn lập trình</span> {"> "}
                  <span onClick={() => navigate("/")}>Xem bài tập</span> {"> "}
                  <span onClick={() => navigate("/lecturer/exam-management/create")}>
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
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Thời gian mở bài kiểm tra</TextTitle>
                <BasicDateTimePicker
                  value={examOpenTime}
                  onHandleValueChange={(newValue) => {
                    setExamOpenTime(newValue);
                  }}
                />
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>Thời gian đóng bài kiểm tra</TextTitle>
                <BasicDateTimePicker
                  value={examCloseTime}
                  onHandleValueChange={(newValue) => {
                    setExamCloseTime(newValue);
                  }}
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
