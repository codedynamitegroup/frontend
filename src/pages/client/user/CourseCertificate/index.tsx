import Header from "components/Header";
import { Box, Container, Divider, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Heading2 from "components/text/Heading2";
import SearchBar from "components/common/search/SearchBar";
import BasicSelect from "components/common/select/BasicSelect";
import React from "react";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/text/ParagraphBody";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Heading3 from "components/text/Heading3";
import images from "config/images";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

interface CourseCertificate {
  imgUrl: string;
  title: string;
  description?: string;
  level?: string;
  lesson?: number;
}
const CourseCertificates = () => {
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };

  const [assignmentSection, setAssignmentSection] = React.useState("0");

  const courseCertificatesRecommend: CourseCertificate[] = [
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/cpp.svg",
      title: "Học C++ cơ bản",
      lesson: 10
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/python.svg",
      title: "Học Python cơ bản",
      lesson: 30
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/go.svg",
      title: "Học Go cơ bản",
      lesson: 35
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/go.svg",
      title: "Học Go nâng cao",
      lesson: 40
    }
  ];

  const courseCertificatesBasic: CourseCertificate[] = [
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/cpp.svg",
      title: "Học C++ cơ bản",
      description:
        "Practice problems of C++, the language most used for DSA and low level programming due to its efficiency and speed.",
      lesson: 10,
      level: "Dễ"
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/python.svg",
      title: "Học Python cơ bản",
      description:
        "Practice Python problems, the language known for its simplicity and readability making it the best language for beginners..",
      lesson: 30,
      level: "Dễ"
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/go.svg",
      title: "Học Go cơ bản",
      description:
        "Learn the basics of Go programming with ease in this interactive and practical course. This course will provide a good base to building real world applications in go.",
      lesson: 35,
      level: "Dễ"
    }
  ];

  const courseCertificatesAdvanced: CourseCertificate[] = [
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/cpp.svg",
      title: "Học C++ nâng cao",
      description:
        "Practice problems of C++, the language most used for DSA and low level programming due to its efficiency and speed.",
      lesson: 10,
      level: "Nâng cao"
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/python.svg",
      title: "Học Python nâng cao",
      description:
        "Practice Python problems, the language known for its simplicity and readability making it the best language for beginners..",
      lesson: 15,
      level: "Nâng cao"
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/go.svg",
      title: "Học Go nâng cao",
      description:
        "Learn the basics of Go programming with ease in this interactive and practical course. This course will provide a good base to building real world applications in go.",
      lesson: 35,
      level: "Nâng cao"
    }
  ];

  const navigate = useNavigate();

  return (
    <Grid className={classes.root}>
      <Header />
      <main id={classes.main}>
        <Box id={classes.banner}>
          <Container id={classes.bannerContainer}>
            <Heading2 colorName={"--white"}>
              Bạn muốn rèn luyện khả năng code của bạn ? Hãy thử các khóa học sau
            </Heading2>
            <Box id={classes.bannerSearch}>
              <SearchBar onSearchClick={searchHandle} />
              <BasicSelect
                labelId='select-assignment-section-label'
                value={assignmentSection}
                onHandleChange={(value) => setAssignmentSection(value)}
                sx={{ maxWidth: "200px" }}
                items={[
                  {
                    value: "0",
                    label: "Tất cả"
                  },
                  {
                    value: "1",
                    label: "Kiến thức cơ sở"
                  },
                  {
                    value: "2",
                    label: "Rèn luyện thuật toán"
                  },
                  {
                    value: "3",
                    label: "Cấu trúc dữ liệu và giải thuật"
                  }
                ]}
                backgroundColor='#FFFFFF'
              />
            </Box>
          </Container>
        </Box>
        <Box mt={"40px"}>
          <Container>
            <Box id={classes.courseRecommendsWrapper}>
              <Heading2>Các khóa học được đề xuất</Heading2>
              <Grid container spacing={2}>
                {courseCertificatesRecommend.map((course, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      className={classes.courseRecommend}
                      onClick={() => {
                        navigate(
                          routes.user.course_certificate.detail.replace(":id", index.toString())
                        );
                      }}
                    >
                      <Grid item container className={classes.titleCourseRecommend}>
                        <Grid item xs={2} className={classes.imgCourseRecommend}>
                          <img src={course.imgUrl} alt='img course recommend' />
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid
                          item
                          xs={9}
                          container
                          direction={"column"}
                          spacing={1.5}
                          className={classes.titleCard}
                        >
                          <Grid item className={classes.topCard}>
                            <ParagraphBody>{course.title}</ParagraphBody>
                          </Grid>
                          <Grid item className={classes.botCard}>
                            <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                            <ParagraphBody>{`${course.lesson} bài học`}</ParagraphBody>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Divider />
                      <Box className={classes.contentCourseRecommend}>
                        <Button btnType={BtnType.Text}>
                          <ParagraphBody>Xem chi tiết</ParagraphBody>
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </Box>
        <Divider sx={{ marginTop: "40px" }} />
        <Box mt={"40px"}>
          <Container>
            <Box id={classes.couseCertificatesWrapper}>
              <Box className={classes.couseCertificatesByTopic}>
                <Heading2>Kiến thức cơ bản</Heading2>
                <Grid container spacing={3}>
                  {courseCertificatesBasic.map((course, index) => (
                    <Grid item xs={4} key={index}>
                      <Box
                        className={classes.courseCerticate}
                        onClick={() => {
                          navigate(
                            routes.user.course_certificate.detail.replace(":id", index.toString())
                          );
                        }}
                      >
                        <Grid container direction={"column"} margin={0} gap={2}>
                          <Grid item container xs={5} className={classes.titleCourse}>
                            <Grid item xs={3} className={classes.imgCourse}>
                              <img alt='img course' src={course.imgUrl} />
                            </Grid>
                            <Grid item xs={9} className={classes.nameCourse}>
                              <Heading3>{course.title}</Heading3>
                            </Grid>
                          </Grid>
                          <Divider />
                          <Grid item xs={5}>
                            <ParagraphBody className={classes.courseDescription}>
                              {course.description}
                            </ParagraphBody>
                          </Grid>
                          <Divider />
                          <Grid item xs={2}>
                            <Box className={classes.iconCourse}>
                              <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                              <ParagraphBody>{course.lesson} bài học</ParagraphBody>
                            </Box>
                            <Box className={classes.iconCourse}>
                              <img
                                src={images.icLevel}
                                alt='icon level'
                                className={classes.iconLevel}
                              />
                              <ParagraphBody>{course.level}</ParagraphBody>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box className={classes.couseCertificatesByTopic}>
                <Heading2>Kiến thức nâng cao</Heading2>
                <Grid container spacing={3}>
                  {courseCertificatesAdvanced.map((course, index) => (
                    <Grid item xs={4} key={index}>
                      <Box className={classes.courseCerticate}>
                        <Grid container direction={"column"} margin={0} gap={2}>
                          <Grid item container xs={5} className={classes.titleCourse}>
                            <Grid item xs={3} className={classes.imgCourse}>
                              <img alt='img course' src={course.imgUrl} />
                            </Grid>
                            <Grid item xs={9} className={classes.nameCourse}>
                              <Heading3>{course.title}</Heading3>
                            </Grid>
                          </Grid>
                          <Divider />
                          <Grid item xs={5}>
                            <ParagraphBody className={classes.courseDescription}>
                              {course.description}
                            </ParagraphBody>
                          </Grid>
                          <Divider />
                          <Grid item xs={2}>
                            <Box className={classes.iconCourse}>
                              <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                              <ParagraphBody>{course.lesson} bài học</ParagraphBody>
                            </Box>
                            <Box className={classes.iconCourse}>
                              <img
                                src={images.icLevel}
                                alt='icon level'
                                className={classes.iconLevel}
                              />
                              <ParagraphBody>{course.level}</ParagraphBody>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Container>
        </Box>
      </main>
    </Grid>
  );
};

export default CourseCertificates;
