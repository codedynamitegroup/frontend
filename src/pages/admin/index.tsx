import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { Route, Routes } from "react-router";
import RequireAuth from "components/common/RequireAuth";
import { ERoleName } from "models/authService/entity/role";
import ContestManagement from "./ContestManagement/ContestManagement";
import CreateContest from "./ContestManagement/CreateContest";
import EditContestDetails from "./ContestManagement/EditContestDetails";
import SidebarSystemAdmin from "components/common/sidebars/SidebarSystemAdmin";
import UserInformation from "pages/client/user/UserDetails/UserInformation";
import React from "react";
import AdminDashboard from "./Dashboard";
import Footer from "components/Footer";
import UserManagement from "./UserManagement/UserManagement";
import CreateUser from "./UserManagement/CreateUser";

type Props = {};

const SystemAdminHomepage = (props: Props) => {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen((pre) => !pre);
  };

  return (
    <Grid className={classes.root}>
      <SidebarSystemAdmin open={open} toggleDrawer={toggleDrawer}>
        {/* <Box className={classes.container}> */}
        <Box className={classes.body}>
          <Routes>
            <Route element={<RequireAuth availableRoles={[ERoleName.ADMIN]} />}>
              <Route path={"contests"} element={<ContestManagement />} />
              <Route path={"contests/create"} element={<CreateContest />} />
              <Route
                path={"contests/edit/:contestId/*"}
                element={<EditContestDetails isDrawerOpen={open} />}
              />
              <Route path={"information"} element={<UserInformation />} />
              <Route path={"/dashboard"} element={<AdminDashboard />} />
              <Route path={"users"} element={<UserManagement />} />
              <Route path={"users/create"} element={<CreateUser />} />
            </Route>
          </Routes>
        </Box>
        {/* </Box> */}
      </SidebarSystemAdmin>
    </Grid>
  );
};

export default SystemAdminHomepage;
