import DashboardIcon from "@mui/icons-material/Dashboard";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Header, { DrawerHeader } from "components/Header";
import React, { useRef } from "react";
import { routes } from "routes/routes";
import SidebarManagement, { SidebarItem } from "../SidebarManagement";
import classes from "./styles.module.scss";
import { CalendarIcon } from "@mui/x-date-pickers";
import useBoxDimensions from "hooks/useBoxDimensions";

const drawerWidth = 300;
const sideBarItemListData: SidebarItem[] = [
  {
    name: "Trang chủ",
    icon: <DashboardIcon className={classes.itemIcon} />,
    link: routes.student.course.management
  },
  {
    name: "Lịch",
    icon: <CalendarIcon className={classes.itemIcon} />,
    link: routes.student.calendar
  }
];
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  width: `calc(100% - ${drawerWidth}px)`,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

export default function SidebarLecturer({ children }: any) {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen((pre) => !pre);
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Header toggleDrawer={toggleDrawer} ref={headerRef} />
      <Drawer
        className={classes.drawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop: `${headerHeight}px`
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <SidebarManagement sideBarItem={sideBarItemListData} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
