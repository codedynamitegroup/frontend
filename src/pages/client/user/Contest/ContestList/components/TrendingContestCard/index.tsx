import classes from "./styles.module.scss";
import { Box, Grid, Paper } from "@mui/material";
import Heading6 from "components/text/Heading6";
import Heading4 from "components/text/Heading4";
interface PropsData {
  name: string;
  startDate: string;
}
const TrendingContestCard = (props: PropsData) => {
  const { name, startDate } = props;
  const IMG_URL = "https://picsum.photos/300/300";
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
          ></Paper>
        </Grid>
        <Grid item className={classes.contestDetail}>
          <Box sx={{ marginLeft: "10px" }}>
            <Heading4>{name}</Heading4>
            <Heading6 colorName={"--gray-80"} fontWeight={100}>
              {startDate}
            </Heading6>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TrendingContestCard;
