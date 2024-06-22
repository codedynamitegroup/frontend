import CalendarIcon from "@mui/icons-material/DateRange";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import JoyButton from "@mui/joy/Button";
import { Box, Stack, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Heading1 from "components/text/Heading1";
import ParagraphSmall from "components/text/ParagraphSmall";
import useAuth from "hooks/useAuth";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { routes } from "routes/routes";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch } from "store";
import ContestTimeDisplay from "../TimeDisplay";
import classes from "./styles.module.scss";

interface PropsData {
  startDate: string;
  endDate?: string;
  status: ContestStartTimeFilterEnum;
  joinContest: boolean;
  contestName: string;
  contestId: string;
}

const ContestTimeInformation = (props: PropsData) => {
  const dispatch = useDispatch<AppDispatch>();
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { startDate, status, endDate, contestName } = props;
  const convertedEndDate = endDate ? new Date(endDate) : null;

  const [isJoinContest, setIsJoinContest] = useState(props.joinContest);

  const { isLoggedIn } = useAuth();

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const inputDate = useMemo(() => {
    return status === ContestStartTimeFilterEnum.UPCOMING ? startDate : endDate;
  }, [startDate, endDate, status]);

  const getTimeUntil = (inputTime: any) => {
    if (!inputTime) {
      return;
    }
    const time = moment(inputTime).diff(moment().utc(), "milliseconds");
    if (time < 0) {
      return;
    } else {
      setYears(Math.floor(time / (1000 * 60 * 60 * 24 * 365)));
      setMonths(Math.floor((time / (1000 * 60 * 60 * 24 * 30)) % 12));
      setDays(Math.floor((time / (1000 * 60 * 60 * 24)) % 30));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  const { t } = useTranslation();

  const handleJoinContest = useCallback(
    async (id: string) => {
      setIsRegisterLoading(true);
      try {
        const joinContestsResponse = await ContestService.registerContestById(id);
        if (joinContestsResponse) {
          setIsJoinContest(true);
          setIsRegisterLoading(false);
          dispatch(setSuccessMess(t("contest_detail_join_success")));
        }
      } catch (error: any) {
        console.error("Failed to join contest", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
        setIsRegisterLoading(false);
        dispatch(setErrorMess("Failed to join contest"));
      }
    },
    [dispatch, t]
  );

  useEffect(() => {
    const interval = setInterval(() => getTimeUntil(inputDate), 1000);

    return () => clearInterval(interval);
  }, [inputDate]);

  return (
    <Paper className={classes.container}>
      <Box>
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.user.contest.root)}
              translation-key='contest_list_title'
            >
              {t("contest_list_title")}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall colorname='--blue-500'>{contestName}</ParagraphSmall>
          </Box>
        </Box>
        <Heading1 marginBottom={"5px"}>{contestName}</Heading1>
        {isJoinContest ? (
          status === ContestStartTimeFilterEnum.UPCOMING ? (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--green-300) !important"}
              translation-key='contest_detail_joined_feature_status'
            >
              {t("contest_detail_joined_feature_status")}
            </Heading1>
          ) : status === ContestStartTimeFilterEnum.HAPPENING ? (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--green-300) !important"}
              translation-key='contest_detail_joined_happening_status'
            >
              {t("contest_detail_joined_happening_status")}
            </Heading1>
          ) : (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--orange-4) !important"}
              translation-key='contest_detail_joined_ended_status'
            >
              {t("contest_detail_joined_ended_status")}
            </Heading1>
          )
        ) : (
          !isJoinContest &&
          (status === ContestStartTimeFilterEnum.UPCOMING ? (
            <Tooltip
              title={isLoggedIn === false ? t("contest_detail_register_tooltip") : ""}
              placement='top'
              arrow
            >
              <span>
                <JoyButton
                  loading={isRegisterLoading}
                  disabled={!isLoggedIn}
                  translation-key='contest_detail_join_button'
                  onClick={() => handleJoinContest(props.contestId)}
                >
                  {t("contest_detail_join_button")}
                </JoyButton>
              </span>
            </Tooltip>
          ) : status === ContestStartTimeFilterEnum.HAPPENING ? (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--warning) !important"}
              translation-key='contest_detail_already_started_message'
            >
              {t("contest_detail_already_started_message")}
            </Heading1>
          ) : (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--orange-4) !important"}
              translation-key='contest_detail_ended_message'
            >
              {t("contest_detail_ended_message")}
            </Heading1>
          ))
        )}
      </Box>

      <Stack>
        {status === ContestStartTimeFilterEnum.UPCOMING && (
          <Box className={classes.timeDetailContainer}>
            <Stack direction={"row"} justifyContent={"center"}>
              <CalendarIcon fontSize='small' />
              <ParagraphSmall
                className={classes.timeDescriptionText}
                translation-key='contest_detail_feature_status'
              >
                {t("contest_detail_feature_status")}
              </ParagraphSmall>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ marginTop: "5px" }}
            >
              {years > 0 && (
                <ContestTimeDisplay time={years} type={t("contest_detail_feature_year")} />
              )}
              {months > 0 && (
                <ContestTimeDisplay time={months} type={t("contest_detail_feature_month")} />
              )}
              {days > 0 && (
                <ContestTimeDisplay time={days} type={t("contest_detail_feature_day")} />
              )}
              <ContestTimeDisplay time={hours} type={t("contest_detail_feature_hour")} />
              <ContestTimeDisplay time={minutes} type={t("contest_detail_feature_minute")} />
              <ContestTimeDisplay time={seconds} type={t("contest_detail_feature_second")} />
            </Stack>
          </Box>
        )}
        {status === ContestStartTimeFilterEnum.HAPPENING &&
          (endDate ? (
            <Box className={classes.timeDetailContainer}>
              <Stack direction={"row"} justifyContent={"center"}>
                <CalendarIcon fontSize='small' />
                <ParagraphSmall
                  className={classes.timeDescriptionText}
                  translation-key='contest_detail_happening_status'
                >
                  {t("contest_detail_happening_status")}
                </ParagraphSmall>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{ marginTop: "5px" }}
              >
                {years > 0 && (
                  <ContestTimeDisplay time={years} type={t("contest_detail_feature_year")} />
                )}
                {months > 0 && (
                  <ContestTimeDisplay time={months} type={t("contest_detail_feature_month")} />
                )}
                {days > 0 && (
                  <ContestTimeDisplay time={days} type={t("contest_detail_feature_day")} />
                )}
                <ContestTimeDisplay time={hours} type={t("contest_detail_feature_hour")} />
                <ContestTimeDisplay time={minutes} type={t("contest_detail_feature_minute")} />
                <ContestTimeDisplay time={seconds} type={t("contest_detail_feature_second")} />
              </Stack>
            </Box>
          ) : (
            <Box className={classes.timeDetailContainer}>
              <Stack direction={"row"} justifyContent={"center"}>
                <CalendarIcon fontSize='small' />
                <ParagraphSmall
                  className={classes.timeDescriptionText}
                  translation-key='this_contest_has_no_end_time'
                >
                  {t("this_contest_has_no_end_time")}
                </ParagraphSmall>
              </Stack>
            </Box>
          ))}
        {convertedEndDate && status === ContestStartTimeFilterEnum.ENDED && (
          <Box className={classes.timeDetailContainer}>
            <Stack direction={"row"} justifyContent={"center"}>
              <NotificationsActiveIcon fontSize='small' />
              <ParagraphSmall
                className={classes.timeDescriptionText}
                translation-key='contest_detail_ended_status'
              >
                {t("contest_detail_ended_status")}
              </ParagraphSmall>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ marginTop: "5px" }}
            >
              <ContestTimeDisplay
                time={convertedEndDate.getDate()}
                type={t("contest_detail_feature_day")}
              />
              <ContestTimeDisplay
                time={convertedEndDate.getMonth() + 1}
                type={t("contest_detail_feature_month")}
              />
              <ContestTimeDisplay
                time={convertedEndDate.getFullYear() % 100}
                type={t("contest_detail_feature_year")}
              />
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default ContestTimeInformation;
