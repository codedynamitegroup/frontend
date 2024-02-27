import React from "react";
import classes from "./styles.module.scss";
import { Box, Divider, Grid, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import Heading6 from "components/text/Heading6";
import TrendingContestCard from "./components/TrendingContestCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SearchBar from "components/common/search/SearchBar";
import Button, { BtnType } from "components/common/buttons/Button";
import Header from "components/Header";
import ContestContentCard from "./components/ContestContentCard";
import Heading5 from "components/text/Heading5";
import Heading4 from "components/text/Heading4";
import ContestFilter from "./components/ContestFilter";

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
  const IMG_URL = "https://picsum.photos/1960/400";

  return (
    <Box className={classes.container}>
      <Header />
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} xl={12} lg={12}>
          <Box
            sx={{
              backgroundImage: `url(${IMG_URL})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%"
            }}
            className={classes.detailContainer}
          >
            <Grid container spacing={2} justifyContent='center'>
              <Grid item md={10} lg={7}>
                <Box>
                  <Heading1>LẬP TRÌNH THI ĐẤU</Heading1>
                </Box>
              </Grid>
              <Grid item md={10} lg={7} className={classes.generalDetailsContainer}>
                <Box>
                  <Heading3>926</Heading3>
                  <Heading6>CUỘC THI</Heading6>
                </Box>
                <Box>
                  <Heading3>300.000</Heading3>
                  <Heading6>THÍ SINH THAM GIA</Heading6>
                </Box>
              </Grid>
              <Grid item md={10} lg={7}>
                <Box className={classes.carouselContainer}>
                  {/* <Carousel
                    autoPlaySpeed={10000}
                    responsive={responsive}
                    autoPlay={true}
                    className={classes.carousel}
                    keyBoardControl={true}
                    showDots={true}
                    partialVisbile={true}
                  >
                    <TrendingContestCard num={1} />
                    <TrendingContestCard num={2} />
                    <TrendingContestCard num={3} />
                    <TrendingContestCard num={4} />
                    <TrendingContestCard num={5} />
                  </Carousel> */}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={12} xl={12} lg={12} className={classes.contestListContainer}>
          <Grid container justifyContent={"center"} spacing={1}>
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
                      <ContestFilter />
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
