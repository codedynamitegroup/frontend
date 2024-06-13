import { Box, Chip, Grid, Paper, Stack } from "@mui/material";
import Heading3 from "components/text/Heading3";
import Heading6 from "components/text/Heading6";
import i18next from "i18next";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import classes from "./styles.module.scss";
import { ClockIcon } from "@mui/x-date-pickers";
import TextTitle from "components/text/TextTitle";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface PropsData {
  name: string;
  avtImage: any;
  contestId: string;
  startTime: string;
  endTime: string;
}
const ContestContentCard = ({ name, avtImage, contestId, startTime, endTime }: PropsData) => {
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate(routes.user.contest.detail.information.replace(":contestId", contestId.toString()));
  };
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const contestStatusChipLabel = useMemo(() => {
    if (startTime && moment().utc().isBefore(startTime)) {
      return (
        <Chip
          size='small'
          sx={{ color: "var(--blue-2)", borderColor: "var(--blue-2)" }}
          label={t("common_upcoming")}
          variant='outlined'
        />
      );
    } else if (endTime && moment().utc().isAfter(endTime)) {
      return (
        <Chip
          size='small'
          sx={{ color: "var(--red-hard)", borderColor: "var(--red-hard)" }}
          label={t("common_ended")}
          variant='outlined'
        />
      );
    } else {
      return (
        <Chip
          size='small'
          sx={{ color: "var(--green-500)", borderColor: "var(--green-500)" }}
          label={t("common_in_progress")}
          variant='outlined'
        />
      );
    }
  }, [startTime, endTime, t]);

  return (
    <Paper className={classes.container} onClick={clickHandler}>
      <Grid container alignItems='center' spacing={1}>
        <Grid item xs={10}>
          <Box className={classes.contestInfo}>
            <Grid container>
              <Grid item xs={12}>
                <Stack className={classes.contestTypeContainer} direction='row' spacing={0.5}>
                  {contestStatusChipLabel}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Heading3 sx={{ color: "inherit" }}>{name}</Heading3>
              </Grid>
              <Grid item xs={12}>
                <Stack direction={"row"} alignItems={"center"}>
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
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <img src={avtImage} alt='Contest' className={classes.contestImage} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContestContentCard;
