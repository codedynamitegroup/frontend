import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditImageIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { CircularProgress, Collapse, TextField } from "@mui/material";
import { ECourseResourceType } from "models/courseService/course";
import { useState, useEffect, useCallback } from "react";
import CourseResource from "./components/CourseResource";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useParams } from "react-router-dom";
import { CourseService } from "services/courseService/CourseService";
import { setLoadingSections, setSections } from "reduxes/courseService/section";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { setCourseDetail } from "reduxes/courseService/course";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import Heading1 from "components/text/Heading1";
import CourseAnnouncement from "./components/Announcement";
import NotificationCard from "pages/client/student/CourseManagement/Details/components/Information/components/NotificationCard";
import AssignmentResource, { ResourceType } from "../Assignment/components/Resource";

const LecturerCourseInformation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { courseId } = useParams<{ courseId: string }>();

  const courseState = useSelector((state: RootState) => state.course);
  const [courseData, setCourseData] = useState<CourseEntity | null>(null);
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
          <Heading1 className={classes.nameCourseOverlay} colorname='--white'>
            {courseState.courseDetail?.name}
          </Heading1>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <CourseAnnouncement />
      </Grid>
      <Grid item xs={12}>
        <NotificationCard />
      </Grid>
    </Grid>
  );
};
export default LecturerCourseInformation;
