import { DateSelectArg } from "@fullcalendar/core";
import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, Stack } from "@mui/material";
import CustomFullCalendar from "components/calendar/CustomFullCalendar";
import Button, { BtnType } from "components/common/buttons/Button";
import BasicSelect from "components/common/select/BasicSelect";
import Heading1 from "components/text/Heading1";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import AddEventDialog from "./components/AddEventDialog";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { NotificationEventTypeEnum } from "models/courseService/enum/NotificationEventTypeEnum";
import { NotificationComponentTypeEnum } from "models/courseService/enum/NotificationComponentTypeEnum";
import { EventCalendarService } from "services/courseService/EventCalendarService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { setErrorMess } from "reduxes/AppStatus";

export interface IFullCalendarEvent {
  isExpanded: boolean;
  durationRadioIndex: string;
  durationInMinute: number;
  eventTitle: string;
  eventDescription: string;
  start: string;
  end: string;
  allDay: boolean;
  eventType: NotificationEventTypeEnum;
  isAddEventDialogOpen: boolean;
  selectDateInfo: DateSelectArg | null;
  filterCourse: string;
  isLoading: boolean;
  currentEvents: {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    description: string;
    component: NotificationComponentTypeEnum;
    user?: {
      userId: string;
      roleMoodle: {
        id: {
          value: number;
        };
        name: string;
      };
      fullName: string;
      email: string;
    };
    course?: {
      id: string;
      courseIdMoodle: number;
      teachers: [
        {
          userId: string;
          firstName: string;
          lastName: string;
          email: string;
          role: string;
        }
      ];
      organization: {
        organizationId: string;
        name: string;
        description: string;
      };
      name: string;
      courseType: {
        courseTypeId: string;
        moodleId: number;
        name: string;
      };
      visisble: boolean;
      createdAt: string;
      updatedAt: string;
    };
    exam?: {};
    assignment?: {};
    createdAt: string;
  }[];
}

const LecturerEventCalendar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<IFullCalendarEvent>({
    isExpanded: false,
    durationRadioIndex: "0",
    durationInMinute: 0,
    eventTitle: "",
    eventDescription: "",
    start: "",
    end: "",
    allDay: false,
    eventType: NotificationEventTypeEnum.USER,
    isAddEventDialogOpen: false,
    selectDateInfo: null,
    filterCourse: "ALL",
    // currentEvents: [
    //   {
    //     id: "1",
    //     title: "Sự kiện nộp bài nhập môn lập trình",
    //     start: "2024-02-28",
    //     end: "2024-03-02",
    //     allDay: true,
    //     description: "Nộp bài tập lớn"
    //   },
    //   {
    //     id: "2",
    //     title: "Sự kiện thi cuối kì nhập môn lập trình",
    //     start: "2024-02-20",
    //     end: "2024-02-22",
    //     allDay: true,
    //     description: "Thi cuối kì"
    //   }
    // ]
    isLoading: false,
    currentEvents: []
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

  const [calendarViewType, setCalendarViewType] = useState("0");

  const onHanldeConfirmAddEvent = useCallback(() => {
    // setData((pre) => {
    //   return {
    //     ...pre,
    //     currentEvents: [
    //       ...pre.currentEvents,
    //       {
    //         id: "100",
    //         title: pre.eventTitle,
    //         start: data.selectDateInfo?.startStr || "",
    //         end: data.selectDateInfo?.endStr || "",
    //         allDay: data.selectDateInfo?.allDay || false,
    //         description: pre.eventDescription
    //       }
    //     ]
    //   };
    // });
    closeAddEventDialog();
  }, [closeAddEventDialog, data.selectDateInfo]);

  const handleGetCalendarEvents = useCallback(
    async ({ fromTime, toTime }: { fromTime: string; toTime: string }) => {
      try {
        const getCertificateCoursesResponse = await EventCalendarService.getEventCalendars({
          courseId: data.filterCourse === "ALL" ? undefined : data.filterCourse,
          fromTime,
          toTime
        });
        console.log("getCertificateCoursesResponse", getCertificateCoursesResponse);
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
      }
    },
    [data.filterCourse, dispatch, t]
  );

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
          // setData((pre) => {
          //   return {
          //     ...pre,
          //     isExpanded: newData.isExpanded,
          //     durationRadioIndex: newData.durationRadioIndex,
          //     durationInMinute: newData.durationInMinute,
          //     eventTitle: newData.eventTitle,
          //     start: newData.start,
          //     end: newData.end,
          //     allDay: newData.allDay,
          //     eventType: newData.eventType
          //   };
          // });
        }}
        title={t("calendar_add_event")}
        cancelText={t("common_cancel")}
        confirmText={t("common_create")}
        onHandleCancel={() => {
          closeAddEventDialog();
          setData((pre) => {
            return {
              ...pre,
              isExpanded: false
            };
          });
        }}
        translation-key={["common_cancel", "common_create", "calendar_add_event"]}
        onHanldeConfirm={() => {
          onHanldeConfirmAddEvent();
        }}
      />
      <Box id={classes.calendarBody}>
        <Heading1 translation-key='calendar_title'>{t("calendar_title")}</Heading1>
        <Divider />
        <Box
          sx={{
            display: "flex",
            direction: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px"
          }}
        >
          <Stack
            direction='row'
            spacing={2}
            sx={{
              alignItems: "center"
            }}
          >
            <BasicSelect
              labelId='select-calendar-type-label'
              value={calendarViewType}
              onHandleChange={(value) => {
                setCalendarViewType(value);
              }}
              width={"120px"}
              items={[
                {
                  value: "0",
                  label: "Month"
                },
                {
                  value: "1",
                  label: "Day"
                }
              ]}
            />
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
              items={[
                {
                  value: "ALL",
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
          </Stack>
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
        </Box>
        <CustomFullCalendar
          calendarViewType={calendarViewType}
          events={data.currentEvents}
          handleDateSelect={handleDateSelect}
          editable={true}
          handleGetCalendarEvents={handleGetCalendarEvents}
        />
      </Box>
    </>
  );
};

export default LecturerEventCalendar;
