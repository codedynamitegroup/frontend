import { faCalendar, faFile, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faChartLine,
  faCircleInfo,
  faCode,
  faQuestion,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
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
import { File } from "models/codePlagiarism";
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
    if (location.state?.report && (report === null || report?.id !== location.state.report.id)) {
      dispatch(
        setReport({
          report: location.state.report
        })
      );
    }
  }, [dispatch, location.state.report, report]);

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
                    <Box className={classes.reportOpenTimeWrapper}>
                      <Tooltip title={"Nguời tạo"} placement='top'>
                        <FontAwesomeIcon icon={faUser} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>Nguyễn Quốc Tuấn</ParagraphBody>
                    </Box>
                    <Box className={classes.submissionsQuantity}>
                      <Tooltip title={"Tiêu đề câu hỏi nguồn"} placement='top'>
                        <FontAwesomeIcon icon={faQuestion} color='#737373' size={"lg"} />
                      </Tooltip>
                      <Link to={routes.lecturer.code_question.detail}>Tìm tổng từ 1 đến 10</Link>
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
                      Danh sách bài kiểm tra của các khoá học so sánh
                    </TextTitle>
                    <Box
                      sx={{
                        maxHeight: "300px",
                        overflow: "auto",
                        padding: "10px",
                        border: "1px solid var(--gray-20)",
                        background: "var(--blue-1)",
                        borderRadius: "4px"
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%"
                        }}
                      >
                        <Grid container spacing={2}>
                          {[
                            {
                              id: "f47ac10b-58cc-4372-a567-0e02b2c3d495",
                              title: "Tìm số lớn nhất trong mảng",
                              exam_name: "Bài thi cuối kỳ",
                              course_name: "CSC101 - Lập trình căn bản"
                            },
                            {
                              id: "f47ac10b-58cc-4372-a567-0e02b2c3d496",
                              title: "Tìm số lớn nhất trong mảng",
                              exam_name: "Bài thi giữa kỳ",
                              course_name: "CSC102 - Lập trình hướng đối tượng"
                            },
                            {
                              id: "f47ac10b-58cc-4372-a567-0e02b2c3d497",
                              title: "Tìm số lớn nhất trong mảng",
                              exam_name: "Bài thi giữa kỳ",
                              course_name: "CSC103 - Cấu trúc dữ liệu và giải thuật"
                            },
                            {
                              id: "f47ac10b-58cc-4372-a567-0e02b2c3d497",
                              title: "Tìm số lớn nhất trong mảng",
                              exam_name: "Bài thi giữa kỳ",
                              course_name: "CSC104 - Kỹ thuật lập trình"
                            },
                            {
                              id: "f47ac10b-58cc-4372-a567-0e02b2c3d497",
                              title: "Tìm số lớn nhất trong mảng",
                              exam_name: "Bài thi giữa kỳ",
                              course_name: "CSC104 - Kỹ thuật lập trình"
                            }
                          ].map((item: any) => (
                            <Grid item xs={12}>
                              <Card
                                sx={{
                                  padding: "8px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center"
                                }}
                              >
                                {item.exam_name} - {item.course_name}
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
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
