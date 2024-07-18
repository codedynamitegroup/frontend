import { Box, Card, Divider, Tab, Tabs } from "@mui/material";
import Heading1 from "components/text/Heading1";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import classes from "./styles.module.scss";
import CustomBreadCrumb from "components/common/Breadcrumb";
import ParagraphBody from "components/text/ParagraphBody";
import NotFoundPage from "pages/common/NotFoundPage";
import CourseDetails from "./Edit";
import OrganizationUserManagement from "./UserManagement";
import AssignUser from "./UserManagement/AssignUser";

const EditCourseDetails = () => {
  const { t } = useTranslation();

  const tabs: string[] = useMemo(() => {
    return [
      routes.org_admin.course_type.course.edit.details,
      routes.org_admin.course_type.course.edit.list_users
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const { pathname } = useLocation();
  const { courseId, courseTypeId } = useParams<{ courseId: string; courseTypeId: string }>();

  const activeRoute = (routeName: string) => {
    const match = pathname.startsWith(routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (courseId && courseTypeId) {
      const index = tabs.findIndex((it) =>
        activeRoute(it.replace(":courseId", courseId).replace(":courseTypeId", courseTypeId))
      );
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const navigate = useNavigate();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (courseId && courseTypeId)
      navigate(tabs[newTab].replace(":courseId", courseId).replace(":courseTypeId", courseTypeId));
  };

  return (
    <>
      <Box>
        <Box className={classes.breadcump}>
          <Box id={classes.breadcumpWrapper}>
            <CustomBreadCrumb
              breadCrumbData={[
                {
                  navLink: routes.org_admin.course_type.course.root.replace(
                    ":courseTypeId",
                    courseTypeId || ":courseTypeId"
                  ),
                  label: t("common_course_management")
                }
              ]}
              lastBreadCrumbLabel={t("course_information")}
            />
          </Box>
        </Box>
        <Box
          sx={{
            padding: "0px 20px 20px 20px"
          }}
        >
          <Heading1 translate-key='course_information'>{t("course_information")}</Heading1>
          <Box
            sx={{
              margin: "20px 0px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0"
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label='basic tabs example'
              className={classes.tabs}
              variant='fullWidth'
            >
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translate-key='common_details'>
                    {t("common_details")}
                  </ParagraphBody>
                }
                value={0}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translate-key='course_detail_participant'>
                    {t("course_detail_participant")}
                  </ParagraphBody>
                }
                value={1}
              />
            </Tabs>
          </Box>
          <Box>
            <Routes>
              <Route path={"details"} element={<CourseDetails />} />
              <Route path={"users"} element={<OrganizationUserManagement />} />
              <Route path={"*"} element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EditCourseDetails;
