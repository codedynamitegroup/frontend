import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditImageIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import SettingIcon from "@mui/icons-material/Settings";

import CourseAnnouncement from "./components/Announcement";
import { Accordion, AccordionDetails, AccordionSummary, Paper, TextField } from "@mui/material";
import CourseResource from "./components/CourseResource";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ECourseResourceType } from "models/courseService/course";
import { useState } from "react";

const LecturerCourseInformation = () => {
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
  const [isTopicOpen, setIsTopicOpen] = useState<Array<Boolean>>([]);
  const [isOpenEditTitle, setIsOpenEditTitle] = useState<Array<Boolean>>([]);
  const toggleTextField = (index: number) => {
    isOpenEditTitle[index] === undefined
      ? setIsOpenEditTitle((prevState: any) => ({
          ...prevState,
          [index]: false
        }))
      : setIsOpenEditTitle((prevState: any) => ({
          ...prevState,
          [index]: !Boolean(prevState[index])
        }));
  };
  const saveEditTopicTitleHandler = (index: number) => {
    setIsOpenEditTitle((prevState: any) => ({
      ...prevState,
      [index]: !Boolean(prevState[index])
    }));
  };
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

      if (!isOpenEditTitle[index])
        setIsOpenEditTitle((prevState: any) => ({
          ...prevState,
          [index]: !Boolean(prevState[index])
        }));
    }
  };

  return (
    <Box className={classes.informationBody}>
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
                  <Box>
                    {isOpen ? (
                      <>
                        <IconButton>
                          <AddIcon />
                        </IconButton>
                        <IconButton>
                          <SettingIcon />
                        </IconButton>
                      </>
                    ) : null}
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
                {isOpenEditTitle[index] === undefined || isOpenEditTitle[index] ? (
                  <Typography className={classes.resourceSummaryText} align='center'>
                    {topic.title}
                  </Typography>
                ) : (
                  <TextField variant='standard' defaultValue={topic.title} />
                )}

                {isOpen ? (
                  <Box>
                    {isOpenEditTitle[index] || isOpenEditTitle[index] === undefined ? (
                      <IconButton
                        onClick={() => toggleTextField(index)}
                        className={classes.editTopicTitleImageContainer}
                      >
                        <EditImageIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => saveEditTopicTitleHandler(index)}
                        className={classes.editTopicTitleImageContainer}
                      >
                        <SaveIcon />
                      </IconButton>
                    )}
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
    </Box>
  );
};

export default LecturerCourseInformation;
