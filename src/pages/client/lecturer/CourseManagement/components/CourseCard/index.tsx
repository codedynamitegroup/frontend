import classes from "./styles.module.scss";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import List from "@mui/material/List";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { User } from "models/courseService/user";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { routes } from "routes/routes";
import { Link as RouterLink } from "react-router-dom";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9"
  }
}));

interface CardProps {
  courseAvatarUrl: string;
  courseCategory: string;
  courseName: string;
  teacherList: Array<User>;
}

const CourseCard = (props: CardProps) => {
  return (
    <Paper className={classes.cardContainer}>
      <Box className={classes.topGroup}>
        <Box className={classes.detailGroup}>
          <Typography fontWeight='20px' fontSize='18px'>
            {props.courseCategory}
          </Typography>
        </Box>

        <IconButton>
          <MoreVertIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Divider className={classes.cardDivider} />
      <Link
        component={RouterLink}
        to={routes.lecturer.course.information.replace(":courseId", "1")}
        underline='hover'
        color='inherit'
      >
        <Typography className={classes.courseNameText}>{props.courseName}</Typography>
      </Link>
      <List>
        {props.teacherList.slice(0, 2).map((teacher) => (
          <ListItem key={teacher.id}>
            <ListItemAvatar>
              <Avatar alt={teacher.firstName} src={teacher.avatarUrl} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Link component={RouterLink} to='#' underline='hover'>
                  {teacher.lastName} {teacher.firstName}
                </Link>
              }
              secondary='Giảng viên'
            />
          </ListItem>
        ))}
      </List>

      {props.teacherList.length > 2 ? (
        <CustomTooltip
          placement='right-end'
          title={
            <List>
              {props.teacherList.map((teacher) => (
                <ListItem key={teacher.id} className={classes.tooltipTeacherList}>
                  <ListItemAvatar>
                    <Avatar alt={teacher.firstName} src={teacher.avatarUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link component={RouterLink} to='#' underline='hover'>
                        {teacher.lastName} {teacher.firstName}
                      </Link>
                    }
                    secondary='Giảng viên'
                  />
                </ListItem>
              ))}
            </List>
          }
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14]
                  }
                }
              ]
            }
          }}
        >
          <Button className={classes.moreButton}>Xem toàn bộ giảng viên</Button>
        </CustomTooltip>
      ) : null}
    </Paper>
  );
};

export default CourseCard;
