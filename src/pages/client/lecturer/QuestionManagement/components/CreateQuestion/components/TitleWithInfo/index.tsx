import { Box, Typography } from "@mui/material";
import InfoTooltip from "components/common/infoTooltip";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface PropsData {
  title: string;
  titleRequired?: boolean;
  tooltipDescription?: string;
  optional?: boolean;

  fontSize?: string;
  margin?: string;
  fontWeight?: string;
  color?: string;
}

const TitleWithInfoTip = (props: PropsData) => {
  const {
    optional,
    title,
    titleRequired,
    tooltipDescription,
    fontSize,
    margin,
    fontWeight,
    color
  } = props;
  const { t } = useTranslation();

  return (
    <Box className={classes.titleContainer}>
      <Typography
        className={classes.generalDescription}
        sx={{
          fontWeight: fontWeight || "500px",
          color: color || "#162130bf",
          fontSize: fontSize || ".8rem"
        }}
      >
        {title} {titleRequired && <span className={classes.errorStar}>*</span>}{" "}
        {optional && (
          <span className={classes.optionalText}>{`(${t("grading_config_optional")})`}</span>
        )}
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
