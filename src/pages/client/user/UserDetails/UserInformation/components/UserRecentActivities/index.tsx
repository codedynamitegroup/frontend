import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Card, Divider, Link, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import { useState } from "react";
import UserRecentSolutionsTable from "./components/UserRecentSolutionsTable";
import UserRecentSubmissionsTable from "./components/UserRecentSubmissionsTable";
import classes from "./styles.module.scss";
import CustomHeatMap from "components/heatmap/CustomHeatMap";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";

const UserRecentActivities = () => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [submissionViewTypeIndex, setSubmissionViewTypeIndex] = useState(0);

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

            {/* <Button
              btnType={BtnType.Text}
              onClick={() => {}}
              endIcon={<ChevronRightIcon />}
              
            >
              {t("user_detail_get_certification")}
            </Button> */}
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
          <CustomHeatMap
            value={[
              { date: "2016/01/11", count: 2 },
              ...[...Array(17)].map((_, idx) => ({ date: `2016/01/${idx + 10}`, count: idx })),
              ...[...Array(17)].map((_, idx) => ({ date: `2016/02/${idx + 10}`, count: idx })),
              { date: "2016/04/12", count: 2 },
              { date: "2016/05/01", count: 5 },
              { date: "2016/05/02", count: 5 },
              { date: "2016/05/03", count: 1 },
              { date: "2016/05/04", count: 11 },
              { date: "2016/05/08", count: 32 }
            ]}
          />
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
                label={t("user_detail_submission")}
                icon={<AssignmentTurnedInIcon />}
                iconPosition='start'
                translation-key='user_detail_submission'
              />
            </Tabs>
            {tabIndex === 0 ? (
              <Button
                btnType={BtnType.Text}
                onClick={() => {}}
                endIcon={<ChevronRightIcon />}
                translation-key='user_detail_see_all_submission'
              >
                {t("user_detail_see_all_submission")}
              </Button>
            ) : (
              <Tabs
                value={submissionViewTypeIndex}
                onChange={(e, newValue) => {
                  setSubmissionViewTypeIndex(newValue);
                }}
              >
                <Tab
                  label={t("user_detail_recent")}
                  icon={<AccessTimeIcon fontSize='small' />}
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
                  sx={{
                    fontSize: "12px"
                  }}
                  translation-key='user_detail_most_comment'
                />
              </Tabs>
            )}
          </Box>
          {tabIndex === 0 ? <UserRecentSubmissionsTable /> : <UserRecentSolutionsTable />}
        </Box>
      </Card>
    </Box>
  );
};

export default UserRecentActivities;
