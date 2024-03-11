import classes from "./styles.module.scss";
import { Box, Grid, Paper } from "@mui/material";
import Heading6 from "components/text/Heading6";
import Heading4 from "components/text/Heading4";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
interface PropsData {
  name: string;
  startDate: string;
  avtImage: any;
  contestId: number;
}
const TrendingContestCard = (props: PropsData) => {
  const { name, startDate, avtImage, contestId } = props;
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate(routes.user.contest.detail.replace(":contestId", contestId.toString()));
  };
  return (
    <Paper className={classes.container} onClick={clickHandler}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper
            className={classes.imageContainer}
            sx={{
              backgroundImage: `url(${avtImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%"
            }}
          ></Paper>
        </Grid>
        <Grid item className={classes.contestDetail}>
          <Box sx={{ marginLeft: "10px" }}>
            <Heading4 sx={{ color: "inherit" }}>{name}</Heading4>
            <Heading6 colorname={"--gray-80"} fontWeight={100}>
              {startDate}
            </Heading6>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TrendingContestCard;
