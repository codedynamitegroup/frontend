import { faCalendar, faFile } from "@fortawesome/free-regular-svg-icons";
import { faChartLine, faCircleInfo, faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Card, CssBaseline, Grid, IconButton, Slider, Toolbar, Tooltip } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Header from "components/Header";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import useBoxDimensions from "hooks/useBoxDimensions";
import * as React from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import FilePairsTable from "./components/FilePairsTable";
import LabelSubmissionsTable from "./components/LabelSubmissionsTable";
import SimilarityHistogram from "./components/SimilarityHistogram";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";

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

export interface DolosCustomFile {
  id: string;
  path: string;
  charCount: number;
  lines: string[];
  lineCount: number;
  extra: {
    id: string;
    filename: string;
    createdAt: string;
    labels: string;
  };
  highestSimilarity: number | null;
}

export default function LecturerSourceCodePlagiarismManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";
  const [threshold, setThreshold] = React.useState(70);
  const location = useLocation();

  const [data, setData] = React.useState<{
    report: {
      labels: {
        label: string;
        submissions: number;
      }[];
      maxHighSimilarity: number;
      averageHighSimilarity: number;
      medianHighSimilarity: number;
      name: string;
      createdAt: string;
      files: DolosCustomFile[];
      language: { name: string; extensions: string[] };
      pairs: {
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
      }[];
    } | null;
  }>({
    report: location.state?.report
  });

  const xAxisData = React.useMemo(() => {
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  }, []);

  const yAxisData = React.useMemo(() => {
    const zeroArray = Array(xAxisData.length).fill(0);
    if (data.report?.files) {
      data.report.files.forEach((file) => {
        for (let i = 0; i < xAxisData.length; i++) {
          if (file.highestSimilarity === null) continue;
          if (
            file.highestSimilarity * 100 >= xAxisData[i] &&
            file.highestSimilarity * 100 < xAxisData[i] + 5
          ) {
            zeroArray[i] += 1;
          }
          if (xAxisData[i] === 95 && file.highestSimilarity * 100 === 100) {
            zeroArray[i] += 1;
          }
        }
      });
    }

    return zeroArray;
  }, [xAxisData, data.report?.files]);

  const handleThresholdChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== "number") {
      return;
    }
    setThreshold(newValue);
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
            <Box component='form' className={classes.formBody} autoComplete='off'>
              <Heading1>Câu hỏi code 1 - Bài kiểm tra cuối kỳ</Heading1>
              <ParagraphBody translation-key='code_plagiarism_report_description'>
                {t("code_plagiarism_report_description")}
              </ParagraphBody>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                  <Card className={classes.cardWrapper}>
                    <Heading2
                      className={classes.cardTitleHeader}
                      translation-key='code_plagiarism_report_info'
                    >
                      {t("code_plagiarism_report_info")}
                    </Heading2>
                    <Box className={classes.reportOpenTimeWrapper}>
                      <Tooltip
                        title={t("code_plagiarism_report_creation_date_tooltip")}
                        placement='top'
                      >
                        <FontAwesomeIcon icon={faCalendar} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>
                        {data.report?.createdAt
                          ? new Date(data.report.createdAt).toLocaleString()
                          : t("code_plagiarism_not_updated")}
                      </ParagraphBody>
                    </Box>
                    <Box className={classes.submissionsQuantity}>
                      <Tooltip
                        title={t("code_plagiarism_report_analyzed_submissions_count_tooltip")}
                        placement='top'
                      >
                        <FontAwesomeIcon icon={faFile} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody translation-key='code_plagiarism_report_analyzed_submissions_count'>
                        {data.report?.files
                          ? t("code_plagiarism_report_analyzed_submissions_count", {
                              count: data.report.files.length
                            })
                          : t("code_plagiarism_not_updated")}
                      </ParagraphBody>
                    </Box>
                    <Box className={classes.codeLanguage}>
                      <Tooltip title={t("contest_programming_language_title")} placement='top'>
                        <FontAwesomeIcon icon={faCode} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>
                        {data.report?.language
                          ? data.report.language?.name
                          : t("code_plagiarism_not_updated")}
                      </ParagraphBody>
                    </Box>
                    <TextTitle className={classes.labelTitle}>
                      {`${data.report?.labels.length || 0} nhãn được phát hiện`}
                    </TextTitle>
                    <LabelSubmissionsTable
                      headers={[
                        t("code_plagiarism_label_title"),
                        t("code_plagiarism_submissions_title")
                      ]}
                      rows={
                        data.report?.labels.map((label) => ({
                          label: label.label,
                          submissions: label.submissions
                        })) || []
                      }
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Card className={classes.similarityWrapper}>
                              <FontAwesomeIcon
                                icon={faChartLine}
                                color={"var(--blue-500)"}
                                size='3x'
                              />
                            </Card>
                          </Grid>
                          <Grid item xs={6}>
                            <Heading4 translation-key='code_plagiarism_highest_similarity'>
                              {t("code_plagiarism_highest_similarity")}{" "}
                              <Tooltip
                                title={t("code_plagiarism_highest_similarity_tooltip", {
                                  similarity: Math.round(
                                    (data.report?.maxHighSimilarity || 0) * 100
                                  )
                                })}
                                placement='top'
                              >
                                <FontAwesomeIcon icon={faCircleInfo} color={"#737373"} />
                              </Tooltip>
                            </Heading4>
                            <ParagraphBody
                              fontSize={"30px"}
                              fontWeight={600}
                              colorname='--red-error-01'
                            >
                              {Math.round((data.report?.maxHighSimilarity || 0) * 100)}%
                            </ParagraphBody>
                            <Link
                              to={routes.lecturer.exam.code_plagiarism_detection_file_pairs}
                              state={{ pairs: data.report?.pairs }}
                              translation-key='code_plagiarism_view_all_code_plagiarism_file_pairs'
                            >
                              {t("code_plagiarism_view_all_code_plagiarism_file_pairs", {
                                count: data.report?.pairs.length || 0
                              })}
                            </Link>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Card className={classes.similarityWrapper}>
                              <ParagraphBody
                                fontSize={"60px"}
                                fontWeight={600}
                                colorname={"--blue-500"}
                              >
                                &asymp;
                              </ParagraphBody>
                            </Card>
                          </Grid>
                          <Grid item xs={6}>
                            <Heading4>
                              {t("code_plagiarism_average_similarity")}{" "}
                              <Tooltip
                                title={t("code_plagiarism_average_similarity_tooltip")}
                                placement='top'
                              >
                                <FontAwesomeIcon icon={faCircleInfo} color={"#737373"} />
                              </Tooltip>
                            </Heading4>
                            <ParagraphBody
                              fontSize={"30px"}
                              fontWeight={600}
                              colorname='--orange-400'
                            >
                              {Math.round((data.report?.averageHighSimilarity || 0) * 100)}%
                            </ParagraphBody>
                            <ParagraphSmall>
                              {t("code_plagiarism_median_similarity")}
                              {": "}
                              {Math.round((data.report?.medianHighSimilarity || 0) * 100)}%
                            </ParagraphSmall>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card className={classes.cardWrapper}>
                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <Heading4>
                          {t("code_plagiarism_similarity_distribution_chart_title")}{" "}
                          <Tooltip
                            title={t("code_plagiarism_similarity_distribution_chart_tooltip")}
                            placement='top'
                          >
                            <FontAwesomeIcon icon={faCircleInfo} color={"#737373"} />
                          </Tooltip>
                        </Heading4>
                      </Grid>
                      <Grid item xs={4}>
                        <ParagraphBody
                          id='input-series-number'
                          gutterBottom
                          translation-key='threshold_title'
                        >
                          {t("code_plagiarism_threshold_title")} &#8805; {threshold}%
                        </ParagraphBody>
                        <Slider
                          value={threshold}
                          onChange={handleThresholdChange}
                          valueLabelDisplay='auto'
                          min={20}
                          max={100}
                          step={1}
                          aria-labelledby='input-series-number'
                        />
                      </Grid>
                      <SimilarityHistogram
                        threshold={threshold}
                        xAxisData={xAxisData}
                        y={yAxisData}
                      />
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card className={classes.cardWrapper}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading4 translation-key='code_plagiarism_file_pairs_list_title'>
                          {t("code_plagiarism_file_pairs_list_title")}
                        </Heading4>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody translation-key='code_plagiarism_file_pairs_list_description'>
                          {t("code_plagiarism_file_pairs_list_description")}
                        </ParagraphBody>
                      </Grid>
                      <Grid item xs={12}>
                        <FilePairsTable
                          headers={[
                            t("code_plagiarism_left_file_title"),
                            t("code_plagiarism_right_file_title"),
                            t("code_plagiarism_highest_similarity_title"),
                            t("code_plagiarism_longest_fragment_title"),
                            t("code_plagiarism_total_overlap_title")
                          ]}
                          rows={data.report?.pairs || []}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
