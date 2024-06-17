import AccordionActions from "@mui/material/AccordionActions";
import classes from "./styles.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useEffect, useState } from "react";
import ParagraphBody from "components/text/ParagraphBody";
import TextEditor from "components/editor/TextEditor";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [resourceExpansion, setResourceExpansion] = useState(false);
  type = type || ResourceType.assignment;
  const cancelResourceHandler = () => {
    setResourceExpansion(false);
  };

  const navigate = useNavigate();

  return (
    <Box className={classes.cardWrapper}>
      <Grid container alignItems='center'>
        <Grid item xs={12} className={classes.timeWrapper}>
          <Grid container alignItems='center'>
            <Grid item md={0.6}></Grid>
            <Grid item md={11.4}>
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

        <Box className={classes.content} style={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: type === ResourceType.assignment ? "#eb66a2" : "#0077be" }}>
            {type === ResourceType.assignment ? <AssignmentIcon /> : <AccessTimeFilledIcon />}
          </Avatar>
          <Link
            component={RouterLink}
            to={
              type === ResourceType.assignment
                ? routes.student.assignment.detail
                    .replace(":courseId", courseId || "")
                    .replace(":assignmentId", examId || "")
                : routes.student.exam.detail
                    .replace(":courseId", courseId || "")
                    .replace(":examId", examId || "")
            }
            underline='none'
            style={{ marginLeft: "12px" }}
          >
            {resourceTitle}
          </Link>
        </Box>
      </Grid>
    </Box>
  );
};

export default AssignmentResource;
