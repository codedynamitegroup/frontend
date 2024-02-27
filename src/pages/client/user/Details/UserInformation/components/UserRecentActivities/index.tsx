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

const UserRecentActivities = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [submissionViewTypeIndex, setSubmissionViewTypeIndex] = useState(0);
  const [data, setData] = useState({});

  return (
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
  );
};

export default UserRecentActivities;
