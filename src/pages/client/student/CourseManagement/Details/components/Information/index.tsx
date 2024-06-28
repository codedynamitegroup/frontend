import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";

import { CircularProgress, Collapse } from "@mui/material";
import { ECourseEventStatus, ECourseResourceType } from "models/courseService/course";
import { useState, useEffect, useCallback } from "react";
import CourseResource from "./components/CourseResource";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useParams } from "react-router-dom";
import { CourseService } from "services/courseService/CourseService";
import { setLoadingSections, setSections } from "reduxes/courseService/section";
import Heading4 from "components/text/Heading4";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Heading2 from "components/text/Heading2";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import { setCourseDetail } from "reduxes/courseService/course";
import Heading1 from "components/text/Heading1";
const StudentCourseInformation = () => {
  const { t } = useTranslation();

  const toggleItem = (index: number) => {
    if (collapseOpen[index] === undefined)
      setCollapseOpen((prevState: Array<Boolean>) => ({
        ...prevState,
        [index]: false
      }));
    else {
      setCollapseOpen((prevState: any) => ({
        ...prevState,
        [index]: !Boolean(prevState[index])
      }));
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const sectionState = useSelector((state: RootState) => state.section);
  const { courseId } = useParams<{ courseId: string }>();
  const handleGetSections = useCallback(async () => {
    if (!courseId || (sectionState.courseId === courseId && sectionState.sections.length > 0)) {
      return;
    }
    dispatch(setLoadingSections(true));
    try {
      const getSectionsResponse = await CourseService.getSectionsByCourseId(courseId);
      dispatch(setSections({ sections: getSectionsResponse.sections, courseId: courseId }));
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
    dispatch(setLoadingSections(false));
  }, [courseId, dispatch, sectionState.courseId, sectionState.sections]);
  const initialCollapseState = Array(sectionState.sections.length).fill(false);

  const [collapseOpen, setCollapseOpen] = useState<Array<Boolean>>(initialCollapseState);
  useEffect(() => {
    handleGetSections();
  }, [handleGetSections, courseId]);

  const type = (typeModule: string) => {
    switch (typeModule) {
      case "Files":
        return ECourseResourceType.file;
      case "Assignments":
        return ECourseResourceType.assignment;
      case "URLs":
        return ECourseResourceType.url;
      case "Quizzes":
        return ECourseResourceType.exam;
      default:
        return ECourseResourceType.file;
    }
  };
  const [courseData, setCourseData] = useState<CourseEntity | null>(null);
  const courseState = useSelector((state: RootState) => state.course);
  const getCouseData = useCallback(
    async (courseId: string) => {
      try {
        const courseResponse = await CourseService.getCourseDetail(courseId);
        setCourseData(courseResponse);
        dispatch(setCourseDetail({ courseDetail: courseResponse }));
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const course = courseState.courses.find((course: CourseEntity) => course.id === courseId);

    if (course) {
      setCourseData(course);
      dispatch(setCourseDetail({ courseDetail: course }));
    } else {
      getCouseData(courseId ?? "");
    }
  }, [courseId, courseState.courses, dispatch, getCouseData]);
  return (
    <Grid container spacing={1} className={classes.gridContainer}>
      <Grid item xs={12}>
        <Card className={classes.courseImgCardContainer}>
          <CardMedia
            component='img'
            className={classes.courseImage}
            src='https://www.gstatic.com/classroom/themes/img_bookclub.jpg'
          />
          <Heading1 className={classes.classNameOverlay} colorname='--white'>
            {courseData?.name}
          </Heading1>
        </Card>
      </Grid>

      {sectionState.isLoading === false ? (
        <Grid item xs={12}>
          <Box margin={1} padding={0}>
            <Grid container className={classes.gridBodyContainer}>
              <Grid item className={classes.topicWrapper} xs={12}>
                {sectionState.sections.map((topic, index) => {
                  const isOpen =
                    collapseOpen[index] === undefined ? true : Boolean(collapseOpen[index]);

                  return (
                    <Box className={classes.generalInfo}>
                      <Box display='flex' alignItems='center' margin={1}>
                        {isOpen ? (
                          <IconButton
                            className={classes.iconButtonActive}
                            sx={{ padding: "5px" }}
                            onClick={() => toggleItem(index)}
                          >
                            <ArrowDropDownIcon style={{ fontSize: 20 }} />
                          </IconButton>
                        ) : (
                          <IconButton
                            className={classes.iconButton}
                            sx={{ padding: "5px" }}
                            onClick={() => toggleItem(index)}
                          >
                            <ArrowRightIcon style={{ fontSize: 20 }} />
                          </IconButton>
                        )}
                        <Heading4 fontWeight={500} translation-key='common_general'>
                          {topic.name}
                        </Heading4>
                      </Box>
                      <Collapse in={isOpen} timeout='auto' unmountOnExit>
                        {topic.modules.map((resource, index) => (
                          <CourseResource
                            courseId={courseId || ""}
                            assignmentId={resource.assignmentId}
                            name={resource.name}
                            type={type(resource.typeModule)}
                            content={resource.content}
                            key={index}
                          />
                        ))}
                      </Collapse>
                    </Box>
                  );
                })}
              </Grid>
              {/* <Grid item xs={0.5}></Grid>
            <Grid item xs={3.5}>
              <Paper className={classes.eventContainer}>
                <Typography
                  className={classes.eventTitle}
                  translation-key='course_detail_need_to_do_title'
                >
                  {t("course_detail_need_to_do_title")}
                </Typography>
                <Divider />
                <List
                  sx={{ width: "100%", bgcolor: "background.paper" }}
                  className={classes.eventList}
                >
                  {eventList.map((event, index) => (
                    <StudentCourseEvent
                      id={event.id}
                      key={index}
                      name={event.name}
                      endDate={event.endDate}
                      startDate={event.startDate}
                      type={event.type}
                      status={event.status}
                    />
                  ))}
                </List>
              </Paper>
            </Grid> */}
            </Grid>
          </Box>
        </Grid>
      ) : (
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
        </Box>
      )}
    </Grid>
  );
};

export default StudentCourseInformation;
