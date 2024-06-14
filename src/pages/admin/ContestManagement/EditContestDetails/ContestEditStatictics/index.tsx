import { Card, Grid, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import Heading4 from "components/text/Heading4";
import DasbboradBoxComponent from "pages/admin/Dashboard/DashboardBoxComponent";
import images from "config/images";
import { BarChart } from "@mui/x-charts/BarChart";
import ChartLengend from "pages/admin/Dashboard/ChartLegend";
import Heading5 from "components/text/Heading5";

const ContestEditStatistics = ({
  data
}: {
  data: {
    numOfSignUps: number;
    numOfParticipantsHavingSubmissions: number;
    contestQuestions: any[];
  } | null;
}) => {
  const { t } = useTranslation();

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
              =
              <Skeleton
                variant='rectangular'
                width='100%'
                height='100px'
                sx={{ borderRadius: "10px" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              =
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
              title={"Sign Ups"}
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
              title={"Users Submitted"}
              value={data.numOfParticipantsHavingSubmissions}
              mainColor={"#dc3545"}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12} lg={12}>
            <Heading5>Problems Success Rates</Heading5>
            <Card
              color='neutral'
              variant='outlined'
              sx={{
                height: "400px",
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
                  xAxis={[{ scaleType: "band", data: [] }]}
                  series={[]}
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
                  yAxis={[
                    {
                      scaleType: "linear",
                      disableTicks: true // hide ticks
                    }
                  ]}
                  margin={{
                    left: 30,
                    right: 20,
                    top: 40,
                    bottom: 30
                  }}
                  slotProps={{
                    legend: {
                      hidden: true
                    }
                  }}
                />
                <Stack direction='row' spacing={2}>
                  <ChartLengend label={"Question 1"} color={"#66BB6A"} />
                  <ChartLengend label={"Question 2"} color={"#42A5F5"} />
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
