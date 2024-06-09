import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { Box, Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import { ChapterEntity } from "models/coreService/entity/ChapterEntity";
import { ResourceTypeEnum } from "models/coreService/enum/ResourceTypeEnum";
import classes from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

interface Props {
  chapter: ChapterEntity;
  chapterNumber: number;
  isExpanded?: boolean;
}

export default function LessonAccordion({ chapter, chapterNumber, isExpanded }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <Accordion defaultExpanded={isExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id={classes.accordionHeader}>
          <Grid container alignItems={"center"}>
            <Grid item xs={1} md={1} id={classes.chapterNumber}>
              <Box id={classes.circle}>{chapterNumber}</Box>
            </Grid>
            <Grid item xs={0.5} md={0.5}></Grid>
            <Grid item xs={10.5} md={10.5}>
              <Heading3>{chapter?.title || ""}</Heading3>
              <ParagraphBody className={classes.description}>
                {chapter?.description || ""}
              </ParagraphBody>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails id={classes.accordionDetails}>
          <Box className={classes.chapter}>
            {chapter.resources.map((resource, index) => {
              return (
                <Grid
                  container
                  key={index}
                  className={classes.lesson}
                  onClick={() => {
                    navigate(
                      routes.user.course_certificate.detail.lesson.detail
                        .replace(":courseId", chapter.certificateCourseId)
                        .replace(":lessonId", resource.chapterResourceId)
                        .replace("*", "")
                    );
                  }}
                >
                  <Grid item xs={1} md={1} className={classes.icCodeWrapper}>
                    {resource.isCompleted === true ? (
                      <CheckCircleIcon className={classes.icCheck} />
                    ) : resource.resourceType === ResourceTypeEnum.CODE ? (
                      <CodeIcon className={classes.icCode} />
                    ) : resource.resourceType === ResourceTypeEnum.VIDEO ? (
                      <OndemandVideoIcon className={classes.icVideo} />
                    ) : (
                      <ArticleIcon className={classes.icArticle} />
                    )}
                  </Grid>
                  <Grid item xs={11} md={11} className={classes.lessonTitle}>
                    <ParagraphBody className={classes.title}>{resource?.title || ""}</ParagraphBody>
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
