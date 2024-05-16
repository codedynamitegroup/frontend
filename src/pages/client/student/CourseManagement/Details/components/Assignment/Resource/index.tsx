import AccordionActions from "@mui/material/AccordionActions";
import classes from "./styles.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Box } from "@mui/material";
import { useState } from "react";
import ParagraphBody from "components/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import TextEditor from "components/editor/TextEditor";
import { useNavigate } from "react-router";
import { routes } from "routes/routes";
import { ResourceType } from "pages/client/lecturer/CourseManagement/Details/components/Assignment/components/Resource";
import { useTranslation } from "react-i18next";
import { string } from "yup";
import dayjs from "dayjs";

interface Props {
  resourceTitle: string;
  resourceEndedDate: Date | string;
  intro?: string;
  type?: ResourceType;
}
const AssignmentResource = ({ resourceTitle, resourceEndedDate, intro, type }: Props) => {
  const { t } = useTranslation();
  const [resourceExpansion, setResourceExpansion] = useState(false);
  type = type || ResourceType.assignment;
  const cancelResourceHandler = () => {
    setResourceExpansion(false);
  };

  const navigate = useNavigate();

  const onDetailClick = () => {
    if (type === ResourceType.assignment) navigate(routes.student.assignment.detail);
    else navigate(routes.student.exam.detail);
  };

  return (
    <Box className={classes.container}>
      <Accordion expanded={resourceExpansion} className={classes.accordionContainer}>
        <AccordionSummary
          className={classes.accordionDetails}
          onClick={() => {
            setResourceExpansion(true);
          }}
        >
          <ParagraphBody>{resourceTitle}</ParagraphBody>
          <ParagraphBody translation-key='course_assignment_deadline'>
            {t("course_assignment_deadline")}: {dayjs(resourceEndedDate).format("DD/MM/YYYY")}
          </ParagraphBody>
        </AccordionSummary>
        <AccordionDetails>
          <TextEditor value={intro} readOnly={true} />
        </AccordionDetails>
        <AccordionActions>
          <Button
            btnType={BtnType.Text}
            onClick={cancelResourceHandler}
            translation-key='common_cancel'
          >
            {t("common_cancel")}
          </Button>
          <Button
            btnType={BtnType.Primary}
            onClick={onDetailClick}
            translation-key='course_assignment_detail'
          >
            {t("course_assignment_detail")}
          </Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
};

export default AssignmentResource;
