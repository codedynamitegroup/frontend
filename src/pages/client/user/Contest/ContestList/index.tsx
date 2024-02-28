import React from "react";
import classes from "./styles.module.scss";
import {
  Box,
  Card,
  Divider,
  Grid,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import TrendingContestCard from "./components/TrendingContestCard";
import "react-multi-carousel/lib/styles.css";
import SearchBar from "components/common/search/SearchBar";
import Header from "components/Header";
import ContestContentCard from "./components/ContestContentCard";
import ContestFilter from "./components/ContestFilter";
import images from "config/images";
import Carousel from "react-material-ui-carousel";

const filterObject = {
  difficulty: {
    root: "Độ khó",
    object: ["Sơ cấp", "Trung cấp", "Cao cấp"]
  },
  language: {
    root: "Ngôn ngữ lập trình",
    object: ["C++", "Java", "Python", "C#", "Javascript", "Ruby", "PHP"]
  }
};

const trendingItem = [
  { name: "FPT Tech day", startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7" },
  { name: "Sasuke code war", startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7" },
  { name: "Code challenger 2024", startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7" },
  { name: "Batch the code", startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7" },
  { name: "Batch the code", startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7" },
  { name: "Batch the code", startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7" },
  { name: "Batch the code", startDate: "Chủ nhật 27/02/2024 9:30 AM GMT+7" }
];

const ContestList = () => {
  const sliderItems: number = trendingItem.length > 4 ? 4 : trendingItem.length;
  const items: Array<any> = [];
  for (let i = 0; i < trendingItem.length; i += sliderItems) {
    if (i % sliderItems === 0) {
      items.push(
        <Card
          sx={{ backgroundColor: "rgba(0,0,0,0)" }}
          raised
          className='Banner'
          key={i.toString()}
        >
          <Grid container spacing={0} className='BannerGrid'>
            {trendingItem.slice(i, i + sliderItems).map((da, index) => {
              return (
                <TrendingContestCard
                  key={index.toString()}
                  name={da.name}
                  startDate={da.startDate}
                />
              );
            })}
          </Grid>
        </Card>
      );
    }
  }

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

  return (
    <Box className={classes.container}>
      <Header />
      <Grid container spacing={10}>
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
                  >
                    LẬP TRÌNH THI ĐẤU
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
                  >
                    CUỘC THI
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
                  >
                    THÍ SINH THAM GIA
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={10} lg={8}>
                <Carousel
                  NextIcon={null}
                  PrevIcon={null}
                  activeIndicatorIconButtonProps={{
                    style: {
                      backgroundColor: "white" // 2
                    }
                  }}
                  indicatorContainerProps={{
                    style: {
                      marginTop: "10px", // 5
                      marginBottom: "30px",
                      marginRight: "10px"
                    }
                  }}
                >
                  {items}
                </Carousel>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={12} xl={12} lg={12} className={classes.contestListContainer}>
          <Grid container justifyContent={"center"} spacing={4}>
            <Grid item xs={12} md={10} lg={8}>
              <Typography
                color={"#2a2a2a"}
                fontFamily={"BarlowCondensed,sans-serif"}
                fontSize={"48px"}
                fontWeight={500}
                letterSpacing={".3px"}
                lineHeight={"50px"}
              >
                Danh sách cuộc thi
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={10} lg={8}>
              <SearchBar onSearchClick={onSearchClick} />
            </Grid>
            <Grid item xs={12} md={10} lg={8}>
              <Grid container spacing={2}>
                <Grid item sm={12} xs={12} md={12} lg={9}>
                  <Paper sx={{ padding: "10px" }}>
                    <Grid container spacing={2} alignItems={"flex-start"}>
                      <Grid item sm={12} xs={12} md={12} lg={8}>
                        <Box className={classes.contestListButtonGroup}>
                          <ToggleButtonGroup {...control}>
                            <ToggleButton
                              key='happening'
                              value='happening'
                              className={classes.listStateButton}
                            >
                              Đang diễn ra
                            </ToggleButton>
                            <ToggleButton key='ended' value='ended'>
                              Đã kết thúc
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Box>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <ContestContentCard
                          name='Sasuke war 11'
                          description='The weekly coding contest for people who love programming on CodeLearn'
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ContestContentCard
                          name='Batch the code'
                          description='Thử thách thi vui thưởng thật dành cho các bạn trẻ đam mê công nghệ, thích khám phá và làm chủ ngôn ngữ số.'
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ContestContentCard
                          name='FPT Tech day'
                          description='Bảng thi giành cho mọi đối tượng đam mê lập trình, yêu thích công nghệ
Đăng ký tham gia vui lòng truy cập: https://techday2021.fpt.com.vn/vi/code-war'
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ContestContentCard
                          name='CSS 11'
                          description='Nurture Your Software DNA_Mini code challenge'
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item sm={12} xs={12} md={12} lg={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} />

                    <Grid item xs={12}>
                      <ContestFilter filterObject={filterObject} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContestList;
