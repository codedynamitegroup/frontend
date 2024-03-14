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

  // const filePairList = [
  //   {
  //     id: "1",
  //     left_file: "20127111.java",
  //     right_file: "20127112.java",
  //     highest_similarity: "74",
  //     longest_fragment: "10",
  //     total_overlap: "10"
  //   },
  //   {
  //     id: "2",
  //     left_file: "20127112.java",
  //     right_file: "20127113.java",
  //     highest_similarity: "54",
  //     longest_fragment: "10",
  //     total_overlap: "10"
  //   },
  //   {
  //     id: "3",
  //     left_file: "20127113.java",
  //     right_file: "20127114.java",
  //     highest_similarity: "78",
  //     longest_fragment: "10",
  //     total_overlap: "10"
  //   },
  //   {
  //     id: "4",
  //     left_file: "20127114.java",
  //     right_file: "20127115.java",
  //     highest_similarity: "90",
  //     longest_fragment: "10",
  //     total_overlap: "10"
  //   },
  //   {
  //     id: "5",
  //     left_file: "20127115.java",
  //     right_file: "20127116.java",
  //     highest_similarity: "10",
  //     longest_fragment: "10",
  //     total_overlap: "10"
  //   },
  //   {
  //     id: "6",
  //     left_file: "20127116.java",
  //     right_file: "20127117.java",
  //     highest_similarity: "54",
  //     longest_fragment: "10",
  //     total_overlap: "10"
  //   },
  //   {
  //     id: "7",
  //     left_file: "20127117.java",
  //     right_file: "20127118.java",
  //     highest_similarity: "80",
  //     longest_fragment: "10",
  //     total_overlap: "10"
  //   }
  // ];

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
          <Card>
            <Box component='form' className={classes.formBody} autoComplete='off'>
              <Heading1>Câu hỏi code 1 - Bài kiểm tra cuối kỳ</Heading1>
              <ParagraphBody>Báo cáo phát hiện gian lận mã nguồn</ParagraphBody>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                  <Card className={classes.cardWrapper}>
                    <Heading2 className={classes.cardTitleHeader}>Thông tin báo cáo</Heading2>
                    <Box className={classes.reportOpenTimeWrapper}>
                      <Tooltip title='Thời gian mở bài kiểm tra' placement='top'>
                        <FontAwesomeIcon icon={faCalendar} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>
                        {data.report?.createdAt
                          ? new Date(data.report.createdAt).toLocaleString()
                          : "Chưa cập nhật"}
                      </ParagraphBody>
                    </Box>
                    <Box className={classes.submissionsQuantity}>
                      <Tooltip title='Số lượng bài nộp' placement='top'>
                        <FontAwesomeIcon icon={faFile} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>
                        {data.report?.files ? data.report.files.length : "Chưa cập nhật"} bài nộp
                      </ParagraphBody>
                    </Box>
                    <Box className={classes.codeLanguage}>
                      <Tooltip title='Ngôn ngữ lập trình' placement='top'>
                        <FontAwesomeIcon icon={faCode} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>
                        {data.report?.language ? data.report.language?.name : "Chưa cập nhật"}
                      </ParagraphBody>
                    </Box>
                    <TextTitle className={classes.labelTitle}>
                      {`${data.report?.labels.length || 0} nhãn được phát hiện`}
                    </TextTitle>
                    <LabelSubmissionsTable
                      headers={["Nhãn", "Bài nộp"]}
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
                            <Heading4>
                              Độ tương đồng cao nhất{" "}
                              <Tooltip
                                title={`Phần trăm tương đồng cao nhất giữa 2 bài nộp là ${Math.round((data.report?.maxHighSimilarity || 0) * 100)}%`}
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
                            >
                              Xem tất cả cặp bài nộp
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
                              Độ tương đồng trung bình{" "}
                              <Tooltip
                                title={`Trung bình phần trăm tương đồng giữa các bài nộp`}
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
                              Trung vị độ tương đồng:{" "}
                              {Math.round((data.report?.medianHighSimilarity || 0) * 100)}%
                            </ParagraphSmall>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    {/* <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Card className={classes.similarityWrapper}>
                              <FontAwesomeIcon icon={faUsers} color={"var(--blue-500)"} size='3x' />
                            </Card>
                          </Grid>
                          <Grid item xs={6}>
                            <Heading4>
                              Chia Cụm{" "}
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
                              0
                            </ParagraphBody>
                            <ParagraphSmall>
                              Dựa trên độ tương đồng cao nhất hiện tại ({threshold}%)
                            </ParagraphSmall>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid> */}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card className={classes.cardWrapper}>
                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <Heading4>
                          Phân phối độ tương đồng{" "}
                          <Tooltip
                            title={`Biếu đồ thể hiện phân phối độ tương đồng giữa các bài nộp. Phân phối này sẽ khác nhau tuỳ theo bộ dữ liệu đầu vào, và cho biết góc độ của độ tương đồng mà bạn muốn. Bạn có thể thay đổi ngưỡng giá trị độ tương đồng cao nhất`}
                            placement='top'
                          >
                            <FontAwesomeIcon icon={faCircleInfo} color={"#737373"} />
                          </Tooltip>
                        </Heading4>
                      </Grid>
                      <Grid item xs={4}>
                        <ParagraphBody id='input-series-number' gutterBottom>
                          Ngưỡng độ tương đồng cao nhất &#8805; {threshold}%
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
                        <Heading4>Danh sách cặp tệp bài nộp</Heading4>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody>
                          Danh sách các cặp tệp bài nộp có độ tương đồng cao nhất với nhau.
                        </ParagraphBody>
                      </Grid>
                      <Grid item xs={12}>
                        <FilePairsTable
                          headers={[
                            "Tệp trái",
                            "Tệp phải",
                            "Độ tương đồng cao nhất",
                            "Đoạn trùng dài nhất",
                            "Trùng lập tổng cộng"
                          ]}
                          // rows={data.report?.pairs}
                          rows={data.report?.pairs || []}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <Card className={classes.cardWrapper}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading4>Danh sách chia cụm</Heading4>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody>
                          Bạn có thể xem chi tiết từng cụm bài nộp theo độ tương đồng.
                        </ParagraphBody>
                      </Grid>
                      <Grid item xs={12}></Grid>
                    </Grid>
                  </Card>
                </Grid> */}
              </Grid>
            </Box>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
