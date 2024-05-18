import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import classes from "./styles.module.scss";
import CodeIcon from "@mui/icons-material/Code";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate, useParams } from "react-router";
import { ChapterEntity } from "models/coreService/entity/ChapterEntity";
import { RootState } from "store";
import { useSelector } from "react-redux";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { routes } from "routes/routes";

interface Props {
  chapter: ChapterEntity;
  chapterNumber: number;
  isExpanded?: boolean;
}

export default function LessonAccordion({ chapter, chapterNumber, isExpanded }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const certificateCourseDetails = useSelector(
    (state: RootState) => state.certifcateCourse.certificateCourseDetails
  );
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [content, setContent] = useState("");

  return (
    <>
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={type}
        content={content}
      />
      <Accordion defaultExpanded={isExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id={classes.accordionHeader}>
          <Grid container alignItems={"center"}>
            <Grid item xs={1} md={1} id={classes.chapterNumber}>
              <Box id={classes.circle}>{chapterNumber}</Box>
            </Grid>
            <Grid item xs={0.5} md={0.5}></Grid>
            <Grid item xs={10.5} md={10.5}>
              <Heading3>{chapter?.title || ""}</Heading3>
              <ParagraphBody>{chapter?.description || ""}</ParagraphBody>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails id={classes.accordionDetails}>
          <Box className={classes.chapter}>
            {chapter.questions.map((question, index) => (
              <Grid
                container
                key={index}
                className={classes.lesson}
                onClick={() => {
                  if (certificateCourseDetails?.isRegistered !== true) {
                    setOpenSnackbarAlert(true);
                    setType(AlertType.Error);
                    setContent(t("not_registered_certificate_course_message"));
                  } else if (courseId) {
                    navigate(
                      routes.user.course_certificate.detail.lesson.description
                        .replace(":courseId", courseId)
                        .replace(":lessonId", "1")
                    );
                  }
                }}
              >
                <Grid item xs={1} md={1} className={classes.icCodeWrapper}>
                  {question.pass === true ? (
                    <CheckCircleIcon className={classes.icCheck} />
                  ) : (
                    <CodeIcon className={classes.icCode} />
                  )}
                </Grid>
                <Grid item xs={11} md={11} className={classes.lessonTitle}>
                  <ParagraphBody className={classes.title}>{question?.name}</ParagraphBody>
                </Grid>
              </Grid>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
