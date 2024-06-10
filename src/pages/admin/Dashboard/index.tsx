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

const accessTokenExpTime = 15; // 15 minutes to Mil
const ROLE_LIST = ["user", "admin", "student_moodle", "lecturer_moodle", "admin_moodle"];
const ROLE_PIE_CHART_COLORS = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"];
const startGradientColor = "#1abc9c";
const endGradientColor = "#16a085";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [mainSkeleton, setMainSkeleton] = useState(true);
  const [dashboardTabValue, setDashboardTabValue] = useState(0);
  const [userList, setUserList] = useState([]);
  const [isSevenDays, setIsSevenDays] = useState(true);

  const tabLabels = [
    t("User"),
    t("Course"),
    t("Organization"),
    t("Contest"),
    t("Practice"),
    t("Certificate course")
  ];

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthsList = [
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

  const getAllUserHandler = async () => {
    try {
      const response = await UserService.getAllUser();
      console.log(response);
      setUserList(response.users);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateUserRegisterChart = (isSevenDays: boolean) => {
    if (userList.length === 0) return [{ data: [] }, { data: [] }]; // return empty data
    let filteredUserList = [];

    // week
    if (isSevenDays) {
      filteredUserList = userList.filter((user: any) => {
        const createdAt = new Date(user.createdAt);
        const currentDate = new Date();

        if (
          currentDate.getMonth() === createdAt.getMonth() &&
          currentDate.getDate() - createdAt.getDate() <= 7
        ) {
          return user;
        }

        return null; // Add a return statement at the end of the arrow function
      });
    } else {
      // year (aka months)
      filteredUserList = userList.filter((user: any) => {
        const createdAt = new Date(user.createdAt);
        const currentDate = new Date();

        if (createdAt.getFullYear() === currentDate.getFullYear()) {
          return user;
        }

        return null;
      });
    }

    // Create an array with 7 or 12 elements, each element is 0 for chart series
    const arraySize = isSevenDays ? 7 : 12;
    const registerData = new Array(arraySize).fill(0);

    filteredUserList.forEach((user: any) => {
      const createdAt = new Date(user.createdAt);
      let dayIndex = isSevenDays ? createdAt.getDay() : createdAt.getMonth();

      if (isSevenDays) dayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust Sunday to the end
      registerData[dayIndex]++;
    });

    return [
      {
        data: registerData,
        area: true,
        label: "New user"
      }
    ];
  };
  const calculateUserRole = () => {
    const roleData = new Array(ROLE_LIST.length).fill(0);

    userList.forEach((user: any) => {
      user.roles.forEach((role: any) => {
        roleData[ROLE_LIST.findIndex((value) => value === role.name)]++;
      });
    });

    const pieData = roleData.map((value, index) => {
      return { id: index, value, label: ROLE_NAMES[index] };
    });
    return pieData;
  };
  const calculateActiveUSer = () => {
    const activeUser = userList.filter((user: any) => {
      const lastLogin = new Date(user.lastLogin);
      const currentDate = new Date();
      const differenceInMinutes = (currentDate.getTime() - lastLogin.getTime()) / (1000 * 60);

      return differenceInMinutes <= accessTokenExpTime;
    });

    return activeUser.length;
  };
  const calculateLoginToday = () => {
    const loginToday = userList.filter((user: any) => {
      const lastLogin = new Date(user.lastLogin);
      const currentDate = new Date();
      return (
        currentDate.getDate() === lastLogin.getDate() &&
        currentDate.getMonth() === lastLogin.getMonth() &&
        currentDate.getFullYear() === lastLogin.getFullYear()
      );
    });

    return loginToday.length;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllUserHandler();
    };
    calculateUserRole();

    fetchData();

    setMainSkeleton(false);
  }, []);

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
              <ParagraphBody>Hello, {auth.loggedUser.lastName}</ParagraphBody>
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
                      value={calculateActiveUSer()}
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
                      value={userList.length - calculateActiveUSer()}
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
                      value={userList.length}
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
                      value={calculateLoginToday()}
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
                              data: isSevenDays ? daysList : monthsList
                            }
                          ]}
                          yAxis={[
                            {
                              scaleType: "linear",
                              disableTicks: true // hide ticks
                            }
                          ]}
                          series={calculateUserRegisterChart(isSevenDays)}
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
                              data: calculateUserRole(),
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
                      value={userList.length}
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
                      value={calculateLoginToday()}
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
                        <Button
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
                              data: isSevenDays ? daysList : monthsList
                            }
                          ]}
                          yAxis={[
                            {
                              scaleType: "linear",
                              disableTicks: true // hide ticks
                            }
                          ]}
                          series={calculateUserRegisterChart(isSevenDays)}
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
                              data: calculateUserRole(),
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
