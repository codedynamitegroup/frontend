import React, { useRef } from "react";
import classes from "./styles.module.scss";
import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import TrendingContestCard from "./components/TrendingContestCard";
import SearchBar from "components/common/search/SearchBar";
import Header from "components/Header";
import ContestContentCard from "./components/ContestContentCard";
import ContestFilter from "./components/ContestFilter";
import images from "config/images";
import useBoxDimensions from "hooks/useBoxDimensions";
import Footer from "components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/scss/pagination";
import "swiper/scss/scrollbar";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const filterObject = ["C++", "Java", "Python", "C#", "Javascript", "Ruby", "PHP"];

const trendingItem = [
  {
    name: "FPT Tech day",
    startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7",
    image: images.temp.contest.tempContest1,
    contestId: 1
  },
  {
    name: "Sasuke code war",
    startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7",
    image: images.temp.contest.tempContest2,
    contestId: 2
  },
  {
    name: "Code challenger 2024",
    startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7",
    image: images.temp.contest.tempContest3,
    contestId: 3
  },
  {
    name: "Batch the code",
    startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7",
    image: images.temp.contest.tempContest4,
    contestId: 1
  },
  {
    name: "Hesang Biweekly",
    startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7",
    image: images.temp.contest.tempContest5,
    contestId: 2
  }
];

const ContestList = () => {
  const onSearchClick = () => {};
  const [contestListButtonGroup, setContestListButtonGroup] = React.useState("happening");

  const handleButtonGroupChange = (
    event: React.MouseEvent<HTMLElement>,
    newContestState: string
  ) => {
    setContestListButtonGroup(newContestState);
  };
  const control = {
    value: contestListButtonGroup,
    onChange: handleButtonGroupChange,
    exclusive: true
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });
  const { t } = useTranslation();

  return (
    <Box className={classes.root}>
      <Header ref={headerRef} />
      <Grid
        container
        style={{ marginTop: `${headerHeight}px`, gap: "40px", marginBottom: "40px" }}
        justifyContent={"center"}
      >
        <Grid item xs={12} md={12} xl={12} lg={12}>
          <Box
            sx={{
              backgroundImage: `url(${images.background.contestListBackground})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%"
            }}
            className={classes.detailContainer}
          >
            <Grid container spacing={1} justifyContent='center'>
              <Grid item xs={12} md={10} lg={8}>
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
              <Grid item md={10} lg={8} className={classes.generalDetailsContainer}>
                <Box>
                  <Typography
                    fontFamily={"BarlowCondensed, sans-serif"}
                    fontWeight={500}
                    fontSize={"34px"}
                    lineHeight={"38px"}
                    color={"var(--white)"}
                  >
                    926
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
                    300.000
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
              <Grid item xs={12} md={10} lg={8}>
                <Swiper
                  spaceBetween={10}
                  slidesPerView={4}
                  modules={[Autoplay, Pagination]}
                  autoplay={{ delay: 5000 }}
                  pagination={{ el: ".swiper-pagination", type: "bullets", clickable: true }}
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={(swiper: any) => console.log(swiper)}
                >
                  {trendingItem.map((item, index) => (
                    <SwiperSlide>
                      <TrendingContestCard
                        key={index.toString()}
                        name={item.name}
                        startDate={item.startDate}
                        avtImage={item.image}
                        contestId={item.contestId}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={10} lg={8} className={classes.contestListContainer}>
          <Grid container spacing={7}>
            <Grid item sm={12} xs={12} md={12} lg={3}>
              <Grid container spacing={1}>
                <Grid item xs={12} />
                <Grid item xs={12}>
                  <ContestFilter filterObject={filterObject} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} xs={12} md={12} lg={9}>
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
                  <SearchBar onSearchClick={onSearchClick} />
                </Grid>
                <Grid item xs={12} md={10} lg={8}>
                  <Box className={classes.contestListButtonGroup}>
                    <ToggleButtonGroup {...control}>
                      <ToggleButton
                        key='happening'
                        value='happening'
                        className={classes.listStateButton}
                        translation-key='contest_happening_button'
                      >
                        {t("contest_happening_button")}
                      </ToggleButton>
                      <ToggleButton
                        key='ended'
                        value='ended'
                        translation-key='contest_ended_button'
                      >
                        {t("contest_ended_button")}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Grid>
              </Grid>
              <Box marginTop={"15px"}>
                <Grid container spacing={2} alignItems={"flex-start"}>
                  <Grid item xs={12}>
                    <ContestContentCard
                      name='Sasuke war 11'
                      description='The weekly coding contest for people who love programming on CodeLearn'
                      avtImage={images.temp.contest.tempContest1}
                      contestId={1}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ContestContentCard
                      name='Batch the code'
                      description='Thử thách thi vui thưởng thật dành cho các bạn trẻ đam mê công nghệ, thích khám phá và làm chủ ngôn ngữ số.'
                      avtImage={images.temp.contest.tempContest2}
                      contestId={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ContestContentCard
                      name='FPT Tech day'
                      description='Bảng thi giành cho mọi đối tượng đam mê lập trình, yêu thích công nghệ
Đăng ký tham gia vui lòng truy cập: https://techday2021.fpt.com.vn/vi/code-war'
                      avtImage={images.temp.contest.tempContest3}
                      contestId={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ContestContentCard
                      name='CSS 11'
                      description='Nurture Your Software DNA_Mini code challenge'
                      avtImage={images.temp.contest.tempContest4}
                      contestId={1}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default ContestList;
