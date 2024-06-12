import {
  Box,
  CircularProgress,
  Container,
  Grid,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import CustomPagination from "components/common/pagination/CustomPagination";
import AutoSearchBar from "components/common/search/AutoSearchBar";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import useAuth from "hooks/useAuth";
import i18next from "i18next";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { setContests, setLoading, setMostPopularContests } from "reduxes/coreService/Contest";
import { routes } from "routes/routes";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch, RootState } from "store";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss/pagination";
import "swiper/scss/scrollbar";
import { standardlizeNumber } from "utils/number";
import ContestContentCard from "./components/ContestContentCard";
import TrendingContestCard from "./components/TrendingContestCard";
import classes from "./styles.module.scss";
import { setErrorMess } from "reduxes/AppStatus";

const ContestList = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const contestState = useSelector((state: RootState) => state.contest);
  const [searchParams] = useSearchParams();
  const pageSize = 10;
  const pageNo = useMemo(
    () =>
      Number.isNaN(parseInt(searchParams.get("page") || "1"))
        ? 1
        : parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  if (Number.isNaN(parseInt(searchParams.get("page") || "1"))) {
    navigate({
      pathname: routes.user.contest.root,
      search: createSearchParams({
        page: "1"
      }).toString()
    });
  }

  const startTimeFilter = useMemo(() => {
    const filter = searchParams.get("filter");
    if (!filter) return ContestStartTimeFilterEnum.ALL;
    if (filter === "my-contest" && isLoggedIn) return ContestStartTimeFilterEnum.MY_CONTEST;
    else if (filter === "upcoming") return ContestStartTimeFilterEnum.UPCOMING;
    else if (filter === "happening") return ContestStartTimeFilterEnum.HAPPENING;
    else if (filter === "ended") return ContestStartTimeFilterEnum.ENDED;
    else navigate(routes.user.contest.root);
  }, [isLoggedIn, navigate, searchParams]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    navigate({
      pathname: routes.user.contest.root,
      search: createSearchParams({
        page: value.toString()
      }).toString()
    });
  };

  const handleButtonGroupChange = (
    event: React.MouseEvent<HTMLElement>,
    newContestState: string
  ) => {
    const filter =
      newContestState === ContestStartTimeFilterEnum.ALL
        ? ""
        : newContestState === ContestStartTimeFilterEnum.MY_CONTEST
          ? "my-contest"
          : newContestState === ContestStartTimeFilterEnum.UPCOMING
            ? "upcoming"
            : newContestState === ContestStartTimeFilterEnum.HAPPENING
              ? "happening"
              : newContestState === ContestStartTimeFilterEnum.ENDED
                ? "ended"
                : "";
    if (filter !== "") {
      navigate({
        pathname: routes.user.contest.root,
        search: createSearchParams({
          filter,
          page: "1"
        }).toString()
      });
    } else {
      navigate({
        pathname: routes.user.contest.root,
        search: createSearchParams({
          page: "1"
        }).toString()
      });
    }
  };

  const { t } = useTranslation();

  const handleGetContests = useCallback(
    async ({
      searchName = "",
      startTimeFilter = ContestStartTimeFilterEnum.ALL,
      pageNo = 0,
      pageSize = 10
    }: {
      searchName?: string;
      startTimeFilter?: ContestStartTimeFilterEnum;
      pageNo?: number;
      pageSize?: number;
    }) => {
      dispatch(setLoading(true));
      try {
        const getContestsResponse = await ContestService.getContests({
          searchName: searchName,
          startTimeFilter: startTimeFilter,
          pageNo: pageNo,
          pageSize: pageSize
        });
        dispatch(setContests(getContestsResponse));
        dispatch(setLoading(false));
      } catch (error: any) {
        console.error("Failed to fetch contests", {
          code: error.code || 503,
          status: error.status || "Service Unavailable",
          message: error.message
        });
        dispatch(setLoading(false));
        // Show snackbar here
      }
    },
    [dispatch]
  );

  const handleGetMyContests = useCallback(
    async ({
      searchName = "",
      pageNo = 0,
      pageSize = 10
    }: {
      searchName?: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      dispatch(setLoading(true));
      try {
        const getMyContestsResponse = await ContestService.getMyContests({
          searchName: searchName,
          pageNo: pageNo,
          pageSize: pageSize
        });
        dispatch(setContests(getMyContestsResponse));
        dispatch(setLoading(false));
      } catch (error: any) {
        dispatch(setLoading(false));
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess("Please sign in to continue"));
          navigate(routes.user.contest.root);
        }
      }
    },
    [dispatch, navigate]
  );

  const handleGetMostPopularContests = useCallback(async () => {
    try {
      const getMostPopularContestsResponse = await ContestService.getMostPopularContests();
      dispatch(setMostPopularContests(getMostPopularContestsResponse));
    } catch (error: any) {
      // console.error("Failed to fetch most popular contests", {
      //   code: error.response?.code || 503,
      //   status: error.response?.status || "Service Unavailable",
      //   message: error.response?.message || error.message
      // });
      // Show snackbar here
    }
  }, [dispatch]);

  const searchHandle = useCallback(
    (searchText: string) => {
      if (startTimeFilter === ContestStartTimeFilterEnum.MY_CONTEST) {
        handleGetMyContests({
          searchName: searchText,
          pageNo: 0,
          pageSize
        });
      } else {
        handleGetContests({
          searchName: searchText,
          startTimeFilter,
          pageNo: 0,
          pageSize
        });
      }
    },
    [startTimeFilter, handleGetMyContests, handleGetContests]
  );

  useEffect(() => {
    handleGetMostPopularContests();
  }, [handleGetMostPopularContests]);

  useEffect(() => {
    if (startTimeFilter === ContestStartTimeFilterEnum.MY_CONTEST) {
      handleGetMyContests({
        searchName: "",
        pageNo: pageNo - 1,
        pageSize
      });
    } else {
      handleGetContests({
        searchName: "",
        startTimeFilter,
        pageNo: pageNo - 1,
        pageSize
      });
    }
  }, [handleGetContests, handleGetMyContests, pageNo, startTimeFilter]);

  return (
    <Box id={classes.contestListRoot}>
      <Grid item xs={12} md={12} xl={12} lg={12}>
        <Box
          sx={{
            backgroundImage: `url(${images.background.contestListBackground})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%"
          }}
          className={classes.detailContainer}
        >
          <Container className={classes.container}>
            <Grid container spacing={1} className={classes.bannerWrapper}>
              <Grid item xs={12} md={12} lg={12}>
                <Box>
                  <Heading1 colorname={"--white"} translation-key='contest_title'>
                    {t("contest_title")}
                  </Heading1>
                </Box>
              </Grid>
              <Grid item md={12} lg={12} className={classes.generalDetailsContainer}>
                <Box>
                  <Heading2 colorname={"--white"}>
                    {standardlizeNumber(contestState.mostPopularContests.numOfContests)}
                  </Heading2>
                  <Heading4 colorname={"--white"} translation-key='contest_total_num'>
                    {t("contest_total_num")}
                  </Heading4>
                </Box>
                <Box>
                  <Heading2 colorname={"--white"}>
                    {standardlizeNumber(contestState.mostPopularContests.numOfParticipants)}
                  </Heading2>
                  <Heading4 colorname={"--white"} translation-key='contest_total_num'>
                    {i18next.format(t("common_participant", { count: 2 }), "uppercase")}
                  </Heading4>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Swiper
                  spaceBetween={10}
                  slidesPerView={4}
                  modules={[Autoplay, Pagination]}
                  autoplay={{ delay: 5000 }}
                  pagination={{ el: ".swiper-pagination", type: "bullets", clickable: true }}
                  onSlideChange={() => {}}
                  onSwiper={(swiper: any) => {}}
                >
                  {contestState.mostPopularContests.mostPopularContests.map((item, index) => (
                    <SwiperSlide key={index}>
                      <TrendingContestCard
                        key={index.toString()}
                        name={item.name}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        avtImage={item.thumbnailUrl}
                        contestId={item.contestId}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Grid>

      <Container className={classes.container}>
        <Grid container className={classes.contestListContainer}>
          <Grid item sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={10} lg={8}>
                <Heading1 translation-key='contest_list_title'>{t("contest_list_title")}</Heading1>
              </Grid>
              <Grid item xs={12} md={10} lg={8}>
                <AutoSearchBar
                  value={searchText}
                  setValue={setSearchText}
                  onHandleChange={searchHandle}
                />
              </Grid>
              <Grid item xs={12} md={10} lg={8}>
                <Box className={classes.contestListButtonGroup}>
                  <ToggleButtonGroup
                    value={startTimeFilter}
                    exclusive
                    onChange={handleButtonGroupChange}
                  >
                    <ToggleButton
                      key={ContestStartTimeFilterEnum.ALL}
                      value={ContestStartTimeFilterEnum.ALL}
                      className={classes.listStateButton}
                      translation-key='contest_all_button'
                    >
                      {t("contest_all_button")}
                    </ToggleButton>
                    {isLoggedIn && (
                      <ToggleButton
                        key={ContestStartTimeFilterEnum.MY_CONTEST}
                        value={ContestStartTimeFilterEnum.MY_CONTEST}
                        className={classes.listStateButton}
                        translation-key='contest_my_contests_button'
                      >
                        {t("contest_my_contests_button")}
                      </ToggleButton>
                    )}
                    <ToggleButton
                      key={ContestStartTimeFilterEnum.UPCOMING}
                      value={ContestStartTimeFilterEnum.UPCOMING}
                      className={classes.listStateButton}
                      translation-key='contest_upcoming_button'
                    >
                      {t("contest_upcoming_button")}
                    </ToggleButton>
                    <ToggleButton
                      key={ContestStartTimeFilterEnum.HAPPENING}
                      value={ContestStartTimeFilterEnum.HAPPENING}
                      className={classes.listStateButton}
                      translation-key='contest_happening_button'
                    >
                      {t("contest_happening_button")}
                    </ToggleButton>
                    <ToggleButton
                      key={ContestStartTimeFilterEnum.ENDED}
                      value={ContestStartTimeFilterEnum.ENDED}
                      translation-key='contest_ended_button'
                      className={classes.listStateButton}
                    >
                      {t("contest_ended_button")}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Grid>
            </Grid>
            <Box marginTop={"15px"}>
              <Grid container spacing={2}>
                {contestState.isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      gap: "10px"
                    }}
                  >
                    <CircularProgress />
                    <ParagraphBody translate-key='common_loading'>
                      {t("common_loading")}
                    </ParagraphBody>
                  </Box>
                ) : contestState.contests.contests && contestState.contests.contests.length > 0 ? (
                  contestState.contests.contests.map((item, index) => (
                    <Grid item xs={12} key={index.toString()}>
                      <ContestContentCard
                        name={item.name}
                        avtImage={item.thumbnailUrl}
                        contestId={item.contestId}
                        startTime={item.startTime}
                        endTime={item.endTime}
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
                    <ParagraphBody translate-key='contest_no_contests_found_message'>
                      {t("contest_no_contests_found_message")}
                    </ParagraphBody>
                  </Box>
                )}
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <CustomPagination
                    count={contestState.contests.totalPages}
                    page={pageNo}
                    handlePageChange={handlePageChange}
                    showFirstButton
                    showLastButton
                    size={"large"}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContestList;
