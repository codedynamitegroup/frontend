import { Box } from "@mui/material";
import InfoTooltip from "components/common/infoTooltip";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import TextTitle from "../TextTitle";

interface PropsData {
  title: string;
  titleRequired?: boolean;
  tooltipDescription?: string;
  optional?: boolean;

  fontSize?: string;
  margin?: string;
  fontWeight?: string;
  color?: string;
  gutterBottom?: boolean;
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
    color,
    gutterBottom
  } = props;
  const { t } = useTranslation();

  return (
    <Box className={classes.titleContainer}>
      <TextTitle
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        sx={{
          marginBottom: gutterBottom ? "3px" : "0"
        }}
      >
        {title} {titleRequired && <span className={classes.errorStar}>*</span>}{" "}
        {optional && (
          <span className={classes.optionalText}>{`(${t("grading_config_optional")})`}</span>
        )}
      </TextTitle>
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
