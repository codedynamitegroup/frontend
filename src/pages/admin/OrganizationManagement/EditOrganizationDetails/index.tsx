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
import OrganizationDetails from "./OrganizationDetails";
import OrganizationUserManagement from "./UserManagement";

const EditOrganizationDetails = () => {
  const { t } = useTranslation();

  const tabs: string[] = useMemo(() => {
    return [routes.admin.organizations.edit.details, routes.admin.organizations.edit.list_users];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const { pathname } = useLocation();
  const { organizationId } = useParams<{ organizationId: string }>();

  const activeRoute = (routeName: string) => {
    const match = pathname.startsWith(routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (organizationId) {
      const index = tabs.findIndex((it) =>
        activeRoute(it.replace(":organizationId", organizationId))
      );
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const navigate = useNavigate();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (organizationId) navigate(tabs[newTab].replace(":organizationId", organizationId));
  };

  return (
    <>
      <Card
        sx={{
          margin: "20px",
          // padding: "20px",
          "& .MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "4px"
          },
          gap: "20px"
        }}
      >
        <Box className={classes.breadcump}>
          <Box id={classes.breadcumpWrapper}>
            <CustomBreadCrumb
              breadCrumbData={[
                { navLink: routes.admin.organizations.root, label: t("organization_management") }
              ]}
              lastBreadCrumbLabel={t("organization_information")}
            />
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            padding: "20px"
          }}
        >
          <Heading1 translate-key='organization_information'>
            {t("organization_information")}
          </Heading1>
          <Box
            sx={{
              margin: "20px",
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
                  <ParagraphBody translate-key='organization_list_users'>
                    {t("organization_list_users")}
                  </ParagraphBody>
                }
                value={1}
              />
            </Tabs>
          </Box>
          <Box>
            <Routes>
              <Route path={"details"} element={<OrganizationDetails />} />
              <Route path={"users"} element={<OrganizationUserManagement />} />
              <Route path={"*"} element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default EditOrganizationDetails;
