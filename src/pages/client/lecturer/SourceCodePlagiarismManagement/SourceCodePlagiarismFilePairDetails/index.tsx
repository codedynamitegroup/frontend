import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DifferenceIcon from "@mui/icons-material/Difference";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { TabPanelProps } from "@mui/joy";
import {
  Box,
  Card,
  CssBaseline,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { CalendarIcon } from "@mui/x-date-pickers";
import Header from "components/Header";
import Button, { BtnType } from "components/common/buttons/Button";
import CodeEditor from "components/editor/CodeEditor";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import * as React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { routes } from "routes/routes";
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

interface CustomTabPanelProps extends TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: CustomTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function LecturerSourceCodePlagiarismFilePairDetails() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";
  const location = useLocation();
  const [data, setData] = React.useState({
    leftPart: {
      fileName: "sample.js",
      content: 'console.log("Hellow Wolrd")\n\nconsole.log(10 + 2)',
      createAt: "7/23/2019, 10:12 PM"
    },
    rightPart: {
      fileName: "Copy_of_sample.js",
      content: 'console.log("Hellow Wolrd")',
      createAt: "7/23/2019, 10:12 PM"
    },
    highestSimilarity: 100,
    longestFragment: 97,
    totalOverlap: 194
  });

  const [tabIndex, setTabIndex] = React.useState(0);
  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

  const handleChangeTabIndex = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <Box
        className={classes.container}
        sx={{
          marginTop: `${headerHeight + 20}px`
        }}
      >
        <CssBaseline />
        <AppBar
          position='fixed'
          sx={{
            // margin top to avoid appbar overlap with content
            marginTop: "64px",
            backgroundColor: "white"
          }}
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
              <ParagraphSmall colorname='--blue-500'>Kiểm tra gian lận</ParagraphSmall>
            </Box>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='end'
              sx={{ display: "none" }}
            >
              <MenuIcon color='action' />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Main open={true} className={classes.mainContent}>
          <DrawerHeader />
          <Card className={classes.formBody}>
            <Heading1>
              So sánh {data.leftPart.fileName} với {data.rightPart.fileName}
            </Heading1>
            <ParagraphBody>
              So sánh giữa 2 tệp code. Bạn có thể xem các đoạn code trùng lặp và khác biệt giữa 2
              tệp code.
            </ParagraphBody>
            <Card className={classes.cardWrapper}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Tabs value={tabIndex} onChange={handleChangeTabIndex} aria-label='tabIndex'>
                        <Tab icon={<JoinInnerIcon />} iconPosition='start' label='Trùng khớp' />
                        <Tab icon={<DifferenceIcon />} iconPosition='start' label='Khác nhau' />
                      </Tabs>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid container spacing={1} justifyContent='flex-end' alignItems='center'>
                        <Grid item xs={3}>
                          <Button
                            btnType={BtnType.Primary}
                            onClick={() => {
                              // Swap data.leftPart and data.rightPart
                              setData((pre) => {
                                return {
                                  ...pre,
                                  leftPart: {
                                    fileName: pre.rightPart.fileName,
                                    content: pre.rightPart.content,
                                    createAt: pre.rightPart.createAt
                                  },
                                  rightPart: {
                                    fileName: pre.leftPart.fileName,
                                    content: pre.leftPart.content,
                                    createAt: pre.leftPart.createAt
                                  }
                                };
                              });
                            }}
                          >
                            <CompareArrowsIcon />
                          </Button>
                        </Grid>
                        <Grid item xs={3}>
                          <Box className={classes.flexBoxWrapper}>
                            <ParagraphBody fontSize={"30px"} fontWeight={600}>
                              &asymp;
                            </ParagraphBody>
                            <ParagraphBody>Độ tương đồng: {data.highestSimilarity}%</ParagraphBody>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box className={classes.flexBoxWrapper}>
                            <FileCopyIcon />
                            <ParagraphBody>
                              Đoạn trùng dài nhất: {data.longestFragment}
                            </ParagraphBody>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box className={classes.flexBoxWrapper}>
                            <FileCopyOutlinedIcon />
                            <ParagraphBody>Trùng lặp tổng cộng: {data.totalOverlap}</ParagraphBody>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={tabIndex}
                    onChangeIndex={handleChangeIndex}
                  >
                    <TabPanel value={tabIndex} index={0} dir={theme.direction}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box className={classes.codeWrapper}>
                            <Box className={classes.codeHead}>
                              <Box className={classes.fileNameWrapper}>
                                <InsertDriveFileOutlinedIcon
                                  className={classes.insertDriveFileOutlinedIcon}
                                />
                                <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                  {data.leftPart.fileName}
                                </ParagraphBody>
                              </Box>
                              <Tooltip title={data.leftPart.createAt} placement='top'>
                                <Box className={classes.fileNameWrapper}>
                                  <CalendarIcon />
                                  <ParagraphBody>{data.leftPart.createAt}</ParagraphBody>
                                </Box>
                              </Tooltip>
                            </Box>
                            <Box className={classes.codeContent}>
                              <CodeEditor
                                value={data.leftPart.content}
                                readOnly={true}
                                highlightActiveLine={false}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box className={classes.codeWrapper}>
                            <Box className={classes.codeHead}>
                              <Box className={classes.fileNameWrapper}>
                                <InsertDriveFileOutlinedIcon
                                  className={classes.insertDriveFileOutlinedIcon}
                                />
                                <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                  {data.rightPart.fileName}
                                </ParagraphBody>
                              </Box>
                              <Tooltip title={data.rightPart.createAt} placement='top'>
                                <Box className={classes.fileNameWrapper}>
                                  <CalendarIcon />
                                  <ParagraphBody>{data.rightPart.createAt}</ParagraphBody>
                                </Box>
                              </Tooltip>
                            </Box>
                            <Box className={classes.codeContent}>
                              <CodeEditor
                                value={data.rightPart.content}
                                readOnly={true}
                                highlightActiveLine={false}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1} dir={theme.direction}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box className={classes.codeWrapper}>
                            <Box className={classes.codeHead}>
                              <Box className={classes.fileNameWrapper}>
                                <InsertDriveFileOutlinedIcon
                                  className={classes.insertDriveFileOutlinedIcon}
                                />
                                <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                  {data.leftPart.fileName}
                                </ParagraphBody>
                              </Box>
                              <Tooltip title={data.leftPart.createAt} placement='top'>
                                <Box className={classes.fileNameWrapper}>
                                  <CalendarIcon />
                                  <ParagraphBody>{data.leftPart.createAt}</ParagraphBody>
                                </Box>
                              </Tooltip>
                            </Box>
                            <Box className={classes.codeContent}>
                              <CodeEditor
                                value={data.leftPart.content}
                                readOnly={true}
                                highlightActiveLine={false}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box className={classes.codeWrapper}>
                            <Box className={classes.codeHead}>
                              <Box className={classes.fileNameWrapper}>
                                <InsertDriveFileOutlinedIcon
                                  className={classes.insertDriveFileOutlinedIcon}
                                />
                                <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                  {data.rightPart.fileName}
                                </ParagraphBody>
                              </Box>
                              <Tooltip title={data.rightPart.createAt} placement='top'>
                                <Box className={classes.fileNameWrapper}>
                                  <CalendarIcon />
                                  <ParagraphBody>{data.rightPart.createAt}</ParagraphBody>
                                </Box>
                              </Tooltip>
                            </Box>
                            <Box className={classes.codeContent}>
                              <CodeEditor
                                value={data.rightPart.content}
                                readOnly={true}
                                highlightActiveLine={false}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </TabPanel>
                  </SwipeableViews>
                </Grid>
              </Grid>
            </Card>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
