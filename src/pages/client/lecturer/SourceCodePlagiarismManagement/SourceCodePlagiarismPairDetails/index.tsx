import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
import { githubLight } from "@uiw/codemirror-theme-github";
import { EditorState, EditorView } from "@uiw/react-codemirror";
import Header, { DrawerHeader } from "components/Header";
import Button, { BtnType } from "components/common/buttons/Button";
import CodeEditor from "components/editor/CodeEditor";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import { Pair } from "models/codePlagiarism";
import * as React from "react";
import CodeMirrorMerge from "react-codemirror-merge";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { RootState } from "store";
import classes from "./styles.module.scss";
import useWindowDimensions from "hooks/useWindowDimensions";

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

export default function LecturerSourceCodePlagiarismPairDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pairId } = useParams();
  const codeHeadRef = React.useRef<HTMLDivElement>(null);
  const { height: codeHeadHeight } = useBoxDimensions({
    ref: codeHeadRef
  });

  const codePlagiarismState = useSelector((state: RootState) => state.codePlagiarism);
  const { filteredPairs } = codePlagiarismState;

  const [data, setData] = React.useState<Pair | undefined>(
    filteredPairs.find((pair) => pair.id === Number(pairId))
  );

  const leftfragments = React.useMemo(() => {
    if (!data) return [];
    return data.fragments !== null
      ? data.fragments.map((fragment, index) => {
          return {
            ...fragment.left,
            id: index
          };
        })
      : [];
  }, [data]);

  const rightfragments = React.useMemo(() => {
    if (!data) return [];
    return data.fragments !== null
      ? data.fragments.map((fragment, index) => {
          return {
            ...fragment.right,
            id: index
          };
        })
      : [];
  }, [data]);

  const [tabIndex, setTabIndex] = React.useState(0);
  const handleChangeTabIndex = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const Original = CodeMirrorMerge.Original;
  const Modified = CodeMirrorMerge.Modified;

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
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
        >
          <Toolbar>
            <Box id={classes.breadcumpWrapper}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.code_plagiarism_detection_submissions)}
              >
                Danh sách bài nộp
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() =>
                  navigate(
                    routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
                      ":submissionId",
                      data?.leftFile?.id.toString() || ""
                    )
                  )
                }
              >
                Chi tiết bài nộp
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorname='--blue-500'>Tổng quan Kiểm tra gian lận</ParagraphSmall>
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
          <Card>
            <Box
              component='form'
              className={classes.formBody}
              autoComplete='off'
              sx={{
                height: `calc(100vh - ${headerHeight}px)`
              }}
            >
              <Box className={classes.cardHeader} ref={cardHeaderRef}>
                <Heading1 translation-key='code_plagiarism_no_file_pairs_comparing_title'>
                  {t("code_plagiarism_no_file_pairs_comparing_title", {
                    leftFileName:
                      `${data?.leftFile?.extra?.orgUserId} - ${data?.leftFile?.extra?.userFullName}` ||
                      "",
                    rightFileName:
                      `${data?.rightFile?.extra?.orgUserId} - ${data?.rightFile?.extra?.userFullName}` ||
                      ""
                  })}
                </Heading1>
                <ParagraphBody translation-key='code_plagiarism_no_file_pairs_comparing_description'>
                  {t("code_plagiarism_no_file_pairs_comparing_description")}
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
                        <Tabs
                          value={tabIndex}
                          onChange={handleChangeTabIndex}
                          aria-label='tabIndex'
                        >
                          <Tab
                            icon={<JoinInnerIcon />}
                            iconPosition='start'
                            label={t("code_plagiarism_match_title")}
                            translation-key='code_plagiarism_match_title'
                          />
                          <Tab
                            icon={<DifferenceIcon />}
                            iconPosition='start'
                            label={t("code_plagiarism_diff_title")}
                            translation-key='code_plagiarism_diff_title'
                          />
                        </Tabs>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container spacing={1} justifyContent='flex-end' alignItems='center'>
                          <Grid item xs={3}>
                            <Button
                              btnType={BtnType.Primary}
                              onClick={() => {
                                // Swap data.leftPart and data.rightPart
                                if (data) {
                                  setData({
                                    ...data,
                                    leftFile: data.rightFile,
                                    rightFile: data.leftFile
                                  });
                                }
                              }}
                            >
                              <CompareArrowsIcon />
                            </Button>
                          </Grid>
                          <Grid item xs={3}>
                            <Tooltip
                              title={t("code_plagiarism_shared_fingerprints_fraction_tooltip")}
                              placement='top'
                              translation-key='code_plagiarism_shared_fingerprints_fraction_tooltip'
                            >
                              <Box className={classes.flexBoxWrapper}>
                                <ParagraphBody fontSize={"30px"} fontWeight={600}>
                                  &asymp;
                                </ParagraphBody>
                                <ParagraphBody>
                                  {t("code_plagiarism_similarity_title")}
                                  {": "}
                                  {Math.round(data && data.similarity ? data.similarity * 100 : 0)}%
                                </ParagraphBody>
                              </Box>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={3}>
                            <Tooltip
                              title={t("code_plagiarism_longest_fragment_tooltip")}
                              placement='top'
                              translation-key='code_plagiarism_longest_fragment_tooltip'
                            >
                              <Box className={classes.flexBoxWrapper}>
                                <FileCopyIcon />
                                <ParagraphBody translation-key='code_plagiarism_longest_fragment_title'>
                                  {t("code_plagiarism_longest_fragment_title")}:{" "}
                                  {data?.longestFragment || 0}
                                </ParagraphBody>
                              </Box>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={3}>
                            <Tooltip
                              title={t("code_plagiarism_total_overlap_tooltip")}
                              placement='top'
                              translation-key='code_plagiarism_total_overlap_tooltip'
                            >
                              <Box className={classes.flexBoxWrapper}>
                                <FileCopyOutlinedIcon />
                                <ParagraphBody>
                                  {t("code_plagiarism_total_overlap_title")}:{" "}
                                  {data?.totalOverlap || 0}
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
                              <Box className={classes.firstPartCodeHead}>
                                <Box className={classes.fileNameWrapper}>
                                  <InsertDriveFileOutlinedIcon
                                    className={classes.insertDriveFileOutlinedIcon}
                                  />
                                  <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                    {`${data?.leftFile.extra.orgUserId} - ${data?.leftFile.extra.userFullName}`}
                                  </ParagraphBody>
                                </Box>
                                {data &&
                                  data.leftFile.extra.labels &&
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
                                <Tooltip
                                  title={new Date(
                                    data?.leftFile.extra.createdAt || ""
                                  ).toLocaleString()}
                                  placement='top'
                                >
                                  <Box className={classes.fileNameWrapper}>
                                    <CalendarIcon />
                                    <ParagraphBody>
                                      {new Date(
                                        data?.leftFile.extra.createdAt || ""
                                      ).toLocaleString()}
                                    </ParagraphBody>
                                  </Box>
                                </Tooltip>
                              </Box>
                              <Button
                                btnType={BtnType.Outlined}
                                onClick={() => {
                                  navigate(
                                    routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
                                      ":submissionId",
                                      data?.leftFile?.id.toString() || ""
                                    )
                                  );
                                }}
                                endIcon={<ArrowForwardIosIcon />}
                              >
                                Xem bài nộp
                              </Button>
                            </Box>
                            <Divider />
                            <Box
                              className={classes.codeContent}
                              sx={{
                                height: `calc(100% - ${codeHeadHeight}px)`
                              }}
                            >
                              <CodeEditor
                                value={data?.leftFile.lines.join("\n") || ""}
                                readOnly={true}
                                highlightActiveLine={false}
                                fragments={leftfragments}
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
                              <Box className={classes.firstPartCodeHead}>
                                <Box className={classes.fileNameWrapper}>
                                  <InsertDriveFileOutlinedIcon
                                    className={classes.insertDriveFileOutlinedIcon}
                                  />
                                  <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                    {`${data?.rightFile.extra.orgUserId} - ${data?.rightFile.extra.userFullName}`}
                                  </ParagraphBody>
                                </Box>
                                {data &&
                                  data.rightFile.extra.labels &&
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
                                <Tooltip
                                  title={new Date(
                                    data?.rightFile.extra.createdAt || ""
                                  ).toLocaleString()}
                                  placement='top'
                                >
                                  <Box className={classes.fileNameWrapper}>
                                    <CalendarIcon />
                                    <ParagraphBody>
                                      {new Date(
                                        data?.rightFile.extra.createdAt || ""
                                      ).toLocaleString()}
                                    </ParagraphBody>
                                  </Box>
                                </Tooltip>
                              </Box>
                              <Button
                                btnType={BtnType.Outlined}
                                onClick={() => {
                                  navigate(
                                    routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
                                      ":submissionId",
                                      data?.rightFile.id.toString() || ""
                                    )
                                  );
                                }}
                                endIcon={<ArrowForwardIosIcon />}
                              >
                                Xem bài nộp
                              </Button>
                            </Box>
                            <Divider />
                            <Box
                              className={classes.codeContent}
                              sx={{
                                height: `calc(100% - ${codeHeadHeight}px)`
                              }}
                            >
                              <CodeEditor
                                value={data?.rightFile.lines.join("\n") || ""}
                                readOnly={true}
                                highlightActiveLine={false}
                                fragments={rightfragments}
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
                                <Box className={classes.firstPartCodeHead}>
                                  <Box className={classes.fileNameWrapper}>
                                    <InsertDriveFileOutlinedIcon
                                      className={classes.insertDriveFileOutlinedIcon}
                                    />
                                    <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                      {`${data?.leftFile.extra.orgUserId} - ${data?.leftFile.extra.userFullName}`}
                                    </ParagraphBody>
                                  </Box>
                                  {data &&
                                    data.leftFile.extra.labels &&
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
                                  <Tooltip
                                    title={new Date(
                                      data?.leftFile.extra.createdAt || ""
                                    ).toLocaleString()}
                                    placement='top'
                                  >
                                    <Box className={classes.fileNameWrapper}>
                                      <CalendarIcon />
                                      <ParagraphBody>
                                        {new Date(
                                          data?.leftFile.extra.createdAt || ""
                                        ).toLocaleString()}
                                      </ParagraphBody>
                                    </Box>
                                  </Tooltip>
                                </Box>
                                <Button
                                  btnType={BtnType.Outlined}
                                  onClick={() => {
                                    navigate(
                                      routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
                                        ":submissionId",
                                        data?.leftFile?.id.toString() || ""
                                      )
                                    );
                                  }}
                                  endIcon={<ArrowForwardIosIcon />}
                                >
                                  Xem bài nộp
                                </Button>
                              </Box>
                              <Divider />
                              <Box
                                className={classes.codeContent}
                                sx={{
                                  height: `calc(100% - ${codeHeadHeight}px)`
                                }}
                              >
                                <Original
                                  value={data?.leftFile.lines.join("\n") || ""}
                                  extensions={[
                                    EditorView.editable.of(false),
                                    EditorState.readOnly.of(true)
                                  ]}
                                />
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
                                <Box className={classes.firstPartCodeHead}>
                                  <Box className={classes.fileNameWrapper}>
                                    <InsertDriveFileOutlinedIcon
                                      className={classes.insertDriveFileOutlinedIcon}
                                    />
                                    <ParagraphBody fontWeight={500} colorname='--blue-500'>
                                      {`${data?.rightFile.extra.orgUserId} - ${data?.rightFile.extra.userFullName}`}
                                    </ParagraphBody>
                                  </Box>
                                  {data &&
                                    data.rightFile.extra.labels &&
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
                                  <Tooltip
                                    title={new Date(
                                      data?.rightFile.extra.createdAt || ""
                                    ).toLocaleString()}
                                    placement='top'
                                  >
                                    <Box className={classes.fileNameWrapper}>
                                      <CalendarIcon />
                                      <ParagraphBody>
                                        {new Date(
                                          data?.rightFile.extra.createdAt || ""
                                        ).toLocaleString()}
                                      </ParagraphBody>
                                    </Box>
                                  </Tooltip>
                                </Box>
                                <Button
                                  btnType={BtnType.Outlined}
                                  onClick={() => {
                                    navigate(
                                      routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
                                        ":submissionId",
                                        data?.rightFile.id.toString() || ""
                                      )
                                    );
                                  }}
                                  endIcon={<ArrowForwardIosIcon />}
                                >
                                  Xem bài nộp
                                </Button>
                              </Box>
                              <Divider />
                              <Box
                                className={classes.codeContent}
                                sx={{
                                  height: `calc(100% - ${codeHeadHeight}px)`
                                }}
                              >
                                <Modified
                                  value={data?.rightFile.lines.join("\n") || ""}
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
            </Box>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
