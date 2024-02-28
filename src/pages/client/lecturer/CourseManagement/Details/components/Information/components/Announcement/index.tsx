import AccordionActions from "@mui/material/AccordionActions";
import classes from "./styles.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import TextEditor from "components/editor/TextEditor";
import { Box, Button, Input, TextField } from "@mui/material";
import { useState } from "react";

const CourseAnnouncement = () => {
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
        >
          Thêm thông báo
        </AccordionSummary>
        <AccordionDetails>
          <TextField className={classes.announcementSubject} label='Tiêu đề thông báo' />
          <Box className={classes.announcementContent}>
            <TextEditor value='' placeholder='Nhập thông báo' onChange={textEditorChangeHandler} />
          </Box>
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={cancelAnnoucementHandler}>Hủy</Button>
          <Button>Đăng</Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
};

export default CourseAnnouncement;
