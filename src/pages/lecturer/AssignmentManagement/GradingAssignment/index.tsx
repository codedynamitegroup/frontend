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
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "utils/useWindowDimensions";
import classes from "./styles.module.scss";

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
  const [assignmentTypes, setAssignmentTypes] = React.useState(["Tự luận", "Nộp tệp"]);
  const [assignmentMaximumGrade, setAssignmentMaximumGrade] = React.useState(100);
  const [loading, setLoading] = React.useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = React.useState("");
  const [assignmentSubmissionStudent, setAssignmentSubmissionStudent] = React.useState("0");

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
                <span onClick={() => navigate("/")}>Bài tập 1</span> {"> "}
                <span
                  onClick={() => navigate("/lecturer/assignment-management/:submissionId/grading")}
                >
                  Đánh giá
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
            <iframe
              title='grading-pdf'
              style={{ width: "100%", height: "100vh" }}
              src='http://localhost:3000/grading-pdf'
            />
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
                readOnly={true}
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Sinh viên</TextTitle>
              <FormControl sx={{ marginTop: "15px", minWidth: 120 }} fullWidth size='small'>
                <InputLabel id='select-assignment-submission-student-label'>
                  Chọn sinh viên
                </InputLabel>
                <Select
                  labelId='select-assignment-submission-student-label'
                  id='select-assignment-submission-student'
                  value={assignmentSubmissionStudent}
                  label='Chọn sinh viên'
                  onChange={(e) => setAssignmentSubmissionStudent(e.target.value)}
                  fullWidth
                >
                  <MenuItem value={0}>
                    <Box>
                      <TextTitle fontWeight={"500"}>Nguyễn Văn A</TextTitle>
                      <ParagraphBody colorName='--gray-50'>MSSV: 123456789</ParagraphBody>
                    </Box>
                  </MenuItem>
                  <MenuItem value={1}>
                    <Box>
                      <TextTitle fontWeight={"500"}>Nguyễn Văn B</TextTitle>
                      <ParagraphBody colorName='--gray-50'>MSSV: 123456789</ParagraphBody>
                    </Box>
                  </MenuItem>
                  <MenuItem value={2}>
                    <Box>
                      <TextTitle fontWeight={"500"}>Nguyễn Văn C</TextTitle>
                      <ParagraphBody colorName='--gray-50'>MSSV: 123456789</ParagraphBody>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Điểm trên thang điểm 100</TextTitle>
              <InputTextField
                type='number'
                value={assignmentMaximumGrade}
                onChange={(e) => setAssignmentMaximumGrade(parseInt(e.target.value))}
                placeholder='Nhập điểm tối đa'
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Nhận xét</TextTitle>
              <TextEditor
                style={{
                  marginTop: "10px"
                }}
                value={assignmentFeedback}
                onChange={setAssignmentFeedback}
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
              Đánh giá
            </LoadButton>
          </Box>
        </Drawer>
      </Box>
    </Grid>
  );
}
