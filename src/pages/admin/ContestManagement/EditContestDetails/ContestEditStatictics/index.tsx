import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import Heading4 from "components/text/Heading4";

const ContestEditStatistics = () => {
  const { t } = useTranslation();
  return (
    <Grid
      container
      gap={2}
      direction='column'
      className={classes.container}
      sx={{
        margin: "0px 20px 20px 20px",
        width: "calc(100% - 40px)",
        minHeight: "600px"
      }}
    >
      <Grid item xs={12}>
        <Heading4 translate-key='common_statistics'>{t("common_statistics")}</Heading4>
      </Grid>
    </Grid>
  );
};

export default ContestEditStatistics;
