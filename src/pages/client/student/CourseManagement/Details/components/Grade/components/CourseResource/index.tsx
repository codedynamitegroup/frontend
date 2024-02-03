import { Link } from "@mui/material";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import images from "config/images";
import { ECourseResourceType } from "models/courseService/course";
import { inherits } from "util";

interface PropsData {
  name: string;
  type: ECourseResourceType;
}

const StudentCourseGradeAssignment = (props: PropsData) => {
  let resourceImage;
  switch (props.type) {
    case ECourseResourceType.assignment:
      resourceImage = images.course.courseAssignment;
      break;
    case ECourseResourceType.file:
      resourceImage = images.course.courseFile;
      break;
    default:
      return null;
  }

  return (
    <Box className={classes.container}>
      <Grid container>
        <Link href='#' underline='hover' className={classes.linkContainer}>
          <Grid item>
            <img src={resourceImage} alt='Resource' />
          </Grid>
          <Grid item>
            <Typography className={classes.resourceName}>{props.name}</Typography>
          </Grid>
        </Link>
      </Grid>
    </Box>
  );
};

export default StudentCourseGradeAssignment;
