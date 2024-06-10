import { Box, Grid, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import DasbboradBoxComponent from "./DashboardBoxComponent";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import { useTranslation } from "react-i18next";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Heading3 from "components/text/Heading3";
import { Button, Card } from "@mui/joy";
import { UserService } from "services/authService/UserService";
import Heading6 from "components/text/Heading6";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import * as React from "react";

const accessTokenExpTime = 15 * 60 * 1000; // 15 minutes

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [mainSkeleton, setMainSkeleton] = useState(false);
  const [dashboardTabValue, setDashboardTabValue] = useState(0);
  const [userList, setUserList] = useState([]);
  const [isSevenDays, setIsSevenDays] = useState(true);

  const tabLabels = [
    t("common_general"),
    t("common_user_organization"),
    t("common_course"),
    t("common_certificate"),
    t("common_organization"),
    t("common_contest")
  ];

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

        if (currentDate.getDate() - createdAt.getDate() <= 7) {
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

    const arraySize = isSevenDays ? 7 : 12;
    const registerData = new Array(arraySize).fill(0);

    filteredUserList.forEach((user: any) => {
      const createdAt = new Date(user.createdAt);
      let dayIndex = isSevenDays ? createdAt.getDay() : createdAt.getMonth();

      if (isSevenDays) dayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust Sunday to the end
      registerData[dayIndex]++;
    });

    // const finalData = activeData.map((data, index) => {
    //   return {
    //     data: [data, offlineData[index]]
    //   };
    // });

    console.log(registerData);
    return [
      {
        data: registerData
      }
    ];
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllUserHandler();
    };
    fetchData();
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
          <Grid item xs={6} />

          {dashboardTabValue === 0 && (
            <>
              <Grid item xs={5}>
                <Heading3>{t("general_info")}</Heading3>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <PersonRoundedIcon
                          sx={{
                            fontSize: "35px",
                            color: "white"
                          }}
                        />
                      }
                      title={t("common_user")}
                      value={0}
                      mainColor={"#FFA726"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <PersonRoundedIcon
                          sx={{
                            fontSize: "35px",
                            color: "white"
                          }}
                        />
                      }
                      title={t("Total user")}
                      value={0}
                      mainColor={"#FFA726"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <PersonRoundedIcon
                          sx={{
                            fontSize: "35px",
                            color: "white"
                          }}
                        />
                      }
                      title={t("Unique visitor")}
                      value={0}
                      mainColor={"#FFA726"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DasbboradBoxComponent
                      icon={
                        <PersonRoundedIcon
                          sx={{
                            fontSize: "35px",
                            color: "white"
                          }}
                        />
                      }
                      title={"Active user"}
                      value={0}
                      mainColor={"#FFA726"}
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
                          Month
                        </Button>
                      </Stack>
                      <Stack
                        direction='column'
                        spacing={1}
                        alignItems='center'
                        sx={{ width: "100%" }}
                      >
                        <BarChart
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
                          xAxis={[
                            {
                              scaleType: "band",
                              data: isSevenDays
                                ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                                : [
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
                                  ],
                              colorMap: {
                                type: "ordinal",
                                colors: [
                                  "#ccebc5",
                                  "#a8ddb5",
                                  "#7bccc4",
                                  "#4eb3d3",
                                  "#2b8cbe",
                                  "#08589e"
                                ]
                              },
                              tickPlacement: "middle"
                            }
                          ]}
                          yAxis={[
                            {
                              disableTicks: true // hide ticks
                            }
                          ]}
                          series={calculateUserRegisterChart(isSevenDays)}
                          height={340}
                          grid={{
                            horizontal: true
                          }}
                          borderRadius={10}
                          margin={{
                            left: 20,
                            right: 20,
                            top: 40,
                            bottom: 30
                          }}
                        />
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4}>
                    <Heading6>Active user and unique visitor</Heading6>

                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px"
                      }}
                    >
                      <PieChart
                        series={[
                          {
                            data: [
                              { id: 0, value: 10 },
                              { id: 1, value: 15 },
                              { id: 2, value: 20 }
                            ]
                          }
                        ]}
                        height={400}
                        sx={{
                          maxWidth: "400px"
                        }}
                      ></PieChart>
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

export default AdminDashboard;
