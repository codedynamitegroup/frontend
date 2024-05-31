import { DateSelectArg } from "@fullcalendar/core";
import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, Grid } from "@mui/material";
import CustomFullCalendar from "components/calendar/CustomFullCalendar";
import { createEventId } from "components/calendar/CustomFullCalendar/event-utils";
import Button, { BtnType } from "components/common/buttons/Button";
import BasicSelect from "components/common/select/BasicSelect";
import Heading1 from "components/text/Heading1";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import AddEventDialog from "./components/AddEventDialog";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const StudentEventCalendar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState<{
    isExpanded: boolean;
    durationRadioIndex: string;
    durationInMinute: number;
    eventTitle: string;
    eventDescription: string;
    start: string;
    end: string;
    allDay: boolean;
    isAddEventDialogOpen: boolean;
    selectDateInfo: DateSelectArg | null;
    filterCourse: string;
    currentEvents: any[];
  }>({
    isExpanded: false,
    durationRadioIndex: "0",
    durationInMinute: 0,
    eventTitle: "",
    eventDescription: "",
    start: "",
    end: "",
    allDay: false,
    isAddEventDialogOpen: false,
    selectDateInfo: null,
    filterCourse: "0",
    currentEvents: [
      {
        id: createEventId(),
        title: "Sự kiện nộp bài nhập môn lập trình",
        start: "2024-02-28",
        end: "2024-03-02",
        allDay: true,
        description: "Nộp bài tập lớn"
      },
      {
        id: createEventId(),
        title: "Sự kiện thi cuối kì nhập môn lập trình",
        start: "2024-02-20",
        end: "2024-02-22",
        allDay: true,
        description: "Thi cuối kì"
      }
    ]
  });

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setData((pre) => {
      return {
        ...pre,
        start: selectInfo.startStr,
        selectDateInfo: selectInfo,
        isAddEventDialogOpen: true
      };
    });
  }, []);

  const openAddEventDialog = useCallback(() => {
    setData((pre) => {
      return {
        ...pre,
        isAddEventDialogOpen: true,
        selectDateInfo: null,
        eventTitle: "",
        start: dayjs().toString(),
        end: dayjs().toString()
      };
    });
  }, []);

  const closeAddEventDialog = useCallback(() => {
    setData((pre) => {
      return {
        ...pre,
        isAddEventDialogOpen: false
      };
    });
  }, []);

  const onHanldeConfirmAddEvent = useCallback(() => {
    setData((pre) => {
      return {
        ...pre,
        currentEvents: [
          ...pre.currentEvents,
          {
            id: createEventId(),
            title: pre.eventTitle,
            start: data.selectDateInfo?.startStr || "",
            end: data.selectDateInfo?.endStr || "",
            allDay: data.selectDateInfo?.allDay || false,
            description: pre.eventDescription
          }
        ]
      };
    });
    closeAddEventDialog();
  }, [closeAddEventDialog, data.selectDateInfo]);

  return (
    <>
      <AddEventDialog
        open={data.isAddEventDialogOpen}
        handleClose={() => {
          closeAddEventDialog();
          setData((pre) => {
            return {
              ...pre,
              isExpanded: false
            };
          });
        }}
        data={data}
        handleChangData={(newData) => {
          setData((pre) => {
            return {
              ...pre,
              isExpanded: newData.isExpanded,
              durationRadioIndex: newData.durationRadioIndex,
              durationInMinute: newData.durationInMinute,
              eventTitle: newData.eventTitle,
              start: newData.start,
              end: newData.end,
              allDay: newData.allDay
            };
          });
        }}
        title={t("calendar_add_event")}
        cancelText={t("common_cancel")}
        confirmText={t("common_add")}
        onHandleCancel={() => {
          closeAddEventDialog();
          setData((pre) => {
            return {
              ...pre,
              isExpanded: false
            };
          });
        }}
        translation-key={["calendar_add_event", "common_add", "common_cancel"]}
        onHanldeConfirm={() => {
          onHanldeConfirmAddEvent();
        }}
      />
      <Box id={classes.calendarBody}>
        <Heading1 translation-key='calendar_title'>{t("calendar_title")}</Heading1>
        <Divider />
        <Box sx={{ marginBottom: "10px" }}>
          <Grid
            container
            spacing={2}
            alignItems='center'
            direction={isSmallScreen ? "column" : "row"}
          >
            <Grid item xs={12} sm={12} md={6}>
              <BasicSelect
                labelId='select-assignment-section-label'
                value={data.filterCourse}
                onHandleChange={(value) => {
                  setData((pre) => {
                    return {
                      ...pre,
                      filterCourse: value
                    };
                  });
                }}
                sx={{ width: "100%" }}
                items={[
                  {
                    value: "0",
                    label: t("calendar_all_course")
                  },
                  {
                    value: "1",
                    label: "Nhập môn lập trình"
                  },
                  {
                    value: "2",
                    label: "Lập trình hướng đối tượng"
                  }
                ]}
                translation-key='calendar_all_course'
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              container
              justifyContent={isSmallScreen ? "flex-start" : "flex-end"}
            >
              <Button
                btnType={BtnType.Outlined}
                onClick={() => {
                  openAddEventDialog();
                }}
                startIcon={<AddIcon />}
                translation-key='calendar_add_event'
              >
                {t("calendar_add_event")}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <CustomFullCalendar events={data.currentEvents} handleDateSelect={handleDateSelect} />
        </Box>
      </Box>
    </>
  );
};

export default StudentEventCalendar;
