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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Collapse,
  Divider,
  List,
  Paper,
  TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ECourseEventStatus, ECourseResourceType } from "models/courseService/course";
import { useState, useEffect } from "react";
import CourseResource from "./components/CourseResource";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useParams } from "react-router-dom";
import { CourseService } from "services/courseService/CourseService";
import { setLoading, setSections } from "reduxes/courseService/section";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import dayjs from "dayjs";
import { setCourseDetail } from "reduxes/courseService/course";
import { CourseEntity } from "models/courseService/entity/CourseEntity";

const LecturerCourseInformation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const sectionState = useSelector((state: RootState) => state.section);
  const { courseId } = useParams<{ courseId: string }>();

  const [collapseOpen, setCollapseOpen] = useState<Array<Boolean>>([]);
  const [isOpenEditTitle, setIsOpenEditTitle] = useState<Array<Boolean>>([]);

  const courseState = useSelector((state: RootState) => state.course);

  useEffect(() => {
    const course = courseState.courses.find((course: CourseEntity) => course.id === courseId);
    console.log(course);
    if (course) {
      dispatch(setCourseDetail({ courseDetail: course }));
    }
  }, [courseId, courseState.courses, dispatch]);

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

  const toggleTextField = (index: number) => {
    setIsOpenEditTitle((prevState) => ({
      ...prevState,
      [index]: !Boolean(prevState[index])
    }));
  };

  const saveEditTopicTitleHandler = (index: number) => {
    setIsOpenEditTitle((prevState) => ({
      ...prevState,
      [index]: !Boolean(prevState[index])
    }));
  };

  const handleGetSections = async () => {
    dispatch(setLoading(true));
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
    dispatch(setLoading(false));
  };

  useEffect(() => {
    handleGetSections();
  }, [courseId]);

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
            {/* Tên khóa học dài */}
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
                    collapseOpen[index] === undefined ? true : Boolean(collapseOpen[index]);

                  return (
                    <Box className={classes.generalInfo} key={index}>
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
                        {isOpenEditTitle[index] === undefined || isOpenEditTitle[index] ? (
                          <Typography className={classes.resourceSummaryText} align='center'>
                            {topic.name}
                          </Typography>
                        ) : (
                          <TextField variant='standard' defaultValue={topic.name} />
                        )}
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
                      </Box>
                      <Collapse in={isOpen} timeout='auto' unmountOnExit>
                        {topic.modules.map((resource, resourceIndex) => (
                          <CourseResource
                            courseId={courseId || ""}
                            assignmentId={resource.assignmentId}
                            name={resource.name}
                            type={type(resource.typeModule)}
                            key={resourceIndex}
                          />
                        ))}
                      </Collapse>
                    </Box>
                  );
                })}
              </Grid>
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
export default LecturerCourseInformation;
