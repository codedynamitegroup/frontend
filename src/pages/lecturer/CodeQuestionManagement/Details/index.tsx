import { Box, Container, Grid, Tab, Tabs } from "@mui/material";
import Header from "components/Header";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import { memo, useMemo } from "react";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import Button, { BtnType } from "components/common/buttons/Button";
import CodeQuestionInformation from "./components/Information";
import CodeQuestionTestCases from "./components/TestCases";
import CodeQuestionCodeStubs from "./components/CodeStubs";
import CodeQuestionLanguages from "./components/Languages";
import { routes } from "routes/routes";
import SideBarLecturer from "components/common/sidebars/SidebarLecturer";

interface Props {}

const CodeQuestionDetails = memo((props: Props) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (id) navigate(tabs[newTab].replace(":id", id));
  };

  const tabs: string[] = useMemo(() => {
    return [
      routes.lecturer.code_question.information,
      routes.lecturer.code_question.test_cases,
      routes.lecturer.code_question.code_stubs,
      routes.lecturer.code_question.languages
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (id) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":id", id)));
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
            <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
              <span onClick={() => navigate(routes.lecturer.code_question.management)}>
                Quản lý câu hỏi code
              </span>{" "}
              {">"}{" "}
              <span
                onClick={() => {
                  if (id) navigate(routes.lecturer.code_question.details.replace(":id", id));
                }}
              >
                Tổng 2 số
              </span>
            </ParagraphBody>
          </Box>

          <Box className={classes.body}>
            <Heading1 fontWeight={"500"}>Tổng 2 số</Heading1>
            <Box sx={{ border: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={handleChange}
                aria-label='basic tabs example'
                className={classes.tabs}
              >
                <Tab
                  sx={{ textTransform: "none" }}
                  label={<ParagraphBody>Thông tin</ParagraphBody>}
                  value={0}
                />
                <Tab
                  sx={{ textTransform: "none" }}
                  label={<ParagraphBody>Test cases</ParagraphBody>}
                  value={1}
                />
                <Tab
                  sx={{ textTransform: "none" }}
                  label={<ParagraphBody>Code mẫu</ParagraphBody>}
                  value={2}
                />
                <Tab
                  sx={{ textTransform: "none" }}
                  label={<ParagraphBody>Ngôn ngữ</ParagraphBody>}
                  value={3}
                />
              </Tabs>
            </Box>
            <Box mt={2}>
              <Routes>
                <Route path={"information"} element={<CodeQuestionInformation />} />
                <Route path={"test-cases"} element={<CodeQuestionTestCases />} />
                <Route path={"code-stubs"} element={<CodeQuestionCodeStubs />} />
                <Route path={"languages"} element={<CodeQuestionLanguages />} />
              </Routes>
            </Box>
          </Box>
        </Container>
        <Box className={classes.stickyFooterContainer}>
          <Box className={classes.phantom} />
          <Box className={classes.stickyFooterItem}>
            <Button btnType={BtnType.Primary}>Lưu thay đổi</Button>
          </Box>
        </Box>
      </SideBarLecturer>
    </Grid>
  );
});

export default CodeQuestionDetails;
