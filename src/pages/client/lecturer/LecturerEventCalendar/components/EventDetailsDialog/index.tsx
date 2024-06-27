import { DialogActions, DialogProps, Grid, Link } from "@mui/material";
import Box from "@mui/material/Box";
import CustomDialog from "components/common/dialogs/CustomDialog";
import useWindowDimensions from "hooks/useWindowDimensions";
import { useTranslation } from "react-i18next";
import { IFullCalendarEvent } from "../..";
import { NotificationEventTypeEnum } from "models/courseService/enum/NotificationEventTypeEnum";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import i18next from "i18next";
import { useEffect, useState } from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import JoyButton from "@mui/joy/Button";
import { routes } from "routes/routes";
import ReactQuill from "react-quill";

interface EventDetailsDialogProps extends DialogProps {
  data: IFullCalendarEvent;
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
}

const EventDetailsDialog = ({
  data,
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  ...props
}: EventDetailsDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { height } = useWindowDimensions();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  useEffect(() => {
    setCurrentLang(i18next.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={data.title}
      maxHeight={`${0.6 * height}px`}
      titleBackground={data.eventType === NotificationEventTypeEnum.COURSE ? "#FFD3BD" : "#DCE7EB"}
      actionsDisabled={!data.editable && !data.exam && !data.assignment}
      confirmText='Edit'
      cancelText='Delete'
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={() => {}}
      customActions={
        (data.exam || data.assignment) && (
          <DialogActions>
            <JoyButton
              onClick={() => {}}
              variant='plain'
              translation-key='course_assignment_detail_submit'
            >
              {t("course_assignment_detail_submit")}
            </JoyButton>
          </DialogActions>
        )
      }
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <AccessTimeIcon
              sx={{
                width: "20px",
                height: "20px"
              }}
            />
          </Grid>
          <Grid item xs={12} sm={11}>
            {standardlizeUTCStringToLocaleString(data.start, currentLang)}
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CalendarMonthIcon
              sx={{
                width: "20px",
                height: "20px"
              }}
            />
          </Grid>
          <Grid item xs={12} sm={11}>
            {data.title}
          </Grid>
        </Grid>

        {data.description && data.description.length > 0 && (
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              sm={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FormatAlignLeftIcon
                sx={{
                  width: "20px",
                  height: "20px"
                }}
              />
            </Grid>
            <Grid item xs={12} sm={11}>
              <ReactQuill value={data.description || ""} readOnly={true} theme={"bubble"} />
            </Grid>
          </Grid>
        )}

        {data.course && (
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              sm={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <SchoolIcon
                sx={{
                  width: "20px",
                  height: "20px"
                }}
              />
            </Grid>
            <Grid item xs={12} sm={11}>
              <Link
                component={"button"}
                sx={{
                  marginLeft: "5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
                underline='hover'
                onClick={() => {
                  if (data.course && data.course.id)
                    navigate(
                      routes.lecturer.course.information.replace(":courseId", data.course.id)
                    );
                }}
              >
                {data.course.name || ""}
              </Link>
            </Grid>
          </Grid>
        )}
      </Box>
    </CustomDialog>
  );
};

export default EventDetailsDialog;
