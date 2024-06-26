import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Card, Divider, Link, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import { useCallback, useEffect, useState } from "react";
import UserRecentSharedSolution from "./components/UserRecentSharedSolution";
import UserRecentCodeQuestion from "./components/UserRecentCodeQuestion";
import classes from "./styles.module.scss";
import CustomHeatMap from "components/heatmap/CustomHeatMap";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";
import { useDispatch } from "react-redux";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { setErrorMess } from "reduxes/AppStatus";

export enum ESharedSolutionType {
  RECENT = 0,
  MOST_COMMENT = 1
}
const UserRecentActivities = () => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [sharedSolutionTypeIndex, setSharedSolutionTypeIndex] = useState<ESharedSolutionType>(
    ESharedSolutionType.RECENT
  );

  const [data, setData] = useState<
    {
      date: string;
      count: number;
    }[]
  >([]);

  const dispatch = useDispatch();

  const handleGetHeatMap = useCallback(
    async ({ year = 2024 }: { year?: number }) => {
      try {
        const getHeatMapResponse = await CodeSubmissionService.getHeatMap(year);
        const formattedData = getHeatMapResponse.map((item: any) => ({
          date: item.date,
          count: item.numOfSubmission
        }));
        setData(formattedData);
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
      }
    },
    [dispatch, t]
  );

  useEffect(() => {
    const fetchRecentHeatMap = async () => {
      // dispatch(setInititalLoading(true));
      await handleGetHeatMap({});
      // dispatch(setInititalLoading(false));
    };

    fetchRecentHeatMap();
  }, [dispatch, handleGetHeatMap]);

  return (
    <Box>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px"
        }}
      >
        <Box className={classes.formBody}>
          <Heading1 fontWeight={"500"} translation-key='user_detail_certification'>
            {t("user_detail_certification")}
          </Heading1>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px"
            }}
          >
            <ParagraphBody translation-key='user_detail_non_certification'>
              {t("user_detail_non_certification")}
            </ParagraphBody>
            <ParagraphBody translation-key='user_detail_get_certification' colorname='--blue-2'>
              <Link
                component={RouterLink}
                to={routes.user.course_certificate.root}
                className={classes.textLink}
              >
                {t("user_detail_get_certification")} <ChevronRightIcon />
              </Link>
            </ParagraphBody>
          </Box>
        </Box>
      </Card>

      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px"
        }}
      >
        <Box className={classes.formBody}>
          <Heading1 fontWeight={"500"} translation-key='user_detail_activity_stats'>
            {t("user_detail_activity_stats")}
          </Heading1>
          <Divider />
          <CustomHeatMap value={data} />
        </Box>
      </Card>

      <Card
        sx={{
          height: "100%"
        }}
      >
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Heading1 fontWeight={"500"} translation-key='user_detail_recent_activity'>
            {t("user_detail_recent_activity")}
          </Heading1>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={(e, newValue) => {
                setTabIndex(newValue);
              }}
            >
              <Tab
                label={t("user_detail_problem")}
                icon={<NoteAltIcon />}
                iconPosition='start'
                translation-key='user_detail_problem'
              />
              <Tab
                label={t("user_detail_shared_solution")}
                icon={<AssignmentTurnedInIcon />}
                iconPosition='start'
                translation-key='user_detail_shared_solution'
              />
            </Tabs>
            {tabIndex === 0 ? (
              <></>
            ) : (
              <Tabs
                value={sharedSolutionTypeIndex}
                onChange={(e, newValue) => {
                  setSharedSolutionTypeIndex(newValue);
                }}
              >
                <Tab
                  label={t("user_detail_recent")}
                  icon={<AccessTimeIcon fontSize='small' />}
                  value={ESharedSolutionType.RECENT}
                  iconPosition='start'
                  sx={{
                    fontSize: "12px"
                  }}
                  translation-key='user_detail_recent'
                />
                <Divider
                  orientation='vertical'
                  flexItem
                  sx={{
                    height: "25px",
                    margin: "auto"
                  }}
                />
                <Tab
                  label={t("user_detail_most_comment")}
                  icon={<WhatshotIcon fontSize='small' />}
                  iconPosition='start'
                  value={ESharedSolutionType.MOST_COMMENT}
                  sx={{
                    fontSize: "12px"
                  }}
                  translation-key='user_detail_most_comment'
                />
              </Tabs>
            )}
          </Box>
          {tabIndex === 0 ? (
            <UserRecentCodeQuestion />
          ) : (
            <UserRecentSharedSolution sharedSolutionType={sharedSolutionTypeIndex} />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default UserRecentActivities;
