import classes from "./styles.module.scss";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Button from "@mui/material/Button";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { routes } from "routes/routes";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserCourseEntity } from "models/courseService/entity/UserCourseEntity";
import { Grid } from "@mui/material";
import Heading4 from "components/text/Heading4";
import Heading5 from "components/text/Heading5";

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
  courseId: string;
  courseAvatarUrl: string;
  courseCategory: string;
  courseName: string;
  teacherList: Array<UserCourseEntity>;
}

const CourseCard = (props: CardProps) => {
  const { t } = useTranslation();
  return (
    <Grid className={classes.cardContainer}>
      <Box className={classes.topGroup}>
        <Box className={classes.detailGroup}>
          <Heading4>{props.courseCategory}</Heading4>
        </Box>
        {/* <IconButton>
          <MoreVertIcon sx={{ color: "white" }} />
        </IconButton> */}
      </Box>
      <Divider className={classes.cardDivider} />

      <List className={classes.listWrapper}>
        <Heading5 className={classes.courseNameText} colorname='--blue-3'>
          <Link
            component={RouterLink}
            to={routes.lecturer.course.information.replace(":courseId", props.courseId)}
            underline='hover'
            color='inherit'
          >
            {props.courseName}
          </Link>
        </Heading5>
        {props.teacherList.slice(0, 2).map((teacher) => (
          <ListItem className={classes.listItem} key={teacher.userId}>
            <ListItemAvatar>
              <Avatar alt={teacher.firstName} src={""} />
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
                <ListItem key={teacher.userId} className={classes.tooltipTeacherList}>
                  <ListItemAvatar>
                    <Avatar alt={teacher.firstName} src={""} />
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
          <Button className={classes.moreButton} translation-key='course_see_all_teacher'>
            {t("course_see_all_teacher")}
          </Button>
        </CustomTooltip>
      ) : null}
    </Grid>
  );
};

export default CourseCard;
