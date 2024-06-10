import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Skeleton,
  Stack,
  ToggleButtonGroup
} from "@mui/material";
import AnimatedToggleButton from "components/common/buttons/AnimatedToggleButton";
import CustomAutocomplete from "components/common/search/CustomAutocomplete";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import Heading3 from "components/text/Heading3";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import useAuth from "hooks/useAuth";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import { TopicEntity } from "models/coreService/entity/TopicEntity";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  setCertificateCourses,
  setLoading,
  setMostEnrolledCertificateCourses
} from "reduxes/coreService/CertificateCourse";
import { setTopics } from "reduxes/coreService/Topic";
import { routes } from "routes/routes";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import { TopicService } from "services/coreService/TopicService";
import { AppDispatch, RootState } from "store";
import CourseCertificateCard from "./components/CourseCertifcateCard";
import classes from "./styles.module.scss";

const CourseCertificates = () => {
  const { isLoggedIn } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();

  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [isRecommendedLoading, setIsRecommendedLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const topicState = useSelector((state: RootState) => state.topic);
  const certificateCourseState = useSelector((state: RootState) => state.certifcateCourse);

  const catalogActive = useMemo(() => {
    const catalogActive = searchParams.get("catalog") || "all";
    return catalogActive;
  }, [searchParams]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetTopics = useCallback(async () => {
    setIsTopicsLoading(true);
    try {
      const getTopicsResponse = await TopicService.getTopics({
        fetchAll: true
      });
      dispatch(setTopics(getTopicsResponse));
      setIsTopicsLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch topics", {
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
      setIsTopicsLoading(false);
      // Show snackbar here
    }
  }, [dispatch]);

  const handleGetCertificateCourses = useCallback(
    async ({
      courseName,
      filterTopicId,
      isRegisteredFilter
    }: {
      courseName: string;
      filterTopicId?: string;
      isRegisteredFilter: IsRegisteredFilterEnum;
    }) => {
      dispatch(setLoading({ isLoading: true }));
      try {
        const getCertificateCoursesResponse = await CertificateCourseService.getCertificateCourses({
          courseName,
          filterTopicId,
          isRegisteredFilter
        });
        setTimeout(() => {
          dispatch(setCertificateCourses(getCertificateCoursesResponse.certificateCourses));
          dispatch(setLoading({ isLoading: false }));
        }, 1000);
      } catch (error: any) {
        console.error("Failed to fetch certificate courses", {
          code: error.code || 503,
          status: error.status || "Service Unavailable",
          message: error.message
        });
        dispatch(setLoading({ isLoading: false }));
        // Show snackbar here
      }
    },
    [dispatch]
  );

  const handleGetMyCertificateCourses = useCallback(
    async (searchText: string) => {
      dispatch(setLoading({ isLoading: true }));
      try {
        const getCertificateCoursesResponse =
          await CertificateCourseService.getMyCertificateCourses(searchText);
        dispatch(setCertificateCourses(getCertificateCoursesResponse.certificateCourses));
        dispatch(setLoading({ isLoading: false }));
      } catch (error: any) {
        console.error("Failed to fetch my certificate courses", {
          code: error.code || 503,
          status: error.status || "Service Unavailable",
          message: error.message
        });
        dispatch(setLoading({ isLoading: false }));
        // Show snackbar here
      }
    },
    [dispatch]
  );

  const handleGetMostEnrolledCertificateCourses = useCallback(async () => {
    setIsRecommendedLoading(true);
    try {
      const getMostEnrolledCertificateCoursesResponse =
        await CertificateCourseService.getMostEnrolledCertificateCourses();
      dispatch(
        setMostEnrolledCertificateCourses(
          getMostEnrolledCertificateCoursesResponse.mostEnrolledCertificateCourses
        )
      );
      setIsRecommendedLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch most enrolled certificate courses", {
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
      setIsRecommendedLoading(false);
      // Show snackbar here
    }
  }, [dispatch]);

  const searchHandle = useCallback(
    async (searchText: string) => {
      if (catalogActive === "my-courses") {
        await handleGetMyCertificateCourses(searchText);
      } else {
        const filterTopicId = catalogActive === "all" ? undefined : catalogActive;
        await handleGetCertificateCourses({
          courseName: searchText,
          filterTopicId,
          isRegisteredFilter: IsRegisteredFilterEnum.ALL
        });
      }
    },
    [catalogActive, handleGetCertificateCourses, handleGetMyCertificateCourses]
  );

  const handleChangeCatalog = useCallback(
    async (value: string) => {
      if (!value || value === catalogActive) return;
      if (value === "all") {
        setSearchText("");
        navigate(routes.user.course_certificate.root);
      } else if (value === "my-courses") {
        setSearchText("");
        navigate(`${routes.user.course_certificate.root}?catalog=my-courses`);
      } else {
        setSearchText("");
        navigate(`${routes.user.course_certificate.root}?catalog=${value}`);
      }
    },
    [catalogActive, navigate]
  );

  const certificateCoursesByEachTopic = useMemo(() => {
    const certificateCoursesByEachTopic = new Map<string, CertificateCourseEntity[]>();
    for (const topic of topicState.topics) {
      certificateCoursesByEachTopic.set(topic.topicId, []);
    }

    // Assign certificate courses to each topic
    for (const certificateCourse of certificateCourseState.certificateCourses) {
      const topicId = certificateCourse.topic.topicId;
      const certificateCourses = certificateCoursesByEachTopic.get(topicId);
      if (!certificateCourses) continue;
      certificateCourses?.push(certificateCourse);
      certificateCoursesByEachTopic.set(topicId, certificateCourses);
    }

    return certificateCoursesByEachTopic;
  }, [certificateCourseState.certificateCourses, topicState.topics]);

  useEffect(() => {
    const fetchDefaultData = async () => {
      Promise.all([
        handleGetTopics(),
        handleGetMostEnrolledCertificateCourses(),
        handleGetCertificateCourses({
          courseName: "",
          filterTopicId: undefined,
          isRegisteredFilter: IsRegisteredFilterEnum.ALL
        })
      ]);
    };
    fetchDefaultData();
  }, [handleGetCertificateCourses, handleGetMostEnrolledCertificateCourses, handleGetTopics]);

  return (
    <>
      <Box id={classes.courseCertificatesRoot}>
        <Container className={classes.container}>
          <Grid container>
            <Grid
              item
              xs={2.5}
              id={classes.filter}
              sx={{
                marginTop: "-20px"
              }}
            >
              <Heading3 translation-key='common_catalog'>{t("common_catalog")}</Heading3>
              <Box className={classes.couseCertificatesByTopic}>
                <ToggleButtonGroup
                  orientation='vertical'
                  color='primary'
                  value={catalogActive}
                  exclusive
                  onChange={(e, value) => handleChangeCatalog(value as string)}
                  aria-label='Platform'
                  fullWidth
                >
                  <AnimatedToggleButton value='all' isActive={catalogActive === "all"}>
                    <ParagraphBody>{t("common_all_courses")}</ParagraphBody>
                  </AnimatedToggleButton>
                </ToggleButtonGroup>
              </Box>
              {isLoggedIn && (
                <Box className={classes.couseCertificatesByTopic}>
                  <ToggleButtonGroup
                    orientation='vertical'
                    color='primary'
                    value={catalogActive}
                    exclusive
                    onChange={(e, value) => handleChangeCatalog(value as string)}
                    aria-label='Platform'
                    fullWidth
                  >
                    <AnimatedToggleButton
                      value='my-courses'
                      isActive={catalogActive === "my-courses"}
                    >
                      <ParagraphBody>{t("common_my_courses")}</ParagraphBody>
                    </AnimatedToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}
              <Heading5 translation-key='common_topics'>{t("common_topics")}</Heading5>
              <Box className={classes.couseCertificatesByTopic}>
                {isTopicsLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      gap: "10px"
                    }}
                  >
                    <CircularProgress />
                    <ParagraphBody>{t("common_loading")}</ParagraphBody>
                  </Box>
                ) : (
                  <ToggleButtonGroup
                    orientation='vertical'
                    color='primary'
                    value={catalogActive}
                    exclusive
                    onChange={(e, value) => handleChangeCatalog(value as string)}
                    aria-label='Platform'
                    fullWidth
                  >
                    {topicState.topics.map((topic: TopicEntity, index: number) => (
                      <AnimatedToggleButton
                        key={index}
                        value={topic.topicId}
                        isActive={catalogActive === topic.topicId}
                      >
                        <Stack
                          direction='row'
                          alignItems='center'
                          justifyContent='flex-start'
                          textAlign={"left"}
                          gap={1}
                        >
                          <img
                            style={{ width: "20px", height: "20px" }}
                            src={topic.thumbnailUrl}
                            alt={topic.name}
                          />
                          <ParagraphBody>
                            {topic.name} ({topic.numOfCertificateCourses})
                          </ParagraphBody>
                        </Stack>
                      </AnimatedToggleButton>
                    ))}
                  </ToggleButtonGroup>
                )}
              </Box>
            </Grid>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={9}>
              <Box id={classes.couseCertificatesWrapper}>
                {(catalogActive === "my-courses" || catalogActive === "all") && (
                  <Box className={classes.couseCertificatesByTopic}>
                    <Card className={classes.recommendedCertificateCoursesWrapper}>
                      <Heading2
                        translation-key='certificate_hot_recommend'
                        sx={{
                          marginBottom: "10px"
                        }}
                      >
                        {t("certificate_hot_recommend")}
                      </Heading2>
                      <Grid container spacing={3}>
                        {isRecommendedLoading
                          ? Array.from({ length: 3 }).map((_, index) => (
                              <Grid item xs={4} key={index}>
                                <Skeleton variant='rectangular' width='100%' height={320} />
                              </Grid>
                            ))
                          : certificateCourseState.mostEnrolledCertificateCourses
                              .slice(0, 3)
                              .map((course, index) => (
                                <Grid
                                  item
                                  xs={4}
                                  key={index}
                                  onClick={() =>
                                    navigate(
                                      routes.user.course_certificate.detail.introduction.replace(
                                        ":courseId",
                                        course.certificateCourseId
                                      )
                                    )
                                  }
                                >
                                  <CourseCertificateCard course={course} />
                                </Grid>
                              ))}
                      </Grid>
                    </Card>
                    <Heading1 translation-key='common_all_courses_catalog'>
                      {t("common_all_courses_catalog")}
                    </Heading1>
                  </Box>
                )}

                <Box className={classes.autocompleteWrapper}>
                  <CustomAutocomplete
                    value={searchText}
                    setValue={setSearchText}
                    options={certificateCourseState.certificateCourses}
                    onHandleChange={searchHandle}
                    renderOption={(props, option: CertificateCourseEntity, { inputValue }) => {
                      return (
                        <li
                          {...props}
                          key={option.certificateCourseId}
                          style={{
                            paddingLeft: "10px",
                            paddingRight: "10px"
                          }}
                        >
                          <Button
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "flex-start",
                              textTransform: "capitalize"
                            }}
                            onClick={() => {
                              navigate(
                                `${routes.user.course_certificate.detail.introduction.replace(":courseId", option.certificateCourseId)}`
                              );
                            }}
                          >
                            <Stack
                              direction='row'
                              alignItems='space-between'
                              justifyContent='space-between'
                              gap={1}
                              width={"100%"}
                            >
                              <Stack
                                direction='row'
                                alignItems='center'
                                justifyContent='flex-start'
                                textAlign={"left"}
                                gap={1}
                              >
                                <img
                                  style={{ width: "20px", height: "20px" }}
                                  src={option.topic.thumbnailUrl}
                                  alt={option.name}
                                />
                                {option.name}
                                <Chip
                                  size='small'
                                  label={
                                    option.skillLevel === SkillLevelEnum.BASIC
                                      ? t("common_easy")
                                      : option?.skillLevel === SkillLevelEnum.INTERMEDIATE
                                        ? t("common_medium")
                                        : option?.skillLevel === SkillLevelEnum.ADVANCED
                                          ? t("common_hard")
                                          : ""
                                  }
                                  variant='outlined'
                                />
                              </Stack>
                              <Stack
                                direction='row'
                                alignItems='center'
                                justifyContent='flex-end'
                                gap={1}
                                translate-key='common_view_details'
                              >
                                {t("common_view_details")}
                                <ArrowForwardIosIcon />
                              </Stack>
                            </Stack>
                          </Button>
                        </li>
                      );
                    }}
                  />
                </Box>

                {typeof catalogActive === "string" &&
                  (catalogActive === "all" || catalogActive === "my-courses") &&
                  topicState.topics &&
                  topicState.topics.length > 0 &&
                  topicState.topics.map((topic, index) => {
                    const certificateCourses = certificateCoursesByEachTopic.get(topic.topicId);
                    return (
                      <Box className={classes.couseCertificatesByTopic} key={index}>
                        <Heading3>
                          {topic.name} ({certificateCourses?.length})
                        </Heading3>
                        {certificateCourseState.isLoading ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              gap: "10px"
                            }}
                          >
                            <CircularProgress />
                            <ParagraphBody>{t("common_loading_search")}</ParagraphBody>
                          </Box>
                        ) : (
                          <Grid container spacing={3}>
                            {certificateCourses?.map((course, index) => (
                              <Grid
                                item
                                xs={4}
                                key={index}
                                onClick={() =>
                                  navigate(
                                    routes.user.course_certificate.detail.introduction.replace(
                                      ":courseId",
                                      course.certificateCourseId
                                    )
                                  )
                                }
                              >
                                <CourseCertificateCard course={course} />
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </Box>
                    );
                  })}
                {typeof catalogActive === "string" &&
                  catalogActive !== "all" &&
                  catalogActive !== "my-courses" && (
                    <Box className={classes.couseCertificatesByTopic}>
                      <Heading3>
                        {topicState.topics.find((topic) => topic.topicId === catalogActive)?.name}
                      </Heading3>
                      {certificateCourseState.isLoading ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            gap: "10px"
                          }}
                        >
                          <CircularProgress />
                          <ParagraphBody>{t("common_loading_search")}</ParagraphBody>
                        </Box>
                      ) : (
                        <Grid container spacing={3}>
                          {certificateCoursesByEachTopic.get(catalogActive) &&
                            certificateCoursesByEachTopic
                              .get(catalogActive)
                              ?.map((course, index) => (
                                <Grid
                                  item
                                  xs={4}
                                  key={index}
                                  onClick={() =>
                                    navigate(
                                      routes.user.course_certificate.detail.introduction.replace(
                                        ":courseId",
                                        course.certificateCourseId
                                      )
                                    )
                                  }
                                >
                                  <CourseCertificateCard course={course} />
                                </Grid>
                              ))}
                        </Grid>
                      )}
                    </Box>
                  )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CourseCertificates;
