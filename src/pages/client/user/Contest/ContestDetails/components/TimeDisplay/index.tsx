import classes from "./styles.module.scss";
import { Box, Paper, Typography } from "@mui/material";
import images from "config/images";

interface PropsData {
  time: number | string;
  type: string;
}
const ContestTimeDisplay = (props: PropsData) => {
  const { time, type } = props;
  const backgroundImage = images.contestTimeBackground;

  return (
    <Box className={classes.container}>
      <Paper
        className={classes.timeNumberContainer}
        sx={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Typography textAlign={"center"} color='white' fontSize={"14px"} fontWeight=''>
          {time}
        </Typography>
      </Paper>
      <Typography textAlign={"center"}>{type}</Typography>
    </Box>
  );
};

export default ContestTimeDisplay;
