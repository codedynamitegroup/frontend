import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
  List,
  Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ECourseEventStatus, ECourseResourceType } from "models/courseService/course";
import { useState, useEffect } from "react";
import CourseResource from "./components/CourseResource";
import StudentCourseEvent from "./components/CourseEvent";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useParams } from "react-router-dom";
import { CourseService } from "services/courseService/CourseService";
import { di } from "@fullcalendar/core/internal-common";
import { setLoading, setSections } from "reduxes/courseService/section";

const StudentCourseInformation = () => {
  const { t } = useTranslation();
  const topicList = [
    {
      title: "Topic 1",
      resource: [
        { name: "Test topic 1 Resource 1", type: ECourseResourceType.assignment },
        { name: "Test topic 1 Resource 2", type: ECourseResourceType.assignment },
        { name: "Test topic 1 Resource 3", type: ECourseResourceType.file },
        { name: "Test topic 1 Resource 4", type: ECourseResourceType.assignment }
      ]
    },
    {
      title: "Topic 2",
      resource: [
        { name: "Test topic 2 Resource 1", type: ECourseResourceType.assignment },
        { name: "Test topic 2 Resource 2", type: ECourseResourceType.assignment },
        { name: "Test topic 2 Resource 3", type: ECourseResourceType.file },
        { name: "Test topic 2 Resource 4", type: ECourseResourceType.file },
        { name: "Test topic 2 Resource 5", type: ECourseResourceType.assignment },
        { name: "Test topic 2 Resource 6", type: ECourseResourceType.file },
        { name: "Test topic 2 Resource 7", type: ECourseResourceType.assignment }
      ]
    }
  ];
  const eventList = [
    {
      id: 1,
      name: "Assignment 1",
      type: ECourseResourceType.assignment,
      startDate: "01/01/2024",
      endDate: "12/12/2024",
      status: ECourseEventStatus.submitted
    },
    {
      id: 2,
      name: "Assignment 2",
      type: ECourseResourceType.assignment,
      startDate: "01/01/2024",
      endDate: "12/12/2024",
      status: ECourseEventStatus.notSubmitted
    },
    {
      id: 3,
      name: "Assignment 3",
      type: ECourseResourceType.assignment,
      startDate: "01/01/2024",
      endDate: "12/12/2024",
      status: ECourseEventStatus.notSubmitted
    },
    {
      id: 4,
      name: "Assignment 4",
      type: ECourseResourceType.assignment,
      startDate: "01/01/2024",
      endDate: "12/12/2024",
      status: ECourseEventStatus.submitted
    }
  ];
  const [isTopicOpen, setIsTopicOpen] = useState<Array<Boolean>>([]);
  const toggleItem = (index: number) => {
    if (isTopicOpen[index] === undefined)
      setIsTopicOpen((prevState: Array<Boolean>) => ({
        ...prevState,
        [index]: false
      }));
    else {
      setIsTopicOpen((prevState: any) => ({
        ...prevState,
        [index]: !Boolean(prevState[index])
      }));
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const sectionState = useSelector((state: RootState) => state.section);
  const { courseId } = useParams<{ courseId: string }>();
  const handleGetSections = async () => {
    dispatch(setLoading(true));
    try {
      if (courseId) {
        const getSectionsResponse = await CourseService.getSectionsByCourseId(courseId);
        dispatch(setSections(getSectionsResponse));
        dispatch(setLoading(false));
      } else {
        console.error("courseId is undefined");
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Failed to fetch sections", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handleGetSections();
  }, []);

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

  return (
    <Grid container spacing={1} className={classes.gridContainer}>
      <Grid item xs={12}>
        <Card className={classes.courseImgCardContainer}>
          <CardMedia
            component='img'
            className={classes.courseImage}
            src='https://picsum.photos/1800/300'
          />
          <Typography variant='h1' className={classes.classNameOverlay}>
            Tên khóa học dài
          </Typography>
        </Card>
      </Grid>

      {!sectionState.isLoading ? (
        <Grid item xs={12}>
          <Box margin={1} padding={0}>
            <Grid container className={classes.gridBodyContainer}>
              <Grid item className={classes.topicWrapper} xs={12}>
                {sectionState.sections.map((topic, index) => {
                  const isOpen =
                    isTopicOpen[index] === undefined ? true : Boolean(isTopicOpen[index]);
                  return (
                    <Box key={index}>
                      <Accordion expanded={isOpen} className={classes.resourceAccordionContainer}>
                        <AccordionSummary
                          expandIcon={
                            <Box>
                              <IconButton
                                onClick={() => toggleItem(index)}
                                style={{ transform: `rotate(${isOpen ? 0 : 180}deg)` }}
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            </Box>
                          }
                          className={classes.resourceSummaryContainer}
                        >
                          <Typography className={classes.resourceSummaryText} align='center'>
                            {topic.name}
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails className={classes.accordDetail}>
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
                        </AccordionDetails>
                      </Accordion>
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
