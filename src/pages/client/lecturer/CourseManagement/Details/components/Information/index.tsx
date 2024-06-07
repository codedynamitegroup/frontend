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
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { CourseService } from "services/courseService/CourseService";
import { setSections } from "reduxes/courseService/section";
import { useParams } from "react-router-dom";

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

  const dispatch = useDispatch<AppDispatch>();
  const sectionState = useSelector((state: RootState) => state.section);
  const { courseId } = useParams<{ courseId: string }>();
  const handleGetSections = async () => {
    try {
      if (courseId) {
        const getSectionsResponse = await CourseService.getSectionsByCourseId(courseId);
        dispatch(setSections(getSectionsResponse));
      } else {
        console.error("courseId is undefined");
      }
    } catch (error) {
      console.error("Failed to fetch sections", error);
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
    <Box className={classes.informationBody}>
      <Grid item xs={12}>
        <Card className={classes.courseImgCardContainer}>
          <CardMedia
            component='img'
            className={classes.courseImage}
            src='https://fastly.picsum.photos/id/618/1800/300.jpg?hmac=dSj-blpDAziIOEDzEpHGBgKO33KdTfTMhydPn_opXjw'
          />
          <Typography variant='h1' className={classes.classNameOverlay}>
            Kỹ thuật lập trình - 20CLC
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <CourseAnnouncement />
      </Grid>
      {sectionState.sections.map((topic, index) => {
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
                    {topic.name}
                  </Typography>
                ) : (
                  <TextField variant='standard' defaultValue={topic.name} />
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
                {topic.modules.map((resource, index) => (
                  <CourseResource
                    courseId={courseId || ""}
                    assignmentId={resource.assignmentId}
                    name={resource.name}
                    type={type(resource.typeModule)}
                    key={index}
                  />
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
