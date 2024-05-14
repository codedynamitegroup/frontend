import { Box, Divider, Grid } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import { faBook } from "@fortawesome/free-solid-svg-icons";

type Props = {
  course: CertificateCourseEntity;
};

const CourseCertificateCard = ({ course }: Props) => {
  const formatSkillLevel = (skillLevel: SkillLevelEnum) => {
    switch (skillLevel) {
      case SkillLevelEnum.BASIC:
        return "Cơ bản";
      case SkillLevelEnum.INTERMEDIATE:
        return "Trung bình";
      case SkillLevelEnum.ADVANCED:
        return "Nâng cao";
      default:
        return "";
    }
  };
  return (
    <Box className={classes.courseCerticate}>
      <Grid container direction={"column"} margin={0} gap={2}>
        <Grid item container xs={5} className={classes.titleCourse}>
          <Grid item xs={3} className={classes.imgCourse}>
            <img alt='img course' src={course.topic.thumbnailUrl} />
          </Grid>
          <Grid item xs={9} className={classes.nameCourse}>
            <Heading3>{course.name}</Heading3>
          </Grid>
        </Grid>
        <Divider />
        <Grid item xs={5}>
          <ParagraphBody className={classes.courseDescription}>{course.description}</ParagraphBody>
        </Grid>
        <Divider />
        <Grid item xs={2}>
          <Box className={classes.iconCourse}>
            <FontAwesomeIcon icon={faBook} className={classes.fileIcon} />
            <ParagraphBody>
              {course.numOfQuestions} bài học • {course.numOfStudents} người học
            </ParagraphBody>
          </Box>
          <Box className={classes.iconCourse}>
            <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
            <ParagraphBody>{formatSkillLevel(course.skillLevel)}</ParagraphBody>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseCertificateCard;
