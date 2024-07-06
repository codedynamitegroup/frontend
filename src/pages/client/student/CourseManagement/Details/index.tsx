import { AppBar, Box, Divider, Grid, List, Paper, Tab, Tabs, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextTitle from "components/text/TextTitle";
import { NotificationComponentTypeEnum } from "models/courseService/enum/NotificationComponentTypeEnum";
import { lazy, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { EventCalendarService } from "services/courseService/EventCalendarService";
import { RootState } from "store";
import StudentEventCalendar from "../../StudentEventCalendar";
import StudentCourseAssignment from "./components/Assignment";
import StudentCourseGrade from "./components/Grade";
import StudentCourseInformation from "./components/Information";
import StudentCourseEvent from "./components/Information/components/CourseEvent";
import StudentCourseParticipant from "./components/Participant";
import classes from "./styles.module.scss";
const StudentCourseAssignmentDetails = lazy(
  () => import("./components/Assignment/AssignmentDetails")
);
const StudentCourseExamDetails = lazy(() => import("./components/Assignment/ExamDetails"));

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
  const [eventList, setEventList] = useState<{
    data: {
      name: string;
      type: NotificationComponentTypeEnum;
      endDate: string;
    }[];
    isLoading: boolean;
  }>({
    data: [],
    isLoading: false
  });
  const location = useLocation();
  const isInformationRoute = location.pathname.includes("information");
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const handleGetAllCalendarEventsByCourseId = useCallback(async () => {
    if (!courseId) return;
    setEventList((pre) => ({ ...pre, isLoading: true }));
    try {
      const getAllCalendarEventsByCourseId =
        await EventCalendarService.getToDoEventCalendarsByCourseId(courseId);
      if (getAllCalendarEventsByCourseId) {
        const eventList = getAllCalendarEventsByCourseId.calendarEvents.map((event: any) => {
          return {
            name: event.name,
            type: event.component as NotificationComponentTypeEnum,
            endDate: event.endTime
          };
        });
        setEventList((pre) => ({ ...pre, data: eventList, isLoading: false }));
      }
    } catch (error: any) {
      setEventList((pre) => ({ ...pre, isLoading: false }));
    }
  }, [courseId]);

  useEffect(() => {
    handleGetAllCalendarEventsByCourseId();
  }, [handleGetAllCalendarEventsByCourseId]);

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
              <StudentEventCalendar inDetails={true} />
              <Paper className={classes.eventContainer}>
                <TextTitle
                  className={classes.eventTitle}
                  translation-key='course_detail_need_to_do_title'
                >
                  {t("course_detail_need_to_do_title")}
                </TextTitle>
                <Divider />
                <List
                  sx={{ width: "100%", bgcolor: "background.paper" }}
                  className={classes.eventList}
                >
                  {eventList.data.map((event, index) => (
                    <StudentCourseEvent
                      key={index}
                      name={event.name}
                      endDate={event.endDate}
                      type={event.type}
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
