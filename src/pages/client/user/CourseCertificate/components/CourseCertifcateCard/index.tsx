import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Divider, Grid, Rating, Stack } from "@mui/material";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";

type Props = {
  course: CertificateCourseEntity;
};

const CourseCertificateCard = ({ course }: Props) => {
  const { t } = useTranslation();

  return (
    <Box className={classes.courseCerticate}>
      <Grid container direction={"column"} margin={0} gap={2}>
        <Grid item container xs={5} className={classes.titleCourse}>
          <Grid item xs={3} className={classes.imgCourse}>
            <img alt='img course' src={course?.topic?.thumbnailUrl} />
          </Grid>
          <Grid item xs={9} className={classes.nameCourse}>
            <Heading3>{course?.name || ""}</Heading3>
          </Grid>
        </Grid>
        <Divider />
        <Grid item xs={5}>
          <ParagraphBody className={classes.courseDescription}>
            {course?.description || ""}
          </ParagraphBody>
        </Grid>
        <Divider />
        <Grid item xs={2}>
          <Box
            className={classes.iconCourse}
            sx={{
              marginTop: "-5px",
              marginBottom: "10px"
            }}
          >
            <Stack direction='row' spacing={1} alignItems={"center"}>
              <Rating name='read-only' value={course?.avgRating || 0} readOnly size='small' />
              <ParagraphBody>{course?.avgRating || 0}</ParagraphBody>
              <ParagraphBody>({course?.numOfReviews || 0})</ParagraphBody>
            </Stack>
          </Box>
          <Box className={classes.iconCourse}>
            <FontAwesomeIcon icon={faBook} className={classes.fileIcon} />
            <Stack direction='row' spacing={1} alignItems={"center"}>
              <ParagraphBody fontWeight={550}>
                {course?.numOfQuestions || 0} {t("common_lessons").toLowerCase()} {" • "}
              </ParagraphBody>
              <ParagraphBody>
                {course?.numOfStudents || 0} {t("common_learners").toLowerCase()}
              </ParagraphBody>
            </Stack>
          </Box>
          <Box className={classes.iconCourse}>
            <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
            <ParagraphBody>
              {course?.skillLevel === SkillLevelEnum.BASIC
                ? t("common_easy")
                : course?.skillLevel === SkillLevelEnum.INTERMEDIATE
                  ? t("common_medium")
                  : course?.skillLevel === SkillLevelEnum.ADVANCED
                    ? t("common_hard")
                    : ""}
            </ParagraphBody>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseCertificateCard;
