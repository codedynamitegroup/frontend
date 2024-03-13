import { ECourseEventStatus, ECourseResourceType } from "models/courseService/course";
import classes from "./styles.module.scss";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Typography from "@mui/material/Typography/Typography";
import { Box, ListItemButton } from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  let courseTypeString = "";
  const backgroundColor = status === ECourseEventStatus.submitted ? "var(--gray-40)" : "white";
  const textDecorLine = status === ECourseEventStatus.submitted ? "line-through" : "none";
  switch (type) {
    case ECourseResourceType.assignment:
      courseTypeString = t("common_type_assignment");
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
              <Typography
                translation-key='common_type_assignment'
                component='span'
                variant='body2'
                color='text.primary'
              >
                {courseTypeString}
              </Typography>
              <Box>
                <Typography
                  sx={{ display: "inline" }}
                  component='span'
                  variant='body2'
                  color='text.primary'
                  translation-key='common_deadline'
                >
                  {t("common_deadline")}:
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
