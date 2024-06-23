import CalendarIcon from "@mui/icons-material/DateRange";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import JoyButton from "@mui/joy/Button";
import { Box, Stack, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import CustomBreadCrumb from "components/common/Breadcrumb";
import Heading1 from "components/text/Heading1";
import ParagraphSmall from "components/text/ParagraphSmall";
import useAuth from "hooks/useAuth";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { routes } from "routes/routes";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch } from "store";
import ContestTimeDisplay from "../TimeDisplay";
import classes from "./styles.module.scss";

interface PropsData {
  contestId: string;
  contestDetails: ContestEntity;
  contestStatus: ContestStartTimeFilterEnum | null;
  handleChangeContestStatus: () => void;
}

const ContestTimeInformation = ({
  contestId,
  contestDetails,
  contestStatus,
  handleChangeContestStatus
}: PropsData) => {
  const dispatch = useDispatch<AppDispatch>();
  // const { startDate, status, endDate, contestName } = props;
  const convertedEndDate = contestDetails.endTime ? new Date(contestDetails.endTime) : null;

  const [isJoinContest, setIsJoinContest] = useState(contestDetails?.isRegistered || false);

  const { isLoggedIn } = useAuth();

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTimeUntil = useCallback(
    (inputTime: any) => {
      if (!inputTime) {
        return;
      }
      const time = moment(inputTime).diff(moment().utc(), "milliseconds");
      if (time < 0) {
        if (contestStatus !== ContestStartTimeFilterEnum.ENDED) {
          handleChangeContestStatus();
        }
        return;
      } else {
        setYears(Math.floor(time / (1000 * 60 * 60 * 24 * 365)));
        setMonths(Math.floor((time / (1000 * 60 * 60 * 24 * 30)) % 12));
        setDays(Math.floor((time / (1000 * 60 * 60 * 24)) % 30));
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
      }
    },
    [contestStatus, handleChangeContestStatus]
  );

  const { t } = useTranslation();

  const handleJoinContest = useCallback(
    async (id: string) => {
      if (isJoinContest === true) {
        dispatch(setErrorMess(t("contest_detail_already_joined_message")));
        return;
      }
      setIsRegisterLoading(true);
      try {
        const joinContestsResponse = await ContestService.registerContestById(id);
        if (joinContestsResponse) {
          setIsJoinContest(true);
          setIsRegisterLoading(false);
          dispatch(setSuccessMess(t("contest_detail_join_success")));
        }
      } catch (error: any) {
        setIsRegisterLoading(false);
        dispatch(setErrorMess("Failed to join contest"));
      }
    },
    [dispatch, isJoinContest, t]
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        getTimeUntil(
          contestStatus === ContestStartTimeFilterEnum.UPCOMING
            ? contestDetails.startTime
            : contestDetails.endTime
        ),
      1000
    );

    return () => clearInterval(interval);
  }, [contestDetails.startTime, contestDetails.endTime, contestStatus, getTimeUntil]);

  return (
    <Paper className={classes.container}>
      <Box>
        <Box className={classes.breadcump}>
          <Box id={classes.breadcumpWrapper}>
            <CustomBreadCrumb
              breadCrumbData={[
                { navLink: routes.user.contest.root, label: t("contest_list_title") }
              ]}
              lastBreadCrumbLabel={contestDetails.name}
            />
          </Box>
        </Box>
        <Heading1 marginBottom={"5px"}>{contestDetails.name}</Heading1>
        {isJoinContest ? (
          contestStatus === ContestStartTimeFilterEnum.UPCOMING ? (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--green-300) !important"}
              translation-key='contest_detail_joined_feature_status'
            >
              {t("contest_detail_joined_feature_status")}
            </Heading1>
          ) : contestStatus === ContestStartTimeFilterEnum.HAPPENING ? (
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
          (contestStatus === ContestStartTimeFilterEnum.UPCOMING ? (
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
                  onClick={() => handleJoinContest(contestId)}
                >
                  {t("contest_detail_join_button")}
                </JoyButton>
              </span>
            </Tooltip>
          ) : contestStatus === ContestStartTimeFilterEnum.HAPPENING ? (
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
        {contestStatus === ContestStartTimeFilterEnum.UPCOMING && (
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
        {contestStatus === ContestStartTimeFilterEnum.HAPPENING &&
          (contestDetails.endTime ? (
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
        {convertedEndDate && contestStatus === ContestStartTimeFilterEnum.ENDED && (
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
