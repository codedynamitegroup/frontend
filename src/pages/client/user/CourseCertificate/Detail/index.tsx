import { Box, Container, Divider, Grid, Tab, Tabs } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import { routes } from "routes/routes";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import ParagraphSmall from "components/text/ParagraphSmall";
import Heading2 from "components/text/Heading2";
import Button, { BtnType } from "components/common/buttons/Button";
import { useEffect, useMemo, useState } from "react";
import CourseCertificateIntroduction from "./components/Introduction";
import StarIcon from "@mui/icons-material/Star";
import { LinearProgress } from "@mui/joy";
import FlagIcon from "@mui/icons-material/Flag";
import SchoolIcon from "@mui/icons-material/School";
import CertificateDetails from "./components/Certificate";
import CourseCertificateLesson from "./components/Lesson";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import { calcCertificateCourseProgress } from "utils/coreService/calcCertificateCourseProgress";
import { ChapterService } from "services/coreService/ChapterService";
import { AppDispatch, RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import { setCertificateCourseDetails } from "reduxes/coreService/CertificateCourse";
import { setChapters } from "reduxes/coreService/Chapter";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";

const enum CertificateCourseCompletedStatus {
  START = "START",
  CONTINUE = "CONTINUE",
  DONE = "DONE"
}

const CourseCertificateDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { pathname } = useLocation();

  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [content, setContent] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const certificateCourseDetails = useSelector(
    (state: RootState) => state.certifcateCourse.certificateCourseDetails
  );
  const chapters = useSelector((state: RootState) => state.chapter.chapters);

  const certificateCourseCompletedStatus = useMemo(() => {
    if (!certificateCourseDetails) return CertificateCourseCompletedStatus.START;
    if (
      (certificateCourseDetails.numOfCompletedQuestions || 0) > 0 &&
      (certificateCourseDetails.numOfCompletedQuestions || 0) <
        certificateCourseDetails.numOfQuestions
    ) {
      return CertificateCourseCompletedStatus.CONTINUE;
    } else if (
      (certificateCourseDetails.numOfCompletedQuestions || 0) === 0 &&
      (certificateCourseDetails.numOfCompletedQuestions || 0) <
        certificateCourseDetails.numOfQuestions
    ) {
      return CertificateCourseCompletedStatus.START;
    } else {
      return CertificateCourseCompletedStatus.DONE;
    }
  }, [certificateCourseDetails]);

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (courseId) navigate(tabs[newTab].replace(":courseId", courseId));
  };

  const tabs: string[] = useMemo(() => {
    return [
      routes.user.course_certificate.detail.lesson.root,
      routes.user.course_certificate.detail.introduction,
      routes.user.course_certificate.detail.certificate
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (courseId) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":courseId", courseId)));
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const { t } = useTranslation();

  const handleGetCertificateCourseById = async (id: string) => {
    try {
      const getCertificateCourseByIdResponse =
        await CertificateCourseService.getCertificateCourseById(id);
      dispatch(setCertificateCourseDetails(getCertificateCourseByIdResponse));
    } catch (error: any) {
      console.error("Failed to fetch certificate course by id", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
      setOpenSnackbarAlert(true);
      setType(AlertType.Error);
      setContent(error.response?.message || error.message);
    }
  };

  const handleGetChaptersByCertificateCourseId = async (id: string) => {
    try {
      const getChaptersByCertificateCourseIdResponse =
        await ChapterService.getChaptersByCertificateCourseIdResponse(id);
      dispatch(setChapters(getChaptersByCertificateCourseIdResponse));
    } catch (error: any) {
      console.error("Failed to fetch chapters by certificate course id", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
      setOpenSnackbarAlert(true);
      setType(AlertType.Error);
      setContent(error.response?.message || error.message);
    }
  };

  const handleRegisterCertificateCourseById = async (id: string) => {
    // Check if isRegistered is true
    if (certificateCourseDetails?.isRegistered) return;

    try {
      const registerCertificateCourseByIdResponse =
        await CertificateCourseService.registerCertificateCourseById(id);
      if (
        registerCertificateCourseByIdResponse &&
        registerCertificateCourseByIdResponse.certificateCourseId === id
      ) {
        setOpenSnackbarAlert(true);
        setType(AlertType.Success);
        setContent(
          t("register_certificate_course_success", {
            courseName: certificateCourseDetails?.name
          })
        );
        dispatch(
          setCertificateCourseDetails({
            ...certificateCourseDetails,
            isRegistered: true
          })
        );
      } else {
        setOpenSnackbarAlert(true);
        setType(AlertType.Error);
        setContent(
          t("register_certificate_course_failed", {
            courseName: certificateCourseDetails?.name
          })
        );
      }
    } catch (error: any) {
      console.error("Failed to register certificate course by id", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      setOpenSnackbarAlert(true);
      setType(AlertType.Error);
      setContent(error.response?.message || error.message);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (courseId) {
        await handleGetCertificateCourseById(courseId);
        await handleGetChaptersByCertificateCourseId(courseId);
      }
    };
    fetchInitialData();
  }, []);

  if (!courseId || !certificateCourseDetails) return null;

  return (
    <Box
      sx={{
        backgroundColor: `var(--blue-1)`
      }}
    >
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={type}
        content={content}
      />
      <Container id={classes.container}>
        <Grid container id={classes.bodyWrapper}>
          <Grid item xs={12} md={12} id={classes.rightBody}>
            <Box id={classes.breadcumpWrapper}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.user.course_certificate.root)}
                translation-key='certificate_detail_breadcrump'
              >
                {t("certificate_detail_breadcrump")}
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorname='--blue-500'>
                {certificateCourseDetails.name}
              </ParagraphSmall>
            </Box>
            <Divider />
            <Box id={classes.courseInfoWrapper}>
              <Box id={classes.courseTitle}>
                <Box className={classes.imgCourseRecommend}>
                  <img
                    style={{
                      maxWidth: "70px",
                      maxHeight: "70px",
                      borderRadius: "5px"
                    }}
                    src={certificateCourseDetails.topic.thumbnailUrl}
                    alt='img course recommend'
                  />
                </Box>
                <Heading2>{certificateCourseDetails.name}</Heading2>
              </Box>
              <Grid container>
                <Grid item xs={12} md={6} id={classes.courseDetails} container>
                  <Grid
                    item
                    xs={4}
                    borderRight={"1px solid var(--gray-40)"}
                    className={classes.courseDetailsWrapper}
                  >
                    <Box id={classes.userRating}>
                      <ParagraphBody fontWeight={"600"}>
                        {certificateCourseDetails.avgRating.toFixed(1)}
                      </ParagraphBody>
                      <StarIcon id={classes.icStar} />
                    </Box>
                    <Box id={classes.userReviews}>
                      <ParagraphBody
                        colorname='--gray-60'
                        translation-key='certificate_detail_rating'
                      >
                        {certificateCourseDetails.numOfReviews} {t("certificate_detail_rating")}
                      </ParagraphBody>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    borderRight={"1px solid var(--gray-40)"}
                    className={classes.courseDetailsWrapper}
                  >
                    <Box id={classes.numberLesson}>
                      <ParagraphBody fontWeight={"600"} translation-key='certificate_detail_lesson'>
                        {certificateCourseDetails.numOfQuestions}{" "}
                        {t("certificate_detail_lesson", { count: 2 })}
                      </ParagraphBody>
                    </Box>
                    <Box id={classes.courseLevel}>
                      <ParagraphBody
                        colorname='--gray-60'
                        translation-key={["common_easy", "common_level"]}
                      >
                        {t("common_level", { count: 1 })}:{" "}
                        {certificateCourseDetails.skillLevel === SkillLevelEnum.BASIC
                          ? t("common_easy")
                          : certificateCourseDetails.skillLevel === SkillLevelEnum.INTERMEDIATE
                            ? t("common_medium")
                            : t("common_hard")}
                      </ParagraphBody>
                    </Box>
                  </Grid>
                  <Grid item xs={4} className={classes.courseDetailsWrapper}>
                    <Box id={classes.numberLearner}>
                      <ParagraphBody fontWeight={"600"}>
                        {certificateCourseDetails.numOfStudents}
                      </ParagraphBody>
                    </Box>
                    <Box>
                      <ParagraphBody
                        colorname='--gray-60'
                        translation-key='certificate_detail_participant'
                      >
                        {t("certificate_detail_participant")}
                      </ParagraphBody>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box id={classes.courseProgress}>
                    <Box id={classes.progressTitle}>
                      <ParagraphBody colorname='--gray-80' translation-key={"common_progress"}>
                        {i18next.format(t("common_progress"), "firstUppercase")}:{" "}
                        {calcCertificateCourseProgress(
                          certificateCourseDetails.numOfCompletedQuestions || 0,
                          certificateCourseDetails.numOfQuestions
                        )}
                        %
                      </ParagraphBody>
                      <FlagIcon id={classes.icFlag} />
                    </Box>
                    <LinearProgress
                      determinate
                      value={calcCertificateCourseProgress(
                        certificateCourseDetails.numOfCompletedQuestions || 0,
                        certificateCourseDetails.numOfQuestions
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item md={1}></Grid>
                {certificateCourseCompletedStatus !== CertificateCourseCompletedStatus.DONE && (
                  <Grid item xs={12} md={5}>
                    <Button
                      startIcon={<SchoolIcon id={classes.icSchool} />}
                      btnType={BtnType.Primary}
                      translation-key={
                        certificateCourseDetails.isRegistered === true
                          ? certificateCourseCompletedStatus ===
                            CertificateCourseCompletedStatus.CONTINUE
                            ? "certificate_detail_continue_button"
                            : "certificate_detail_start_button"
                          : "certificate_detail_register_button"
                      }
                      onClick={() => {
                        if (certificateCourseDetails.isRegistered === true) {
                          if (
                            certificateCourseCompletedStatus ===
                            CertificateCourseCompletedStatus.CONTINUE
                          ) {
                            for (let i = 0; i < chapters.length; i++) {
                              if (
                                chapters[i].questions.some((question) => question.pass !== true)
                              ) {
                                navigate(
                                  routes.user.course_certificate.detail.lesson.description
                                    .replace(":courseId", courseId)
                                    .replace(":lessonId", chapters[i].questions[0].id)
                                );
                                break;
                              }
                            }
                          } else {
                            // Start the course with first lesson id
                            if (chapters.length > 0) {
                              navigate(
                                routes.user.course_certificate.detail.lesson.description
                                  .replace(":courseId", courseId)
                                  .replace(":lessonId", chapters[0].questions[0].id)
                              );
                            }
                          }
                        } else {
                          handleRegisterCertificateCourseById(courseId);
                        }
                      }}
                    >
                      {certificateCourseDetails.isRegistered === true
                        ? certificateCourseCompletedStatus ===
                          CertificateCourseCompletedStatus.CONTINUE
                          ? t("certificate_detail_continue_button")
                          : t("certificate_detail_start_button")
                        : t("certificate_detail_register_button")}
                    </Button>
                  </Grid>
                )}
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
                    label={
                      <ParagraphBody translation-key='certificate_detail_lesson'>
                        {t("certificate_detail_lesson")}
                      </ParagraphBody>
                    }
                    value={0}
                  />
                  <Tab
                    sx={{ textTransform: "none" }}
                    label={
                      <ParagraphBody translation-key='common_introduction'>
                        {t("common_introduction")}
                      </ParagraphBody>
                    }
                    value={1}
                  />
                  <Tab
                    sx={{ textTransform: "none" }}
                    label={
                      <ParagraphBody translation-key='common_certificate'>
                        {t("common_certificate")}
                      </ParagraphBody>
                    }
                    value={2}
                  />
                </Tabs>
              </Box>
              <Box>
                <Routes>
                  <Route path={"lesson"} element={<CourseCertificateLesson />} />
                  <Route
                    path={"introduction"}
                    element={
                      <CourseCertificateIntroduction
                        description={certificateCourseDetails.description}
                      />
                    }
                  />
                  <Route path={"certificate"} element={<CertificateDetails />} />
                </Routes>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseCertificateDetail;
