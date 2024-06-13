import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { Route, Routes } from "react-router";
import RequireAuth from "components/common/RequireAuth";
import { ERoleName } from "models/authService/entity/role";
import UserInformation from "pages/client/user/UserDetails/UserInformation";
import React from "react";
import UserManagement from "./UserManagement/UserManagement";
import EditUserDetails from "./UserManagement/EditUserDetails";
import SidebarOrganizationAdmin from "components/common/sidebars/SidebarOrganizationAdmin";

type Props = {};

const OrganizationAdminHomepage = (props: Props) => {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen((pre) => !pre);
  };

  return (
    <Grid className={classes.root}>
      <SidebarOrganizationAdmin open={open} toggleDrawer={toggleDrawer}>
        {/* <Box className={classes.container}> */}
        <Box className={classes.body}>
          <Routes>
            <Route element={<RequireAuth availableRoles={[ERoleName.ADMIN_MOODLE]} />}>
              <Route path={"information"} element={<UserInformation />} />
              <Route path={"users"} element={<UserManagement />} />
              <Route path={"users/edit/:userId/*"} element={<EditUserDetails />} />
            </Route>
          </Routes>
        </Box>
        {/* </Box> */}
      </SidebarOrganizationAdmin>
    </Grid>
  );
};

export default OrganizationAdminHomepage;
