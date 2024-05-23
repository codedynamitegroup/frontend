import { Box, Typography } from "@mui/material";
import InfoTooltip from "components/common/infoTooltip";
import classes from "./styles.module.scss";

interface PropsData {
  title: string;
  titleRequired?: boolean;
  tooltipDescription?: string;

  fontSize?: string;
  margin?: string;
}

const TitleWithInfoTip = (props: PropsData) => {
  const { title, titleRequired, tooltipDescription, fontSize, margin } = props;

  return (
    <Box className={classes.titleContainer}>
      <Typography className={classes.generalDescription}>
        {title} {titleRequired && <span className={classes.errorStar}>*</span>}
      </Typography>
      {tooltipDescription && (
        <InfoTooltip
          tooltipDescription={tooltipDescription}
          fontSize={fontSize || "13px"}
          margin={margin || "0 0 0 5px"}
        />
      )}
    </Box>
  );
};

export default TitleWithInfoTip;
