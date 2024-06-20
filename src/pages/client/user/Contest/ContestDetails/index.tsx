import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs
} from "@mui/material";
import Heading1 from "components/text/Heading1";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import ParagraphSmall from "components/text/ParagraphSmall";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { ContestLeaderboardEntity } from "models/coreService/entity/ContestLeaderboardEntity";
import { UserContestRankEntity } from "models/coreService/entity/UserContestRankEntity";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import {
  Route,
  Link as RouterLink,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch } from "store";
import ContestLeaderboard from "./components/ContestLeaderboard";
import ContestProblemItem from "./components/ContestProblemItem";
import ContestTimeInformation from "./components/ContestTimeInformation";
import classes from "./stytles.module.scss";

const ContestDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [leaderboardPage, setLeaderboardPage] = useState<number>(0);
  const [leaderboardPageSize, setLeaderboardPageSize] = useState<number>(5);
  const [contestLeaderboard, setContestLeaderboard] = useState<ContestLeaderboardEntity | null>(
    null
  );
  const { contestId } = useParams<{ contestId: string }>();
  const tabs: string[] = useMemo(() => {
    return [
      routes.user.contest.detail.information,
      routes.user.contest.detail.problems.root,
      routes.user.contest.detail.leaderboard
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = pathname.startsWith(routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (contestId) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":contestId", contestId)));
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const [contestDetails, setContestDetails] = useState<ContestEntity | null>(null);

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (contestId) {
      if (newValue === 0) {
        navigate(
          routes.user.contest.detail.information.replace(":contestId", contestId.toString())
        );
      } else if (newValue === 1) {
        navigate(
          routes.user.contest.detail.problems.root.replace(":contestId", contestId.toString())
        );
      } else if (newValue === 2) {
        navigate(
          routes.user.contest.detail.leaderboard.replace(":contestId", contestId.toString())
        );
      }
    }
  };

  const { t } = useTranslation();

  const handleGetContestLeaderboard = useCallback(async (id: string) => {
    try {
      const getContestsResponse = await ContestService.getContestLeaderboard(id);
      setContestLeaderboard(getContestsResponse);
    } catch (error: any) {
      console.error("Failed to fetch contests", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
    }
  }, []);

  const handleGetContestById = useCallback(
    async (id: string) => {
      dispatch(setInititalLoading(true));
      try {
        const getContestDetailsResponse = await ContestService.getContestById(id);
        if (getContestDetailsResponse) {
          if (
            getContestDetailsResponse.startTime &&
            moment().utc().isAfter(getContestDetailsResponse.startTime)
          ) {
            await handleGetContestLeaderboard(id);
          }
          setContestDetails(getContestDetailsResponse);
        }
        dispatch(setInititalLoading(false));
      } catch (error: any) {
        console.error("Failed to fetch contests", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
        dispatch(setInititalLoading(false));
        // Show snackbar here
      }
    },
    [dispatch, handleGetContestLeaderboard]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      if (contestId) {
        handleGetContestById(contestId);
      }
    };
    fetchInitialData();
  }, [contestId, dispatch, handleGetContestById, handleGetContestLeaderboard]);

  if (!contestDetails || !contestId) {
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
        <Grid container gap={2}>
          <Grid
            item
            xs={activeTab !== 2 && contestStatus !== ContestStartTimeFilterEnum.UPCOMING ? 8 : 12}
          >
            <Box className={classes.bodyWrapper}>
              {/* <TabContext value={activeTab}> */}
              <Box sx={{ borderBottom: "1px solid var(--gray-10)" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  aria-label='basic tabs example'
                  className={classes.tabs}
                >
                  <Tab
                    label={t("contest_detail_description")}
                    translation-key='contest_detail_description'
                    value={0}
                  />
                  {contestStatus !== ContestStartTimeFilterEnum.UPCOMING &&
                  contestDetails.isRegistered === true ? (
                    <Tab
                      label={t("contest_detail_problems")}
                      translation-key='contest_detail_problems'
                      value={1}
                    />
                  ) : null}
                  {contestStatus !== ContestStartTimeFilterEnum.UPCOMING ? (
                    <Tab
                      label={t("contest_detail_leaderboard")}
                      translation-key='contest_detail_leaderboard'
                      value={2}
                    />
                  ) : null}
                </Tabs>
              </Box>
              <Box
                sx={{
                  padding: "20px",
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Routes>
                  <Route
                    path={"information"}
                    element={
                      <>
                        <Stack direction='column' gap={1}>
                          <Heading4 translation-key='common_description'>
                            {t("common_description")}
                          </Heading4>
                          <ReactQuill
                            value={contestDetails.description || ""}
                            readOnly={true}
                            theme={"bubble"}
                          />
                        </Stack>
                        <Divider
                          sx={{
                            margin: "10px 0"
                          }}
                        />
                        <Stack direction='column' gap={1}>
                          <Heading4 translation-key='common_prizes'>{t("common_prizes")}</Heading4>

                          <ReactQuill
                            value={contestDetails.prizes || ""}
                            readOnly={true}
                            theme={"bubble"}
                          />
                        </Stack>
                        <Divider
                          sx={{
                            margin: "10px 0"
                          }}
                        />
                        <Stack direction='column' gap={1}>
                          <Heading4 translation-key='common_rules'>{t("common_rules")}</Heading4>
                          <ReactQuill
                            value={contestDetails.rules || ""}
                            readOnly={true}
                            theme={"bubble"}
                          />
                        </Stack>
                        <Divider
                          sx={{
                            margin: "10px 0"
                          }}
                        />
                        <Stack direction='column' gap={1}>
                          <Heading4 translation-key='common_scoring'>
                            {t("common_scoring")}
                          </Heading4>
                          <ReactQuill
                            value={contestDetails.scoring || ""}
                            readOnly={true}
                            theme={"bubble"}
                          />
                        </Stack>
                      </>
                    }
                  />
                  <Route
                    path={"problems"}
                    element={
                      <>
                        {contestStatus !== ContestStartTimeFilterEnum.UPCOMING &&
                        contestDetails.isRegistered === true &&
                        activeTab === 1 ? (
                          <Grid container spacing={3}>
                            {contestDetails.questions && contestDetails.questions.length > 0 ? (
                              contestDetails.questions.map((problem) => (
                                <Grid item xs={12} key={problem.name}>
                                  <ContestProblemItem
                                    contestId={contestId}
                                    problemId={problem.codeQuestionId || ""}
                                    name={problem.name || ""}
                                    point={problem.grade || 0}
                                    maxScore={problem.maxGrade || 0}
                                    difficulty={problem.difficulty}
                                    maxSubmission={0}
                                    submission={problem.numOfSubmissions || 0}
                                  />
                                </Grid>
                              ))
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "100%",
                                  width: "100%",
                                  marginTop: "40px",
                                  gap: "10px"
                                }}
                              >
                                <ParagraphBody translate-key='contest_detail_no_problems_messsage'>
                                  {t("contest_detail_no_problems_messsage")}
                                </ParagraphBody>
                              </Box>
                            )}
                          </Grid>
                        ) : null}
                      </>
                    }
                  />
                  <Route
                    path={"leaderboard"}
                    element={
                      <>
                        {contestStatus !== ContestStartTimeFilterEnum.UPCOMING &&
                        activeTab === 2 ? (
                          <>
                            <Heading1>{t("contest_detail_leaderboard")}</Heading1>
                            <ContestLeaderboard
                              page={leaderboardPage}
                              pageSize={leaderboardPageSize}
                              setPage={setLeaderboardPage}
                              setPageSize={setLeaderboardPageSize}
                              currentUserRank={contestLeaderboard?.participantRank}
                              rankingList={contestLeaderboard?.contestLeaderboard || []}
                              problemList={contestDetails.questions}
                              totalPages={contestLeaderboard?.totalPages || 0}
                              totalItems={contestLeaderboard?.totalItems || 0}
                            />
                          </>
                        ) : null}
                      </>
                    }
                  />
                </Routes>
              </Box>
            </Box>
          </Grid>
          {activeTab !== 2 ? (
            <Grid item xs={3}>
              {contestStatus !== ContestStartTimeFilterEnum.UPCOMING ? (
                <Paper
                  sx={{
                    padding: "1px 20px",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <Grid container direction='column' alignItems='center' justifyContent='center'>
                    <Grid item xs={12}>
                      <Heading4 margin={"10px"} translation-key='contest_detail_leaderboard_rank'>
                        {t("contest_detail_leaderboard_rank")}
                      </Heading4>
                      <Divider orientation='horizontal' />
                    </Grid>
                    {topUserRank &&
                    topUserRank.filter((user) => user.totalScore > 0).length !== 0 ? (
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
                                      <ParagraphBody
                                        className={classes.topUserText}
                                      >{`${user.user.firstName} ${user.user.lastName}`}</ParagraphBody>
                                      <Stack direction='row' alignItems='center' gap={1}>
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
                      <ParagraphSmall
                        sx={{
                          margin: "10px"
                        }}
                        color='var(--gray-30)'
                        textAlign={"center"}
                        translation-key='contest_detail_leaderboard_no_data'
                      >
                        {t("contest_detail_leaderboard_no_data")}
                      </ParagraphSmall>
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
