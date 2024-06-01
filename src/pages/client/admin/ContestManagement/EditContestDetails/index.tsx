import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Card, Divider, Tab, Tabs } from "@mui/material";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import ContestEditDetails from "./ContestEditDetails";
import ContestEditLeaderboard from "./ContestEditLeaderboard";
import ContestEditModerators from "./ContestEditModerators";
import ContestEditProblems from "./ContestEditProblems";
import ContestEditSignUps from "./ContestEditSignUps";
import ContestEditStatistics from "./ContestEditStatictics";
import classes from "./styles.module.scss";

const EditContestDetails = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  // const [type, setType] = useState<AlertType>(AlertType.INFO);
  // const [content, setContent] = useState("");

  const { contestId } = useParams<{ contestId: string }>();

  const tabs: string[] = useMemo(() => {
    return [
      routes.admin.contest.edit.details,
      routes.admin.contest.edit.problems,
      routes.admin.contest.edit.moderators,
      routes.admin.contest.edit.signups,
      routes.admin.contest.edit.leaderboard,
      routes.admin.contest.edit.statistics
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = pathname.startsWith(routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (contestId) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":contestId", contestId)));
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (contestId) navigate(tabs[newTab].replace(":contestId", contestId));
  };

  return (
    <>
      {/* <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={type}
        content={content}
      /> */}
      <Card
        sx={{
          margin: "20px",
          "& .MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "4px"
          },
          gap: "20px"
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.admin.contest.root)}
              translation-key='contest_management_title'
            >
              {t("contest_management_title")}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall colorname='--blue-500'>Java Contest</ParagraphSmall>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            margin: "20px"
          }}
        >
          <Heading1>Java Contest</Heading1>
        </Box>
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
                <ParagraphBody translate-key='common_details'>{t("common_details")}</ParagraphBody>
              }
              value={0}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label={
                <ParagraphBody translate-key='common_problems'>
                  {t("common_problems")}
                </ParagraphBody>
              }
              value={1}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label={
                <ParagraphBody translate-key='common_moderators'>
                  {t("common_moderators")}
                </ParagraphBody>
              }
              value={2}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label={
                <ParagraphBody translate-key='common_signups'>{t("common_signups")}</ParagraphBody>
              }
              value={3}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label={
                <ParagraphBody translate-key='common_leaderboard'>
                  {t("common_leaderboard")}
                </ParagraphBody>
              }
              value={4}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label={
                <ParagraphBody translate-key='common_statistics'>
                  {t("common_statistics")}
                </ParagraphBody>
              }
              value={5}
            />
          </Tabs>
        </Box>
        <Box
          sx={{
            margin: "20px"
          }}
        >
          <Routes>
            <Route path={"*"} element={<ContestEditDetails />} />
            <Route path={"problems"} element={<ContestEditProblems />} />
            <Route path={"moderators"} element={<ContestEditModerators />} />
            <Route path={"signups"} element={<ContestEditSignUps />} />
            <Route path={"leaderboard"} element={<ContestEditLeaderboard />} />
            <Route path={"statistics"} element={<ContestEditStatistics />} />
          </Routes>
        </Box>
      </Card>
    </>
  );
};

export default EditContestDetails;
