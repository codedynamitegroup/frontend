import { User } from "models/courseService/user";
import classes from "./styles.module.scss";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";

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
        <Grid item className={classes.courseImageGridContainer}>
          <ButtonBase sx={{ maxWidth: "128px", maxHeight: "128px" }}>
            <img className={classes.courseImage} alt='complex' src={props.courseAvatarUrl} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction='column' spacing={2}>
            <Grid item xs>
              <Typography fontSize='18px' gutterBottom variant='subtitle1' component='div'>
                {props.courseName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {props.courseCategory}
              </Typography>
            </Grid>
            <Grid item className={classes.teacherListGridContainer}>
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
                      <Link href='#' underline='hover'>
                        {teacher.lastName} {teacher.firstName}
                      </Link>
                    }
                    secondary='Giảng viên'
                  />
                </ListItem>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CourseList;
