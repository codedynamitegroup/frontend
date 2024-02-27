import React from "react";
import classes from "./styles.module.scss";
import { Box, Button, ButtonBase, Grid, Paper } from "@mui/material";
import Heading1 from "components/text/Heading1";
import Heading6 from "components/text/Heading6";
import Heading4 from "components/text/Heading4";
interface PropsData {
  num: number;
}
const TrendingContestCard = (prop: PropsData) => {
  const { num } = prop;
  const IMG_URL = "https://picsum.photos/400/300";
  return (
    <Paper className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper
            className={classes.imageContainer}
            sx={{
              backgroundImage: `url(${IMG_URL})`,
              backgroundRepeat: "no-repeat"
            }}
          >
            <Button variant='contained'>{num}</Button>
          </Paper>
        </Grid>
        <Grid item className={classes.contestDetail}>
          <Heading4>Tên cuộc thi</Heading4>
          <Heading6>Chủ nhật 27/02/2024 9:30 AM GMT+7</Heading6>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TrendingContestCard;
