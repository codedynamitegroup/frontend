import { Box, Divider, Grid } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { CourseCertificate } from "../..";

type Props = {
  course: CourseCertificate;
};

const CourseCertificateCard = ({ course }: Props) => {
  return (
    <Box className={classes.courseCerticate}>
      <Grid container direction={"column"} margin={0} gap={2}>
        <Grid item container xs={5} className={classes.titleCourse}>
          <Grid item xs={3} className={classes.imgCourse}>
            <img alt='img course' src={course.imgUrl} />
          </Grid>
          <Grid item xs={9} className={classes.nameCourse}>
            <Heading3>{course.title}</Heading3>
          </Grid>
        </Grid>
        <Divider />
        <Grid item xs={5}>
          <ParagraphBody className={classes.courseDescription}>{course.description}</ParagraphBody>
        </Grid>
        <Divider />
        <Grid item xs={2}>
          <Box className={classes.iconCourse}>
            <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
            <ParagraphBody>{course.lesson} bài học</ParagraphBody>
          </Box>
          <Box className={classes.iconCourse}>
            <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
            <ParagraphBody>{course.level}</ParagraphBody>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseCertificateCard;
