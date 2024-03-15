import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DifferenceIcon from "@mui/icons-material/Difference";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Card,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
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
import { routes } from "routes/routes";
import { DolosCustomFile } from "../SourceCodePlagiarismOverview";
import classes from "./styles.module.scss";
import CodeMirrorMerge from "react-codemirror-merge";
import { githubLight } from "@uiw/codemirror-theme-github";
import { EditorState, EditorView } from "@uiw/react-codemirror";

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

export default function LecturerSourceCodePlagiarismFilePairDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";
  const location = useLocation();
  const codeHeadRef = React.useRef<HTMLDivElement>(null);
  const { height: codeHeadHeight } = useBoxDimensions({
    ref: codeHeadRef
  });

  const [data, setData] = React.useState<{
    id: string;
    leftFile: DolosCustomFile;
    rightFile: DolosCustomFile;
    leftCovered: number;
    rightCovered: number;
    leftTotal: number;
    rightTotal: number;
    longestFragment: number;
    highestSimilarity: number;
    totalOverlap: number;
    buildFragments: {
      left: {
        startRow: number;
        startCol: number;
        endRow: number;
        endCol: number;
      };
      right: {
        startRow: number;
        startCol: number;
        endRow: number;
        endCol: number;
      };
    }[];
  }>(
    location.state?.data || {
      id: "1",
      leftFile: {
        id: "1",
        path: "",
        charCount: 0,
        lines: [],
        lineCount: 0,
        extra: {
          id: "",
          filename: "",
          createdAt: "",
          labels: ""
        }
      },
      rightFile: {
        id: "2",
        path: "",
        charCount: 0,
        lines: [],
        lineCount: 0,
        extra: {
          id: "",
          filename: "",
          createdAt: "",
          labels: ""
        }
      },
      leftCovered: 0,
      rightCovered: 0,
      leftTotal: 0,
      rightTotal: 0,
      longestFragment: 0,
      highestSimilarity: 0,
      totalOverlap: 0,
      buildFragments: []
    }
  );

  const leftBuildFragments = React.useMemo(() => {
    return data.buildFragments.map((fragment, index) => {
      return {
        ...fragment.left,
        id: index
      };
    });
  }, [data.buildFragments]);

  const rightBuildFragments = React.useMemo(() => {
    return data.buildFragments.map((fragment, index) => {
      return {
        ...fragment.right,
        id: index
      };
    });
  }, [data.buildFragments]);

  const [tabIndex, setTabIndex] = React.useState(0);
  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

  const handleChangeTabIndex = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const Original = CodeMirrorMerge.Original;
  const Modified = CodeMirrorMerge.Modified;

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const breadcrumbRef = React.useRef<HTMLDivElement>(null);
  const { height: breadcrumbHeight } = useBoxDimensions({
    ref: breadcrumbRef
  });

  const cardHeaderRef = React.useRef<HTMLDivElement>(null);
  const { height: cardHeaderbHeight } = useBoxDimensions({
    ref: cardHeaderRef
  });

  const toolbarCodeRef = React.useRef<HTMLDivElement>(null);
  const { height: toolbarCodeHeight } = useBoxDimensions({
    ref: toolbarCodeRef
  });

  return (
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
            // margin top to avoid appbar overlap with content
            top: `${headerHeight}px`,
            backgroundColor: "white"
          }}
          open={false}
          ref={breadcrumbRef}
        >
          <Toolbar>
            <Box id={classes.breadcumpWrapper}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.code_plagiarism_detection)}
              >
                Tổng quan Kiểm tra gian lận
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.code_plagiarism_detection_file_pairs)}
              >
                Danh sách cặp bài nộp
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorname='--blue-500'>Chi tiết cặp bài nộp</ParagraphSmall>
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
        <Main
          open={true}
          className={classes.mainContent}
          sx={{
            marginTop: `${breadcrumbHeight}px`,
            height: `calc(100% - ${headerHeight + breadcrumbHeight}px)`
          }}
        >
          <Card className={classes.formBody}>
            <Box className={classes.cardHeader} ref={cardHeaderRef}>
              <Heading1>
                So sánh {data?.leftFile?.extra?.filename || ""} với{" "}
                {data?.rightFile?.extra?.filename || ""}
              </Heading1>
              <ParagraphBody>
                So sánh giữa 2 tệp code. Bạn có thể xem các đoạn code trùng lặp và khác biệt giữa 2
                tệp code.
              </ParagraphBody>
            </Box>
            <Card
              className={classes.cardWrapper}
              sx={{
                height: `calc(100% - ${cardHeaderbHeight}px)`
              }}
            >
              <Grid
                container
                spacing={1}
                sx={{
                  height: "100%"
                }}
              >
                <Grid item xs={12} ref={toolbarCodeRef}>
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
                              setData((prev) => ({
                                ...prev,
                                leftFile: prev.rightFile,
                                rightFile: prev.leftFile
                              }));
                            }}
                          >
                            <CompareArrowsIcon />
                          </Button>
                        </Grid>
                        <Grid item xs={3}>
                          <Tooltip
                            title={"Tỷ lệ các dấu vân tay chung giữa hai tệp"}
                            placement='top'
                          >
                            <Box className={classes.flexBoxWrapper}>
                              <ParagraphBody fontSize={"30px"} fontWeight={600}>
                                &asymp;
                              </ParagraphBody>
                              <ParagraphBody>
                                Độ tương đồng: {Math.round(data?.highestSimilarity * 100 || 0)}%
                              </ParagraphBody>
                            </Box>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={3}>
                          <Tooltip title={"Số dấu vân tay chung giữa hai tệp"} placement='top'>
                            <Box className={classes.flexBoxWrapper}>
                              <FileCopyIcon />
                              <ParagraphBody>
                                Đoạn trùng dài nhất: {data?.longestFragment || 0}
                              </ParagraphBody>
                            </Box>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={3}>
                          <Tooltip
                            title={
                              "Độ dài (tính bằng dấu vân tay) của chuỗi con dấu vân tay dài nhất giữa hai tệp, hữu ích khi không phải toàn bộ mã nguồn được sao chép"
                            }
                            placement='top'
                          >
                            <Box className={classes.flexBoxWrapper}>
                              <FileCopyOutlinedIcon />
                              <ParagraphBody>
                                Trùng lặp tổng cộng: {data?.totalOverlap || 0}
                              </ParagraphBody>
                            </Box>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    height: `calc(100% - ${toolbarCodeHeight}px)`
                  }}
                >
                  {tabIndex === 0 ? (
                    <Grid
                      container
                      sx={{
                        height: "100%"
                      }}
                    >
                      <Grid
                        item
                        xs={5.9}
                        sx={{
                          height: "100%"
                        }}
                      >
                        <Card className={classes.codeWrapper}>
                          <Box className={classes.codeHead} ref={codeHeadRef}>
                            <Box className={classes.fileNameWrapper}>
                              <InsertDriveFileOutlinedIcon
                                className={classes.insertDriveFileOutlinedIcon}
                              />
                              <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                {data.leftFile.extra.filename}
                              </ParagraphBody>
                            </Box>
                            {data.leftFile.extra.labels &&
                              data.leftFile.extra.labels.length > 0 && (
                                <Box className={classes.fileNameWrapper}>
                                  <LocalOfferOutlinedIcon
                                    className={classes.insertDriveFileOutlinedIcon}
                                  />
                                  <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                    {data.leftFile.extra.labels}
                                  </ParagraphBody>
                                </Box>
                              )}
                            <Tooltip title={data.leftFile.extra.createdAt} placement='top'>
                              <Box className={classes.fileNameWrapper}>
                                <CalendarIcon />
                                <ParagraphBody>{data.leftFile.extra.createdAt}</ParagraphBody>
                              </Box>
                            </Tooltip>
                          </Box>
                          <Divider />
                          <Box
                            className={classes.codeContent}
                            sx={{
                              height: `calc(100% - ${codeHeadHeight}px)`
                            }}
                          >
                            <CodeEditor
                              value={data.leftFile.lines.join("\n")}
                              readOnly={true}
                              highlightActiveLine={false}
                              buildFragments={leftBuildFragments}
                            />
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={0.2}></Grid>
                      <Grid
                        item
                        xs={5.9}
                        sx={{
                          height: "100%"
                        }}
                      >
                        <Card className={classes.codeWrapper}>
                          <Box className={classes.codeHead}>
                            <Box className={classes.fileNameWrapper}>
                              <InsertDriveFileOutlinedIcon
                                className={classes.insertDriveFileOutlinedIcon}
                              />
                              <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                {data.rightFile.extra.filename}
                              </ParagraphBody>
                            </Box>
                            {data.rightFile.extra.labels &&
                              data.rightFile.extra.labels.length > 0 && (
                                <Box className={classes.fileNameWrapper}>
                                  <LocalOfferOutlinedIcon
                                    className={classes.insertDriveFileOutlinedIcon}
                                  />
                                  <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                    {data.rightFile.extra.labels}
                                  </ParagraphBody>
                                </Box>
                              )}
                            <Tooltip title={data.rightFile.extra.createdAt} placement='top'>
                              <Box className={classes.fileNameWrapper}>
                                <CalendarIcon />
                                <ParagraphBody>{data.rightFile.extra.createdAt}</ParagraphBody>
                              </Box>
                            </Tooltip>
                          </Box>
                          <Divider />
                          <Box
                            className={classes.codeContent}
                            sx={{
                              height: `calc(100% - ${codeHeadHeight}px)`
                            }}
                          >
                            <CodeEditor
                              value={data.rightFile.lines.join("\n")}
                              readOnly={true}
                              highlightActiveLine={false}
                              buildFragments={rightBuildFragments}
                            />
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <CodeMirrorMerge theme={githubLight}>
                      <Grid
                        container
                        sx={{
                          height: "100%"
                        }}
                      >
                        <Grid
                          item
                          xs={5.9}
                          sx={{
                            height: "100%"
                          }}
                        >
                          <Box className={classes.codeWrapper}>
                            <Box className={classes.codeHead} ref={codeHeadRef}>
                              <Box className={classes.fileNameWrapper}>
                                <InsertDriveFileOutlinedIcon
                                  className={classes.insertDriveFileOutlinedIcon}
                                />
                                <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                  {data.leftFile.extra.filename}
                                </ParagraphBody>
                              </Box>
                              {data.leftFile.extra.labels &&
                                data.leftFile.extra.labels.length > 0 && (
                                  <Box className={classes.fileNameWrapper}>
                                    <LocalOfferOutlinedIcon
                                      className={classes.insertDriveFileOutlinedIcon}
                                    />
                                    <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                      {data.leftFile.extra.labels}
                                    </ParagraphBody>
                                  </Box>
                                )}
                              <Tooltip title={data.leftFile.extra.createdAt} placement='top'>
                                <Box className={classes.fileNameWrapper}>
                                  <CalendarIcon />
                                  <ParagraphBody>{data.leftFile.extra.createdAt}</ParagraphBody>
                                </Box>
                              </Tooltip>
                            </Box>
                            <Divider />
                            <Box
                              className={classes.codeContent}
                              sx={{
                                height: `calc(100% - ${codeHeadHeight}px)`
                              }}
                            >
                              <Original value={data.leftFile.lines.join("\n")} />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={0.2}></Grid>
                        <Grid
                          item
                          xs={5.9}
                          sx={{
                            height: "100%"
                          }}
                        >
                          <Box className={classes.codeWrapper}>
                            <Box className={classes.codeHead}>
                              <Box className={classes.fileNameWrapper}>
                                <InsertDriveFileOutlinedIcon
                                  className={classes.insertDriveFileOutlinedIcon}
                                />
                                <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                  {data.rightFile.extra.filename}
                                </ParagraphBody>
                              </Box>
                              {data.rightFile.extra.labels &&
                                data.rightFile.extra.labels.length > 0 && (
                                  <Box className={classes.fileNameWrapper}>
                                    <LocalOfferOutlinedIcon
                                      className={classes.insertDriveFileOutlinedIcon}
                                    />
                                    <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                      {data.rightFile.extra.labels}
                                    </ParagraphBody>
                                  </Box>
                                )}
                              <Tooltip title={data.rightFile.extra.createdAt} placement='top'>
                                <Box className={classes.fileNameWrapper}>
                                  <CalendarIcon />
                                  <ParagraphBody>{data.rightFile.extra.createdAt}</ParagraphBody>
                                </Box>
                              </Tooltip>
                            </Box>
                            <Divider />
                            <Box
                              className={classes.codeContent}
                              sx={{
                                height: `calc(100% - ${codeHeadHeight}px)`
                              }}
                            >
                              <Modified
                                value={data.rightFile.lines.join("\n")}
                                extensions={[
                                  EditorView.editable.of(false),
                                  EditorState.readOnly.of(true)
                                ]}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CodeMirrorMerge>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
