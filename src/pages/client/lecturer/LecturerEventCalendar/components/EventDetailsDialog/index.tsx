import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import SchoolIcon from "@mui/icons-material/School";
import JoyButton from "@mui/joy/Button";
import { DialogActions, DialogProps, Grid, Link } from "@mui/material";
import Box from "@mui/material/Box";
import CustomDialog from "components/common/dialogs/CustomDialog";
import ParagraphBody from "components/text/ParagraphBody";
import useWindowDimensions from "hooks/useWindowDimensions";
import i18next from "i18next";
import { NotificationEventTypeEnum } from "models/courseService/enum/NotificationEventTypeEnum";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import { IFullCalendarEvent } from "../..";
import "./styles.module.scss";

interface EventDetailsDialogProps extends DialogProps {
  data: IFullCalendarEvent;
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  openEditEventDialog?: (event: IFullCalendarEvent) => void;
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
  openEditEventDialog,
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
      actionsDisabled={
        !data.editable ||
        (data.editable === true && (data.exam !== undefined || data.assignment !== undefined))
      }
      confirmText='Edit'
      cancelText='Delete'
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={() => {
        if (openEditEventDialog) openEditEventDialog(data);
      }}
      customActions={
        (data.exam !== undefined || data.assignment !== undefined) && (
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
            <ParagraphBody>
              {data.end
                ? `${standardlizeUTCStringToLocaleString(data.start, currentLang)} » ${standardlizeUTCStringToLocaleString(
                    data.end,
                    currentLang
                  )}`
                : `${standardlizeUTCStringToLocaleString(data.start, currentLang)}`}
            </ParagraphBody>
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
            <ParagraphBody>
              {data.eventType === NotificationEventTypeEnum.COURSE
                ? t("calendar_event_course_event")
                : t("calendar_event_user_event")}
            </ParagraphBody>
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
              <ReactQuill
                value={data.description || ""}
                readOnly={true}
                theme={"bubble"}
                style={{
                  margin: "-12px -15px"
                }}
              />
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
                <ParagraphBody
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "var(--blue-3)",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer"
                    }
                  }}
                >
                  {data.course.name || ""}
                </ParagraphBody>
              </Link>
            </Grid>
          </Grid>
        )}
      </Box>
    </CustomDialog>
  );
};

export default EventDetailsDialog;
