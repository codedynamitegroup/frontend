import { Box, Tab, Tabs } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import { memo, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import LecturerCourseAssignment from "./components/Assignment";
import LecturerCourseAssignmentDetails from "./components/Assignment/components/AssignmentDetails";
import LecturerCourseGrade from "./components/Grade";
import LecturerCourseInformation from "./components/Information";
import LecturerCourseParticipant from "./components/Participant";
import LecturerCourseAssignmentSubmissions from "./components/AssignmentSubmissions";
import LecturerCourseExamSubmissions from "./components/ExamSubmissions";
import classes from "./styles.module.scss";
import LecturerCourseExamDetails from "./components/Assignment/components/ExamDetails";
import { useTranslation } from "react-i18next";

interface Props {}

const LecturerCourseDetail = memo((props: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (courseId) navigate(tabs[newTab].replace(":courseId", courseId));
  };

  const tabs: string[] = useMemo(() => {
    return [
      routes.lecturer.course.information,
      routes.lecturer.course.assignment,
      routes.lecturer.course.grade,
      routes.lecturer.course.participant
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

  return (
    <>
      <Box className={classes.tabWrapper}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label='basic tabs example'
          className={classes.tabs}
        >
          <Tab
            sx={{ textTransform: "none" }}
            label={
              <ParagraphBody translation-key='course_detail_classroom'>
                {t("course_detail_classroom")}
              </ParagraphBody>
            }
            value={0}
          />
          <Tab
            sx={{ textTransform: "none" }}
            label={
              <ParagraphBody translation-key='course_detail_assignment'>
                {t("course_detail_assignment")}
              </ParagraphBody>
            }
            value={1}
          />
          <Tab
            sx={{ textTransform: "none" }}
            label={
              <ParagraphBody translation-key='common_grade'>{t("common_grade")}</ParagraphBody>
            }
            value={2}
          />
          <Tab
            sx={{ textTransform: "none" }}
            label={
              <ParagraphBody translation-key='course_detail_participant'>
                {t("course_detail_participant")}
              </ParagraphBody>
            }
            value={3}
          />
        </Tabs>
      </Box>

      <Box id={classes.courseDetailBody}>
        <Box mt={2}>
          <Routes>
            <Route path={"information"} element={<LecturerCourseInformation />} />
            <Route path={"assignments"} element={<LecturerCourseAssignment />} />
            <Route
              path={"assignments/:assignmentId"}
              element={<LecturerCourseAssignmentDetails />}
            />
            <Route
              path={"assignments/:assignmentId/submissions"}
              element={<LecturerCourseAssignmentSubmissions />}
            />
            <Route path={"assignments/exams/:examId"} element={<LecturerCourseExamDetails />} />
            <Route
              path={"assignments/exams/:examId/submissions"}
              element={<LecturerCourseExamSubmissions />}
            />
            <Route path={"grade"} element={<LecturerCourseGrade />} />
            <Route path={"participant"} element={<LecturerCourseParticipant />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
});

export default LecturerCourseDetail;
