import Header from "components/Header";
import { Box, Checkbox, Container, Divider, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Heading2 from "components/text/Heading2";
import SearchBar from "components/common/search/SearchBar";
import BasicSelect from "components/common/select/BasicSelect";
import React from "react";
import ParagraphBody from "components/text/ParagraphBody";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Heading3 from "components/text/Heading3";
import images from "config/images";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import Heading1 from "components/text/Heading1";
import Heading4 from "components/text/Heading4";

interface CourseCertificate {
  imgUrl: string;
  title: string;
  description?: string;
  level?: string;
  lesson?: number;
}

interface FilterByTopic {
  checked: boolean;
  title: string;
  courseNumber: number;
}

const CourseCertificates = () => {
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };

  const [assignmentSection, setAssignmentSection] = React.useState("0");

  const filterByTopics: FilterByTopic[] = [
    {
      checked: true,
      title: "Học C++",
      courseNumber: 10
    },
    {
      checked: false,
      title: "Học Java",
      courseNumber: 15
    },
    {
      checked: false,
      title: "Học Python",
      courseNumber: 20
    },
    {
      checked: false,
      title: "Học Javascript",
      courseNumber: 10
    },
    {
      checked: false,
      title: "Cấu trúc dữ liệu và giải thuật",
      courseNumber: 3
    },
    {
      checked: false,
      title: "Kỹ thuật lập trình",
      courseNumber: 5
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
        <Box
          id={classes.banner}
          sx={{
            backgroundImage: `url(${images.background.courseCertificatesBackground})`
          }}
        >
          <Container id={classes.bannerContainer} className={classes.container}>
            <Heading1 colorName={"--white"}>Khóa học chứng chỉ</Heading1>
            <Heading3 colorName={"--white"}>
              Bạn muốn rèn luyện khả năng code của bạn ? Hãy thử các khóa học sau
            </Heading3>
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
                    label: "Đã đăng ký"
                  },
                  {
                    value: "2",
                    label: "Chưa đăng ký"
                  }
                ]}
                backgroundColor='#FFFFFF'
              />
            </Box>
          </Container>
        </Box>
        <Box mt={"40px"}>
          <Container className={classes.container}>
            <Grid container>
              <Grid item xs={2.5} id={classes.filter}>
                <Heading3>Lọc theo</Heading3>
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading4>Chủ đề</Heading4>
                  {filterByTopics.map((topic, index) => (
                    <Box className={classes.couseCertificatesByTopicItem} key={index}>
                      <Checkbox checked={topic.checked} className={classes.checkbox} />
                      <ParagraphBody className={classes.couseCertificatesByTopicTitle}>
                        {topic.title} <span>({topic.courseNumber})</span>
                      </ParagraphBody>
                    </Box>
                  ))}
                </Box>
                <Box className={classes.couseCertificatesByTopic}></Box>
              </Grid>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={9}>
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
                                routes.user.course_certificate.lesson.replace(
                                  ":id",
                                  index.toString()
                                )
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
              </Grid>
            </Grid>
          </Container>
        </Box>
      </main>
    </Grid>
  );
};

export default CourseCertificates;
