import { DateSelectArg, EventContentArg } from "@fullcalendar/core";
import enLocale from "@fullcalendar/core/locales/en-gb";
import viLocale from "@fullcalendar/core/locales/vi";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Box, IconButton, Stack, ToggleButton, Tooltip } from "@mui/material";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import TextTitle from "components/text/TextTitle";
import i18next from "i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import JoyButton from "@mui/joy/Button";
import "./index.scss";
import dayjs from "dayjs";
import moment from "moment";
interface CustomFullCalendarProps {
  calendarViewType?: string;
  events: any[];
  handleDateSelect?: (selectInfo: DateSelectArg) => void;
  editable?: boolean;
  handleGetCalendarEvents: ({
    fromTime,
    toTime
  }: {
    fromTime: string;
    toTime: string;
  }) => Promise<void>;
}

export default function CustomFullCalendar({
  calendarViewType,
  events,
  handleDateSelect,
  editable,
  handleGetCalendarEvents
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
  const [currentRange, setCurrentRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: ""
  });

  const goPrev = () => {
    /* @ts-ignore */
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCalendarViewTitle(calendarApi.view.title);
    setCurrentRange({
      start: moment(calendarApi.view.currentStart).toISOString(),
      end: moment(calendarApi.view.currentEnd).toISOString()
    });
  };

  const goNext = () => {
    /* @ts-ignore */
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCalendarViewTitle(calendarApi.view.title);
    setCurrentRange({
      start: moment(calendarApi.view.currentStart).toISOString(),
      end: moment(calendarApi.view.currentEnd).toISOString()
    });
  };

  const goToday = () => {
    /* @ts-ignore */
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setCalendarViewTitle(calendarApi.view.title);
    setCurrentRange({
      start: moment(calendarApi.view.currentStart).toISOString(),
      end: moment(calendarApi.view.currentEnd).toISOString()
    });
  };

  const isTodayButtonDisabled = useMemo(() => {
    if (calendarRef.current) {
      /* @ts-ignore */
      const calendarApi = calendarRef.current.getApi();
      return calendarApi.view.title === dayjs().format("MMMM YYYY");
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
      setCurrentRange({
        start: moment(calendarApi.view.currentStart).toISOString(),
        end: moment(calendarApi.view.currentEnd).toISOString()
      });
    }
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      /* @ts-ignore */
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(calendarViewType === "0" ? "dayGridMonth" : "dayGridDay");
    }
  }, [calendarViewType]);

  // useEffect(() => {
  //   if (calendarRef.current) {
  //     /* @ts-ignore */
  //     const calendarApi = calendarRef.current.getApi();
  //     calendarApi.refetchEvents();
  //   }
  // }, [events]);

  // console.log("currentRange", currentRange);

  // console.log(moment("Wed May 29 2024 07:00:00 GMT+0700 (Indochina Time)").utc());

  // console.log("calendarRef.current", calendarRef.current);

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

      <Box className='demo-app'>
        <Box className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={false}
            initialView={"dayGridMonth"}
            editable={editable || false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={(arg: DateSelectArg) => {
              // check if the arg is in the current range
              console.log("arg", arg);
              // if (currentRange.start !== "" && currentRange.end !== "") {
              //   if (
              //     moment(arg.startStr).isBefore(moment(currentRange.start)) ||
              //     moment(arg.endStr).isAfter(moment(currentRange.end))
              //   ) {
              //     return;
              //   }
              // } else {
              //   handleDateSelect && handleDateSelect(arg);
              // }
            }}
            eventContent={renderEventContent} // custom render function
            eventClick={function () {}}
            events={events}
            eventSources={[
              function (fetchInfo, successCallback, failureCallback) {
                console.log("fetchInfo", fetchInfo);
                handleGetCalendarEvents({
                  fromTime: fetchInfo.startStr,
                  toTime: fetchInfo.endStr
                });
                successCallback(events);
              }
            ]}
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
    </Stack>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <Tooltip title={eventContent.event.title} placement='top-start'>
      <Box
        sx={{
          padding: "5px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          "@media (max-width: 600px)": {
            fontSize: "10px",
            padding: "3px"
          }
        }}
      >
        <ParagraphExtraSmall
          sx={{ fontSize: "12px", "@media (max-width: 600px)": { fontSize: "10px" } }}
        >
          {eventContent.timeText}
        </ParagraphExtraSmall>
        <TextTitle
          sx={{
            color: "white",
            textWrap: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "13px",
            "@media (max-width: 600px)": { fontSize: "11px" }
          }}
        >
          {eventContent.event.title}
        </TextTitle>
        <ParagraphBody
          sx={{
            fontSize: "12px",
            color: "grey",
            "@media (max-width: 600px)": { fontSize: "10px" }
          }}
        >
          {eventContent.event.extendedProps.description || "No description"}
        </ParagraphBody>
      </Box>
    </Tooltip>
  );
}
