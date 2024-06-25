import DashboardIcon from "@mui/icons-material/Dashboard";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Header from "components/Header";
import React, { useEffect, useRef } from "react";
import { routes } from "routes/routes";
import SidebarManagement, { SidebarItem } from "../SidebarManagement";
import classes from "./styles.module.scss";
import { CalendarIcon } from "@mui/x-date-pickers";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useDispatch } from "react-redux";
import { setSidebarWidth, toggleSidebar } from "reduxes/SidebarStatus";
import { RootState } from "store";
import { useSelector } from "react-redux";

const drawerWidth = 270;
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
  overflow: "auto",
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

export default function SidebarStudent({ children }: any) {
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setOpen((pre) => !pre);
    dispatch(toggleSidebar());
  };

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const { width: sidebarWidth } = useBoxDimensions({
    ref: sidebarRef
  });

  useEffect(() => {
    dispatch(setSidebarWidth(sidebarWidth));
  }, [sidebarWidth, dispatch]);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Header toggleDrawer={toggleDrawer} />
      <Drawer
        className={classes.drawer}
        ref={sidebarRef}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth
            // marginTop: `${headerHeight + 2}px`
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <SidebarManagement sideBarItem={sideBarItemListData} />
      </Drawer>
      <Main
        open={open}
        sx={{
          marginTop: `${sidebarStatus.headerHeight}px`,
          height: `calc(100% - ${sidebarStatus.headerHeight}px)`
        }}
      >
        {children}
      </Main>
    </Box>
  );
}
