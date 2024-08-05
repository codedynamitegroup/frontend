import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import { UserCourseEntity } from "models/courseService/entity/UserCourseEntity";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

interface ListProps {
  courseId: string;
  courseAvatarUrl: string;
  courseCategory: string;
  courseName: string;
  teacherList: Array<UserCourseEntity>;
}

const CourseList = (props: ListProps) => {
  const { t } = useTranslation();
  const { courseId, courseAvatarUrl, courseCategory, courseName, teacherList } = props;
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(routes.student.course.information.replace(":courseId", courseId));
  };

  return (
    <Card className={classes.courseCard} onClick={handleCardClick}>
      <CardContent>
        <Typography variant='h5' component='div' className={classes.courseName}>
          {courseName}
        </Typography>
        <Chip label={courseCategory} className={classes.courseType} />
        <Stack direction='row' spacing={2} className={classes.courseInstructors}>
          {teacherList.slice(0, 5).map((instructor, index) => (
            <Stack direction='row' spacing={1} key={index} className={classes.instructor}>
              <Avatar
                sx={{
                  bgcolor: `${generateHSLColorByRandomText(`${instructor.firstName} ${instructor.lastName}`)}`
                }}
                className={classes.avatar}
              >
                {instructor.firstName.charAt(0)}
              </Avatar>
              <Typography variant='body2' className={classes.instructorName}>
                {instructor.firstName + " " + instructor.lastName}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CourseList;
