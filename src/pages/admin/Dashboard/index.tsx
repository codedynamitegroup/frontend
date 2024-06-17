import { Box, Grid, Skeleton, Stack, TableCell } from "@mui/material";
import { useEffect, useState } from "react";
import DashboardBoxComponent from "./DashboardBoxComponent";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import { useTranslation } from "react-i18next";
import Heading3 from "components/text/Heading3";
import { Button, Card, Table } from "@mui/joy";
import { UserService } from "services/authService/UserService";
import Heading6 from "components/text/Heading6";
import { PieChart } from "@mui/x-charts/PieChart";
import ParagraphBody from "components/text/ParagraphBody";
import ChartLengend from "./ChartLegend";
import images from "config/images";
import useAuth from "hooks/useAuth";
import { CourseService } from "services/courseService/CourseService";
import CustomLineChart from "components/common/chart/CustomLineChart";
import { ContestService } from "services/coreService/ContestService";
import { BarChart } from "@mui/x-charts/BarChart";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import Heading2 from "components/text/Heading2";

interface LineChartType {
  data: number[];
  label: string;
  area: boolean;
}
interface PieChartType {
  index: number;
  value: number;
  label: string;
}

interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  offlineUsers: number;
  loginToday: number;
  registerUser: LineChartType[];
  userByRole: PieChartType[];
}
interface CourseStatistics {
  activeCourse: number;
  activeInactiveCourse: PieChartType[];
  courseType: PieChartType[];
  inactiveCourse: number;
  newCourses: undefined;
  recentAssignments: {
    courseId: string;
    courseName: string;
    createdAt: Date;
    id: string;
    title: string;
    type: string;
  }[];
  recentExam: {
    id: string;
    courseId: string;
    courseName: string;
    examName: string;
    createdAt: Date;
  }[];
  totalCourse: number;
  totalEnrollments: number;
  userEnrollments: LineChartType[];
}
interface ContestStatistics {
  totalContest: number;
  totalParticipants: number;
  activeContest: number;
  closedContest: number;
  upcomingContest: number;
  participantTrend: LineChartType[];
  popularContest: LineChartType[];
  popularContestName: string[];
}
interface CertificateCourseStatistics {
  totalCertificateCourse: number;
  totalEnrollments: number;
  averageRating: number;
  totalParticipantCompletedCourse: number;

  enrollmentChart: LineChartType[];
  topEnrolledCourse: LineChartType[];
  chapterResourceType: PieChartType[];
}

const ROLE_PIE_CHART_COLORS = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"];

