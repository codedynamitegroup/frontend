import React from "react";
import classes from "./styles.module.scss";
import { Box, Divider, Grid, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import TrendingContestCard from "./components/TrendingContestCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SearchBar from "components/common/search/SearchBar";
import Header from "components/Header";
import ContestContentCard from "./components/ContestContentCard";
import ContestFilter from "./components/ContestFilter";
import images from "config/images";

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

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1700 },
    items: 3,
    partialVisibilityGutter: 40 // this is needed to tell the amount of px that should be visible.
  },
  tablet: {
    breakpoint: { max: 1700, min: 464 },
    items: 2,
    partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
  }
};

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

  return (
    <Box className={classes.container}>
      <Header />
      <Grid container spacing={10}>
        <Grid item xs={12} md={12} xl={12} lg={12}>
          <Box
            sx={{
              backgroundImage: `url(${images.contestListBackground})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%"
            }}
            className={classes.detailContainer}
          >
            <Grid container spacing={2} justifyContent='center'>
              <Grid item md={10} lg={7}>
                <Box>
                  <Typography
                    fontSize={"40px"}
                    fontFamily={"BarlowCondensed,sans-serif"}
                    fontWeight={600}
                    letterSpacing={".5px"}
                    lineHeight={"74px"}
                    textAlign={"left"}
                    color={"#2a2a2a"}
                  >
                    LẬP TRÌNH THI ĐẤU
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={10} lg={7} className={classes.generalDetailsContainer}>
                <Box>
                  <Typography
                    fontFamily={"BarlowCondensed, sans-serif"}
                    fontWeight={500}
                    fontSize={"34px"}
                    lineHeight={"38px"}
                    color={"#2a2a2a"}
                  >
                    926
                  </Typography>
                  <Typography
                    lineHeight={"18px"}
                    fontWeight={700}
                    fontFamily={"Roboto, sans-serif"}
                    color={"#2a2a2a"}
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
                    color={"#2a2a2a"}
                  >
                    300.000
                  </Typography>
                  <Typography
                    lineHeight={"18px"}
                    fontWeight={700}
                    fontFamily={"Roboto, sans-serif"}
                    color={"#2a2a2a"}
                  >
                    THÍ SINH THAM GIA
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={10} lg={7}>
                <Box className={classes.carouselContainer}>
                  <Carousel
                    autoPlaySpeed={5000}
                    responsive={responsive}
                    autoPlay={true}
                    className={classes.carousel}
                    keyBoardControl={true}
                    showDots={true}
                    partialVisbile={true}
                  >
                    <TrendingContestCard />
                    <TrendingContestCard />
                    <TrendingContestCard />
                    <TrendingContestCard />
                    <TrendingContestCard />
                  </Carousel>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={12} xl={12} lg={12} className={classes.contestListContainer}>
          <Grid container justifyContent={"center"} spacing={2}>
            <Grid item xs={12} md={10} lg={7}>
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
            <Grid item xs={12} md={10} lg={7}>
              <SearchBar onSearchClick={onSearchClick} />
            </Grid>
            <Grid item xs={12} md={10} lg={7}>
              <Grid container spacing={2}>
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

                <Grid item sm={12} xs={12} md={12} lg={8}>
                  <Grid container spacing={2} alignItems={"flex-start"}>
                    <Grid item xs={12}>
                      <ContestContentCard />
                    </Grid>
                    <Grid item xs={12}>
                      <ContestContentCard />
                    </Grid>
                    <Grid item xs={12}>
                      <ContestContentCard />
                    </Grid>
                    <Grid item xs={12}>
                      <ContestContentCard />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item sm={12} xs={12} md={12} lg={4}>
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
