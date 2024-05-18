import { Box, Container, Grid, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import CustomPagination from "components/common/pagination/CustomPagination";
import AutoSearchBar from "components/common/search/AutoSearchBar";
import images from "config/images";
import i18next from "i18next";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { setContests, setMostPopularContests } from "reduxes/coreService/Contest";
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
import { routes } from "routes/routes";

const ContestList = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [contestListButtonGroup, setContestListButtonGroup] = React.useState("all");
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
    return contestListButtonGroup === "upcoming"
      ? ContestStartTimeFilterEnum.UPCOMING
      : contestListButtonGroup === "happening"
        ? ContestStartTimeFilterEnum.HAPPENING
        : contestListButtonGroup === "ended"
          ? ContestStartTimeFilterEnum.ENDED
          : ContestStartTimeFilterEnum.ALL;
  }, [contestListButtonGroup]);

  const searchHandle = useCallback((searchText: string) => {
    handleGetContests({
      searchName: searchText,
      startTimeFilter,
      pageNo: pageNo - 1,
      pageSize
    });
  }, []);

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
    setContestListButtonGroup(newContestState);
  };

  const { t } = useTranslation();

  const handleGetContests = async ({
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
    try {
      const getContestsResponse = await ContestService.getContests({
        searchName: searchName,
        startTimeFilter: startTimeFilter,
        pageNo: pageNo,
        pageSize: pageSize
      });
      dispatch(setContests(getContestsResponse));
    } catch (error: any) {
      console.error("Failed to fetch contests", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
    }
  };

  const handleGetMostPopularContests = async () => {
    try {
      const getMostPopularContestsResponse = await ContestService.getMostPopularContests();
      dispatch(setMostPopularContests(getMostPopularContestsResponse));
    } catch (error: any) {
      console.error("Failed to fetch most popular contests", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
    }
  };

  useEffect(() => {
    handleGetMostPopularContests();
    handleGetContests({
      pageNo: pageNo - 1,
      pageSize
    });
  }, []);

  useEffect(() => {
    handleGetContests({
      searchName: searchText,
      startTimeFilter,
      pageNo: pageNo - 1,
      pageSize
    });
  }, [contestListButtonGroup]);

  useEffect(() => {
    handleGetContests({
      searchName: searchText,
      startTimeFilter,
      pageNo: pageNo - 1,
      pageSize
    });
  }, [pageNo]);

  return (
    <>
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
                  <Typography
                    fontSize={"40px"}
                    fontFamily={"BarlowCondensed,sans-serif"}
                    fontWeight={600}
                    letterSpacing={".5px"}
                    lineHeight={"74px"}
                    textAlign={"left"}
                    color={"var(--white)"}
                    translation-key='contest_title'
                  >
                    {t("contest_title")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={12} lg={12} className={classes.generalDetailsContainer}>
                <Box>
                  <Typography
                    fontFamily={"BarlowCondensed, sans-serif"}
                    fontWeight={500}
                    fontSize={"34px"}
                    lineHeight={"38px"}
                    color={"var(--white)"}
                  >
                    {/* 926 */}
                    {standardlizeNumber(contestState.mostPopularContests.numOfContests)}
                  </Typography>
                  <Typography
                    lineHeight={"18px"}
                    fontWeight={700}
                    fontFamily={"Roboto, sans-serif"}
                    color={"var(--white)"}
                    translation-key='contest_total_num'
                  >
                    {t("contest_total_num")}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    fontFamily={"BarlowCondensed, sans-serif"}
                    fontWeight={500}
                    fontSize={"34px"}
                    lineHeight={"38px"}
                    color={"var(--white)"}
                  >
                    {/* 300.000 */}
                    {standardlizeNumber(contestState.mostPopularContests.numOfParticipants)}
                  </Typography>
                  <Typography
                    lineHeight={"18px"}
                    fontWeight={700}
                    fontFamily={"Roboto, sans-serif"}
                    color={"var(--white)"}
                    translation-key='common_participant'
                  >
                    {i18next.format(t("common_participant", { count: 2 }), "uppercase")}
                  </Typography>
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
          {/* <Grid item sm={12} xs={12} md={2.5} lg={2.5}>
            <Grid container>
              <Grid item xs={12} />
              <Grid item xs={12}>
                <ContestFilter filterObject={filterObject} />
              </Grid>
            </Grid>
          </Grid> */}
          {/* <Grid item xs={0.5}></Grid> */}
          <Grid item sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={10} lg={8}>
                <Typography
                  color={"#2a2a2a"}
                  fontFamily={"BarlowCondensed,sans-serif"}
                  fontSize={"48px"}
                  fontWeight={500}
                  letterSpacing={".3px"}
                  lineHeight={"50px"}
                  translation-key='contest_list_title'
                >
                  {t("contest_list_title")}
                </Typography>
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
                    value={contestListButtonGroup}
                    exclusive
                    onChange={handleButtonGroupChange}
                  >
                    <ToggleButton
                      key='all'
                      value='all'
                      className={classes.listStateButton}
                      translation-key='contest_all_button'
                    >
                      {t("contest_all_button")}
                    </ToggleButton>
                    <ToggleButton
                      key='upcoming'
                      value='upcoming'
                      className={classes.listStateButton}
                      translation-key='contest_upcoming_button'
                    >
                      {t("contest_upcoming_button")}
                    </ToggleButton>
                    <ToggleButton
                      key='happening'
                      value='happening'
                      className={classes.listStateButton}
                      translation-key='contest_happening_button'
                    >
                      {t("contest_happening_button")}
                    </ToggleButton>
                    <ToggleButton key='ended' value='ended' translation-key='contest_ended_button'>
                      {t("contest_ended_button")}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Grid>
            </Grid>
            <Box marginTop={"15px"}>
              <Grid container spacing={2} alignItems={"flex-start"}>
                {contestState.contests.contests.map((item, index) => (
                  <Grid item xs={12} key={index.toString()}>
                    <ContestContentCard
                      name={item.name}
                      avtImage={item.thumbnailUrl}
                      contestId={item.contestId}
                      startTime={item.startTime}
                      endTime={item.endTime}
                    />
                  </Grid>
                ))}
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
    </>
  );
};

export default ContestList;
