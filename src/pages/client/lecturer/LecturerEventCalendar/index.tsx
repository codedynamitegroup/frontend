import { DateSelectArg } from "@fullcalendar/core";
import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, Stack } from "@mui/material";
import CustomFullCalendar from "components/calendar/CustomFullCalendar";
import Button, { BtnType } from "components/common/buttons/Button";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import BasicSelect from "components/common/select/BasicSelect";
import Heading1 from "components/text/Heading1";
import useAuth from "hooks/useAuth";
import { NotificationComponentTypeEnum } from "models/courseService/enum/NotificationComponentTypeEnum";
import { NotificationEventTypeEnum } from "models/courseService/enum/NotificationEventTypeEnum";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import {
  CreateEventCalendarEvent,
  EventCalendarService
} from "services/courseService/EventCalendarService";
import { AppDispatch } from "store";
import AddEventDialog from "./components/AddEventDialog";
import EventDetailsDialog from "./components/EventDetailsDialog";
import classes from "./styles.module.scss";

export interface IFullCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description: string;
  eventType: NotificationEventTypeEnum;
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
  editable: boolean;
  exam?: {};
  assignment?: {};
  createdAt: string;
}

export interface IEventCalendarData {
  isExpanded: boolean;
  durationRadioIndex: string;
  durationInMinute: number;
  eventTitle: string;
  eventDescription: string;
  start: string;
  end: string;
  allDay: boolean;
  eventType: NotificationEventTypeEnum;
  // isAddEventDialogOpen: boolean;
  selectDateInfo: DateSelectArg | null;
  filterCourse: string;
  isLoading: boolean;
  currentEvents: IFullCalendarEvent[];
}