const AdminDashboard = () => {
  const currentDateTime = new Date();
  const { t } = useTranslation();
  const auth = useAuth();
  const [mainSkeleton, setMainSkeleton] = useState(true);
  const [dashboardTabValue, setDashboardTabValue] = useState(0);
  const [userRegisterChartRangeButtonState, setUserRegisterChartRangeButtonState] = useState(0);
  const [
    certificateCourseEnrollmentChartButtonState,
    setCertificateCourseEnrollmentChartButtonState
  ] = useState(0);
  const [courseEnrollmentChartRangeButtonState, setCourseEnrollmentChartRangeButtonState] =
    useState(0);
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
  const [courseStatistics, setCourseStatistics] = useState<CourseStatistics>({
    activeCourse: 0,
    activeInactiveCourse: [],
    courseType: [],
    inactiveCourse: 0,
    newCourses: undefined,
    recentAssignments: [],
    recentExam: [],
    totalCourse: 0,
    totalEnrollments: 0,
    userEnrollments: []
  });
  const [contestStatistics, setContestStatistics] = useState<ContestStatistics>({
    totalContest: 0,
    totalParticipants: 0,
    activeContest: 0,
    closedContest: 0,
    upcomingContest: 0,
    participantTrend: [],
    popularContest: [],
    popularContestName: []
  });
  const [certificateCourseStatistics, setCertificateCourseStatistics] =
    useState<CertificateCourseStatistics>({
      totalCertificateCourse: 0,
      totalEnrollments: 0,
      averageRating: 0,
      totalParticipantCompletedCourse: 0,
      enrollmentChart: [],
      topEnrolledCourse: [],
      chapterResourceType: []
    });

  const [daysInMonth, setDaysInMonth] = useState(new Date(tempYear, tempMonth + 1, 0).getDate());

  const tabLabels = [t("User"), t("Course"), t("Contest"), t("Certificate course")];

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daysListFull = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  const monthListFull = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
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
  const recentAssignmentsHeader = ["Title", "Course name", "Type", "Created at"];
  const recentExamHeader = ["Exam name", "Course name", "Created at"];

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

  const getCourseStatistics = async () => {
    try {
      const response = await CourseService.getCourseStatistics();

      setCourseStatistics((prevStats) => ({
        ...response,
        userEnrollments: response.userEnrollments.map((user: any) => ({ ...user, area: true })),
        activeInactiveCourse: response.activeInactiveCourse.map((course: any) => ({
          ...course,
          area: true
        }))
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getContestStatistics = async () => {
    try {
      const response = await ContestService.getAdminContestStatistics();
      setContestStatistics((prevStats) => ({
        ...response,
        participantTrend: response.participantTrend.map((trend: any) => ({ ...trend, area: true }))
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getCertificateCourseStatistics = async () => {
    try {
      const response = await CertificateCourseService.getCertificateCourseStatistics();
      setCertificateCourseStatistics((prevStats) => ({
        ...response,
        enrollmentChart: response.enrollmentChart.map((enrollment: any) => ({
          ...enrollment,
          area: true
        }))
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserStatistics();
      await getCourseStatistics();
      await getContestStatistics();
      await getCertificateCourseStatistics();
    };
    fetchData();

    setMainSkeleton(false);
  }, []);

  useEffect(() => {
    console.log(certificateCourseStatistics);
  }, [certificateCourseStatistics]);

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
          {/* Dashboard tabs */}
          <Grid item xs={12}>
            <Card
              sx={{
                height: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "linear-gradient(145deg, #EDE7F6 30%, #D1C4E9 90%)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                color: "#333"
              }}
            >
              <Box>
                <Heading2 colorname={"--gray-80"}>
                  Hello, {auth.loggedUser?.firstName}! Welcome back to your dashboard
                </Heading2>
                <ParagraphBody colorname='--gray-60'>
                  Today is {daysListFull[currentDateTime.getDay() - 1]}, {currentDateTime.getDate()}{" "}
                  {monthListFull[currentDateTime.getMonth()]} {currentDateTime.getFullYear()}
                </ParagraphBody>
              </Box>

              <Box>
                <ParagraphBody colorname={"--gray-60"}>
                  What stats would you like to view today ?
                </ParagraphBody>
                <Tabs
                  aria-label='tabs'
                  defaultValue={dashboardTabValue}
                  value={dashboardTabValue}
                  sx={{ backgroundColor: "transparent", width: "fit-content", marginTop: "5px" }}
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
                        color: "#FFF",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                        bgcolor: "#2196F3"
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
              </Box>
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
                    <DashboardBoxComponent
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
                    <DashboardBoxComponent
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
                    <DashboardBoxComponent
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
                    <DashboardBoxComponent
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
                        justifyContent: "center",
                        boxShadow: "lg"
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
                        <CustomLineChart
                          scaleType={"point"}
                          data={
                            userRegisterChartRangeButtonState === 0
                              ? daysList
                              : userRegisterChartRangeButtonState === 1
                                ? dayInMonthList
                                : monthInYearList
                          }
                          series={
                            userStatistics.registerUser.length === 0
                              ? []
                              : userRegisterChartRangeButtonState === 0
                                ? [userStatistics.registerUser[0]]
                                : userRegisterChartRangeButtonState === 1
                                  ? [userStatistics.registerUser[1]]
                                  : [userStatistics.registerUser[2]]
                          }
                          startGradientColor={["#11B678"]}
                          endGradientColor={["#FF3143"]}
                        />
                        <ChartLengend label={"New user"} color={"#11B678"} />
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4}>
                    <Heading6>User role</Heading6>

                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        boxShadow: "lg"
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
                      <Grid container spacing={2} alignItems={"center"} marginTop={2}>
                        {ROLE_NAMES.map((role, index) => (
                          <Grid item key={index}>
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
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.course}
                          alt='Total course'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Total courses"}
                      value={courseStatistics.totalCourse}
                      mainColor={"#3498db"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.userEnrollment}
                          alt='Enrolled user'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Enrollments"}
                      value={courseStatistics.totalEnrollments}
                      mainColor={"#2ecc71"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.activeCourse}
                          alt='active course'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Active Courses"}
                      value={courseStatistics.activeCourse}
                      mainColor={"#f39c12"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.inactiveCourse}
                          alt='online user'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Inactive courses"}
                      value={courseStatistics.inactiveCourse}
                      mainColor={"#e74c3c"}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Heading6>Course Enrollment</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        display: "flex",
                        justifyContent: "center",
                        boxShadow: "lg"
                      }}
                    >
                      <Stack
                        display={"flex"}
                        justifyContent={"flex-end"}
                        direction={"row"}
                        spacing={2}
                      >
                        <Button
                          variant={
                            courseEnrollmentChartRangeButtonState === 0 ? "outlined" : "plain"
                          }
                          onClick={() => {
                            if (courseEnrollmentChartRangeButtonState === 0) return;
                            setCourseEnrollmentChartRangeButtonState(0);
                          }}
                          size='sm'
                        >
                          Week
                        </Button>
                        <Button
                          variant={
                            courseEnrollmentChartRangeButtonState === 1 ? "outlined" : "plain"
                          }
                          onClick={() => {
                            if (courseEnrollmentChartRangeButtonState === 1) return;
                            setCourseEnrollmentChartRangeButtonState(1);
                          }}
                          size='sm'
                        >
                          Month
                        </Button>
                        <Button
                          variant={
                            courseEnrollmentChartRangeButtonState === 2 ? "outlined" : "plain"
                          }
                          onClick={() => {
                            if (courseEnrollmentChartRangeButtonState === 2) return;
                            setCourseEnrollmentChartRangeButtonState(2);
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
                        <CustomLineChart
                          data={
                            courseEnrollmentChartRangeButtonState === 0
                              ? daysList
                              : courseEnrollmentChartRangeButtonState === 1
                                ? dayInMonthList
                                : monthInYearList
                          }
                          series={
                            courseStatistics.userEnrollments.length === 0
                              ? []
                              : courseEnrollmentChartRangeButtonState === 0
                                ? [courseStatistics.userEnrollments[0]]
                                : courseEnrollmentChartRangeButtonState === 1
                                  ? [courseStatistics.userEnrollments[1]]
                                  : [courseStatistics.userEnrollments[2]]
                          }
                          scaleType='point'
                          startGradientColor={["#11B678"]}
                          endGradientColor={["#FF3143"]}
                        />
                        <ChartLengend label={"New Enrollment"} color={"#11B678"} />
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Heading6>Active / Inactive course</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        boxShadow: "lg"
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
                              data: courseStatistics.activeInactiveCourse,
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
                      <Grid container spacing={2} alignItems={"center"} marginTop={2}>
                        <Grid item>
                          <ChartLengend label={"Active"} color={ROLE_PIE_CHART_COLORS[0]} />
                        </Grid>
                        <Grid item>
                          <ChartLengend label={"Inactive"} color={ROLE_PIE_CHART_COLORS[1]} />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Heading6>Course type</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        boxShadow: "lg"
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
                              data: courseStatistics.courseType,
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
                      <Grid container spacing={2} alignItems={"center"} marginTop={2}>
                        {courseStatistics.courseType.map((role, index) => (
                          <Grid item key={index}>
                            <ChartLengend label={role.label} color={ROLE_PIE_CHART_COLORS[index]} />
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={12} lg={6}>
                    <Heading6>Recent assignment</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        boxShadow: "lg",
                        height: "400px"
                      }}
                    >
                      <Table
                        variant='soft'
                        size='lg'
                        hoverRow
                        sx={{
                          backgroundColor: "#FBFCFE",
                          "& tbody tr:hover": {
                            backgroundColor: "#f3f3f3" // Change this to your desired color
                          }
                        }}
                      >
                        <thead>
                          <tr>
                            {recentAssignmentsHeader.map((header, index) => (
                              <th
                                key={index}
                                style={{
                                  borderBottom: "2px solid rgb(128,128,128)"
                                }}
                              >
                                <ParagraphBody
                                  fontSize={"12px"}
                                  color={"#525151"}
                                  fontWeight={"500"}
                                  nonoverflow
                                >
                                  {header}
                                </ParagraphBody>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {courseStatistics.recentAssignments.length !== 0 && (
                            <>
                              {courseStatistics.recentAssignments.map((assignment, index) => (
                                <tr key={index}>
                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
                                      nonoverflow
                                    >
                                      {assignment.title}
                                    </ParagraphBody>
                                  </td>
                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
                                      nonoverflow
                                    >
                                      {assignment.courseName}
                                    </ParagraphBody>
                                  </td>
                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
                                      nonoverflow
                                    >
                                      {assignment.type === "FILE"
                                        ? "File"
                                        : assignment.type === "TEXT_ONLINE"
                                          ? "Text online"
                                          : "Both"}
                                    </ParagraphBody>
                                  </td>
                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
                                      nonoverflow
                                    >
                                      {new Date(assignment.createdAt).toLocaleDateString()}
                                    </ParagraphBody>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}

                          {courseStatistics.recentAssignments.length === 0 && (
                            <tr>
                              <TableCell colSpan={recentAssignmentsHeader.length}>
                                <Box
                                  display='flex'
                                  alignItems='center'
                                  justifyContent='center'
                                  height='300px' // Or any other height that suits your needs
                                >
                                  <ParagraphBody
                                    fontSize={".875rem"}
                                    color={"#212121"}
                                    fontWeight={"600"}
                                  >
                                    No data to display
                                  </ParagraphBody>
                                </Box>
                              </TableCell>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={12} lg={6}>
                    <Heading6>Recent exam</Heading6>

                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        boxShadow: "lg"
                      }}
                    >
                      <Table
                        variant='soft'
                        size='lg'
                        hoverRow
                        sx={{
                          backgroundColor: "#FBFCFE",
                          "& tbody tr:hover": {
                            backgroundColor: "#f3f3f3" // Change this to your desired color
                          }
                        }}
                      >
                        <thead>
                          <tr>
                            {recentExamHeader.map((header, index) => (
                              <th
                                key={index}
                                style={{
                                  borderBottom: "2px solid rgb(128,128,128)"
                                }}
                              >
                                <ParagraphBody
                                  fontSize={"12px"}
                                  color={"#525151"}
                                  fontWeight={"500"}
                                >
                                  {header}
                                </ParagraphBody>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {courseStatistics.recentExam.length !== 0 && (
                            <>
                              {courseStatistics.recentExam.map((exam, index) => (
                                <tr key={index}>
                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
                                    >
                                      {exam.examName}
                                    </ParagraphBody>
                                  </td>
                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
                                    >
                                      {exam.courseName}
                                    </ParagraphBody>
                                  </td>

                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
                                    >
                                      {new Date(exam.createdAt).toLocaleDateString()}
                                    </ParagraphBody>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                          {courseStatistics.recentExam.length === 0 && (
                            <tr>
                              <TableCell colSpan={recentExamHeader.length}>
                                <Box
                                  display='flex'
                                  alignItems='center'
                                  justifyContent='center'
                                  height='300px' // Or any other height that suits your needs
                                >
                                  <ParagraphBody
                                    fontSize={".875rem"}
                                    color={"#212121"}
                                    fontWeight={"600"}
                                  >
                                    No data to display
                                  </ParagraphBody>
                                </Box>
                              </TableCell>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {dashboardTabValue === 2 && (
            <>
              <Grid item xs={5}>
                <Heading3>{"Contest"}</Heading3>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.contestDashboard}
                          alt='Total contest'
                          style={{ width: "35px", color: "white" }}
                        />
                      }
                      title={"Total contest"}
                      value={contestStatistics.totalContest}
                      mainColor={"#4CAF50"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.contestParticipant}
                          alt='Participant'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Total participants"}
                      value={contestStatistics.totalParticipants}
                      mainColor={"#2196F3"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.happeningContest}
                          alt='active contest'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Happening contest"}
                      value={contestStatistics.activeContest}
                      mainColor={"#FFEB3B"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.upcomingContest}
                          alt='upcomming contest'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Upcomming contest"}
                      value={contestStatistics.upcomingContest}
                      mainColor={"#FF9800"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.closedContest}
                          alt='closed contest'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Closed contest"}
                      value={contestStatistics.closedContest}
                      mainColor={"#F44336"}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Heading6>Contest Participant Trend</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        display: "flex",
                        justifyContent: "center",
                        boxShadow: "lg"
                      }}
                    >
                      <Stack
                        direction='column'
                        spacing={1}
                        alignItems='center'
                        sx={{ width: "100%" }}
                      >
                        <CustomLineChart
                          data={monthInYearList}
                          series={
                            contestStatistics.participantTrend.length === 0
                              ? []
                              : [
                                  contestStatistics.participantTrend[0],
                                  contestStatistics.participantTrend[1]
                                ]
                          }
                          scaleType='point'
                          startGradientColor={["#42A5F5", "#66BB6A"]}
                          endGradientColor={["#1E88E5", "#43A047"]}
                        />

                        <Stack direction='row' spacing={2}>
                          <ChartLengend label={"Participant"} color={"#42A5F5"} />
                          <ChartLengend label={"Average Participant"} color={"#66BB6A"} />
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Heading6>Popular contest</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        display: "flex",
                        justifyContent: "center",
                        boxShadow: "lg"
                      }}
                    >
                      <Stack
                        direction='column'
                        spacing={1}
                        alignItems='center'
                        sx={{ width: "100%" }}
                      >
                        <BarChart
                          borderRadius={10}
                          colors={["#42A5F5", "#66BB6A"]}
                          height={320}
                          xAxis={[
                            { scaleType: "band", data: contestStatistics.popularContestName }
                          ]}
                          series={
                            contestStatistics.popularContest.length === 0
                              ? []
                              : [
                                  {
                                    ...contestStatistics.popularContest[0],
                                    stack: "A",
                                    stackOffset: "none"
                                  },
                                  {
                                    ...contestStatistics.popularContest[1],
                                    stack: "A",
                                    stackOffset: "none"
                                  }
                                ]
                          }
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
                          <ChartLengend label={"Participant"} color={"#66BB6A"} />
                          <ChartLengend label={"Submission"} color={"#42A5F5"} />
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {dashboardTabValue === 3 && (
            <>
              <Grid item xs={5}>
                <Heading3>{"Certificate course"}</Heading3>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.certificateCourse}
                          alt='Total certificate course'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Total certificate course"}
                      value={certificateCourseStatistics.totalCertificateCourse}
                      mainColor={"#6A1B9A"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.certificateEnrollment}
                          alt='Enrollment'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Total enrollment"}
                      value={certificateCourseStatistics.totalEnrollments}
                      mainColor={"#2196F3"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.certificateCompleted}
                          alt='active contest'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"participant completed course"}
                      value={certificateCourseStatistics.totalParticipantCompletedCourse}
                      mainColor={"#4CAF50"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <DashboardBoxComponent
                      icon={
                        <img
                          src={images.admin.certificateRating}
                          alt='upcomming contest'
                          style={{ width: "35px" }}
                        />
                      }
                      title={"Average rating"}
                      value={Number(certificateCourseStatistics.averageRating.toFixed(2))}
                      mainColor={"#FFC107"}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Heading6>Enrollment chart</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        display: "flex",
                        justifyContent: "center",
                        boxShadow: "lg"
                      }}
                    >
                      <Stack
                        display={"flex"}
                        justifyContent={"flex-end"}
                        direction={"row"}
                        spacing={2}
                      >
                        <Button
                          variant={
                            certificateCourseEnrollmentChartButtonState === 0 ? "outlined" : "plain"
                          }
                          onClick={() => {
                            if (certificateCourseEnrollmentChartButtonState === 0) return;
                            setCertificateCourseEnrollmentChartButtonState(0);
                          }}
                          size='sm'
                        >
                          Week
                        </Button>
                        <Button
                          variant={
                            certificateCourseEnrollmentChartButtonState === 1 ? "outlined" : "plain"
                          }
                          onClick={() => {
                            if (certificateCourseEnrollmentChartButtonState === 1) return;
                            setCertificateCourseEnrollmentChartButtonState(1);
                          }}
                          size='sm'
                        >
                          Month
                        </Button>
                        <Button
                          variant={
                            certificateCourseEnrollmentChartButtonState === 2 ? "outlined" : "plain"
                          }
                          onClick={() => {
                            if (certificateCourseEnrollmentChartButtonState === 2) return;
                            setCertificateCourseEnrollmentChartButtonState(2);
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
                        <CustomLineChart
                          data={
                            certificateCourseEnrollmentChartButtonState === 0
                              ? daysList
                              : certificateCourseEnrollmentChartButtonState === 1
                                ? dayInMonthList
                                : monthInYearList
                          }
                          series={
                            certificateCourseStatistics.enrollmentChart.length === 0
                              ? []
                              : certificateCourseEnrollmentChartButtonState === 0
                                ? [certificateCourseStatistics.enrollmentChart[0]]
                                : certificateCourseEnrollmentChartButtonState === 1
                                  ? [certificateCourseStatistics.enrollmentChart[1]]
                                  : [certificateCourseStatistics.enrollmentChart[2]]
                          }
                          scaleType='point'
                          startGradientColor={["#42A5F5"]}
                          endGradientColor={["#1E88E5"]}
                        />
                        <ChartLengend label={"New Enrollment"} color={"#42A5F5"} />
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Heading6>Top Enrolled Course</Heading6>
                    <Card
                      color='neutral'
                      variant='outlined'
                      sx={{
                        height: "400px",
                        display: "flex",
                        justifyContent: "center",
                        boxShadow: "lg"
                      }}
                    >
                      <Stack
                        direction='column'
                        spacing={1}
                        alignItems='center'
                        sx={{ width: "100%" }}
                      >
                        <BarChart
                          borderRadius={10}
                          colors={["#1E88E5", "#1565C0"]}
                          height={320}
                          xAxis={[
                            {
                              scaleType: "band",
                              data: certificateCourseStatistics.topEnrolledCourse.map(
                                (course) => course.label
                              )
                            }
                          ]}
                          series={
                            certificateCourseStatistics.topEnrolledCourse.length === 0
                              ? []
                              : [
                                  {
                                    data: certificateCourseStatistics.topEnrolledCourse.map(
                                      (course) => course.data[0]
                                    ),
                                    label: "Participant(s)"
                                  }
                                ]
                          }
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
                        <ChartLengend label={"Participant"} color={"#1E88E5"} />
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Heading6>Course Resource Type</Heading6>
                <Card
                  color='neutral'
                  variant='outlined'
                  sx={{
                    height: "400px",
                    boxShadow: "lg"
                  }}
                >
                  <Stack direction='column' spacing={1} alignItems='center' sx={{ width: "100%" }}>
                    <PieChart
                      colors={ROLE_PIE_CHART_COLORS}
                      series={[
                        {
                          data: certificateCourseStatistics.chapterResourceType,
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
                  <Grid container spacing={2} alignItems={"center"} marginTop={2}>
                    {certificateCourseStatistics.chapterResourceType.map((resourceType, index) => (
                      <Grid item key={index}>
                        <ChartLengend
                          label={resourceType.label}
                          color={ROLE_PIE_CHART_COLORS[index]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </>
  );
};

export default AdminDashboard;
