import { Grid, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import DasbboradBoxComponent from "./DashboardBoxComponent";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import { useTranslation } from "react-i18next";
import Heading3 from "components/text/Heading3";
import { Button, Card } from "@mui/joy";
import { UserService } from "services/authService/UserService";
import Heading6 from "components/text/Heading6";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart, areaElementClasses, useDrawingArea, useYScale } from "@mui/x-charts";
import ParagraphBody from "components/text/ParagraphBody";
import ChartLengend from "./ChartLegend";
import images from "config/images";
import { ScaleLinear } from "d3";
import useAuth from "hooks/useAuth";
import { set } from "date-fns";

interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  offlineUsers: number;
  loginToday: number;
  registerUser: { data: number[]; label: string; area: boolean }[];
  userByRole: { index: number; value: number; label: string }[];
}
const ROLE_PIE_CHART_COLORS = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"];
const startGradientColor = "#1abc9c";
const endGradientColor = "#16a085";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [mainSkeleton, setMainSkeleton] = useState(true);
  const [dashboardTabValue, setDashboardTabValue] = useState(0);
  const [userRegisterChartRangeButtonState, setUserRegisterChartRangeButtonState] = useState(0);
  const tempDate = new Date();
  const tempMonth = tempDate.getMonth();
  const tempYear = tempDate.getFullYear();
  const [userStatistics, setUserStatistics] = useState<UserStatistics>({
    totalUsers: 0,
    activeUsers: 0,
    offlineUsers: 0,
    loginToday: 0,
    registerUser: [],
    userByRole: []
  });

  const [daysInMonth, setDaysInMonth] = useState(new Date(tempYear, tempMonth + 1, 0).getDate());

  const tabLabels = [
    t("User"),
    t("Course"),
    t("Organization"),
    t("Contest"),
    t("Practice"),
    t("Certificate course")
  ];

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayInMonthList =
    daysInMonth === 31
      ? [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31"
        ]
      : [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30"
        ];

  const monthInYearList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const ROLE_NAMES = ["User", "Admin", "Student Course", "Lecturer", "Admin course"];

  const getUserStatistics = async () => {
    try {
      const response = await UserService.getUserStatistics();
      setUserStatistics((prevStats) => ({
        ...response,
        registerUser: response.registerUser.map((user: any) => ({ ...user, area: true }))
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserStatistics();
    };
    fetchData();

    setMainSkeleton(false);
  }, []);

  useEffect(() => {
    console.log(userStatistics);
  }, [userStatistics]);

  return (
    <>
      {mainSkeleton && (
        <Grid
          container
          spacing={2}
          sx={{
            padding: 3
          }}
        >
          <Grid item xs={12}>
            <Skeleton
              variant='text'
              sx={{
                fontSize: "1rem"
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Skeleton variant='text' height={50} />
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={5}>
            <Skeleton
              variant='text'
              sx={{
                fontSize: "1.5rem"
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant='rounded' height={100} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant='rounded' height={100} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant='rounded' height={100} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant='rounded' height={100} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Skeleton variant='rounded' height={400} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant='rounded' height={400} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {!mainSkeleton && (
        <Grid
          container
          spacing={2}
          sx={{
            padding: 3
          }}
        >
          <Grid item xs={12}>
            <Skeleton
              variant='text'
              sx={{
                fontSize: "1rem"
              }}
            />
          </Grid>

          {/* Dashboard tabs */}
          <Grid item xs={6}>
            <Tabs
              aria-label='tabs'
              defaultValue={dashboardTabValue}
              sx={{ bgcolor: "transparent" }}
              onChange={(e, value) => setDashboardTabValue(Number(value) || 0)}
            >
              <TabList
                disableUnderline
                sx={{
                  p: 0.5,
                  gap: 0.5,
                  borderRadius: "xl",
                  bgcolor: "background.level1",
                  [`& .${tabClasses.root}[aria-selected="true"]`]: {
                    boxShadow: "sm",
                    bgcolor: "background.surface"
                  }
                }}
              >
                {tabLabels.map((label, index) => (
                  <Tab key={index} disableIndicator>
                    {label}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <ParagraphBody>Hello, tien</ParagraphBody>
            </Card>
          </Grid>

          {dashboardTabValue === 0 && (
            <>
              <Grid item xs={5}>
                <Heading3>{"User"}</Heading3>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <img
                          src={images.admin.onlineUser}
                          alt='online user'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Active user"}
                      value={userStatistics.activeUsers}
                      mainColor={"#28a745"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <img
                          src={images.admin.offlineUser}
                          alt='online user'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Offline user"}
                      value={userStatistics.offlineUsers}
                      mainColor={"#dc3545"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <img
                          src={images.admin.totalUser}
                          alt='online user'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Total user"}
                      value={userStatistics.totalUsers}
                      mainColor={"#007bff"}
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
                      title={"Total login today"}
                      value={userStatistics.loginToday}
                      mainColor={"#ffc107"}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={8}>
                    <Heading6>User register</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      <Stack
                        display={"flex"}
                        justifyContent={"flex-end"}
                        direction={"row"}
                        spacing={2}
                      >
                        <Button
                          variant={userRegisterChartRangeButtonState === 0 ? "outlined" : "plain"}
                          onClick={() => {
                            if (userRegisterChartRangeButtonState === 0) return;
                            setUserRegisterChartRangeButtonState(0);
                          }}
                          size='sm'
                        >
                          Week
                        </Button>
                        <Button
                          variant={userRegisterChartRangeButtonState === 1 ? "outlined" : "plain"}
                          onClick={() => {
                            if (userRegisterChartRangeButtonState === 1) return;
                            setUserRegisterChartRangeButtonState(1);
                          }}
                          size='sm'
                        >
                          Month
                        </Button>
                        <Button
                          variant={userRegisterChartRangeButtonState === 2 ? "outlined" : "plain"}
                          onClick={() => {
                            if (userRegisterChartRangeButtonState === 2) return;
                            setUserRegisterChartRangeButtonState(2);
                          }}
                          size='sm'
                        >
                          Year
                        </Button>
                      </Stack>
                      <Stack
                        direction='column'
                        spacing={1}
                        alignItems='center'
                        sx={{ width: "100%" }}
                      >
                        <LineChart
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
                            },
                            [`& .${areaElementClasses.root}`]: {
                              fill: "url(#swich-color-id-1)"
                            }
                          }}
                          colors={[startGradientColor, endGradientColor]}
                          xAxis={[
                            {
                              scaleType: "point",
                              data:
                                userRegisterChartRangeButtonState === 0
                                  ? daysList
                                  : userRegisterChartRangeButtonState === 1
                                    ? dayInMonthList
                                    : monthInYearList
                            }
                          ]}
                          yAxis={[
                            {
                              scaleType: "linear",
                              disableTicks: true // hide ticks
                            }
                          ]}
                          series={
                            userStatistics.registerUser.length === 0
                              ? []
                              : userRegisterChartRangeButtonState === 0
                                ? [userStatistics.registerUser[0]]
                                : userRegisterChartRangeButtonState === 1
                                  ? [userStatistics.registerUser[1]]
                                  : [userStatistics.registerUser[2]]
                          }
                          height={320}
                          grid={{
                            horizontal: true
                          }}
                          // borderRadius={10}
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
                        >
                          <Colorswitch
                            color1='#11B678'
                            color2='#FF3143'
                            threshold={0}
                            id='swich-color-id-1'
                          />
                        </LineChart>
                        <ChartLengend label={"New user"} color={startGradientColor} />
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4}>
                    <Heading6>User role</Heading6>

                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px"
                      }}
                    >
                      <Stack
                        direction='column'
                        spacing={1}
                        alignItems='center'
                        sx={{ width: "100%" }}
                      >
                        <PieChart
                          colors={ROLE_PIE_CHART_COLORS}
                          series={[
                            {
                              data: userStatistics.userByRole,
                              innerRadius: 10,
                              cornerRadius: 10
                            }
                          ]}
                          height={300}
                          sx={{
                            maxWidth: "100%"
                          }}
                          margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                          }}
                          slotProps={{
                            legend: {
                              hidden: true
                            }
                          }}
                        />
                      </Stack>
                      <Grid container spacing={1} alignItems={"center"}>
                        {ROLE_NAMES.map((role, index) => (
                          <Grid item xs={4} key={index}>
                            <ChartLengend label={role} color={ROLE_PIE_CHART_COLORS[index]} />
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {dashboardTabValue === 1 && (
            <>
              <Grid item xs={5}>
                <Heading3>{"Course"}</Heading3>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <img
                          src={images.admin.course}
                          alt='Total course'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Total courses"}
                      value={0}
                      mainColor={"#3498db"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <img
                          src={images.admin.userEnrollment}
                          alt='Enrolled user'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Total Enrollments"}
                      value={0}
                      mainColor={"#2ecc71"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <img
                          src={images.admin.activeCourse}
                          alt='active course'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Active Courses"}
                      value={0}
                      mainColor={"#f39c12"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <img
                          src={images.admin.inactiveCourse}
                          alt='online user'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Inactive courses"}
                      value={0}
                      mainColor={"#e74c3c"}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={8}>
                    <Heading6>User register</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      <Stack
                        display={"flex"}
                        justifyContent={"flex-end"}
                        direction={"row"}
                        spacing={2}
                      >
                        {/* <Button
                          variant={isSevenDays ? "outlined" : "plain"}
                          onClick={() => {
                            if (isSevenDays) return;
                            setIsSevenDays(!isSevenDays);
                          }}
                          size='sm'
                        >
                          Week
                        </Button>
                        <Button
                          variant={!isSevenDays ? "outlined" : "plain"}
                          onClick={() => {
                            if (!isSevenDays) return;
                            setIsSevenDays(!isSevenDays);
                          }}
                          size='sm'
                        >
                          Year
                        </Button> */}
                      </Stack>
                      <Stack
                        direction='column'
                        spacing={1}
                        alignItems='center'
                        sx={{ width: "100%" }}
                      >
                        <LineChart
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
                            },
                            [`& .${areaElementClasses.root}`]: {
                              fill: "url(#swich-color-id-1)"
                            }
                          }}
                          colors={[startGradientColor, endGradientColor]}
                          xAxis={[
                            {
                              scaleType: "point"
                              // data: isSevenDays ? daysList : monthsList
                            }
                          ]}
                          yAxis={[
                            {
                              scaleType: "linear",
                              disableTicks: true // hide ticks
                            }
                          ]}
                          series={[]}
                          height={320}
                          grid={{
                            horizontal: true
                          }}
                          // borderRadius={10}
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
                        >
                          <Colorswitch
                            color1='#11B678'
                            color2='#FF3143'
                            threshold={0}
                            id='swich-color-id-1'
                          />
                        </LineChart>
                        <ChartLengend label={"New user"} color={startGradientColor} />
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4}>
                    <Heading6>User role</Heading6>

                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px"
                      }}
                    >
                      <Stack
                        direction='column'
                        spacing={1}
                        alignItems='center'
                        sx={{ width: "100%" }}
                      >
                        <PieChart
                          colors={ROLE_PIE_CHART_COLORS}
                          series={[
                            {
                              data: [],
                              innerRadius: 10,
                              cornerRadius: 10
                            }
                          ]}
                          height={300}
                          sx={{
                            maxWidth: "100%"
                          }}
                          margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                          }}
                          slotProps={{
                            legend: {
                              hidden: true
                            }
                          }}
                        />
                      </Stack>
                      <Grid container spacing={1} alignItems={"center"}>
                        {ROLE_NAMES.map((role, index) => (
                          <Grid item xs={4} key={index}>
                            <ChartLengend label={role} color={ROLE_PIE_CHART_COLORS[index]} />
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </>
  );
};

type ColorSwichProps = {
  threshold: number;
  color1: string;
  color2: string;
  id: string;
};

const Colorswitch = ({ threshold, id }: ColorSwichProps) => {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;

  const scale = useYScale() as ScaleLinear<number, number>; // You can provide the axis Id if you have multiple ones
  const y0 = scale(threshold); // The coordinate of of the origine
  const off = y0 !== undefined ? y0 / svgHeight : 0;

  return (
    <>
      <defs>
        <linearGradient
          id={id}
          x1='0'
          x2='0'
          y1='0'
          y2={`${svgHeight}px`}
          gradientUnits='userSpaceOnUse' // Use the SVG coordinate instead of the component ones.
        >
          <stop offset={off} stopColor={startGradientColor} stopOpacity={0.4} />
          <stop offset={off} stopColor={endGradientColor} stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
};

export default AdminDashboard;
