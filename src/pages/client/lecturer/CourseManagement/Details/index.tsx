import { Box, Container, Grid, Tab, Tabs } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import { memo, useMemo } from "react";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import SideBarLecturer from "components/common/sidebars/SidebarLecturer";
import LecturerCourseInformation from "./components/Information";
import LecturerCourseAssignment from "./components/Assignment";
import LecturerCourseGrade from "./components/Grade";
import LecturerCourseParticipant from "./components/Participant";

interface Props {}

const CourseDetail = memo((props: Props) => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (courseId) navigate(tabs[newTab].replace(":courseId", courseId));
  };

  const tabs: string[] = useMemo(() => {
    return [
      routes.lecturer.course.information.path,
      routes.lecturer.course.assignment.path,
      routes.lecturer.course.grade.path,
      routes.lecturer.course.participant.path
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
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

  return (
    <Grid className={classes.root}>
      <SideBarLecturer>
        <Container className={classes.container}>
          <Box className={classes.tabWrapper}>
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label='basic tabs example'
              className={classes.tabs}
            >
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Lớp học</ParagraphBody>}
                value={0}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Bài tập</ParagraphBody>}
                value={1}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Điểm</ParagraphBody>}
                value={2}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Thành viên</ParagraphBody>}
                value={3}
              />
            </Tabs>
          </Box>

          <Box className={classes.body}>
            <Box mt={2}>
              <Routes>
                <Route path={"information"} element={<LecturerCourseInformation />} />
                <Route path={"assignment"} element={<LecturerCourseAssignment />} />
                <Route path={"grade"} element={<LecturerCourseGrade />} />
                <Route path={"participant"} element={<LecturerCourseParticipant />} />
              </Routes>
            </Box>
          </Box>
        </Container>
      </SideBarLecturer>
    </Grid>
  );
});

export default CourseDetail;
