import { ECourseEventStatus, ECourseResourceType } from "models/courseService/course";
import classes from "./styles.module.scss";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar/ListItemAvatar";
import Avatar from "@mui/material/Avatar/Avatar";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Typography from "@mui/material/Typography/Typography";
import { Box, ListItemButton } from "@mui/material";

interface PropData {
  id: number;
  name: string;
  type: ECourseResourceType;
  startDate: string;
  endDate: string;
  status: ECourseEventStatus;
}

const StudentCourseEvent = (props: PropData) => {
  const { id, name, type, startDate, endDate, status } = props;
  let courseTypeString = "";
  const backgroundColor = status === ECourseEventStatus.submitted ? "var(--gray-40)" : "white";
  const textDecorLine = status === ECourseEventStatus.submitted ? "line-through" : "none";
  switch (type) {
    case ECourseResourceType.assignment:
      courseTypeString = "Bài tập";
      break;
    default:
      break;
  }

  return (
    <ListItem alignItems='flex-start' sx={{ backgroundColor: backgroundColor }}>
      <ListItemButton>
        <ListItemText
          primary={
            <>
              <Typography
                component='span'
                variant='body2'
                color='text.primary'
                sx={{ textDecorationLine: textDecorLine }}
              >
                {name}
              </Typography>
            </>
          }
          secondary={
            <>
              <Typography component='span' variant='body2' color='text.primary'>
                {courseTypeString}
              </Typography>
              <Box>
                <Typography
                  sx={{ display: "inline" }}
                  component='span'
                  variant='body2'
                  color='text.primary'
                >
                  Thời hạn:
                </Typography>
                {` ${endDate} `}
              </Box>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default StudentCourseEvent;
