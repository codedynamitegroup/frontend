import FlagIcon from "@mui/icons-material/Flag";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import { LinearProgress } from "@mui/joy";
import JoyButton from "@mui/joy/Button";
import { Box, Container, Grid, Skeleton, Stack, Tab, Tabs, Tooltip } from "@mui/material";
import CustomBreadCrumb from "components/common/Breadcrumb";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import useAuth from "hooks/useAuth";
import i18next from "i18next";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import { CertificateCourseReviewMetadataEntity } from "models/coreService/entity/CertificateCourseReviewMetadataEntity";
import { ResourceTypeEnum } from "models/coreService/enum/ResourceTypeEnum";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { setChapters } from "reduxes/coreService/Chapter";
import { routes } from "routes/routes";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import { ChapterService } from "services/coreService/ChapterService";
import { ReviewService } from "services/coreService/ReviewService";
import { AppDispatch } from "store";
import { calcCertificateCourseProgress } from "utils/coreService/calcCertificateCourseProgress";
import CertificateDetails from "./components/Certificate";
import CertificateCourseReviews from "./components/CertificateCourseReviews";
import CourseCertificateIntroduction from "./components/Introduction";
import CourseCertificateLesson from "./components/Lesson";
import classes from "./styles.module.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ParagraphSmall from "components/text/ParagraphSmall";

const enum CertificateCourseCompletedStatus {
  START = "START",
  CONTINUE = "CONTINUE",
  DONE = "DONE"
}

const CourseCertificateDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { pathname } = useLocation();

  const { isLoggedIn } = useAuth();
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const [certificateCourseDetails, setCertificateCourseDetails] = useState<{
    data: CertificateCourseEntity | null;
    isLoading: boolean;
  }>({
    data: null,
    isLoading: false
  });

  const [reviewMetadata, setReviewMetadata] = useState<{
    data: CertificateCourseReviewMetadataEntity;
    isLoading: boolean;
  }>({
    data: {
      numOfOneStarReviews: 0,
      numOfTwoStarReviews: 0,
      numOfThreeStarReviews: 0,
      numOfFourStarReviews: 0,
      numOfFiveStarReviews: 0,
      numOfReviews: 0,
      avgRating: 0
    },
    isLoading: false
  });

  const progress = useMemo(() => {
    if (!certificateCourseDetails.data) return 0;
    return calcCertificateCourseProgress(
      certificateCourseDetails.data.numOfCompletedResources || 0,
      certificateCourseDetails.data.numOfResources
    );
  }, [certificateCourseDetails]);

  const certificateCourseCompletedStatus = useMemo(() => {
    if (progress > 0 && progress < 85) {
      return CertificateCourseCompletedStatus.CONTINUE;
    } else if (progress === 0) {
      return CertificateCourseCompletedStatus.START;
    } else if (progress >= 85) {
      return CertificateCourseCompletedStatus.DONE;
    }
  }, [progress]);

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (courseId) navigate(tabs[newTab].replace(":courseId", courseId));
  };

  const tabs: string[] = useMemo(() => {
    return [
      routes.user.course_certificate.detail.introduction,
      routes.user.course_certificate.detail.lesson.root,
      routes.user.course_certificate.detail.certificate,
      routes.user.course_certificate.detail.review
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

  const handleGetCertificateCourseById = useCallback(
    async (id: string) => {
      setCertificateCourseDetails((prev) => ({
        ...prev,
        isLoading: true
      }));
      try {
        const getCertificateCourseByIdResponse =
          await CertificateCourseService.getCertificateCourseById(id);
        setCertificateCourseDetails((prev) => ({
          ...prev,
          data: getCertificateCourseByIdResponse,
          isLoading: false
        }));
      } catch (error: any) {
        console.error("Failed to fetch certificate course by id", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
        // Show snackbar here
        dispatch(setErrorMess(error.response?.message || error.message));
        setCertificateCourseDetails((prev) => ({
          ...prev,
          isLoading: false
        }));
      }
    },
    [dispatch]
  );

  const handleGetRatingCountByCertificateCourseId = useCallback(
    async (certificateCourseId: string) => {
      setReviewMetadata((prev) => ({
        ...prev,
        isLoading: true
      }));
      try {
        const getRatingCountByCertificateCourseIdResponse =
          await ReviewService.getEachRatingCountByCertificateCourseId({
            certificateCourseId
          });
        setReviewMetadata((prev) => ({
          ...prev,
          isLoading: false,
          data: getRatingCountByCertificateCourseIdResponse
        }));
      } catch (error: any) {
        setReviewMetadata((prev) => ({
          ...prev,
          isLoading: false
        }));
      }
    },
    []
  );

  const handleGetChaptersByCertificateCourseId = useCallback(
    async (id: string) => {
      try {
        const getChaptersByCertificateCourseIdResponse =
          await ChapterService.getChaptersByCertificateCourseIdResponse(id);
        dispatch(setChapters(getChaptersByCertificateCourseIdResponse));
      } catch (error: any) {
        dispatch(setErrorMess(error.response?.message || error.message));
      }
    },
    [dispatch]
  );

  const handleRegisterCertificateCourseById = useCallback(
    async (id: string) => {
      // Check if isRegistered is true
      if (certificateCourseDetails.data?.isRegistered) return;
      setIsRegisterLoading(true);
      try {
        const registerCertificateCourseByIdResponse =
          await CertificateCourseService.registerCertificateCourseById(id);
        setIsRegisterLoading(false);
        if (
          registerCertificateCourseByIdResponse &&
          registerCertificateCourseByIdResponse.certificateCourseId === id
        ) {
          setCertificateCourseDetails((prev) => ({
            ...prev,
            data: {
              ...prev.data!,
              isRegistered: true
            }
          }));
          dispatch(
            setSuccessMess(
              t("register_certificate_course_success", {
                courseName: certificateCourseDetails.data?.name
              })
            )
          );
        } else {
          dispatch(
            setSuccessMess(
              t("register_certificate_course_failed", {
                courseName: certificateCourseDetails.data?.name
              })
            )
          );
        }
      } catch (error: any) {
        console.error("Failed to register certificate course by id", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
        setIsRegisterLoading(false);
        dispatch(setErrorMess(error.response?.message || error.message));
      }
    },
    [certificateCourseDetails, dispatch, t]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      if (courseId) {
        await handleGetCertificateCourseById(courseId);
        await handleGetChaptersByCertificateCourseId(courseId);
        await handleGetRatingCountByCertificateCourseId(courseId);
      }
    };
    fetchInitialData();
  }, [
    courseId,
    dispatch,
    handleGetCertificateCourseById,
    handleGetChaptersByCertificateCourseId,
    handleGetRatingCountByCertificateCourseId
  ]);

  if (
    !courseId ||
    (certificateCourseDetails.data === null && certificateCourseDetails.isLoading === false)
  )
    return null;

  return (
    <Box id={classes.courseCertificateDetailRoot}>
      <Container id={classes.container}>
        <Grid container id={classes.bodyWrapper}>
          <Grid item xs={12} md={12} id={classes.rightBody}>
            <Box className={classes.breadcump}>
              <Box id={classes.breadcumpWrapper}>
                <CustomBreadCrumb
                  breadCrumbData={[
                    {
                      navLink: routes.user.course_certificate.root,
                      label: t("certificate_detail_breadcrump")
                    }
                  ]}
                  lastBreadCrumbLabel={certificateCourseDetails.data?.name || ""}
                />
              </Box>
            </Box>
            <Box id={classes.courseInfoWrapper}>
              <Box id={classes.courseTitle}>
                {certificateCourseDetails.isLoading ? (
                  <Skeleton variant='rectangular' width={50} height={50} />
                ) : (
                  <Box className={classes.imgCourseRecommend}>
                    <img
                      style={{
                        maxWidth: "70px",
                        maxHeight: "70px",
                        borderRadius: "5px"
                      }}
                      src={certificateCourseDetails.data?.topic?.thumbnailUrl}
                      alt='img course recommend'
                    />
                  </Box>
                )}
                {certificateCourseDetails.isLoading ? (
                  <Skeleton variant='rectangular' width={200} height={30} />
                ) : (
                  <Stack direction={"column"} spacing={1}>
                    <Heading2>{certificateCourseDetails.data?.name}</Heading2>
                    {certificateCourseCompletedStatus === CertificateCourseCompletedStatus.DONE && (
                      <Stack
                        direction='row'
                        spacing={1}
                        sx={{
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <CheckCircleIcon
                          htmlColor='#1BA94C'
                          sx={{
                            width: "18px",
                            height: "18px"
                          }}
                        />
                        <ParagraphSmall translate-key='certificate_detail_certification_completed'>
                          {t("certificate_detail_certification_completed")}
                        </ParagraphSmall>
                      </Stack>
                    )}
                  </Stack>
                )}
              </Box>
              <Grid container>
                <Grid item xs={12} md={6} id={classes.courseDetails} container>
                  {reviewMetadata.isLoading ? (
                    <Grid
                      item
                      xs={4}
                      borderRight={"1px solid var(--gray-40)"}
                      className={classes.courseDetailsWrapper}
                    >
                      <Box id={classes.userRating}>
                        <Skeleton variant='text' width={20} height={20} />
                        <StarIcon id={classes.icStar} />
                      </Box>
                      <Box id={classes.userReviews}>
                        <Skeleton variant='text' width={50} height={20} />
                      </Box>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={4}
                      borderRight={"1px solid var(--gray-40)"}
                      className={classes.courseDetailsWrapper}
                    >
                      <Box id={classes.userRating}>
                        <ParagraphBody fontWeight={"600"}>
                          {reviewMetadata.data.avgRating.toFixed(1)}
                        </ParagraphBody>
                        <StarIcon id={classes.icStar} />
                      </Box>
                      <Box id={classes.userReviews}>
                        <ParagraphBody
                          colorname='--gray-60'
                          translation-key='certificate_detail_rating'
                        >
                          {reviewMetadata.data.numOfReviews} {t("certificate_detail_rating")}
                        </ParagraphBody>
                      </Box>
                    </Grid>
                  )}
                  {certificateCourseDetails.isLoading ? (
                    <Grid
                      item
                      xs={4}
                      borderRight={"1px solid var(--gray-40)"}
                      className={classes.courseDetailsWrapper}
                    >
                      <Box id={classes.numberLesson}>
                        <Skeleton variant='text' width={50} height={20} />
                      </Box>
                      <Box id={classes.courseLevel}>
                        <Skeleton variant='text' width={50} height={20} />
                      </Box>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={4}
                      borderRight={"1px solid var(--gray-40)"}
                      className={classes.courseDetailsWrapper}
                    >
                      <Box id={classes.numberLesson}>
                        <ParagraphBody
                          fontWeight={"600"}
                          translation-key='certificate_detail_lesson'
                        >
                          {certificateCourseDetails.data?.numOfResources}{" "}
                          {t("certificate_detail_lesson", { count: 2 })}
                        </ParagraphBody>
                      </Box>
                      <Box id={classes.courseLevel}>
                        <ParagraphBody
                          colorname='--gray-60'
                          translation-key={["common_easy", "common_level"]}
                        >
                          {t("common_level", { count: 1 })}:{" "}
                          {certificateCourseDetails.data?.skillLevel === SkillLevelEnum.BASIC
                            ? t("common_easy")
                            : certificateCourseDetails.data?.skillLevel ===
                                SkillLevelEnum.INTERMEDIATE
                              ? t("common_medium")
                              : t("common_hard")}
                        </ParagraphBody>
                      </Box>
                    </Grid>
                  )}
                  {certificateCourseDetails.isLoading ? (
                    <Grid item xs={4} className={classes.courseDetailsWrapper}>
                      <Box id={classes.numberLearner}>
                        <Skeleton variant='text' width={50} height={20} />
                      </Box>
                      <Box>
                        <Skeleton variant='text' width={50} height={20} />
                      </Box>
                    </Grid>
                  ) : (
                    <Grid item xs={4} className={classes.courseDetailsWrapper}>
                      <Box id={classes.numberLearner}>
                        <ParagraphBody fontWeight={"600"}>
                          {certificateCourseDetails.data?.numOfStudents}
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
                  )}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box id={classes.courseProgress}>
                    <Box id={classes.progressTitle}>
                      <ParagraphBody colorname='--gray-80' translation-key={"common_progress"}>
                        {i18next.format(t("common_progress"), "firstUppercase")}: {progress}%
                      </ParagraphBody>
                      <FlagIcon id={classes.icFlag} />
                    </Box>
                    <LinearProgress determinate value={progress} />
                  </Box>
                </Grid>
                <Grid item md={1}></Grid>
                <Grid item xs={12} md={5}>
                  <Tooltip
                    title={isLoggedIn === false ? t("certificate_detail_register_tooltip") : ""}
                    placement='top'
                    arrow
                  >
                    <span>
                      <JoyButton
                        loading={isRegisterLoading}
                        disabled={isLoggedIn === false}
                        color='primary'
                        startDecorator={<SchoolIcon />}
                        translation-key={
                          certificateCourseDetails.data?.isRegistered === true
                            ? certificateCourseCompletedStatus ===
                              CertificateCourseCompletedStatus.CONTINUE
                              ? "certificate_detail_continue_button"
                              : "certificate_detail_start_button"
                            : "certificate_detail_register_button"
                        }
                        onClick={() => {
                          if (certificateCourseDetails.data?.isRegistered === true) {
                            if (certificateCourseDetails.data?.currentResource) {
                              const url =
                                certificateCourseDetails.data?.currentResource.resourceType ===
                                ResourceTypeEnum.CODE
                                  ? routes.user.course_certificate.detail.lesson.description
                                      .replace(":courseId", courseId)
                                      .replace(
                                        ":lessonId",
                                        certificateCourseDetails.data?.currentResource
                                          ?.chapterResourceId || ""
                                      )
                                      .replace("*", "")
                                  : routes.user.course_certificate.detail.lesson.detail
                                      .replace(":courseId", courseId)
                                      .replace(
                                        ":lessonId",
                                        certificateCourseDetails.data?.currentResource
                                          ?.chapterResourceId || ""
                                      )
                                      .replace("*", "");

                              navigate(url);
                            } else {
                              dispatch(setErrorMess(t("certificate_detail_no_resources")));
                            }
                          } else {
                            handleRegisterCertificateCourseById(courseId);
                          }
                        }}
                      >
                        {certificateCourseDetails.data?.isRegistered === true
                          ? certificateCourseCompletedStatus ===
                            CertificateCourseCompletedStatus.CONTINUE
                            ? t("certificate_detail_continue_button")
                            : t("certificate_detail_start_button")
                          : t("certificate_detail_register_button")}
                      </JoyButton>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
              <Box sx={{ border: "1px solid var(--gray-10)" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  aria-label='basic tabs example'
                  className={classes.tabs}
                >
                  <Tab
                    sx={{ textTransform: "none" }}
                    label={
                      <ParagraphBody translation-key='common_introduction'>
                        {t("common_introduction")}
                      </ParagraphBody>
                    }
                    value={0}
                  />
                  <Tab
                    sx={{ textTransform: "none" }}
                    label={
                      <ParagraphBody translation-key='certificate_detail_lesson'>
                        {t("certificate_detail_lesson")}
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
                  <Tab
                    sx={{ textTransform: "none" }}
                    label={
                      <ParagraphBody translation-key='common_review'>
                        {t("common_review")}
                      </ParagraphBody>
                    }
                    value={3}
                  />
                </Tabs>
              </Box>
              <Box>
                <Routes>
                  <Route
                    path={"introduction"}
                    element={
                      certificateCourseDetails.isLoading ? (
                        <>
                          <Skeleton variant='text' width={200} height={50} />
                          <Skeleton
                            variant='text'
                            width={700}
                            height={500}
                            sx={{
                              marginTop: "-50px"
                            }}
                          />
                        </>
                      ) : (
                        <CourseCertificateIntroduction
                          description={certificateCourseDetails.data?.description || ""}
                        />
                      )
                    }
                  />
                  <Route
                    path={"lesson"}
                    element={
                      <CourseCertificateLesson
                        isRegistered={certificateCourseDetails.data?.isRegistered || false}
                      />
                    }
                  />
                  <Route
                    path={"certificate"}
                    element={
                      <CertificateDetails
                        isCompleted={
                          certificateCourseCompletedStatus === CertificateCourseCompletedStatus.DONE
                        }
                      />
                    }
                  />
                  <Route
                    path={"review"}
                    element={
                      <CertificateCourseReviews
                        reviewMetadata={reviewMetadata}
                        handleGetRatingCountByCertificateCourseId={
                          handleGetRatingCountByCertificateCourseId
                        }
                        isRegistered={certificateCourseDetails.data?.isRegistered || false}
                        certificateCourseId={courseId}
                        dispatch={dispatch}
                      />
                    }
                  />
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
