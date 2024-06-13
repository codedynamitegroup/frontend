import AccordionActions from "@mui/material/AccordionActions";
import classes from "./styles.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useState } from "react";
import ParagraphBody from "components/text/ParagraphBody";
import TextEditor from "components/editor/TextEditor";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import images from "config/images";
import UploadIcon from "@mui/icons-material/Upload";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Avatar,
  IconButton,
  Tooltip
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "@mui/material/Link";
import { Delete, Edit } from "@mui/icons-material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import "dayjs/locale/vi";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Link as RouterLink } from "react-router-dom";

export enum ResourceType {
  assignment = "assignment",
  exam = "exam"
}

interface Props {
  courseId?: string;
  examId?: string;
  resourceTitle: string;
  resourceOpenDate: Date | string;
  resourceEndedDate: Date | string;
  intro?: string;
  type?: ResourceType;
}

const AssignmentResource = ({
  resourceTitle,
  resourceOpenDate,
  resourceEndedDate,
  courseId,
  examId,
  intro,
  type
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  type = type || ResourceType.assignment;
  const [resourceExpansion, setResourceExpansion] = useState(false);
  const cancelResourceHandler = () => {
    setResourceExpansion(false);
  };

  const onDetailClick = () => {
    if (type === ResourceType.assignment)
      navigate(
        routes.lecturer.assignment.detail
          .replace(":courseId", courseId ?? "")
          .replace(":assignmentId", examId ?? "")
      );
    else
      navigate(
        routes.lecturer.exam.detail
          .replace(":courseId", courseId ?? "")
          .replace(":examId", examId ?? "")
      );
  };

  dayjs.extend(localeData);
  dayjs.extend(weekday);
  dayjs.extend(advancedFormat);

  // Thiết lập locale tiếng Việt
  dayjs.locale("vi");

  const handleEdit = () => {
    if (type === ResourceType.assignment) {
      navigate(
        routes.lecturer.assignment.edit
          .replace(":courseId", courseId ?? "")
          .replace(":assignmentId", examId ?? "")
      );
    }
  };

  return (
    <Box className={classes.cardWrapper}>
      <Grid container alignItems='center'>
        <Grid item xs={12} className={classes.timeWrapper}>
          <Grid container alignItems='center'>
            <Grid item xs={0.6}></Grid>
            <Grid item xs={11.4}>
              <Box className={classes.deadline}>
                <Typography variant='body2' color='textSecondary'>
                  {t("course_assignment_open")}:{" "}
                  {dayjs(resourceOpenDate).format("dddd, DD MMMM YYYY, h:mm A")}
                </Typography>
                <Typography>...</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {t("course_assignment_deadline")}:{" "}
                  {dayjs(resourceEndedDate).format("dddd, DD MMMM YYYY, h:mm A")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={0.7} className={classes.content}>
          <Avatar sx={{ bgcolor: type == ResourceType.assignment ? "#eb66a2" : "#0077be" }}>
            {type == ResourceType.assignment ? <AssignmentIcon /> : <AccessTimeFilledIcon />}
          </Avatar>
        </Grid>
        <Grid item xs={7.3}>
          <Link
            component={RouterLink}
            to={
              type === ResourceType.assignment
                ? routes.lecturer.assignment.detail
                    .replace(":courseId", courseId ?? "")
                    .replace(":assignmentId", examId ?? "")
                : routes.lecturer.exam.detail
                    .replace(":courseId", courseId ?? "")
                    .replace(":examId", examId ?? "")
            }
            underline='none'
          >
            {resourceTitle}
          </Link>
        </Grid>
        <Grid item xs={3.8} className={classes.action}>
          {/* edit and delete icon */}
          <Tooltip title='Edit'>
            <IconButton onClick={handleEdit}>
              <Edit className={classes.iconEdit} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton>
              <Delete className={classes.iconDelete} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentResource;
