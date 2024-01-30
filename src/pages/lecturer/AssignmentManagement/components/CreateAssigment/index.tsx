import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Card,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import Header from "components/Header";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import InputTextField from "components/common/inputs/InputTextField";
import FileManager from "components/editor/FileManager";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "utils/useWindowDimensions";
import classes from "./styles.module.scss";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";

const drawerWidth = 450;

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

export default function AssignmentCreated() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [assignmentName, setAssignmentName] = React.useState("");
  const [assignmentDescription, setAssignmentDescription] = React.useState("");
  const [activityInstructions, setActivityInstructions] = React.useState("");
  const [assignmentTypes, setAssignmentTypes] = React.useState(["Tự luận", "Nộp tệp"]);
  const [assignmentMaximumGrade, setAssignmentMaximumGrade] = React.useState(100);
  const [assignmentAllowSubmissionFromDate, setAssignmentAllowSubmissionFromDate] =
    React.useState<Dayjs | null>(dayjs());
  const [assignmentSubmissionDueDate, setAssignmentSubmissionDueDate] =
    React.useState<Dayjs | null>(dayjs());
  const [assignmentSection, setAssignmentSection] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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

  return (
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
              <ParagraphBody className={classes.linkLevel} colorName='--gray-50' fontWeight={"600"}>
                {/* TODO */}
                <span onClick={() => navigate("/")}>Quản lý khoá học</span> {"> "}
                <span onClick={() => navigate("/")}>Xem bài tập</span> {"> "}
                <span onClick={() => navigate("/lecturer/assignment-management/create")}>
                  Tạo bài tập
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
              <Heading1 fontWeight={"500"}>Tạo bài tập</Heading1>
              <InputTextField
                type='text'
                title='Tên bài tập'
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                placeholder='Nhập tên bài tập'
              />
              <Grid container spacing={1} columns={12}>
                <Grid item xs={3}>
                  <TextTitle>Mô tả bài tập</TextTitle>
                </Grid>
                <Grid item xs={9}>
                  <TextEditor value={assignmentDescription} onChange={setAssignmentDescription} />
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={3}>
                  <TextTitle>Hướng dẫn nộp bài tập</TextTitle>
                </Grid>
                <Grid item xs={9}>
                  <TextEditor value={activityInstructions} onChange={setActivityInstructions} />
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={3}>
                  <TextTitle>Tệp đính kèm (nếu có)</TextTitle>
                </Grid>
                <Grid item xs={9}>
                  <FileManager />
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
              <TextTitle>Dạng bài tập</TextTitle>
              <ChipMultipleFilter
                label='Dạng bài tập'
                defaultChipList={["Tự luận", "Nộp tệp"]}
                filterList={assignmentTypes}
                onFilterListChangeHandler={setAssignmentTypes}
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Điểm tối đa</TextTitle>
              <InputTextField
                type='number'
                value={assignmentMaximumGrade}
                onChange={(e) => setAssignmentMaximumGrade(parseInt(e.target.value))}
                placeholder='Nhập điểm tối đa'
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Cho phép nộp bài kể từ</TextTitle>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                  <DateTimePicker
                    label='Chọn ngày giờ'
                    value={assignmentAllowSubmissionFromDate}
                    onChange={(newValue) => {
                      setAssignmentAllowSubmissionFromDate(newValue);
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Hạn nộp bài</TextTitle>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                  <DateTimePicker
                    label='Chọn ngày giờ'
                    value={assignmentSubmissionDueDate}
                    onChange={(newValue) => {
                      setAssignmentSubmissionDueDate(newValue);
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Chủ đề</TextTitle>
              <FormControl sx={{ marginTop: "15px", minWidth: 120 }} fullWidth size='small'>
                <InputLabel id='select-assignment-section-label'>Chọn chủ đề</InputLabel>
                <Select
                  labelId='select-assignment-section-label'
                  id='select-assignment-section'
                  value={assignmentSection}
                  label='Chủ đề'
                  onChange={(e) => setAssignmentSection(e.target.value)}
                  fullWidth
                >
                  <MenuItem value={0}>Chủ đề 1</MenuItem>
                  <MenuItem value={1}>Chủ đề 2</MenuItem>
                  <MenuItem value={2}>Chủ đề 3</MenuItem>
                </Select>
              </FormControl>

              <LoadButton
                btnType={BtnType.Outlined}
                fullWidth
                style={{ marginTop: "20px" }}
                padding='10px'
                loading={loading}
                onClick={handleClick}
              >
                Tạo bài tập
              </LoadButton>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Grid>
  );
}
