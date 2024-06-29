import { DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import enLocale from "@fullcalendar/core/locales/en-gb";
import viLocale from "@fullcalendar/core/locales/vi";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { EventDragStopArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import JoyButton from "@mui/joy/Button";
import { Box, CircularProgress, IconButton, Link, Stack, Tooltip } from "@mui/material";
import Heading2 from "components/text/Heading2";
import dayjs from "dayjs";
import i18next from "i18next";
import { NotificationEventTypeEnum } from "models/courseService/enum/NotificationEventTypeEnum";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { IFullCalendarEvent } from "pages/client/lecturer/LecturerEventCalendar";
import { NotificationComponentTypeEnum } from "models/courseService/enum/NotificationComponentTypeEnum";

interface CustomFullCalendarProps {
  isEventsLoading: boolean;
  currentRange: {
    start: string;
    end: string;
  };
  handleChangeCurrentRange: (range: { start: string; end: string }) => void;
  calendarViewType?: string;
  events: IFullCalendarEvent[];
  handleDateSelect?: (selectInfo: DateSelectArg) => void;
  handleGetCalendarEvents: ({
    fromTime,
    toTime
  }: {
    fromTime: string;
    toTime: string;
  }) => Promise<any>;
  handleOpenEventDetailsDialog?: (event: IFullCalendarEvent) => void;
  handleUpdateCalendarEventById?: (
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
  ) => void;
}

export default function CustomFullCalendar({
  isEventsLoading,
  calendarViewType,
  events,
  handleDateSelect,
  handleGetCalendarEvents,
  handleOpenEventDetailsDialog,
  currentRange,
  handleChangeCurrentRange,
  handleUpdateCalendarEventById
}: CustomFullCalendarProps) {
  const { t } = useTranslation();
  const calendarRef = useRef(null);
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  useEffect(() => {
    setCurrentLang(i18next.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  const [calendarViewTitle, setCalendarViewTitle] = useState("");

  const goPrev = () => {
    /* @ts-ignore */
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCalendarViewTitle(calendarApi.view.title);
    handleChangeCurrentRange({
      start: moment(calendarApi.view.currentStart).toISOString(),
      end: moment(calendarApi.view.currentEnd).toISOString()
    });
  };

  const goNext = () => {
    /* @ts-ignore */
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCalendarViewTitle(calendarApi.view.title);
    handleChangeCurrentRange({
      start: moment(calendarApi.view.currentStart).toISOString(),
      end: moment(calendarApi.view.currentEnd).toISOString()
    });
  };

  const goToday = () => {
    /* @ts-ignore */
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setCalendarViewTitle(calendarApi.view.title);
    handleChangeCurrentRange({
      start: moment(calendarApi.view.currentStart).toISOString(),
      end: moment(calendarApi.view.currentEnd).toISOString()
    });
  };

  const isTodayButtonDisabled = useMemo(() => {
    if (calendarRef.current) {
      /* @ts-ignore */
      const calendarApi = calendarRef.current.getApi();
      return (
        calendarApi.view.title === dayjs().format("MMMM YYYY") ||
        calendarApi.view.title === dayjs().format("DD MMMM YYYY")
      );
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarViewTitle]);

  useEffect(() => {
    if (calendarRef.current) {
      /* @ts-ignore */
      const calendarApi = calendarRef.current.getApi();
      console.log("calendarApi", calendarApi);
      setCalendarViewTitle(calendarApi.view.title);
      handleChangeCurrentRange({
        start: moment(calendarApi.view.currentStart).toISOString(),
        end: moment(calendarApi.view.currentEnd).toISOString()
      });
    }
  }, [handleChangeCurrentRange]);

  const handleEventClick = useCallback(
    (arg: EventClickArg) => {
      const findEvent = events.find((event) => event.id === arg.event.id);
      if (findEvent && handleOpenEventDetailsDialog) handleOpenEventDetailsDialog(findEvent);
    },
    [events, handleOpenEventDetailsDialog]
  );

  useEffect(() => {
    if (calendarRef.current) {
      /* @ts-ignore */
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(calendarViewType === "0" ? "dayGridMonth" : "dayGridDay");
      setCalendarViewTitle(calendarApi.view.title);
      handleChangeCurrentRange({
        start: moment(calendarApi.view.currentStart).toISOString(),
        end: moment(calendarApi.view.currentEnd).toISOString()
      });
    }
  }, [calendarViewType, handleChangeCurrentRange]);

  useEffect(() => {
    if (
      currentRange.start &&
      currentRange.end &&
      currentRange.start !== "" &&
      currentRange.end !== ""
    )
      handleGetCalendarEvents({
        fromTime: currentRange.start,
        toTime: currentRange.end
      });
  }, [currentRange, handleGetCalendarEvents]);

  return (
    <Stack direction={"column"} gap={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <Box>
          <Heading2>{calendarViewTitle}</Heading2>
        </Box>
        <Box>
          <IconButton aria-label='prev' onClick={goPrev}>
            <ArrowBackIosIcon
              sx={{
                width: "17px",
                height: "17px"
              }}
            />
          </IconButton>
          <IconButton aria-label='prev' onClick={goNext}>
            <ArrowForwardIosIcon
              sx={{
                width: "17px",
                height: "17px"
              }}
            />
          </IconButton>
          <JoyButton
            sx={{
              marginLeft: "10px"
            }}
            color='neutral'
            onClick={goToday}
            disabled={isTodayButtonDisabled}
            translate-key='calendar_today'
          >
            {t("calendar_today")}
          </JoyButton>
        </Box>
      </Box>
      <Box
        sx={{
          position: "relative"
        }}
      >
        <Box className='demo-app'>
          <Box className='demo-app-main'>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={false}
              initialView={"dayGridMonth"}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={(arg: DateSelectArg) => {
                console.log("arg", arg);
                /* @ts-ignore */
                const calendarApi = calendarRef.current.getApi();
                calendarApi.unselect(); // clear date selection

                if (handleDateSelect) handleDateSelect(arg);
              }}
              eventDrop={(arg: EventDragStopArg) => {
                handleUpdateCalendarEventById &&
                  handleUpdateCalendarEventById(arg.event.id, {
                    startTime: moment(arg.event.start).utc().toISOString(),
                    endTime: moment(arg.event.end).utc().toISOString()
                  });
              }}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              events={events}
              editable={false}
              ref={calendarRef}
              locale={currentLang === "en" ? enLocale : viLocale}
              timeZone='UTC'

              // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
              /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            />
          </Box>
        </Box>
        {isEventsLoading && (
          <Box
            sx={{
              position: "absolute",
              top: "0",
              right: "0",
              height: "100%",
              width: "100%",
              backgroundColor: "white",
              opacity: "0.5",
              zIndex: "50"
            }}
          >
            <CircularProgress
              color='inherit'
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
          </Box>
        )}
      </Box>
    </Stack>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <Tooltip title={eventContent.event.title} placement='top-start'>
      <Stack
        direction={"row"}
        display={"flex"}
        padding={"5px 3px"}
        alignItems={"center"}
        sx={{
          width: "100%",
          backgroundColor: "#3688D8",
          borderRadius: "3px"
        }}
      >
        {eventContent.event.extendedProps.eventType === NotificationEventTypeEnum.COURSE ? (
          <Box
            sx={{
              minWidth: "13px",
              minHeight: "13px",
              borderRadius: "50%",
              backgroundColor: "#FFD3BD",
              border: "2px solid #D34500"
            }}
          />
        ) : (
          <Box
            sx={{
              minWidth: "13px",
              minHeight: "13px",
              borderRadius: "50%",
              backgroundColor: "#DCE7EB",
              border: "2px solid #4D7C91"
            }}
          />
        )}
        <Link
          sx={{
            marginLeft: "5px",
            whiteSpace: "nowrap",
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
          underline='hover'
        >
          {eventContent.event.title}
        </Link>
      </Stack>
    </Tooltip>
  );
}
