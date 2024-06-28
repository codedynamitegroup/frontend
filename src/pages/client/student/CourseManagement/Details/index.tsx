import { AppBar, Box, Tab, Tabs, Toolbar } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import { memo, useMemo } from "react";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import StudentCourseInformation from "./components/Information";
import StudentCourseGrade from "./components/Grade";
import StudentCourseParticipant from "./components/Participant";
import StudentCourseAssignment from "./components/Assignment";
import StudentCourseAssignmentDetails from "./components/Assignment/AssignmentDetails";
import StudentCourseExamDetails from "./components/Assignment/ExamDetails";
import { useTranslation } from "react-i18next";
import StudentEventCalendar from "../../StudentEventCalendar";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ECourseEventStatus, ECourseResourceType } from "models/courseService/course";
import { Paper, Typography, List, Divider } from "@mui/material";
import StudentCourseEvent from "./components/Information/components/CourseEvent";
import { useSelector } from "react-redux";
import { RootState } from "store";

interface Props {}

const StudentCourseDetail = memo((props: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (courseId) navigate(tabs[newTab].replace(":courseId", courseId));
  };

  const AntTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
      backgroundColor: "transparent",
      display: "none",
      borderBottom: "none"
    },
    "& .MuiTabs-flexContainer": {
      width: "fit-content",
      padding: "4px 3px",
      borderRadius: 8,
      gap: "10px"
    }
  });
  interface StyledTabProps {
    label: React.ReactNode;
    value: number;
  }

  const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: "none",
      width: "fit-content",
      minHeight: 29,
      borderRadius: 10,
      padding: "10px 16px",
      fontSize: 16,
      [theme.breakpoints.up("sm")]: {
        minWidth: 0
      },
      fontWeight: 500,
      color: "rgba(0, 0, 0, 0.85)",
      fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Roboto"'].join(","),
      "&:hover": {
        color: "#1976d2",
        backgroundColor: "#ECF4FD",
        transition: "all 0.2s ease-in-out",
        opacity: 1
      },
      "&.Mui-selected": {
        color: "#1976d2",
        backgroundColor: "#ECF4FD",
        fontWeight: theme.typography.fontWeightMedium
      },
      "&.Mui-focusVisible": {
        backgroundColor: "#d1eaff"
      }
    })
  );
  const tabs: string[] = useMemo(() => {
    return [
      routes.student.course.information,
      routes.student.course.assignment,
      routes.student.course.grade,
      routes.student.course.participant
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = pathname.startsWith(routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (courseId) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":courseId", courseId)));
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);
  const eventList = [
    {
      id: 1,
      name: "Assignment 1",
      type: ECourseResourceType.assignment,
      startDate: "01/01/2024",
      endDate: "12/12/2024",
      status: ECourseEventStatus.submitted
    },
    {
      id: 2,
      name: "Assignment 2",
      type: ECourseResourceType.assignment,
      startDate: "01/01/2024",
      endDate: "12/12/2024",
      status: ECourseEventStatus.notSubmitted
    },
    {
      id: 3,
      name: "Assignment 3",
      type: ECourseResourceType.assignment,
      startDate: "01/01/2024",
      endDate: "12/12/2024",
      status: ECourseEventStatus.notSubmitted
    },
    {
      id: 4,
      name: "Assignment 4",
      type: ECourseResourceType.assignment,
      startDate: "01/01/2024",
      endDate: "12/12/2024",
      status: ECourseEventStatus.submitted
    }
  ];
  const location = useLocation();
  const isInformationRoute = location.pathname.includes("information");
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);
  return (
    <>
      <Box
        translation-key={[
          "course_detail_classroom",
          "course_detail_assignment",
          "common_grade",
          "course_detail_participant"
        ]}
      >
        <AppBar
          position='fixed'
          className={classes.tabs}
          sx={{
            top: `${sidebarStatus.headerHeight}px`,
            left: sidebarStatus.isOpen ? `${sidebarStatus.sidebarWidth}px` : 0
          }}
        >
          <Toolbar>
            <AntTabs value={activeTab} onChange={handleChange} aria-label='basic tabs example'>
              <AntTab label={t("course_detail_classroom")} value={0} />
              <AntTab label={t("course_detail_assignment")} value={1} />
              <AntTab label={t("common_grade")} value={2} />
              <AntTab label={t("course_detail_participant")} value={3} />
            </AntTabs>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Box>

      <Box id={classes.courseDetailBody}>
        <Grid container>
          <Grid item xs={!isInformationRoute ? 12 : 7.2}>
            <Routes>
              <Route path={"information"} element={<StudentCourseInformation />} />
              <Route path={"assignments"} element={<StudentCourseAssignment />} />
              <Route
                path={"assignments/:assignmentId"}
                element={<StudentCourseAssignmentDetails />}
              />
              <Route path={"assignments/exams/:examId"} element={<StudentCourseExamDetails />} />
              <Route path={"grade"} element={<StudentCourseGrade />} />
              <Route path={"participant"} element={<StudentCourseParticipant />} />
            </Routes>
          </Grid>
          {isInformationRoute && (
            <Grid item xs={4.8}>
              <StudentEventCalendar />
              <Paper className={classes.eventContainer}>
                <Typography
                  className={classes.eventTitle}
                  translation-key='course_detail_need_to_do_title'
                >
                  {t("course_detail_need_to_do_title")}
                </Typography>
                <Divider />
                <List
                  sx={{ width: "100%", bgcolor: "background.paper" }}
                  className={classes.eventList}
                >
                  {eventList.map((event, index) => (
                    <StudentCourseEvent
                      id={event.id}
                      key={index}
                      name={event.name}
                      endDate={event.endDate}
                      startDate={event.startDate}
                      type={event.type}
                      status={event.status}
                    />
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default StudentCourseDetail;
