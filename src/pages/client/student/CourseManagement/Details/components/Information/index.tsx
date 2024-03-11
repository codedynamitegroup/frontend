import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Accordion, AccordionDetails, AccordionSummary, Divider, List, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ECourseEventStatus, ECourseResourceType } from "models/courseService/course";
import { useState } from "react";
import CourseResource from "./components/CourseResource";
import StudentCourseEvent from "./components/CourseEvent";

const StudentCourseInformation = () => {
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

  return (
    <Grid container spacing={2} className={classes.gridContainer}>
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

      <Grid item xs={12}>
        <Box margin={1} padding={0}>
          <Grid container className={classes.gridBodyContainer}>
            <Grid item className={classes.topicWrapper} xs={8}>
              {topicList.map((topic, index) => {
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
                          {topic.title}
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails className={classes.accordDetail}>
                        {topic.resource.map((resource, index) => (
                          <CourseResource name={resource.name} type={resource.type} key={index} />
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                );
              })}
            </Grid>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={3.5}>
              <Paper className={classes.eventContainer}>
                <Typography className={classes.eventTitle}>Công việc cần làm</Typography>
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
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StudentCourseInformation;
