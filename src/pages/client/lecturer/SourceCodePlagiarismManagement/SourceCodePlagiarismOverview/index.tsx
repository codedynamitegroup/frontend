import { faCalendar, faFile } from "@fortawesome/free-regular-svg-icons";
import { faChartLine, faCircleInfo, faCode, faUsers } from "@fortawesome/free-solid-svg-icons";
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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setLabel, setReport, setThreshold } from "reduxes/CodePlagiarism";
import { routes } from "routes/routes";
import { RootState } from "store";
import FileSubmissionsTable from "./components/FileSubmissionsTable";
import LabelSubmissionsTable from "./components/LabelSubmissionsTable";
import SimilarityHistogram from "./components/SimilarityHistogram";
import SubmissionsClustersTable from "./components/SubmissionsClustersTable";
import classes from "./styles.module.scss";
import { File } from "models/codePlagiarism";

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

export default function LecturerSourceCodePlagiarismManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const codePlagiarismState = useSelector((state: RootState) => state.codePlagiarism);
  const {
    report,
    highestSimilarity,
    threshold,
    filterdFiles,
    averageSimilarity,
    medianSimilarity,
    clusters
  } = codePlagiarismState;

  // const [data, setData] = React.useState<{
  //   report: {
  //     name: string;
  //     createdAt: string;
  //     files: File[];
  //     language: { name: string; extensions: string[] };
  //     pairs: Pair[];
  //     labels: { label: string; submissions: number; isActive: boolean }[];
  //   } | null;
  // }>({
  //   report: {
  //     ...location.state?.report,
  //     labels: getUniqueLabelsFromPairsAndFiles(
  //       location.state?.report?.pairs,
  //       location.state?.report?.files
  //     )
  //   }
  // });

  // const filteredPairs = React.useMemo(() => {
  //   // Fitter pairs with labels has isActive = true
  //   const copyPairs = [
  //     ...(report?.pairs?.map((pair) => {
  //       return pair;
  //     }) || [])
  //   ];
  //   return (
  //     copyPairs.filter(
  //       (pair) =>
  //         report?.labels.length === 0 ||
  //         report?.labels.some(
  //           (label) =>
  //             pair.leftFile.extra?.labels === label.label &&
  //             pair.rightFile.extra?.labels === label.label &&
  //             label.isActive
  //         )
  //     ) || []
  //   );
  // }, [report?.pairs, report?.labels]);

  // const filterdFiles = React.useMemo(() => {
  //   // Fitter files with labels has isActive = true
  //   const copyFiles = [
  //     ...(report?.files?.map((file) => {
  //       return file;
  //     }) || [])
  //   ];
  //   return (
  //     copyFiles.filter(
  //       (file) =>
  //         report?.labels.length === 0 ||
  //         report?.labels.some((label) => file.extra?.labels === label.label && label.isActive)
  //     ) || []
  //   );
  // }, [report?.files, report?.labels]);

  // const fileInterestingnessCalculator = React.useMemo(() => {
  //   return new FileInterestingnessCalculator(filteredPairs || []);
  // }, [filteredPairs]);

  // const [threshold, setThreshold] = React.useState<number>(
  //   Number((guessSimilarityThreshold(filteredPairs || []) * 100).toFixed(0)) < 25
  //     ? 25
  //     : Number((guessSimilarityThreshold(filteredPairs || []) * 100).toFixed(0)) > 100
  //       ? 100
  //       : Number((guessSimilarityThreshold(filteredPairs || []) * 100).toFixed(0))
  // );

  // const highestSimilarityPair = React.useMemo(() => {
  //   // Fix error Reduce of empty array with no initial value
  //   if (filteredPairs.length === 0) {
  //     return null;
  //   }
  //   return filteredPairs.reduce((a, b) => (a.similarity > b.similarity ? a : b));
  // }, [filteredPairs]);

  // // Highest similarity.
  // const highestSimilarity = React.useMemo(() => {
  //   return highestSimilarityPair?.similarity || 0;
  // }, [highestSimilarityPair]);

  // const similarities = React.useMemo(() => {
  //   return new Map(
  //     filterdFiles.map((file) => [file, file.fileScoring?.similarityScore || null]) || []
  //   );
  // }, [filterdFiles]);

  // const similaritiesList = React.useMemo(() => {
  //   const similaritiesList = Array.from(similarities.values()).filter(
  //     (s) => s !== null
  //   ) as SimilarityScore[];
  //   const similaritiesListCheck = similaritiesList.map((s) => s?.similarity || 0);
  //   return similaritiesListCheck;
  // }, [similarities]);

  // // Average maximum similarity.
  // const averageSimilarity = React.useMemo(() => {
  //   const mean = similaritiesList.reduce((a, b) => a + b, 0) / similaritiesList.length;
  //   return isNaN(mean) ? 0 : mean;
  // }, [similaritiesList]);

  // // Median maximum similarity.
  // const medianSimilarity = React.useMemo(() => {
  //   const sorted = [...similaritiesList].sort();
  //   const middle = Math.floor(sorted.length / 2);
  //   const median = sorted[middle];
  //   return isNaN(median) ? 0 : median;
  // }, [similaritiesList]);

  // const clustering = React.useMemo(() => {
  //   if (filterdFiles && filteredPairs) {
  //     return singleLinkageCluster(filteredPairs, filterdFiles, threshold / 100);
  //   }
  //   return [];
  // }, [filteredPairs, filterdFiles, threshold]);

  // const clusters = React.useMemo(() => {
  //   const result = clustering.map((cluster) => {
  //     const findIndex = clustering.findIndex((c) => c === cluster);
  //     const files = getClusterElementsArray(cluster);

  //     // Calculate similarity score for each file
  //     files.forEach((file) => {
  //       if (!file.fileScoring) {
  //         const fileScoring = fileInterestingnessCalculator.calculateFileScoring(file);
  //         file.fileScoring = fileScoring;
  //       }
  //     });

  //     return {
  //       id: findIndex,
  //       submissions: files,
  //       size: files.length,
  //       similarity: [...cluster].reduce((acc, pair) => acc + pair.similarity, 0) / cluster.size,
  //       cluster
  //     };
  //   });
  //   result.sort((a, b) => b.size - a.size);
  //   return result;
  // }, [clustering, fileInterestingnessCalculator]);

  const xAxisData = React.useMemo(() => {
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  }, []);

  const yAxisData = React.useMemo(() => {
    const zeroArray = Array(xAxisData.length).fill(0);
    filterdFiles.forEach((file: File) => {
      for (let i = 0; i < xAxisData.length; i++) {
        const similarity = file.fileScoring?.similarityScore?.similarity || 0;
        if (similarity * 100 >= xAxisData[i] && similarity * 100 < xAxisData[i] + 5) {
          zeroArray[i] += 1;
        }
        if (xAxisData[i] === 95 && similarity * 100 === 100) {
          zeroArray[i] += 1;
        }
      }
    });

    return zeroArray;
  }, [xAxisData, filterdFiles]);

  const handleLabelChange = (label: string, isActive: boolean) => {
    dispatch(setLabel({ label, isActive }));
  };

  const handleThresholdChange = (value: number) => {
    dispatch(setThreshold(value));
  };

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  React.useEffect(() => {
    if (location.state?.report) {
      dispatch(setReport({ report: location.state.report }));
    }
  }, [dispatch, location.state.report]);

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
              <Heading1>{report?.name}</Heading1>
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
                        {report?.createdAt
                          ? new Date(report.createdAt).toLocaleString()
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
                        {report?.files
                          ? t("code_plagiarism_report_analyzed_submissions_count", {
                              count: report.files.length
                            })
                          : t("code_plagiarism_not_updated")}
                      </ParagraphBody>
                    </Box>
                    <Box className={classes.codeLanguage}>
                      <Tooltip title={t("contest_programming_language_title")} placement='top'>
                        <FontAwesomeIcon icon={faCode} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>
                        {report?.language
                          ? report.language?.name
                          : t("code_plagiarism_not_updated")}
                      </ParagraphBody>
                    </Box>
                    <TextTitle className={classes.labelTitle}>
                      {`${report?.labels.length || 0} nhãn được phát hiện`}
                    </TextTitle>
                    <LabelSubmissionsTable
                      headers={[
                        t("code_plagiarism_label_title"),
                        t("code_plagiarism_submissions_title"),
                        ""
                      ]}
                      rows={report?.labels || []}
                      handleLabelChange={handleLabelChange}
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
                                  similarity: Math.round((highestSimilarity || 0) * 100)
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
                              {Math.round((highestSimilarity || 0) * 100)}%
                            </ParagraphBody>
                            <Link to={routes.lecturer.exam.code_plagiarism_detection_submissions}>
                              Xem tất cả bài nộp
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
                              {Math.round((averageSimilarity || 0) * 100)}%
                            </ParagraphBody>
                            <ParagraphSmall>
                              {t("code_plagiarism_median_similarity")}
                              {": "}
                              {Math.round((medianSimilarity || 0) * 100)}%
                            </ParagraphSmall>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Card className={classes.similarityWrapper}>
                              <FontAwesomeIcon icon={faUsers} color={"var(--blue-500)"} size='3x' />
                            </Card>
                          </Grid>
                          <Grid item xs={6}>
                            <Heading4>
                              Chia Nhóm{" "}
                              <Tooltip
                                title={`Tất cả bài nộp sẽ được chia thành các cụm dựa trên độ tương đồng. Nếu 1 cặp bài nào đó có độ tương đồng cao hơn độ tương đồng cao nhất, chúng sẽ được chia vào cùng 1 cụm.`}
                                placement='top'
                              >
                                <FontAwesomeIcon icon={faCircleInfo} color={"#737373"} />
                              </Tooltip>
                            </Heading4>
                            <ParagraphBody
                              fontSize={"30px"}
                              fontWeight={600}
                              colorname='--eerie-black'
                            >
                              {clusters.length}
                            </ParagraphBody>
                            <ParagraphSmall>
                              Dựa trên độ tương đồng cao nhất hiện tại ({threshold}%)
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
                          onChangeCommitted={(_, newValue) => {
                            handleThresholdChange(newValue as number);
                          }}
                          valueLabelDisplay='auto'
                          min={25}
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
                <Grid item xs={12} md={6}>
                  <Card className={classes.cardWrapper}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading4>Danh sách bài nộp</Heading4>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody>
                          Đánh dấu các bài nộp cá nhân nghi ngờ nhất, hữu ích cho bài kiểm tra.
                        </ParagraphBody>
                      </Grid>
                      <Grid item xs={12}>
                        <FileSubmissionsTable
                          headers={[
                            "MSSV",
                            "Tên sinh viên",
                            "Bài kiểm tra",
                            "Ngày nộp",
                            "Độ tương đồng cao nhẩt"
                          ]}
                          rows={
                            // sort by similarity score
                            filterdFiles && filterdFiles.length > 0
                              ? [...filterdFiles].sort(
                                  (a, b) =>
                                    (b.fileScoring?.finalScore || 0) -
                                    (a.fileScoring?.finalScore || 0)
                                )
                              : []
                          }
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card className={classes.cardWrapper}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading4>Chia nhóm</Heading4>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody>
                          Tập hợp các bài nộp thành các nhóm, hữu ích cho bài tập.
                        </ParagraphBody>
                      </Grid>
                      <Grid item xs={12}>
                        <SubmissionsClustersTable headers={["Nhóm", "Bài nộp"]} rows={clusters} />
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
