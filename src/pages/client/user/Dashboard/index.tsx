import { Container, Grid } from "@mui/material";
import React from "react";
import Header from "components/Header";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Heading2 from "components/text/Heading2";
import { LinearProgress } from "@mui/joy";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import Heading3 from "components/text/Heading3";
import Divider from "@mui/material/Divider";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import images from "config/images";
import Heading5 from "components/text/Heading5";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

interface CourseCertificate {
  imgUrl: string;
  title: string;
  description: string;
  lesson: number;
  level: string;
}
export default function Dashboard() {
  const navigate = useNavigate();
  const courses = [
    {
      id: 1,
      name: "Học Python",
      image:
        "https://codelearnstorage.s3.amazonaws.com/CodeCamp/CodeCamp/Upload/Course/cf55489ccd434e8c81c61e6fffc9433f.jpg",
      process: 38,
      currentLesson: "Sử dụng vòng lặp"
    },
    {
      id: 2,
      name: "Học C++",
      image:
        "https://codelearnstorage.s3.amazonaws.com/CodeCamp/CodeCamp/Upload/Course/37a8e25c3ada4cb0bc3b0b32a36881fe.jpg",
      process: 10,
      currentLesson: "Câu điều kiện"
    },
    {
      id: 3,
      name: "Học Java",
      image:
        "https://codelearnstorage.s3.amazonaws.com/CodeCamp/CodeCamp/Upload/Course/00e74493b80d4dcfadf2e1a59af577e7.jpg",
      process: 1,
      currentLesson: "Đọc ghi file"
    }
  ];
  const { t } = useTranslation();

  const courseCertificatesBasic: CourseCertificate[] = [
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/cpp.svg",
      title: "Học C++ cơ bản",
      description:
        "Practice problems of C++, the language most used for DSA and low level programming due to its efficiency and speed.",
      lesson: 10,
      level: t("common_easy")
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/python.svg",
      title: "Học Python cơ bản",
      description:
        "Practice Python problems, the language known for its simplicity and readability making it the best language for beginners..",
      lesson: 30,
      level: t("common_easy")
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/go.svg",
      title: "Học Go cơ bản",
      description:
        "Learn the basics of Go programming with ease in this interactive and practical course. This course will provide a good base to building real world applications in go.",
      lesson: 35,
      level: t("common_easy")
    }
  ];
  return (
    <Grid className={classes.root}>
      <Header />
      <main>
        <Container className={classes.container}>
          <Grid container className={classes.sectionContentImage}>
            <Grid item sm={12} md={6} className={classes.sectionContent}>
              <Box className={classes.currentCourse} translation-key='dashboard_continue_title'>
                <Heading2>{t("dashboard_continue_title")}</Heading2>
                <Box className={classes.courseLearningList}>
                  {courses.map((course, index) => (
                    <Grid className={classes.courseLearningItem} key={index}>
                      <Box className={classes.titleContainer}>
                        <img src={course.image} alt='course' className={classes.imageCourse} />
                        <Box className={classes.courseLearningItemContent}>
                          <Heading3>{course.name}</Heading3>
                          <Box className={classes.processBar} style={{ width: "100%" }}>
                            <LinearProgress determinate value={course.process} />
                          </Box>
                          <ParagraphExtraSmall translation-key='dashboard_current_lesson'>
                            {t("dashboard_current_lesson")}: {course.currentLesson}
                          </ParagraphExtraSmall>
                        </Box>
                      </Box>
                      <Box className={classes.learnBtn}>
                        <Button
                          variant='contained'
                          color='primary'
                          translation-key='common_continue'
                        >
                          {i18next.format(t("common_continue"), "firstUppercase")}
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Box>
              </Box>
              <Box className={classes.courseRecommend}>
                <Box className={classes.wrapperCourseRecommend}>
                  <Heading2 translation-key='dashboard_other_course'>
                    {t("dashboard_other_course")}
                  </Heading2>
                  <Button variant='outlined' color='primary' translation-key='home_more_button'>
                    {t("home_more_button")}
                  </Button>
                </Box>
                <Box className={classes.couseCertificatesByTopic}>
                  <Grid container spacing={3}>
                    {courseCertificatesBasic.map((course, index) => (
                      <Grid item xs={4} key={index}>
                        <Box
                          className={classes.courseCerticate}
                          onClick={() => {
                            navigate(
                              routes.user.course_certificate.detail.lesson.root.replace(
                                ":courseId",
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
                                <Heading5>{course.title}</Heading5>
                              </Grid>
                            </Grid>
                            <Divider />

                            <Grid item xs={2}>
                              <Box className={classes.iconCourse}>
                                <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                                <ParagraphBody translation-key='certificate_detail_lesson'>
                                  {course.lesson}{" "}
                                  {i18next.format(
                                    t("certificate_detail_lesson", { count: 2 }),
                                    "lowercase"
                                  )}
                                </ParagraphBody>
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
            <Grid item md={2}></Grid>
            <Grid item sm={12} md={4} className={classes.wrapperContest}>
              <Heading2 translation-key='dashboard_happening_contest'>
                {t("dashboard_happening_contest")}
              </Heading2>
              <Box className={classes.contest}>
                <Card>
                  <CardMedia
                    component='img'
                    alt='green iguana'
                    height='140'
                    image='https://files.codingninjas.in/article_images/codingcompetitionblog-23489.webp'
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      Cuộc thi lập trình đa vũ trụ
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      translation-key='dashboard_participant_num'
                    >
                      {t("dashboard_participant_num", { participantNum: 1000 })}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.primary'
                      translation-key='dashboard_contest_end'
                    >
                      {t("dashboard_contest_end")} 20/04/2024
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size='large'
                      variant='contained'
                      translation-key='contest_detail_join_button'
                    >
                      {t("contest_detail_join_button")}
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </main>
    </Grid>
  );
}
