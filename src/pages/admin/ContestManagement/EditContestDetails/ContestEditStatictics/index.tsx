import { Box, Card, Grid, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import Heading4 from "components/text/Heading4";
import DasbboradBoxComponent from "pages/admin/Dashboard/DashboardBoxComponent";
import images from "config/images";
import { BarChart } from "@mui/x-charts/BarChart";
import ChartLengend from "pages/admin/Dashboard/ChartLegend";
import Heading5 from "components/text/Heading5";
import { ContestQuestionEntity } from "models/coreService/entity/ContestQuestionEntity";
import { useMemo } from "react";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import JoyButton from "@mui/joy/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const valueFormatter = (value: number | null) => `${value}%`;

const ContestEditStatistics = ({
  data
}: {
  data: {
    numOfSignUps: number;
    numOfParticipantsHavingSubmissions: number;
    contestQuestions: ContestQuestionEntity[];
  } | null;
}) => {
  const { t } = useTranslation();

  const calculateSuccessRate = useMemo(
    () => (numOfCorrectSubmissions: number, numOfSubmissions: number) => {
      if (numOfSubmissions === 0) return 0;
      return (numOfCorrectSubmissions / numOfSubmissions) * 100;
    },
    []
  );

  const xAxisData = useMemo(() => {
    return data?.contestQuestions.map((question, index) => `Problem ${index + 1}`);
  }, [data]);

  const seriesData = useMemo(() => {
    return data?.contestQuestions.map((question) => {
      return calculateSuccessRate(
        question.numOfCorrectSubmissions || 0,
        question.numOfSubmissions || 0
      );
    });
  }, [data, calculateSuccessRate]);

  const colorBars = useMemo(() => {
    if (!data) return [];
    return data?.contestQuestions.map((question) => {
      return generateHSLColorByRandomText(`${question.questionId}${question.name}`);
    });
  }, [data]);

  if (!data) {
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
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <Skeleton
                variant='rectangular'
                width='100%'
                height='100px'
                sx={{ borderRadius: "10px" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <Skeleton
                variant='rectangular'
                width='100%'
                height='100px'
                sx={{ borderRadius: "10px" }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
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
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <DasbboradBoxComponent
              icon={
                <img src={images.admin.totalUser} alt='online user' style={{ width: "35px" }} />
              }
              title={t("common_signups").toUpperCase()}
              value={data.numOfSignUps}
              mainColor={"#28a745"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <DasbboradBoxComponent
              icon={
                <img
                  src={images.admin.loginTodayUser}
                  alt='online user'
                  style={{ width: "35px" }}
                />
              }
              title={t("common_users_submitted").toUpperCase()}
              value={data.numOfParticipantsHavingSubmissions}
              mainColor={"#dc3545"}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12} lg={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Heading5 translate-key='contest_details_problems_success_rates'>
                {t("contest_details_problems_success_rates")}
              </Heading5>
              <JoyButton
                onClick={() => {}}
                endDecorator={
                  <ArrowForwardIosIcon
                    sx={{
                      width: "17px"
                    }}
                  />
                }
                translate-key='contest_details_view_all_submissions'
              >
                {t("contest_details_view_all_submissions")}
              </JoyButton>
            </Box>
            <Card
              color='neutral'
              variant='outlined'
              sx={{
                marginTop: "10px",
                height: "500px",
                display: "flex",
                justifyContent: "center",
                boxShadow: "lg",
                paddingBottom: "10px"
              }}
            >
              <Stack direction='column' spacing={1} alignItems='center' sx={{ width: "100%" }}>
                <BarChart
                  borderRadius={10}
                  colors={["#42A5F5", "#66BB6A"]}
                  height={320}
                  width={900}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: xAxisData,
                      colorMap: {
                        type: "ordinal",
                        values: xAxisData,
                        colors: colorBars
                      }
                    }
                  ]}
                  series={[{ data: seriesData, valueFormatter, label: "Success Rate (%)" }]}
                  sx={{
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                      stroke: "var(--gray-40)",
                      strokeWidth: 0.4
                    },
                    "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                      stroke: "white",
                      strokeWidth: 0.4
                    },
                    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                      strokeWidth: "0.4",
                      fill: "var(--gray-40)",
                      fontSize: 12,
                      fontFamily: "Roboto"
                    },
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                      strokeWidth: "0.4",
                      fill: "var(--gray-40)",
                      fontSize: 12,
                      fontFamily: "Roboto"
                    },
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tick": {
                      strokeWidth: "1",
                      stroke: "var(--gray-40)",
                      fontSize: 12,
                      fontFamily: "Roboto"
                    }
                  }}
                  grid={{ horizontal: true }}
                  margin={{
                    top: 40,
                    bottom: 30
                  }}
                  slotProps={{
                    legend: {
                      hidden: true
                    }
                  }}
                />
                <Stack direction='column' spacing={2}>
                  {data.contestQuestions.map((question, index) => (
                    <ChartLengend
                      key={index}
                      label={`Problem ${index + 1}: ${question.name}`}
                      color={generateHSLColorByRandomText(`${question.questionId}${question.name}`)}
                    />
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContestEditStatistics;
