import Header from "components/Header";
import { Box, Container, Divider, Grid, Tab, Tabs } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import { routes } from "routes/routes";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import ParagraphSmall from "components/text/ParagraphSmall";
import Heading2 from "components/text/Heading2";
import Button, { BtnType } from "components/common/buttons/Button";
import { useMemo } from "react";
import CourseCertificateIntroduction from "./components/Introduction";
import StarIcon from "@mui/icons-material/Star";
import { LinearProgress } from "@mui/joy";
import FlagIcon from "@mui/icons-material/Flag";

const CourseCertificateDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (id) navigate(tabs[newTab].replace(":id", id));
  };

  const tabs: string[] = useMemo(() => {
    return [
      routes.user.course_certificate.introduction,
      routes.user.course_certificate.lesson,
      routes.user.course_certificate.certificate
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (id) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":id", id)));
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  return (
    <Grid id={classes.root}>
      <Header />
      <main id={classes.main}>
        <Container id={classes.container}>
          <Grid container id={classes.bodyWrapper}>
            <Grid item xs={12} md={12} id={classes.rightBody}>
              <Box id={classes.breadcumpWrapper}>
                <ParagraphSmall colorName='--gray-50' fontWeight={"600"}>
                  <span onClick={() => navigate(routes.user.course_certificate.root)}>
                    Danh sách khóa học
                  </span>{" "}
                  {">"} <span>Học C++ cơ bản</span>
                </ParagraphSmall>
              </Box>
              <Divider />
              <Box id={classes.courseInfoWrapper}>
                <Box id={classes.courseTitle}>
                  <Box className={classes.imgCourseRecommend}>
                    <img
                      src={"https://cdn.codechef.com/images/self-learning/icons/cpp.svg"}
                      alt='img course recommend'
                    />
                  </Box>
                  <Heading2>Học C++ cơ bản</Heading2>
                </Box>
                <Grid container>
                  <Grid item xs={12} md={6} id={classes.courseDetails} container>
                    <Grid
                      item
                      xs={4}
                      borderRight={"1px solid var(--gray-60)"}
                      className={classes.courseDetailsWrapper}
                    >
                      <Box id={classes.userRating}>
                        <ParagraphBody fontWeight={"600"}>4.4</ParagraphBody>
                        <StarIcon id={classes.icStar} />
                      </Box>
                      <Box id={classes.userReviews}>
                        <ParagraphBody colorName='--gray-60'>10 Đánh giá</ParagraphBody>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      borderRight={"1px solid var(--gray-60)"}
                      className={classes.courseDetailsWrapper}
                    >
                      <Box id={classes.numberLesson}>
                        <ParagraphBody fontWeight={"600"}>20 Bài học</ParagraphBody>
                      </Box>
                      <Box id={classes.courseLevel}>
                        <ParagraphBody colorName='--gray-60'>Cấp độ: Dễ</ParagraphBody>
                      </Box>
                    </Grid>
                    <Grid item xs={4} className={classes.courseDetailsWrapper}>
                      <Box id={classes.numberLearner}>
                        <ParagraphBody fontWeight={"600"}>100</ParagraphBody>
                      </Box>
                      <Box>
                        <ParagraphBody colorName='--gray-60'>Số người học</ParagraphBody>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Box>
                  <Button btnType={BtnType.Primary}>Bắt đầu học ngay</Button>
                </Box>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <Box id={classes.courseProgress}>
                      <Box id={classes.progressTitle}>
                        <ParagraphBody colorName='--gray-80'>Tiến độ: 38%</ParagraphBody>
                        <FlagIcon id={classes.icFlag} />
                      </Box>
                      <LinearProgress determinate value={38} />
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ border: 1, borderColor: "divider" }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    aria-label='basic tabs example'
                    className={classes.tabs}
                  >
                    <Tab
                      sx={{ textTransform: "none" }}
                      label={<ParagraphBody>Giới thiệu</ParagraphBody>}
                      value={0}
                    />
                    <Tab
                      sx={{ textTransform: "none" }}
                      label={<ParagraphBody>Bài học</ParagraphBody>}
                      value={1}
                    />
                    <Tab
                      sx={{ textTransform: "none" }}
                      label={<ParagraphBody>Chứng chỉ</ParagraphBody>}
                      value={2}
                    />
                  </Tabs>
                </Box>
                <Box>
                  <Routes>
                    <Route path={"introduction"} element={<CourseCertificateIntroduction />} />
                    {/* <Route path={"test-cases"} element={<CodeQuestionTestCases />} />
                  <Route path={"code-stubs"} element={<CodeQuestionCodeStubs />} />
                  <Route path={"languages"} element={<CodeQuestionLanguages />} /> */}
                  </Routes>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </main>
    </Grid>
  );
};

export default CourseCertificateDetail;