import Header from "components/Header";
import { Box, Container, Divider, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import { routes } from "routes/routes";
import { useNavigate } from "react-router-dom";
import ParagraphSmall from "components/text/ParagraphSmall";
import Heading2 from "components/text/Heading2";
import StarIcon from "@mui/icons-material/Star";
import { LinearProgress } from "@mui/joy";
import FlagIcon from "@mui/icons-material/Flag";
import Heading3 from "components/text/Heading3";

const CourseCertificateDetail = () => {
  const navigate = useNavigate();

  return (
    <Grid id={classes.root}>
      <Header />
      <main id={classes.main}>
        <Container id={classes.container}>
          <Grid container id={classes.bodyWrapper}>
            <Grid item xs={3.5} id={classes.leftBody}></Grid>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={8} id={classes.rightBody}>
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
                <Box id={classes.courseDescription}>
                  <ParagraphBody colorName='--gray-80'>
                    Practice problems of C++, the language most used for DSA and low level
                    programming due to its efficiency and speed.
                  </ParagraphBody>
                </Box>
                <Grid id={classes.courseDetails} container>
                  <Grid
                    item
                    xs={4}
                    className={classes.courseDetailsWrapper}
                    borderRight={"1px solid var(--gray-40)"}
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
                    className={classes.courseDetailsWrapper}
                    borderRight={"1px solid var(--gray-40)"}
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
                <Box id={classes.courseProgress}>
                  <Box id={classes.progressTitle}>
                    <ParagraphBody colorName='--gray-80'>Tiến độ: 38%</ParagraphBody>
                    <FlagIcon id={classes.icFlag} />
                  </Box>
                  <LinearProgress determinate value={25} />
                </Box>
              </Box>
              <Divider />
              <Box id={classes.courseCatalog}>
                <Heading3>Các danh mục bài học</Heading3>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </main>
    </Grid>
  );
};

export default CourseCertificateDetail;
