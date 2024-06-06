import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinearProgress } from "@mui/joy";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CustomButton, { BtnType } from "components/common/buttons/Button";
import Heading2 from "components/text/Heading2";
import Heading3 from "components/text/Heading3";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import images from "config/images";
import useAuth from "hooks/useAuth";
import i18next from "i18next";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import { AppDispatch, RootState } from "store";
import { calcCertificateCourseProgress } from "utils/coreService/calcCertificateCourseProgress";
import classes from "./styles.module.scss";
import { ContestService } from "services/coreService/ContestService";
import { setMostPopularContests } from "reduxes/coreService/Contest";
import ParagraphSmall from "components/text/ParagraphSmall";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import JoyButton from "@mui/joy/Button";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const user: User = useSelector(selectCurrentUser);
  const { loggedUser } = useAuth();
  const contestState = useSelector((state: RootState) => state.contest);
  const dispatch = useDispatch<AppDispatch>();

  const [registeredCertificateCourses, setRegisteredCertificateCourses] = React.useState<
    CertificateCourseEntity[]
  >([]);

  const [certificateCourses, setCertificateCourses] = React.useState<CertificateCourseEntity[]>([]);

  const firstMostPopularContest = useMemo(() => {
    if (
      !contestState.mostPopularContests ||
      !contestState.mostPopularContests.mostPopularContests
    ) {
      return null;
    }
    return contestState.mostPopularContests.mostPopularContests[0];
  }, [contestState.mostPopularContests]);

  const handleGetCertificateCourses = async ({
    courseName,
    filterTopicIds,
    isRegisteredFilter
  }: {
    courseName: string;
    filterTopicIds: string[];
    isRegisteredFilter: IsRegisteredFilterEnum;
  }) => {
    try {
      const getCertificateCoursesResponse = await CertificateCourseService.getCertificateCourses({
        courseName,
        filterTopicIds,
        isRegisteredFilter
      });
      return getCertificateCoursesResponse;
    } catch (error: any) {
      console.error("Failed to fetch certificate courses", {
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
      // Show snackbar here
    }
  };

  const handleGetMostPopularContests = useCallback(async () => {
    try {
      const getMostPopularContestsResponse = await ContestService.getMostPopularContests();
      dispatch(setMostPopularContests(getMostPopularContestsResponse));
    } catch (error: any) {
      console.error("Failed to fetch most popular contests", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
    }
  }, [dispatch]);

  const ongoingRegisteredCourses = useMemo(() => {
    if (!registeredCertificateCourses) {
      return [];
    }
    return registeredCertificateCourses
      .filter((course) => (course?.numOfCompletedQuestions || 0) > 0)
      .sort((a, b) => (b.numOfCompletedQuestions || 0) - (a.numOfCompletedQuestions || 0))
      .slice(0, 4);
  }, [registeredCertificateCourses]);

  const otherCertificateCourses = useMemo(() => {
    if (!certificateCourses) {
      return [];
    }
    return certificateCourses
      .filter(
        (course) =>
          !ongoingRegisteredCourses.find(
            (ongoingCourse) => ongoingCourse.certificateCourseId === course.certificateCourseId
          )
      )
      .sort((a, b) => (b.numOfCompletedQuestions || 0) - (a.numOfCompletedQuestions || 0))
      .slice(0, 3);
  }, [certificateCourses, ongoingRegisteredCourses]);

  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch(setInititalLoading(true));
      const getRegisteredCertificateCoursesResponse = await handleGetCertificateCourses({
        courseName: "",
        filterTopicIds: [],
        isRegisteredFilter: IsRegisteredFilterEnum.REGISTERED
      });
      if (getRegisteredCertificateCoursesResponse) {
        setRegisteredCertificateCourses(getRegisteredCertificateCoursesResponse.certificateCourses);
      }

      const getAllCertificateCoursesResponse = await handleGetCertificateCourses({
        courseName: "",
        filterTopicIds: [],
        isRegisteredFilter: IsRegisteredFilterEnum.ALL
      });
      if (getAllCertificateCoursesResponse) {
        setCertificateCourses(getAllCertificateCoursesResponse.certificateCourses);
      }

      await handleGetMostPopularContests();

      dispatch(setInititalLoading(false));
    };

    fetchInitialData();
  }, []);

  return (
    <Grid id={classes.userDashboardRoot}>
      <Container className={classes.container}>
        <Grid container className={classes.sectionContentImage}>
          <Grid item sm={12} md={7} className={classes.sectionContent}>
            <Box className={classes.currentCourse} translation-key='dashboard_continue_title'>
              <Heading2>
                {t("dashboard_continue_title")}, {loggedUser?.firstName}
              </Heading2>
              <Box className={classes.courseLearningList}>
                {ongoingRegisteredCourses.length === 0 ? (
                  <Box className={classes.noCourse}>
                    <ParagraphBody translation-key='dashboard_no_ongoing_course'>
                      {t("dashboard_no_ongoing_course")}
                    </ParagraphBody>
                  </Box>
                ) : (
                  ongoingRegisteredCourses.map((course: CertificateCourseEntity, index) => (
                    <Grid className={classes.courseLearningItem} key={index}>
                      <Box className={classes.titleContainer}>
                        <img
                          src={course.topic.thumbnailUrl}
                          alt='course'
                          className={classes.imageCourse}
                        />
                        <Box className={classes.courseLearningItemContent}>
                          <Heading3>{course.name}</Heading3>
                          <Box className={classes.processBar} style={{ width: "100%" }}>
                            <LinearProgress
                              determinate
                              value={calcCertificateCourseProgress(
                                course.numOfCompletedQuestions || 0,
                                course.numOfQuestions
                              )}
                            />
                          </Box>
                          {course.numOfQuestions ? (
                            <ParagraphExtraSmall translation-key='dashboard_current_lesson'>
                              {t("dashboard_current_lesson")}: {course.currentQuestion?.name || ""}
                            </ParagraphExtraSmall>
                          ) : (
                            <ParagraphExtraSmall translation-key='dashboard_this_certificate_course_has_no_lesson'>
                              {t("dashboard_this_certificate_course_has_no_lesson")}
                            </ParagraphExtraSmall>
                          )}
                        </Box>
                      </Box>
                      <Box className={classes.learnBtn}>
                        <CustomButton
                          btnType={BtnType.Primary}
                          translation-key='common_continue'
                          onClick={() => {
                            navigate(
                              routes.user.course_certificate.detail.lesson.root.replace(
                                ":courseId",
                                course.certificateCourseId.toString()
                              )
                            );
                          }}
                        >
                          {i18next.format(t("common_continue"), "firstUppercase")}
                        </CustomButton>
                      </Box>
                    </Grid>
                  ))
                )}
              </Box>
            </Box>
            <Box className={classes.courseRecommend}>
              <Box className={classes.wrapperCourseRecommend}>
                <Heading2 translation-key='dashboard_other_course'>
                  {t("dashboard_other_course")}
                </Heading2>
                <JoyButton
                  translation-key='home_view_all_courses'
                  onClick={() => {
                    navigate(routes.user.course_certificate.root);
                  }}
                >
                  {t("home_view_all_courses")}
                </JoyButton>
              </Box>
              <Box className={classes.couseCertificatesByTopic}>
                <Grid container spacing={3}>
                  {otherCertificateCourses.map((course, index) => (
                    <Grid item xs={4} key={index}>
                      <Box
                        className={classes.courseCerticate}
                        onClick={() => {
                          navigate(
                            routes.user.course_certificate.detail.lesson.root.replace(
                              ":courseId",
                              course.certificateCourseId.toString()
                            )
                          );
                        }}
                      >
                        <Grid container direction={"column"} margin={0} gap={2}>
                          <Grid item container xs={5} className={classes.titleCourse}>
                            <Grid item xs={3} className={classes.imgCourse}>
                              <img alt='img course' src={course.topic.thumbnailUrl} />
                            </Grid>
                            <Grid item xs={9} className={classes.nameCourse}>
                              <Heading5>{course.name}</Heading5>
                            </Grid>
                          </Grid>
                          <Divider />

                          <Grid item xs={2}>
                            <Box className={classes.iconCourse}>
                              <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                              <ParagraphBody translation-key='certificate_detail_lesson'>
                                {course.numOfQuestions}{" "}
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
                              <ParagraphBody>
                                {course.skillLevel === SkillLevelEnum.BASIC
                                  ? t("common_easy")
                                  : course.skillLevel === SkillLevelEnum.INTERMEDIATE
                                    ? t("common_medium")
                                    : t("common_hard")}
                              </ParagraphBody>
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
          <Grid item md={1}></Grid>
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
                  // image='https://files.codingninjas.in/article_images/codingcompetitionblog-23489.webp'
                  image={firstMostPopularContest?.thumbnailUrl}
                />
                <CardContent>
                  <ParagraphBody>
                    {/* Cuộc thi lập trình đa vũ trụ */}
                    {firstMostPopularContest?.name}
                  </ParagraphBody>
                  <ParagraphSmall translation-key='dashboard_participant_num'>
                    {t("dashboard_participant_num", { participantNum: 1000 })}
                  </ParagraphSmall>
                  <ParagraphSmall fontWeight={500} translation-key='dashboard_contest_end'>
                    {t("dashboard_contest_end")}{" "}
                    {firstMostPopularContest
                      ? standardlizeUTCStringToLocaleString(
                          firstMostPopularContest.endTime,
                          i18next.language
                        )
                      : ""}
                  </ParagraphSmall>
                </CardContent>
                <CardActions>
                  <JoyButton
                    translation-key='common_view_details'
                    onClick={() => {
                      navigate(
                        routes.user.contest.detail.replace(
                          ":contestId",
                          firstMostPopularContest?.contestId.toString() || ""
                        )
                      );
                    }}
                  >
                    {t("common_view_details")}
                  </JoyButton>
                </CardActions>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}
