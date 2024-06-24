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
import { styled } from "@mui/material/styles";

interface Props {}

const LecturerCourseDetail = memo((props: Props) => {
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
      display: "none"
    },
    "& .MuiTabs-flexContainer": {
      width: "fit-content",
      padding: "4px 3px",
      gap: "10px",
      borderRadius: 8
    }
  });
  interface StyledTabProps {
    label: React.ReactNode;
    value: number;
  }

  const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: "none",
      width: 100,
      minHeight: 29,
      borderRadius: 10,
      padding: "10px 6px",
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
      <Box
        className={classes.tabWrapper}
        translation-key={[
          "course_detail_classroom",
          "course_detail_assignment",
          "common_grade",
          "course_detail_participant"
        ]}
      >
        <AntTabs
          value={activeTab}
          onChange={handleChange}
          aria-label='basic tabs example'
          className={classes.tabs}
        >
          <AntTab sx={{ textTransform: "none" }} label={t("course_detail_classroom")} value={0} />
          <AntTab sx={{ textTransform: "none" }} label={t("course_detail_assignment")} value={1} />
          <AntTab sx={{ textTransform: "none" }} label={t("common_grade")} value={2} />
          <AntTab sx={{ textTransform: "none" }} label={t("course_detail_participant")} value={3} />
        </AntTabs>
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
