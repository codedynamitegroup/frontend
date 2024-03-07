import { User } from "models/courseService/user";
import classes from "./styles.module.scss";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
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

interface ListProps {
  courseAvatarUrl: string;
  courseCategory: string;
  courseName: string;
  teacherList: Array<User>;
}

const CourseList = (props: ListProps) => {
  return (
    <Paper className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12} container direction='column'>
          <Grid item xs className={classes.courseInfo}>
            <Box className={classes.courseInfoWrapper}>
              <Link
                component={RouterLink}
                to={routes.student.course.information.replace(":courseId", "1")}
                underline='hover'
                color='inherit'
              >
                <Heading4 gutterBottom variant='subtitle1' colorName='--blue-600'>
                  {props.courseName}
                </Heading4>
              </Link>

              <Heading5>{props.courseCategory}</Heading5>
            </Box>
          </Grid>
          <Grid item xs className={classes.teacherListGridContainer}>
            {props.teacherList.map((teacher) => (
              <ListItem key={teacher.id}>
                <ListItemAvatar className={classes.teacherAvatarContainer}>
                  <Avatar
                    className={classes.teacherAvatar}
                    alt={teacher.firstName}
                    src={teacher.avatarUrl}
                  />
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
    </Paper>
  );
};

export default CourseList;
