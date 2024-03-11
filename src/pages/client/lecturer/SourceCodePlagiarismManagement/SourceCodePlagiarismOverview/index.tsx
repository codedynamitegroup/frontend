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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import HighestSimilaritySubmissionsTable from "./components/HighestSimilaritySubmissionsTable";
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

export default function LecturerSourceCodePlagiarismManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";
  const [threshold, setThreshold] = React.useState(70);

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
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.management)}
              >
                Quản lý khoá học
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.information)}
              >
                CS202 - Nhập môn lập trình
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.assignment)}
              >
                Danh sách bài tập
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.detail)}
              >
                Bài kiểm tra cuối kỳ
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.submissions)}
              >
                Danh sách bài nộp
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorName='--blue-500'>Kiểm tra gian lận</ParagraphSmall>
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
                      <ParagraphBody>March 9, 2024 at 2:29 PM GMT+7</ParagraphBody>
                    </Box>
                    <Box className={classes.submissionsQuantity}>
                      <Tooltip title='Số lượng bài nộp' placement='top'>
                        <FontAwesomeIcon icon={faFile} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>2 bài nộp</ParagraphBody>
                    </Box>
                    <Box className={classes.codeLanguage}>
                      <Tooltip title='Ngôn ngữ lập trình' placement='top'>
                        <FontAwesomeIcon icon={faCode} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>Java</ParagraphBody>
                    </Box>
                    <TextTitle className={classes.labelTitle}>2 nhãn được phát hiện</TextTitle>
                    <LabelSubmissionsTable
                      headers={["Nhãn", "Bài nộp"]}
                      rows={[
                        { label: "Gian lận", submissions: 2 },
                        { label: "Trong sạch", submissions: 2 }
                      ]}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>
                        <Grid container spacing={1}>
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
                              Tương đồng cao nhất{" "}
                              <Tooltip
                                title={`Phần trăm tương đồng cao nhất giữa 2 bài nộp là 97%.`}
                                placement='top'
                              >
                                <FontAwesomeIcon icon={faCircleInfo} color={"#737373"} />
                              </Tooltip>
                            </Heading4>
                            <ParagraphBody
                              fontSize={"30px"}
                              fontWeight={600}
                              colorName='--red-error-01'
                            >
                              97%
                            </ParagraphBody>
                            <Link to={routes.lecturer.exam.submissions}>Xem tất cả bài nộp</Link>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Card className={classes.similarityWrapper}>
                              <ParagraphBody
                                fontSize={"60px"}
                                fontWeight={600}
                                colorName={"--blue-500"}
                              >
                                &asymp;
                              </ParagraphBody>
                            </Card>
                          </Grid>
                          <Grid item xs={6}>
                            <Heading4>
                              Tương đồng trung bình{" "}
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
                              colorName='--orange-400'
                            >
                              54%
                            </ParagraphBody>
                            <ParagraphSmall>Trung vị độ tương đồng: 52%</ParagraphSmall>
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
                              colorName='--eerie-black'
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
                      <SimilarityHistogram threshold={threshold} />
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card className={classes.cardWrapper}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading4>Danh sách bài nộp</Heading4>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody>
                          Bạn có thể xem chi tiết từng bài nộp để kiểm tra thông tin và đánh giá độ
                          tương đồng.
                        </ParagraphBody>
                      </Grid>
                      <Grid item xs={12}>
                        <HighestSimilaritySubmissionsTable
                          headers={["Tên bài nộp", "Nhãn", "Độ tương đồng cao nhất"]}
                          rows={[
                            {
                              submissionFilename: "20127111.java",
                              submissionLabel: "Gian lận",
                              submissionHighestSimilarity: "97"
                            },
                            {
                              submissionFilename: "20127112.java",
                              submissionLabel: "Trong sạch",
                              submissionHighestSimilarity: "75"
                            },
                            {
                              submissionFilename: "20127113.java",
                              submissionLabel: "Trong sạch",
                              submissionHighestSimilarity: "54"
                            },
                            {
                              submissionFilename: "20127114.java",
                              submissionLabel: "Trong sạch",
                              submissionHighestSimilarity: "10"
                            },
                            {
                              submissionFilename: "20127115.java",
                              submissionLabel: "Trong sạch",
                              submissionHighestSimilarity: "10"
                            },
                            {
                              submissionFilename: "20127116.java",
                              submissionLabel: "Trong sạch",
                              submissionHighestSimilarity: "10"
                            },
                            {
                              submissionFilename: "20127117.java",
                              submissionLabel: "Trong sạch",
                              submissionHighestSimilarity: "10"
                            }
                          ]}
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
