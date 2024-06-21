import { Box, Paper } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import classes from "./styles.module.scss";

interface PropsData {
  time: number;
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
        <ParagraphBody textAlign={"center"} colorname='--white' fontSize={"14px"} fontWeight='500'>
          {time}
        </ParagraphBody>
      </Paper>
      <ParagraphBody textAlign={"center"} fontWeight='500'>
        {type}
      </ParagraphBody>
    </Box>
  );
};

export default ContestTimeDisplay;
