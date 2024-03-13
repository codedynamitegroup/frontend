import AccordionActions from "@mui/material/AccordionActions";
import classes from "./styles.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import TextEditor from "components/editor/TextEditor";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CourseAnnouncement = () => {
  const { t } = useTranslation();
  const [announcementExpansion, setAnnouncementExpansion] = useState(false);
  const textEditorChangeHandler = () => {};
  const cancelAnnoucementHandler = () => {
    setAnnouncementExpansion(false);
  };

  return (
    <Box className={classes.container}>
      <Accordion expanded={announcementExpansion} className={classes.accordionContainer}>
        <AccordionSummary
          className={classes.accordionSummary}
          onClick={() => {
            setAnnouncementExpansion(true);
          }}
          translation-key='course_lecturer_add_announcement'
        >
          {t("course_lecturer_add_announcement")}
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            className={classes.announcementSubject}
            label={t("course_lecturer_announcement_title")}
            translation-key='course_lecturer_announcement_title'
          />
          <Box className={classes.announcementContent}>
            <TextEditor
              value=''
              placeholder={t("course_lecturer_enter_announcement")}
              onChange={textEditorChangeHandler}
              translation-key='course_lecturer_enter_announcement'
            />
          </Box>
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={cancelAnnoucementHandler} translation-key='common_cancel'>
            {t("common_cancel")}
          </Button>
          <Button translation-key='common_post'>{t("common_post")}</Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
};

export default CourseAnnouncement;
