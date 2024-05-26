import { Link } from "@mui/material";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import images from "config/images";
import { ECourseResourceType } from "models/courseService/course";
import { inherits } from "util";
import { Link as RouterLink } from "react-router-dom";

interface PropsData {
  name: string;
  type: ECourseResourceType;
  content: string;
}

const CourseResource = (props: PropsData) => {
  const getFileType = (url: string): string => {
    // Extract the file extension from the URL
    const fileExtension = url.split(".").pop()?.split("?")[0] || "";

    // Define known image and PDF extensions
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "tiff"];
    const pdfExtension = "pdf";
    const docExtension = "docx";
    const xlsExtension = "xlsx";
    const pptExtension = "ppt";

    // Check if the file extension matches any of the image extensions
    if (imageExtensions.includes(fileExtension.toLowerCase())) {
      return images.course.courseImage;
    }

    // Check if the file extension is 'pdf'
    if (fileExtension.toLowerCase() === pdfExtension) {
      return images.course.coursePDF;
    }

    // Check if the file extension is 'doc'
    if (fileExtension.toLowerCase() === docExtension) {
      return images.course.courseDOC;
    }

    // Check if the file extension is 'xls'
    if (fileExtension.toLowerCase() === xlsExtension) {
      return images.course.courseXLS;
    }

    // Check if the file extension is 'ppt'
    if (fileExtension.toLowerCase() === pptExtension) {
      return images.course.coursePPT;
    }

    // Return 'unknown' if the file extension does not match known types
    return images.course.courseFile;
  };
  let resourceImage;
  switch (props.type) {
    case ECourseResourceType.assignment:
      resourceImage = images.course.courseAssignment;
      break;
    case ECourseResourceType.file:
      resourceImage = getFileType(props.content);
      break;
    case ECourseResourceType.url:
      resourceImage = images.course.courseUrl;
      break;
    default:
      return null;
  }
  const getPath = (type: ECourseResourceType) => {
    switch (type) {
      case ECourseResourceType.assignment:
        return "/path-for-assignment";
      case ECourseResourceType.file:
        return props.content;
      case ECourseResourceType.url:
        return props.content;
      default:
        return "/";
    }
  };

  // Example usage

  return (
    <Box className={classes.container}>
      <Grid container>
        <Link
          component={RouterLink}
          to={getPath(props.type)}
          underline='hover'
          className={classes.linkContainer}
        >
          <Grid item>
            <Box
              className={
                props.type === ECourseResourceType.assignment
                  ? classes.imageContainerAssignment
                  : classes.imageContainer
              }
            >
              <img className={classes.imageResourse} src={resourceImage} alt='Resource' />
            </Box>
          </Grid>
          <Grid item>
            <Typography color={"#0f6cbf"} className={classes.resourceName}>
              {props.name}
            </Typography>
          </Grid>
        </Link>
      </Grid>
    </Box>
  );
};

export default CourseResource;
