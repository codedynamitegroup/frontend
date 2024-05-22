import classes from "./styles.module.scss";
import { Box, Grid, Paper } from "@mui/material";
import Heading6 from "components/text/Heading6";
import Heading4 from "components/text/Heading4";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { useEffect, useState } from "react";
import i18next from "i18next";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import moment from "moment";
import TextTitle from "components/text/TextTitle";
import { ClockIcon } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import { millisToFormatTimeString } from "utils/time";

interface PropsData {
  name: string;
  startTime: string;
  endTime: string;
  avtImage: any;
  contestId: string;
}

const TrendingContestCard = ({ name, startTime, avtImage, contestId, endTime }: PropsData) => {
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate(routes.user.contest.detail.replace(":contestId", contestId.toString()));
  };

  // Count down base on start time if start time is not exceed current time
  const [countdown, setCountdown] = useState(
    moment(startTime).diff(moment().utc(), "milliseconds")
  );

  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) {
          return prev - 1000;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Paper className={classes.container} onClick={clickHandler}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ position: "relative" }}>
            {countdown > 0 ? (
              <ParagraphBody
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  color: "var(--white)"
                }}
                translate-key='common_starts_in'
              >
                {t("common_starts_in")} {millisToFormatTimeString(countdown, currentLang)}
              </ParagraphBody>
            ) : endTime && moment().utc().isAfter(endTime) ? (
              <ParagraphBody
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  color: "var(--white)"
                }}
                translate-key='common_ended'
              >
                {t("common_ended")}
              </ParagraphBody>
            ) : (
              <ParagraphBody
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  color: "var(--white)"
                }}
                translate-key='common_in_progress'
              >
                {t("common_in_progress")}
              </ParagraphBody>
            )}
            <Paper
              sx={{
                width: "100%",
                height: "200px",
                borderEndStartRadius: 0,
                borderEndEndRadius: 0,
                background: `url(${avtImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          </Box>
        </Grid>
        <Grid item className={classes.contestDetail}>
          <Box sx={{ marginLeft: "10px" }}>
            <Heading4 sx={{ color: "inherit" }}>{name}</Heading4>
            {endTime && moment().utc().isAfter(endTime) ? (
              <>
                <ClockIcon fontSize='small' sx={{ color: "var(--gray-80)" }} />
                <TextTitle margin='10px 5px 10px 5px'>{t("common_ended")}</TextTitle>
                <Heading6 colorname={"--gray-80"} fontWeight={300}>
                  {standardlizeUTCStringToLocaleString(endTime, currentLang)}
                </Heading6>
              </>
            ) : (
              <Heading6 colorname={"--gray-80"} fontWeight={300}>
                {standardlizeUTCStringToLocaleString(startTime, currentLang)}
              </Heading6>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TrendingContestCard;
