import { Box, Grid, Skeleton, Stack, TableCell } from "@mui/material";
import { useEffect, useState } from "react";
import DasbboradBoxComponent from "./DashboardBoxComponent";
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

const ROLE_PIE_CHART_COLORS = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"];
const startGradientColor = "#1abc9c";
const endGradientColor = "#16a085";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [mainSkeleton, setMainSkeleton] = useState(true);
  const [dashboardTabValue, setDashboardTabValue] = useState(0);
  const [userRegisterChartRangeButtonState, setUserRegisterChartRangeButtonState] = useState(0);
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

  useEffect(() => {
    const fetchData = async () => {
      await getUserStatistics();
      await getCourseStatistics();
    };
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
              value={dashboardTabValue}
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
                          startGradientColor='#11B678'
                          endGradientColor='#FF3143'
                        />
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
                      <Grid container spacing={2} alignItems={"center"}>
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
                    <DasbboradBoxComponent
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
                    <DasbboradBoxComponent
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
                    <DasbboradBoxComponent
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
                    <DasbboradBoxComponent
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
                          startGradientColor='#11B678'
                          endGradientColor='#FF3143'
                        />
                        <ChartLengend label={"New user"} color={startGradientColor} />
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
                      <Grid container spacing={2} alignItems={"center"}>
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
                      <Grid container spacing={2} alignItems={"center"}>
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
                                    >
                                      {assignment.title}
                                    </ParagraphBody>
                                  </td>
                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
                                    >
                                      {assignment.courseName}
                                    </ParagraphBody>
                                  </td>
                                  <td>
                                    <ParagraphBody
                                      fontSize={".875rem"}
                                      color={"#212121"}
                                      fontWeight={"600"}
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
        </Grid>
      )}
    </>
  );
};

export default AdminDashboard;
