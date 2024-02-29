import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import * as React from "react";
import classes from "./styles.module.scss";
import CodeIcon from "@mui/icons-material/Code";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Lesson {
  title: string;
  status: boolean;
  url: string;
}
export interface Chapter {
  chapterTitle: string;
  chapterDescription: string;
  lessons: Lesson[];
}

interface Props {
  chapter: Chapter;
  chapterNumber: number;
  isExpanded?: boolean;
}

export default function LessonAccordion({ chapter, chapterNumber, isExpanded }: Props) {
  return (
    <Accordion defaultExpanded={isExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id={classes.accordionHeader}>
        <Grid container alignItems={"center"}>
          <Grid item xs={1} md={1} id={classes.chapterNumber}>
            <Box id={classes.circle}>{chapterNumber}</Box>
          </Grid>
          <Grid item xs={0.5} md={0.5}></Grid>
          <Grid item xs={10.5} md={10.5}>
            <Heading3>{chapter.chapterTitle}</Heading3>
            <ParagraphBody>{chapter.chapterDescription}</ParagraphBody>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Box className={classes.lessons}>
          {chapter.lessons.map((item, index) => (
            <Grid container key={index} className={classes.lesson}>
              <Grid item xs={1} md={1} className={classes.icCodeWrapper}>
                {item.status === true ? (
                  <CheckCircleIcon className={classes.icCheck} />
                ) : (
                  <CodeIcon className={classes.icCode} />
                )}
              </Grid>
              <Grid item xs={11} md={11} className={classes.lessonTitle}>
                <ParagraphBody>{item.title}</ParagraphBody>
              </Grid>
            </Grid>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
