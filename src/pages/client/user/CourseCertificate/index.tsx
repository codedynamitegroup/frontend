import { Box, Checkbox, Container, FormControlLabel, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Heading2 from "components/text/Heading2";
import BasicSelect from "components/common/select/BasicSelect";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ParagraphBody from "components/text/ParagraphBody";
import Heading3 from "components/text/Heading3";
import images from "config/images";
import Heading1 from "components/text/Heading1";
import Heading4 from "components/text/Heading4";
import { useTranslation } from "react-i18next";
import CourseCertificateCard from "./components/CourseCertifcateCard";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { setFilterForTopic, setTopics } from "reduxes/coreService/Topic";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import AutoSearchBar from "components/common/search/AutoSearchBar";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import { setCertificateCourses } from "reduxes/coreService/CertificateCourse";
import { TopicService } from "services/coreService/TopicService";

const CourseCertificates = () => {
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const topicState = useSelector((state: RootState) => state.topic);
  const certificateCourseState = useSelector((state: RootState) => state.certifcateCourse);

  const filterTopicIds = useMemo(() => {
    return topicState.topicsFilter
      .filter((topicFilter) => topicFilter.checked)
      .map((topicFilter) => topicFilter.topic.topicId);
  }, [topicState.topicsFilter]);

  const searchHandle = async (searchText: string) => {
    const getCertificateCoursesResponse = await CertificateCourseService.getCertificateCourses({
      courseName: searchText,
      filterTopicIds: filterTopicIds,
      isRegisteredFilter: IsRegisteredFilterEnum.ALL
    });
    dispatch(setCertificateCourses(getCertificateCoursesResponse));
  };

  const [assignmentSection, setAssignmentSection] = React.useState("0");

  const basicCertificateCourses: CertificateCourseEntity[] = useMemo(() => {
    return certificateCourseState.certificateCourses.filter(
      (course) => course.skillLevel === SkillLevelEnum.BASIC
    );
  }, [certificateCourseState.certificateCourses]);

  const intermediateCertificateCourses: CertificateCourseEntity[] = useMemo(() => {
    return certificateCourseState.certificateCourses.filter(
      (course) => course.skillLevel === SkillLevelEnum.INTERMEDIATE
    );
  }, [certificateCourseState.certificateCourses]);

  const advancedCertificateCourses: CertificateCourseEntity[] = useMemo(() => {
    return certificateCourseState.certificateCourses.filter(
      (course) => course.skillLevel === SkillLevelEnum.ADVANCED
    );
  }, [certificateCourseState.certificateCourses]);

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
    data: { courseName, filterTopicIds, isRegisteredFilter }
  }: {
    data: {
      courseName: string;
      filterTopicIds: string[];
      isRegisteredFilter: IsRegisteredFilterEnum;
    };
  }) => {
    try {
      const getCertificateCoursesResponse = await CertificateCourseService.getCertificateCourses({
        courseName: courseName,
        filterTopicIds: filterTopicIds,
        isRegisteredFilter: isRegisteredFilter
      });
      dispatch(setCertificateCourses(getCertificateCoursesResponse));
    } catch (error: any) {
      console.error("Failed to fetch certificate courses", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await handleGetTopics();
      await handleGetCertificateCourses({
        data: {
          courseName: "",
          filterTopicIds: filterTopicIds,
          isRegisteredFilter: IsRegisteredFilterEnum.ALL
        }
      });
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchDataWhenFilterTopicIdsChange = async () => {
      await handleGetCertificateCourses({
        data: {
          courseName: searchText,
          filterTopicIds: filterTopicIds,
          isRegisteredFilter: IsRegisteredFilterEnum.ALL
        }
      });
    };
    fetchDataWhenFilterTopicIdsChange();
  }, [filterTopicIds]);

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
            <AutoSearchBar
              value={searchText}
              setValue={setSearchText}
              onHandleChange={searchHandle}
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
              <Heading3 translation-key='common_filter_by'>{t("common_filter_by")}</Heading3>
              <Box className={classes.couseCertificatesByTopic}>
                <Heading4 translation-key='common_filter_topic'>
                  {t("common_filter_topic")}
                </Heading4>
                {topicState.topicsFilter.map((topicFilter, index) => (
                  <Box className={classes.couseCertificatesByTopicItem} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={topicFilter.checked}
                          onChange={(e) =>
                            dispatch(
                              setFilterForTopic({
                                topicId: topicFilter.topic.topicId,
                                checked: e.target.checked
                              })
                            )
                          }
                        />
                      }
                      label={
                        <ParagraphBody>
                          {topicFilter.topic.name} ({topicFilter.topic.numOfCertificateCourses})
                        </ParagraphBody>
                      }
                    />
                  </Box>
                ))}
              </Box>
              <Box className={classes.couseCertificatesByTopic}></Box>
            </Grid>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={9}>
              <Box id={classes.couseCertificatesWrapper}>
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading2 translation-key='certificate_hot_recommend'>
                    {t("certificate_hot_recommend")}
                  </Heading2>
                  <Grid container spacing={3}>
                    {certificateCourseState.mostEnrolledCertificateCourses.map((course, index) => (
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
                  <Heading2 translation-key='certificate_basic'>{t("certificate_basic")}</Heading2>
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
                  <Heading2 translation-key='certificate_intermediate'>
                    {t("certificate_intermediate")}
                  </Heading2>
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
                  <Heading2 translation-key='certificate_advance'>
                    {t("certificate_advance")}
                  </Heading2>
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
