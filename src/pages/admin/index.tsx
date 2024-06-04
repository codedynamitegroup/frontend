import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { Route, Routes } from "react-router";
import RequireAuth from "components/common/RequireAuth";
import { ERoleName } from "models/authService/entity/role";
import ContestManagement from "./ContestManagement/ContestManagement";
import CreateContest from "./ContestManagement/CreateContest";
import EditContestDetails from "./ContestManagement/EditContestDetails";
import SidebarSystemAdmin from "components/common/sidebars/SidebarSystemAdmin";

type Props = {};

const SystemAdminHomepage = (props: Props) => {
  return (
    <Grid className={classes.root}>
      <SidebarSystemAdmin>
        <Box className={classes.container}>
          <Box className={classes.body}>
            <Routes>
              <Route element={<RequireAuth availableRoles={[ERoleName.ADMIN]} />}>
                <Route path={"contests"} element={<ContestManagement />} />
                <Route path={"contests/create"} element={<CreateContest />} />
                <Route path={"contests/edit/:contestId/*"} element={<EditContestDetails />} />
              </Route>
            </Routes>
          </Box>
        </Box>
      </SidebarSystemAdmin>
    </Grid>
  );
};

export default SystemAdminHomepage;
