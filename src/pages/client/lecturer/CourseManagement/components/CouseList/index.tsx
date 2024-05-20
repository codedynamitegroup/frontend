import { User } from "models/courseService/user";
import classes from "./styles.module.scss";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Heading5 from "components/text/Heading5";
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
    <Paper className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12} container direction='column'>
          <Grid item xs className={classes.courseInfo}>
            <Box>
              <Link
                underline='hover'
                color='inherit'
                component={RouterLink}
                to={routes.lecturer.course.information.replace(":courseId", props.courseId)}
              >
                <Heading4 gutterBottom variant='subtitle1' colorname='--blue-600'>
                  {props.courseName}
                </Heading4>
              </Link>

              <Heading5>{props.courseCategory}</Heading5>
            </Box>

            <IconButton>
              <MoreVertIcon />
            </IconButton>
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
                      {teacher.firstName + " " + teacher.lastName}
                    </Link>
                  }
                  secondary='Giảng viên'
                />
              </ListItem>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CourseList;
