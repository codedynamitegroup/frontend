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

interface Props {
  resourceTitle: string;
  resourceEndedDate: string;
  type?: ResourceType;
}
const AssignmentResource = ({ resourceTitle, resourceEndedDate, type }: Props) => {
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
          <ParagraphBody>Hết hạn lúc: {resourceEndedDate}</ParagraphBody>
        </AccordionSummary>
        <AccordionDetails>
          <TextEditor
            value='<p><span style="color: rgb(95, 99, 104);">Technique need to be prepared for the seminar next week</span></p><p><br></p><p><span style="color: rgb(95, 99, 104);">👉 Implement a mechanism to log request and response data of all api endpoints</span></p><p><span style="color: rgb(95, 99, 104);">👉 Log can be saved to text file, database, or 3rd party service</span></p><p><span style="color: rgb(95, 99, 104);">👉 Propose &amp; implement a method to support log rotation (eg: daily rotation, weekly rotation, file size rotation, ...)</span></p><p><span style="color: rgb(95, 99, 104);">👉 Propose &amp; implement a method to search through log data for debugging purposes</span></p>'
            readOnly={true}
          />
        </AccordionDetails>
        <AccordionActions>
          <Button btnType={BtnType.Text} onClick={cancelResourceHandler}>
            Hủy
          </Button>
          <Button btnType={BtnType.Primary} onClick={onDetailClick}>
            Xem chi tiết
          </Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
};

export default AssignmentResource;