const LecturerEventCalendar = () => {
  const { t } = useTranslation();
  const { loggedUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<IEventCalendarData>({
    isExpanded: false,
    durationRadioIndex: "0",
    durationInMinute: 0,
    eventTitle: "",
    eventDescription: "",
    start: "",
    end: "",
    allDay: false,
    eventType: NotificationEventTypeEnum.USER,
    selectDateInfo: null,
    // isAddEventDialogOpen: false,
    filterCourse: "ALL",
    isLoading: false,
    currentEvents: []
  });

  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);

  const [allMyCoursesData, setAllMyCoursesData] = useState<{
    data: [];
    isLoading: false;
  }>({
    data: [],
    isLoading: false
  });

  const [eventDetailsDialogData, setEventDetailsDialogData] = useState<{
    open: boolean;
    data: IFullCalendarEvent | null;
  }>({
    open: false,
    data: null
  });

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [currentRange, setCurrentRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: ""
  });

  const handleOpenEventDetailsDialog = useCallback((event: IFullCalendarEvent) => {
    setEventDetailsDialogData((pre) => {
      return {
        ...pre,
        open: true,
        data: event
      };
    });
  }, []);

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
    setIsAddEventDialogOpen(true);
  }, []);

  const closeAddEventDialog = useCallback(() => {
    setIsAddEventDialogOpen(false);
  }, []);

  const [calendarViewType, setCalendarViewType] = useState("0");

  const handleGetCalendarEvents = useCallback(
    async ({ fromTime, toTime }: { fromTime: string; toTime: string }) => {
      setData((pre) => {
        return {
          ...pre,
          isLoading: true
        };
      });
      try {
        const getCertificateCoursesResponse = await EventCalendarService.getEventCalendars({
          courseId: data.filterCourse === "ALL" ? undefined : data.filterCourse,
          fromTime,
          toTime
        });
        if (getCertificateCoursesResponse.calendarEvents.length === 0) {
          setData((pre) => {
            return {
              ...pre,
              currentEvents: [],
              isLoading: false
            };
          });
          return;
        }
        setData((pre) => {
          return {
            ...pre,
            currentEvents: getCertificateCoursesResponse.calendarEvents.map((value: any) => {
              let checkExistTeacherByLoggedUser = false;
              if (
                value.eventType === NotificationEventTypeEnum.COURSE &&
                value.course !== null &&
                value.course.teacher !== null
              ) {
                const findTeacher = value.course.teachers.find(
                  (teacher: any) => teacher.userId === loggedUser?.userId
                );
                if (findTeacher && findTeacher.role === "Giảng viên 1") {
                  checkExistTeacherByLoggedUser = true;
                }
              }
              return {
                id: value.calendarEventId,
                title: value.name,
                start: value.startTime,
                end: value.endTime || "",
                allDay: value.endTime ? false : true,
                description: value.description,
                eventType: value.eventType,
                component: value.component,
                user: value.user,
                course: value.course,
                exam: value.exam,
                assignment: value.assignment,
                createdAt: value.createdAt,
                editable:
                  value.eventType === NotificationEventTypeEnum.USER
                    ? true
                    : checkExistTeacherByLoggedUser
              };
            }),
            isLoading: false
          };
        });
      } catch (error: any) {
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        setData((pre) => {
          return {
            ...pre,
            isLoading: false
          };
        });
      }
    },
    [data.filterCourse, dispatch, loggedUser?.userId, t]
  );

  const handleUpdateCalendarEventById = useCallback(
    async (
      id: string,
      body: {
        name?: string;
        description?: string;
        eventType?: NotificationEventTypeEnum;
        startTime?: string;
        endTime?: string;
        userId?: string;
        courseId?: string;
        examId?: string;
        assignmentId?: string;
        contestId?: string;
        component?: NotificationComponentTypeEnum;
      }
    ) => {
      try {
        const updateCalendarEventResponse = await EventCalendarService.updateEventCalendar(
          id,
          body
        );
        if (updateCalendarEventResponse && currentRange.start !== "" && currentRange.end !== "") {
          await handleGetCalendarEvents({
            fromTime: currentRange.start,
            toTime: currentRange.end
          });
          dispatch(setSuccessMess(t("calendar_event_update_event_success")));
        }
      } catch (error: any) {
        dispatch(setErrorMess(t("calendar_event_update_event_failed")));
      }
    },
    [currentRange.end, currentRange.start, dispatch, handleGetCalendarEvents, t]
  );

  const handleCreateCalendarEventById = useCallback(
    async (data: CreateEventCalendarEvent) => {
      try {
        const createCalendarEventResponse = await EventCalendarService.createEventCalendar(data);
        if (createCalendarEventResponse && currentRange.start !== "" && currentRange.end !== "") {
          await handleGetCalendarEvents({
            fromTime: currentRange.start,
            toTime: currentRange.end
          });
          dispatch(setSuccessMess(t("calendar_event_create_event_success")));
        }
      } catch (error: any) {
        dispatch(setErrorMess(t("calendar_event_create_event_failed")));
      }
    },
    [currentRange.end, currentRange.start, dispatch, handleGetCalendarEvents, t]
  );

  const handleDeleteCalendarEventById = useCallback(
    async (id: string) => {
      try {
        const deleteCalendarEventResponse = await EventCalendarService.deleteEventCalendarById(id);
        if (deleteCalendarEventResponse && currentRange.start !== "" && currentRange.end !== "") {
          await handleGetCalendarEvents({
            fromTime: currentRange.start,
            toTime: currentRange.end
          });
          dispatch(setSuccessMess(t("calendar_event_delete_event_success")));
        }
      } catch (error: any) {
        dispatch(setErrorMess(t("calendar_event_delete_event_failed")));
      }
    },
    [currentRange.end, currentRange.start, dispatch, handleGetCalendarEvents, t]
  );

  return (
    <>
      {isAddEventDialogOpen && (
        <AddEventDialog
          open={isAddEventDialogOpen}
          handleClose={() => {
            closeAddEventDialog();
            setData((pre) => {
              return {
                ...pre,
                isExpanded: false
              };
            });
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
          onHanldeConfirm={handleCreateCalendarEventById}
        />
      )}

      {eventDetailsDialogData.data && (
        <EventDetailsDialog
          open={eventDetailsDialogData.open}
          data={eventDetailsDialogData.data}
          handleClose={() => {
            setEventDetailsDialogData((pre) => {
              return {
                ...pre,
                open: false,
                data: null
              };
            });
          }}
          onHandleCancel={() => {
            setIsOpenConfirmDelete(true);
            setEventDetailsDialogData((pre) => {
              return {
                ...pre,
                open: false
              };
            });
          }}
        />
      )}
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={t("dialog_confirm_delete_title")}
        description={t("dialog_confirm_delete_calendar_event", {
          eventTitle: eventDetailsDialogData.data?.title
        })}
        onCancel={() => {
          setIsOpenConfirmDelete(false);
          setEventDetailsDialogData((pre) => {
            return {
              ...pre,
              open: true
            };
          });
        }}
        onDelete={() => {
          if (eventDetailsDialogData.data) {
            handleDeleteCalendarEventById(eventDetailsDialogData.data.id);
            setIsOpenConfirmDelete(false);
          }
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
            spacing={1}
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
          isEventsLoading={data.isLoading}
          calendarViewType={calendarViewType}
          events={data.currentEvents}
          handleDateSelect={handleDateSelect}
          handleGetCalendarEvents={handleGetCalendarEvents}
          handleOpenEventDetailsDialog={handleOpenEventDetailsDialog}
          currentRange={currentRange}
          handleChangeCurrentRange={setCurrentRange}
          handleUpdateCalendarEventById={handleUpdateCalendarEventById}
        />
      </Box>
    </>
  );
};

export default LecturerEventCalendar;
