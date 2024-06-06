import classes from "./styles.module.scss";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Heading4 from "components/text/Heading4";
import { routes } from "routes/routes";
import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { UserCourseEntity } from "models/courseService/entity/UserCourseEntity";

interface ListProps {
  courseId: string;
  courseAvatarUrl: string;
  courseCategory: string;
  courseName: string;
  teacherList: Array<UserCourseEntity>;
}

const CourseList = (props: ListProps) => {
  return (
    <Grid className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12} container direction='column'>
          <Grid item xs className={classes.courseInfo}>
            <Box className={classes.courseInfoWrapper}>
              <Heading4 gutterBottom variant='subtitle1' colorname='--blue-3'>
                <Link
                  component={RouterLink}
                  to={routes.student.course.information.replace(":courseId", props.courseId)}
                  underline='hover'
                  color='inherit'
                >
                  {props.courseName} - {props.courseCategory}
                </Link>
              </Heading4>
            </Box>
          </Grid>
          <Grid item xs className={classes.teacherListGridContainer}>
            {props.teacherList.map((teacher) => (
              <ListItem key={teacher.userId}>
                <ListItemAvatar className={classes.teacherAvatarContainer}>
                  <Avatar className={classes.teacherAvatar} alt={teacher.firstName} src={""} />
                </ListItemAvatar>
                <ListItemText
                  classes={{
                    primary: classes.primaryTeacherText,
                    secondary: classes.secondaryTeacherText
                  }}
                  primary={
                    <Link component={RouterLink} to='#' underline='hover'>
                      {teacher.lastName} {teacher.firstName}
                    </Link>
                  }
                  secondary='Giảng viên'
                />
              </ListItem>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CourseList;
