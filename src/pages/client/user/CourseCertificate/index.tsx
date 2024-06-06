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
import BasicSelect from "components/common/select/BasicSelect";
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
    const topicId = searchParams.get("topicId");
    if (topicId && topicState.topics.find((topic) => topic.topicId === topicId)) {
      return topicId;
    }
    return "all";
  }, [searchParams, topicState.topics]);

  const currentTopic = useMemo(() => {
    return topicState.topics.find((topic) => topic.topicId === catalogActive);
  }, [catalogActive, topicState.topics]);

  const [isRegisterFilterValue, setIsRegisterFilterValue] = React.useState<IsRegisteredFilterEnum>(
    IsRegisteredFilterEnum.ALL
  );

  const basicCertificateCourses: CertificateCourseEntity[] = useMemo(() => {
    if (certificateCourseState.certificateCourses.length === 0) return [];
    return certificateCourseState.certificateCourses.filter(
      (course) =>
        course.skillLevel === SkillLevelEnum.BASIC &&
        (catalogActive === "all" ||
          (catalogActive !== "all" && course.topic.topicId === catalogActive))
    );
  }, [catalogActive, certificateCourseState.certificateCourses]);

  const intermediateCertificateCourses: CertificateCourseEntity[] = useMemo(() => {
    if (certificateCourseState.certificateCourses.length === 0) return [];
    return certificateCourseState.certificateCourses.filter(
      (course) =>
        course.skillLevel === SkillLevelEnum.INTERMEDIATE &&
        (catalogActive === "all" ||
          (catalogActive !== "all" && course.topic.topicId === catalogActive))
    );
  }, [catalogActive, certificateCourseState.certificateCourses]);

  const advancedCertificateCourses: CertificateCourseEntity[] = useMemo(() => {
    if (certificateCourseState.certificateCourses.length === 0) return [];
    return certificateCourseState.certificateCourses.filter(
      (course) =>
        course.skillLevel === SkillLevelEnum.ADVANCED &&
        (catalogActive === "all" ||
          (catalogActive !== "all" && course.topic.topicId === catalogActive))
    );
  }, [catalogActive, certificateCourseState.certificateCourses]);

  const supportedProgrammingLanguages = useMemo(() => {
    if (currentTopic) {
      return currentTopic.programmingLanguages;
    }
    return [];
  }, [currentTopic]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetTopics = useCallback(async () => {
    setIsTopicsLoading(true);
    try {
      const getTopicsResponse = await TopicService.getTopics({
        fetchAll: true
      });
      setTimeout(() => {
        dispatch(setTopics(getTopicsResponse));
        setIsTopicsLoading(false);
      }, 500);
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
      filterTopicIds,
      isRegisteredFilter
      // fetchMostEnrolled = false
    }: {
      courseName: string;
      filterTopicIds: string[];
      isRegisteredFilter: IsRegisteredFilterEnum;
      // fetchMostEnrolled?: boolean;
    }) => {
      dispatch(setLoading({ isLoading: true }));
      try {
        const getCertificateCoursesResponse = await CertificateCourseService.getCertificateCourses({
          courseName,
          filterTopicIds,
          isRegisteredFilter
        });
        setTimeout(() => {
          dispatch(setCertificateCourses(getCertificateCoursesResponse.certificateCourses));
          dispatch(setLoading({ isLoading: false }));
        }, 500);
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

  const handleGetMostEnrolledCertificateCourses = useCallback(async () => {
    setIsRecommendedLoading(true);
    try {
      const getMostEnrolledCertificateCoursesResponse =
        await CertificateCourseService.getMostEnrolledCertificateCourses();
      setTimeout(() => {
        dispatch(
          setMostEnrolledCertificateCourses(
            getMostEnrolledCertificateCoursesResponse.mostEnrolledCertificateCourses
          )
        );
        setIsRecommendedLoading(false);
      }, 500);
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

  const handleChangeCatalog = useCallback(
    (value: string) => {
      if (value === "all") {
        setSearchText("");
        navigate(routes.user.course_certificate.root);
      } else {
        setSearchText("");
        navigate(`${routes.user.course_certificate.root}?topicId=${value}`);
      }
    },
    [navigate]
  );

  const searchHandle = useCallback(
    (searchText: string) => {
      handleGetCertificateCourses({
        courseName: searchText,
        filterTopicIds: [currentTopic?.topicId || ""],
        isRegisteredFilter: isRegisterFilterValue
      });
    },
    [currentTopic?.topicId, handleGetCertificateCourses, isRegisterFilterValue]
  );

  useEffect(() => {
    const fetchDefaultData = async () => {
      await handleGetTopics();
      await handleGetMostEnrolledCertificateCourses();
    };
    fetchDefaultData();
  }, []);

  useEffect(() => {
    if (certificateCourseState.isLoading) return;
    handleGetCertificateCourses({
      courseName: searchText,
      filterTopicIds: [currentTopic?.topicId || ""],
      isRegisteredFilter: isRegisterFilterValue
    });
  }, [currentTopic?.topicId, handleGetCertificateCourses, handleGetMostEnrolledCertificateCourses]);

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
                {catalogActive === "all" && (
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
                                      routes.user.course_certificate.detail.lesson.root.replace(
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
                                    `${routes.user.course_certificate.detail.lesson.root.replace(":courseId", option.certificateCourseId)}`
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
                      {isLoggedIn && (
                        <BasicSelect
                          labelId='select-assignment-section-label'
                          value={isRegisterFilterValue}
                          onHandleChange={(value) =>
                            setIsRegisterFilterValue(value as IsRegisteredFilterEnum)
                          }
                          sx={{ maxWidth: "200px" }}
                          items={[
                            {
                              value: IsRegisteredFilterEnum.ALL,
                              label: t("common_all")
                            },
                            {
                              value: IsRegisteredFilterEnum.REGISTERED,
                              label: t("common_registered")
                            },
                            {
                              value: IsRegisteredFilterEnum.NOT_REGISTERED,
                              label: t("common_not_registered")
                            }
                          ]}
                          backgroundColor='#FFFFFF'
                          translation-key={[
                            "common_all",
                            "common_registered",
                            "common_not_registered"
                          ]}
                        />
                      )}
                    </Box>
                  </Box>
                )}

                {typeof catalogActive === "string" && catalogActive !== "all" && (
                  <Box className={classes.couseCertificatesByTopic}>
                    <Heading2 translation-key='certificate_hot_recommend'>
                      {topicState.topics.find((topic) => topic.topicId === catalogActive)?.name}
                    </Heading2>
                    <ParagraphBody>
                      {
                        topicState.topics.find((topic) => topic.topicId === catalogActive)
                          ?.description
                      }
                    </ParagraphBody>
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
                                    `${routes.user.course_certificate.detail.lesson.root.replace(":courseId", option.certificateCourseId)}`
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
                      {isLoggedIn && (
                        <BasicSelect
                          labelId='select-assignment-section-label'
                          value={isRegisterFilterValue}
                          onHandleChange={(value) =>
                            setIsRegisterFilterValue(value as IsRegisteredFilterEnum)
                          }
                          sx={{ maxWidth: "200px" }}
                          items={[
                            {
                              value: IsRegisteredFilterEnum.ALL,
                              label: t("common_all")
                            },
                            {
                              value: IsRegisteredFilterEnum.REGISTERED,
                              label: t("common_registered")
                            },
                            {
                              value: IsRegisteredFilterEnum.NOT_REGISTERED,
                              label: t("common_not_registered")
                            }
                          ]}
                          backgroundColor='#FFFFFF'
                          translation-key={[
                            "common_all",
                            "common_registered",
                            "common_not_registered"
                          ]}
                        />
                      )}
                    </Box>

                    {/* {topicState.topics.find((topic) => topic.topicId === catalogActive)
                      ?.isSingleProgrammingLanguage === false && (
                      <Stack
                        direction='row'
                        spacing={1}
                        justifyContent={"flex-start"}
                        alignItems={"center"}
                      >
                        <TextTitle
                          translation-key='common_multi_language'
                          translate-key='common_update_language'
                        >
                          {t("common_update_language")}
                        </TextTitle>
                        {supportedProgrammingLanguages.length > 0 && (
                          <BasicSelect
                            labelId='select-assignment-section-label'
                            value={defaultProgrammingLanguage}
                            onHandleChange={(value) => console.log(value)}
                            sx={{ width: "fit-content", maxWidth: "600px" }}
                            items={supportedProgrammingLanguages.map(
                              (language: ProgrammingLanguageEntity) => ({
                                value: language.id,
                                label: language.name
                              })
                            )}
                            backgroundColor='#FFFFFF'
                          />
                        )}
                      </Stack>
                    )} */}
                  </Box>
                )}
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading3 translation-key='certificate_basic'>
                    {t("certificate_basic")} ({basicCertificateCourses.length})
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
                      {basicCertificateCourses.map(
                        (course: CertificateCourseEntity, index: number) => (
                          <Grid
                            item
                            xs={4}
                            key={index}
                            onClick={() =>
                              navigate(
                                routes.user.course_certificate.detail.lesson.root.replace(
                                  ":courseId",
                                  course.certificateCourseId
                                )
                              )
                            }
                          >
                            <CourseCertificateCard course={course} />
                          </Grid>
                        )
                      )}
                    </Grid>
                  )}
                </Box>
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading3 translation-key='certificate_intermediate'>
                    {t("certificate_intermediate")} ({intermediateCertificateCourses.length})
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
                      {intermediateCertificateCourses.map((course, index) => (
                        <Grid
                          item
                          xs={4}
                          key={index}
                          onClick={() =>
                            navigate(
                              routes.user.course_certificate.detail.lesson.root.replace(
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
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading3 translation-key='certificate_advance'>
                    {t("certificate_advance")} ({advancedCertificateCourses.length})
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
                      {advancedCertificateCourses.map((course, index) => (
                        <Grid
                          item
                          xs={4}
                          key={index}
                          onClick={() =>
                            navigate(
                              routes.user.course_certificate.detail.lesson.root.replace(
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
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CourseCertificates;
