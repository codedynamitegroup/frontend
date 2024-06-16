import AccordionActions from "@mui/material/AccordionActions";
import classes from "./styles.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useEffect, useState } from "react";
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
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
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
import { AssignmentService } from "services/courseService/AssignmentService";
import { useCallback } from "react";
import i18next from "i18next";
import { clearExamCreate } from "reduxes/coreService/questionCreate";
import { useDispatch } from "react-redux";

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
  onDelete: (id: string) => void;
}

const AssignmentResource = ({
  resourceTitle,
  resourceOpenDate,
  resourceEndedDate,
  courseId,
  examId,
  intro,
  type,
  onDelete
}: Props) => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  type = type || ResourceType.assignment;
  const [resourceExpansion, setResourceExpansion] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  useEffect(() => {
    dayjs.locale(i18n.language);
    if (i18n.language !== currentLang) {
      setCurrentLang(i18n.language);
      dayjs.locale(currentLang === "vi" ? "en" : "vi");
    }
  }, [i18next.language]);

  const dispatch = useDispatch();

  const handleEdit = () => {
    if (type === ResourceType.assignment) {
      navigate(
        routes.lecturer.assignment.edit
          .replace(":courseId", courseId ?? "")
          .replace(":assignmentId", examId ?? "")
      );
    } else {
      dispatch(clearExamCreate());
      navigate(
        routes.lecturer.exam.edit
          .replace(":courseId", courseId ?? "")
          .replace(":examId", examId ?? "")
      );
    }
  };

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(examId ?? "");
    setDialogOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box className={classes.cardWrapper}>
      <Grid container alignItems='center'>
        <Grid item xs={12} className={classes.timeWrapper}>
          <Grid container alignItems='center'>
            <Grid item xs={0.6}></Grid>
            <Grid item xs={11.4}>
              <Box
                translation-key={["course_assignment_open", "course_assignment_deadline"]}
                className={classes.deadline}
              >
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
          <Tooltip title='Edit'>
            <IconButton onClick={handleEdit}>
              <Edit className={classes.iconEdit} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton onClick={handleDelete}>
              <Delete className={classes.iconDelete} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        translation-key={[
          "common_confirm_deletion",
          "assignment_management_delete_assignment",
          "common_cancel",
          "common_confirm"
        ]}
      >
        <DialogTitle id='alert-dialog-title'>{t("common_confirm_deletion")}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {t("assignment_management_delete_assignment")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            {t("common_cancel")}
          </Button>
          <Button onClick={confirmDelete} color='primary' autoFocus>
            {t("common_confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignmentResource;
