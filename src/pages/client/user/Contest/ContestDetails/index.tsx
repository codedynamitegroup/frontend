import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Tab,
  Typography,
  Avatar
} from "@mui/material";
import classes from "./stytles.module.scss";
import Heading1 from "components/text/Heading1";
import ContestTimeInformation from "./components/ContestTimeInformation";
import { useCallback, useEffect, useMemo, useState } from "react";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import ContestProblemItem from "./components/ContestProblemItem";
import ContestLeaderboard from "./components/ContestLeaderboard";
import Heading4 from "components/text/Heading4";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContestService } from "services/coreService/ContestService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { setContestDetails, setContestLeaderboard } from "reduxes/coreService/Contest";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import moment from "moment";
import { UserContestRankEntity } from "models/coreService/entity/UserContestRankEntity";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import { setLoading as setInititalLoading } from "reduxes/Loading";

const ContestDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const contestState = useSelector((state: RootState) => state.contest);
  const { contestId } = useParams<{ contestId: string }>();
  const contestDetails = useMemo(() => contestState.contestDetails, [contestState.contestDetails]);
  const contestLeaderboard = useMemo(
    () => contestState.contestLeaderboard,
    [contestState.contestLeaderboard]
  );

  const contestStatus = useMemo(() => {
    if (contestDetails) {
      if (contestDetails.startTime && moment().utc().isBefore(contestDetails.startTime)) {
        return ContestStartTimeFilterEnum.UPCOMING;
      } else if (contestDetails.endTime && moment().utc().isAfter(contestDetails.endTime)) {
        return ContestStartTimeFilterEnum.ENDED;
      } else {
        return ContestStartTimeFilterEnum.HAPPENING;
      }
    } else {
      return ContestStartTimeFilterEnum.UPCOMING;
    }
  }, [contestDetails]);

  const topUserRank = useMemo(() => {
    if (contestLeaderboard?.contestLeaderboard) {
      return contestLeaderboard.contestLeaderboard.slice(0, 3);
    }
    return [];
  }, [contestLeaderboard]);

  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { t } = useTranslation();

  const handleGetContestLeaderboard = useCallback(
    async (id: string) => {
      try {
        const getContestsResponse = await ContestService.getContestLeaderboard(id);
        dispatch(setContestLeaderboard(getContestsResponse));
      } catch (error: any) {
        console.error("Failed to fetch contests", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
        // Show snackbar here
      }
    },
    [dispatch]
  );

  const handleGetContestById = useCallback(
    async (id: string) => {
      try {
        const getContestsResponse = await ContestService.getContestById(id);
        dispatch(setContestDetails(getContestsResponse));
      } catch (error: any) {
        console.error("Failed to fetch contests", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
        // Show snackbar here
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      if (contestId) {
        dispatch(setInititalLoading(true));
        await handleGetContestById(contestId);
        await handleGetContestLeaderboard(contestId);
        dispatch(setInititalLoading(false));
      }
    };
    fetchInitialData();
  }, [contestId, dispatch, handleGetContestById, handleGetContestLeaderboard]);

  if (!contestDetails) {
    return null;
  }

  return (
    <Box id={classes.contestDetailsRoot}>
      <ContestTimeInformation
        status={contestStatus}
        startDate={contestDetails.startTime}
        endDate={contestDetails.endTime}
        joinContest={contestDetails.isRegistered || false}
        contestName={contestDetails.name || ""}
        contestId={contestId || ""}
      />
      <Container className={classes.bodyContainer}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={value !== "3" && contestStatus !== ContestStartTimeFilterEnum.UPCOMING ? 9 : 12}
          >
            <Paper>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange} aria-label='lab API tabs example'>
                    <Tab
                      label={t("contest_detail_description")}
                      translation-key='contest_detail_description'
                      value='1'
                    />
                    {contestStatus !== ContestStartTimeFilterEnum.UPCOMING &&
                    contestDetails.isRegistered === true ? (
                      <Tab
                        label={t("contest_detail_problems")}
                        translation-key='contest_detail_problems'
                        value='2'
                      />
                    ) : null}
                    {contestStatus !== ContestStartTimeFilterEnum.UPCOMING ? (
                      <Tab
                        label={t("contest_detail_leaderboard")}
                        translation-key='contest_detail_leaderboard'
                        value='3'
                      />
                    ) : null}
                  </TabList>
                </Box>
                <TabPanel value='1'>
                  <div
                    className={classes.divContainer}
                    dangerouslySetInnerHTML={{ __html: contestDetails.description || "" }}
                  ></div>
                </TabPanel>
                {contestStatus !== ContestStartTimeFilterEnum.UPCOMING &&
                contestDetails.isRegistered === true ? (
                  <TabPanel value='2'>
                    <Grid container spacing={3}>
                      {contestDetails.questions.map((problem) => (
                        <Grid item xs={12} key={problem.name}>
                          <ContestProblemItem
                            name={problem.name || ""}
                            point={problem.grade || 0}
                            maxScore={problem.maxGrade || 0}
                            difficulty={problem.difficulty}
                            maxSubmission={0}
                            submission={problem.numOfSubmissions || 0}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </TabPanel>
                ) : null}

                {contestStatus !== ContestStartTimeFilterEnum.UPCOMING ? (
                  <TabPanel value='3' translation-key='contest_detail_leaderboard'>
                    <Heading1>{t("contest_detail_leaderboard")}</Heading1>
                    <ContestLeaderboard
                      currentUserRank={contestLeaderboard?.participantRank}
                      rankingList={contestLeaderboard?.contestLeaderboard || []}
                      problemList={contestDetails.questions}
                    />
                  </TabPanel>
                ) : null}
              </TabContext>
            </Paper>
          </Grid>
          {value !== "3" ? (
            <Grid item xs={3}>
              {contestStatus !== ContestStartTimeFilterEnum.UPCOMING ? (
                <Paper>
                  <Grid container direction='column' alignItems='center' justifyContent='center'>
                    <Grid item xs={12}>
                      <Heading4 margin={"10px"} translation-key='contest_detail_leaderboard_rank'>
                        {t("contest_detail_leaderboard_rank")}
                      </Heading4>
                      <Divider orientation='horizontal' />
                    </Grid>
                    {topUserRank && topUserRank.length !== 0 ? (
                      <Stack spacing={1} margin={"10px 0 10px 0"}>
                        {topUserRank.map((user: UserContestRankEntity, index: number) => (
                          <Grid item xs={12} key={user.rank}>
                            <Stack alignItems={"center"} direction={"row"}>
                              <EmojiEventsIcon
                                fontSize='small'
                                sx={{
                                  color: index === 0 ? "gold" : index === 1 ? "gray" : "brown",
                                  marginRight: "5px"
                                }}
                              />
                              <Link component={RouterLink} to='#' underline='none'>
                                <Stack direction='row' alignItems='center' spacing={1}>
                                  <Avatar
                                    sx={{ width: 40, height: 40 }}
                                    variant='rounded'
                                    src={user.user.avatarUrl}
                                  />
                                  <Stack>
                                    <Stack direction='column' alignItems='left'>
                                      <Typography
                                        className={classes.topUserText}
                                      >{`${user.user.firstName} ${user.user.lastName}`}</Typography>
                                      <Stack
                                        direction='row'
                                        alignItems='center'
                                        justifyContent='space-between'
                                        gap={1}
                                      >
                                        <ParagraphExtraSmall>
                                          {`${t("common_rank")}: ${user.rank}`}
                                        </ParagraphExtraSmall>
                                        <ParagraphExtraSmall>
                                          {`${t("common_score")}: ${user.totalScore || 0}`}
                                        </ParagraphExtraSmall>
                                      </Stack>
                                    </Stack>
                                  </Stack>
                                </Stack>
                              </Link>
                            </Stack>
                          </Grid>
                        ))}
                      </Stack>
                    ) : (
                      <Typography
                        color='var(--gray-30)'
                        translation-key='contest_detail_leaderboard_no_data'
                      >
                        {t("contest_detail_leaderboard_no_data")}
                      </Typography>
                    )}
                  </Grid>
                </Paper>
              ) : null}
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
};

export default ContestDetails;
