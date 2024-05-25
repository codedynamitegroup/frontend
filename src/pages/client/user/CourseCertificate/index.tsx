import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Chip, Container, Grid, Stack, ToggleButtonGroup } from "@mui/material";
import AnimatedToggleButton from "components/common/buttons/AnimatedToggleButton";
import CustomAutocomplete from "components/common/search/CustomAutocomplete";
import BasicSelect from "components/common/select/BasicSelect";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import Heading3 from "components/text/Heading3";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import { TopicEntity } from "models/coreService/entity/TopicEntity";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCertificateCourses, setLoading } from "reduxes/coreService/CertificateCourse";
import { setTopics } from "reduxes/coreService/Topic";
import { routes } from "routes/routes";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import { TopicService } from "services/coreService/TopicService";
import { AppDispatch, RootState } from "store";
import CourseCertificateCard from "./components/CourseCertifcateCard";
import classes from "./styles.module.scss";
import TextTitle from "components/text/TextTitle";
import { ProgrammingLanguageEntity } from "models/coreService/entity/ProgrammingLanguageEntity";

const CourseCertificates = () => {
  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();

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

  const searchHandle = useCallback((searchText: string) => {
    handleGetCertificateCourses({
      courseName: searchText,
      filterTopicIds: [currentTopic?.topicId || ""],
      isRegisteredFilter: IsRegisteredFilterEnum.ALL
    });
  }, []);

  const [assignmentSection, setAssignmentSection] = React.useState("0");

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

  const defaultProgrammingLanguage = useMemo(() => {
    if (supportedProgrammingLanguages.length > 0) {
      return supportedProgrammingLanguages[0].programmingLanguageId;
    }
    return "";
  }, [supportedProgrammingLanguages]);

  console.log("supportedProgrammingLanguages", supportedProgrammingLanguages);
  console.log("defaultProgrammingLanguage", defaultProgrammingLanguage);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetTopics = async () => {
    try {
      const getTopicsResponse = await TopicService.getTopics({
        fetchAll: true
      });
      dispatch(setTopics(getTopicsResponse));
    } catch (error: any) {
      console.error("Failed to fetch topics", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
    }
  };

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
      dispatch(setCertificateCourses(getCertificateCoursesResponse));
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

  const handleChangeCatalog = (value: string) => {
    if (value === "all") {
      navigate(routes.user.course_certificate.root);
    } else {
      navigate(`${routes.user.course_certificate.root}?topicId=${value}`);
    }
  };

  useEffect(() => {
    handleGetTopics();
    handleGetCertificateCourses({
      courseName: searchText,
      filterTopicIds: [currentTopic?.topicId || ""],
      isRegisteredFilter: IsRegisteredFilterEnum.ALL
    });
  }, []);

  return (
    <>
      <Box
        id={classes.banner}
        sx={{
          backgroundImage: `url(${images.background.courseCertificatesBackground})`
        }}
      >
        <Container id={classes.bannerContainer} className={classes.container}>
          <Heading1 colorname={"--white"} translation-key='certificate_title'>
            {t("certificate_title")}
          </Heading1>
          <Heading3 colorname={"--white"} translation-key='certificate_description'>
            {t("certificate_description")}
          </Heading3>
          <Box id={classes.bannerSearch}>
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
            <BasicSelect
              labelId='select-assignment-section-label'
              value={assignmentSection}
              onHandleChange={(value) => setAssignmentSection(value)}
              sx={{ maxWidth: "200px" }}
              items={[
                {
                  value: "0",
                  label: t("common_all")
                },
                {
                  value: "1",
                  label: t("common_registered")
                },
                {
                  value: "2",
                  label: t("common_not_registered")
                }
              ]}
              backgroundColor='#FFFFFF'
              translation-key={["common_all", "common_registered", "common_not_registered"]}
            />
          </Box>
        </Container>
      </Box>
      <Box mt={"40px"}>
        <Container className={classes.container}>
          <Grid container>
            <Grid item xs={2.5} id={classes.filter}>
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
                    {t("common_all_courses")}
                  </AnimatedToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Heading5 translation-key='common_topics'>{t("common_topics")}</Heading5>
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
                        {topic.name}
                      </Stack>
                    </AnimatedToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Grid>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={9}>
              <Box id={classes.couseCertificatesWrapper}>
                {catalogActive === "all" && (
                  <Box className={classes.couseCertificatesByTopic}>
                    <Heading2 translation-key='certificate_hot_recommend'>
                      {t("certificate_hot_recommend")}
                    </Heading2>
                    <Grid container spacing={3}>
                      {certificateCourseState.mostEnrolledCertificateCourses.map(
                        (course, index) => (
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
                    {topicState.topics.find((topic) => topic.topicId === catalogActive)
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
                                value: language.programmingLanguageId,
                                label: language.name
                              })
                            )}
                            backgroundColor='#FFFFFF'
                          />
                        )}
                      </Stack>
                    )}
                  </Box>
                )}

                <Box className={classes.couseCertificatesByTopic}>
                  <Heading3 translation-key='certificate_basic'>
                    {t("certificate_basic")} ({basicCertificateCourses.length})
                  </Heading3>
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
                </Box>
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading3 translation-key='certificate_intermediate'>
                    {t("certificate_intermediate")} ({intermediateCertificateCourses.length})
                  </Heading3>
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
                </Box>
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading3 translation-key='certificate_advance'>
                    {t("certificate_advance")} ({advancedCertificateCourses.length})
                  </Heading3>
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
