import { Box, Button, CardMedia, Container, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import Heading3 from "components/text/Heading3";
import { Card, CardContent } from "@mui/material";
import images from "config/images";
import StarIcon from "@mui/icons-material/Star";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";
import { setCertificateCourses, setLoading } from "reduxes/coreService/CertificateCourse";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import { useEffect, useMemo } from "react";
import { routes } from "routes/routes";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const certificateCourseState = useSelector((state: RootState) => state.certifcateCourse);

  const singleBasicProgrammingLanguageCertificateCourses = useMemo(() => {
    if (!certificateCourseState.certificateCourses) {
      return [];
    }
    const certificateCourses = certificateCourseState.certificateCourses.filter(
      (certificateCourse) => certificateCourse.topic.isSingleProgrammingLanguage === true
    );
    // sort by skill level
    certificateCourses.sort((a, b) => {
      if (a.skillLevel === SkillLevelEnum.BASIC && b.skillLevel !== SkillLevelEnum.BASIC) {
        return -1;
      } else if (a.skillLevel !== SkillLevelEnum.BASIC && b.skillLevel === SkillLevelEnum.BASIC) {
        return 1;
      } else if (
        a.skillLevel === SkillLevelEnum.INTERMEDIATE &&
        b.skillLevel === SkillLevelEnum.ADVANCED
      ) {
        return -1;
      } else if (
        a.skillLevel === SkillLevelEnum.ADVANCED &&
        b.skillLevel === SkillLevelEnum.INTERMEDIATE
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    return certificateCourses;
  }, [certificateCourseState.certificateCourses]);

  const dsaProgrammingLanguageCertificateCourses = useMemo(() => {
    if (!certificateCourseState.certificateCourses) {
      return [];
    }
    return certificateCourseState.certificateCourses.filter(
      (certificateCourse) =>
        certificateCourse.topic.isSingleProgrammingLanguage !== true &&
        certificateCourse.topic.name === "Data structures and Algorithms"
    );
  }, [certificateCourseState.certificateCourses]);

  const handleGetCertificateCourses = async ({
    courseName,
    filterTopicIds,
    isRegisteredFilter
  }: {
    courseName: string;
    filterTopicIds: string[];
    isRegisteredFilter: IsRegisteredFilterEnum;
  }) => {
    dispatch(setLoading({ isLoading: true }));
    try {
      const getCertificateCoursesResponse = await CertificateCourseService.getCertificateCourses({
        courseName: courseName,
        filterTopicIds: filterTopicIds,
        isRegisteredFilter: isRegisteredFilter
      });
      dispatch(setCertificateCourses(getCertificateCoursesResponse.certificateCourses));
      dispatch(setLoading({ isLoading: false }));
    } catch (error: any) {
      console.error("Failed to fetch certificate courses", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      dispatch(setLoading({ isLoading: false }));
      // Show snackbar here
    }
  };

  useEffect(() => {
    handleGetCertificateCourses({
      courseName: "",
      filterTopicIds: [],
      isRegisteredFilter: IsRegisteredFilterEnum.ALL
    });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "var(--blue-1)"
      }}
    >
      <Container className={classes.container}>
        <Grid container columnSpacing={5} className={classes.sectionContentImage}>
          <Grid item xs={12} sm={12} md={6} className={classes.sectionContent}>
            <Box className={classes.customListContainer}>
              <Heading1 className={classes.mainHeading} translation-key='home_title'>
                {t("home_title")}
              </Heading1>
              <ParagraphBody className={classes.mainParagraph} translation-key='home_subtitle'>
                {t("home_subtitle")}
              </ParagraphBody>
              <Button
                className={classes.createAccountBtn}
                variant='contained'
                color='primary'
                translation-key='home_create_account_button'
                onClick={() => navigate(routes.user.register.root)}
              >
                {t("home_create_account_button")}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={0} sm={0} md={6} className={classes.sectionImage}>
            <img className={classes.homeImage} src={images.home} alt='home' />
          </Grid>
        </Grid>
        <Grid container>
          <Container className={classes.courseContainer}>
            <Grid item xs={12} className={classes.courseContent}>
              <Heading3 className={classes.courseHeading}>{t("home_learn_to_code")}</Heading3>
              <Grid
                container
                spacing={2}
                sx={{
                  padding: "20px 100px 0px 100px"
                }}
              >
                {singleBasicProgrammingLanguageCertificateCourses.length > 0 &&
                  singleBasicProgrammingLanguageCertificateCourses
                    .slice(0, 3)
                    .map((certificateCourse) => (
                      <Grid item sm={12} md={4} key={certificateCourse.certificateCourseId}>
                        <Card
                          sx={{
                            width: "100%",
                            boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)"
                          }}
                        >
                          <CardMedia
                            component='img'
                            height='140'
                            image={certificateCourse.topic.thumbnailUrl}
                          />
                          <CardContent className={classes.courseCard}>
                            <Heading3>{certificateCourse.name}</Heading3>
                            <ParagraphBody className={classes.courseDescription}>
                              {certificateCourse.topic.description}
                            </ParagraphBody>
                            <Box className={classes.iconCourse}>
                              <img
                                src={images.icLevel}
                                alt='icon level'
                                className={classes.iconLevel}
                              />
                              <ParagraphBody>
                                {certificateCourse?.skillLevel === SkillLevelEnum.BASIC
                                  ? t("common_easy")
                                  : certificateCourse?.skillLevel === SkillLevelEnum.INTERMEDIATE
                                    ? t("common_medium")
                                    : certificateCourse?.skillLevel === SkillLevelEnum.ADVANCED
                                      ? t("common_hard")
                                      : ""}
                              </ParagraphBody>
                            </Box>
                            <Box className={classes.courseDetail}>
                              <Box className={classes.userLearning}>
                                <ParagraphBody>{certificateCourse.numOfStudents}</ParagraphBody>
                                <FontAwesomeIcon icon={faUser} className={classes.icUser} />
                              </Box>
                              <Box className={classes.userRating}>
                                <ParagraphBody>{certificateCourse.avgRating}</ParagraphBody>
                                <StarIcon className={classes.icStar} />
                              </Box>
                            </Box>
                            <Button
                              className={classes.viewDetailBtn}
                              fullWidth
                              variant='outlined'
                              color='primary'
                              translation-key='common_view_this_course'
                              onClick={() =>
                                navigate(
                                  routes.user.course_certificate.detail.lesson.root.replace(
                                    ":courseId",
                                    certificateCourse.certificateCourseId
                                  )
                                )
                              }
                            >
                              {t("common_view_this_course")}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.courseContent}>
              <Heading3 className={classes.courseHeading}>
                {t("home_data_structures_and_algorithms")}
              </Heading3>
              <Grid
                container
                spacing={2}
                sx={{
                  padding: "20px 100px 0px 100px"
                }}
              >
                {dsaProgrammingLanguageCertificateCourses.length > 0 &&
                  dsaProgrammingLanguageCertificateCourses.slice(0, 3).map((certificateCourse) => (
                    <Grid item sm={12} md={4} key={certificateCourse.certificateCourseId}>
                      <Card
                        sx={{
                          width: "100%",
                          boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)"
                        }}
                      >
                        <CardMedia
                          component='img'
                          height='140'
                          image={certificateCourse.topic.thumbnailUrl}
                        />
                        <CardContent className={classes.courseCard}>
                          <Heading3>{certificateCourse.name}</Heading3>
                          <ParagraphBody className={classes.courseDescription}>
                            {certificateCourse.topic.description}
                          </ParagraphBody>
                          <Box className={classes.iconCourse}>
                            <img
                              src={images.icLevel}
                              alt='icon level'
                              className={classes.iconLevel}
                            />
                            <ParagraphBody>
                              {" "}
                              {certificateCourse?.skillLevel === SkillLevelEnum.BASIC
                                ? t("common_easy")
                                : certificateCourse?.skillLevel === SkillLevelEnum.INTERMEDIATE
                                  ? t("common_medium")
                                  : certificateCourse?.skillLevel === SkillLevelEnum.ADVANCED
                                    ? t("common_hard")
                                    : ""}
                            </ParagraphBody>
                          </Box>
                          <Box className={classes.courseDetail}>
                            <Box className={classes.userLearning}>
                              <ParagraphBody>{certificateCourse.numOfStudents}</ParagraphBody>
                              <FontAwesomeIcon icon={faUser} className={classes.icUser} />
                            </Box>
                            <Box className={classes.userRating}>
                              <ParagraphBody>{certificateCourse.avgRating}</ParagraphBody>
                              <StarIcon className={classes.icStar} />
                            </Box>
                          </Box>
                          <Button
                            className={classes.viewDetailBtn}
                            fullWidth
                            variant='outlined'
                            color='primary'
                            translation-key='common_view_this_course'
                            onClick={() =>
                              navigate(
                                routes.user.course_certificate.detail.lesson.root.replace(
                                  ":courseId",
                                  certificateCourse.certificateCourseId
                                )
                              )
                            }
                          >
                            {t("common_view_this_course")}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            <Box className={classes.viewAllBtn}>
              <Button
                variant='contained'
                color='primary'
                translation-key={"home_view_all_courses"}
                onClick={() => navigate(routes.user.course_certificate.root)}
              >
                {t("home_view_all_courses")}
              </Button>
            </Box>
          </Container>
        </Grid>
      </Container>
    </Box>
  );
}
