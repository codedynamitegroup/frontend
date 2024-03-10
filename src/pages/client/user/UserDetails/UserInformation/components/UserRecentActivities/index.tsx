import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Card, Divider, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import { useState } from "react";
import UserRecentSolutionsTable from "./components/UserRecentSolutionsTable";
import UserRecentSubmissionsTable from "./components/UserRecentSubmissionsTable";
import classes from "./styles.module.scss";
import CustomHeatMap from "components/heatmap/CustomHeatMap";
import ParagraphBody from "components/text/ParagraphBody";

const UserRecentActivities = () => {
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
          <Heading1 fontWeight={"500"}>Chứng chỉ của tôi</Heading1>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ParagraphBody>Chưa có chứng chỉ nào</ParagraphBody>
            <Button btnType={BtnType.Text} onClick={() => {}} endIcon={<ChevronRightIcon />}>
              Lấy chứng chỉ ngay
            </Button>
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
          <Heading1 fontWeight={"500"}>Thống kê hoạt động</Heading1>
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
          <Heading1 fontWeight={"500"}>Hoạt động gần đây</Heading1>
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
              <Tab label='Bài làm' icon={<NoteAltIcon />} iconPosition='start' />
              <Tab label='Bài giải' icon={<AssignmentTurnedInIcon />} iconPosition='start' />
            </Tabs>
            {tabIndex === 0 ? (
              <Button btnType={BtnType.Text} onClick={() => {}} endIcon={<ChevronRightIcon />}>
                Xem tất cả bài làm
              </Button>
            ) : (
              <Tabs
                value={submissionViewTypeIndex}
                onChange={(e, newValue) => {
                  setSubmissionViewTypeIndex(newValue);
                }}
              >
                <Tab
                  label=' Gần đây nhất'
                  icon={<AccessTimeIcon fontSize='small' />}
                  iconPosition='start'
                  sx={{
                    fontSize: "12px"
                  }}
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
                  label='Nhiều bình chọn nhất'
                  icon={<WhatshotIcon fontSize='small' />}
                  iconPosition='start'
                  sx={{
                    fontSize: "12px"
                  }}
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
