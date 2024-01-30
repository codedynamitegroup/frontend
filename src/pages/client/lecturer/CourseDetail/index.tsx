import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditImageIcon from "@mui/icons-material/Edit";
import CourseAnnouncement from "./components/Announcement";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button
} from "@mui/material";
import CourseResource from "./components/CourseResource";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ECourseResourceType } from "models/courseService/course";
import { useState } from "react";

const LecturerCourseDetail = () => {
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
  const editTopicHandler = (index: number) => {};
  const [isTopicOpen, setIsTopicOpen] = useState<Array<Boolean>>([]);
  const toggleItem = (index: number) => {
    isTopicOpen[index] === undefined
      ? setIsTopicOpen((prevState: Array<Boolean>) => ({
          ...prevState,
          [index]: false
        }))
      : setIsTopicOpen((prevState: any) => ({
          ...prevState,
          [index]: !Boolean(prevState[index])
        }));
    console.log(isTopicOpen);
  };

  return (
    <Box className={classes.container}>
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
          <CourseAnnouncement />
        </Grid>
        {topicList.map((topic, index) => {
          const isOpen = isTopicOpen[index] === undefined ? true : Boolean(isTopicOpen[index]);
          return (
            <Grid item xs={12} key={index}>
              <Accordion expanded={isOpen} className={classes.resourceAccordionContainer}>
                <AccordionSummary
                  expandIcon={
                    <IconButton onClick={() => toggleItem(index)}>
                      <ExpandMoreIcon />
                    </IconButton>
                  }
                  className={classes.resourceSummaryContainer}
                >
                  <Typography className={classes.resourceSummaryText}>{topic.title}</Typography>
                  {isOpen ? (
                    <Box order={100}>
                      <IconButton
                        onClick={() => editTopicHandler(index)}
                        className={classes.editTopicTitleImageContainer}
                      >
                        <EditImageIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <></>
                  )}
                </AccordionSummary>

                <AccordionDetails className={classes.accordDetail}>
                  {topic.resource.map((resource, index) => (
                    <CourseResource name={resource.name} type={resource.type} key={index} />
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default LecturerCourseDetail;
