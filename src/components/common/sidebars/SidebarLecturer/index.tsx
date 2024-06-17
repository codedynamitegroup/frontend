import CodeIcon from "@mui/icons-material/Code";
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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "reduxes/SidebarStatus";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  width: `calc(100% - ${drawerWidth}px)`,
  overflow: "auto",
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
  const { t } = useTranslation();
  const sideBarItemListData: SidebarItem[] = [
    {
      name: t("side_bar_dashboard"),
      "translation-key": "side_bar_dashboard",
      icon: <DashboardIcon className={classes.itemIcon} />,
      link: routes.lecturer.course.management
    },
    {
      name: t("calendar_title"),
      "translation-key": "calendar_title",
      icon: <CalendarIcon className={classes.itemIcon} />,
      link: routes.lecturer.calendar
    },
    // {
    //   name: t("code_management_title"),
    //   "translation-key": "code_management_title",
    //   icon: <CodeIcon className={classes.itemIcon} />,
    //   link: routes.lecturer.code_question.management
    // },
    {
      name: i18next.format(t("common_question_bank"), "firstUppercase"),
      "translation-key": "common_question_bank",
      icon: <AccountBalanceIcon className={classes.itemIcon} />,
      link: routes.lecturer.question_bank.path
    }
  ];
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setOpen((pre) => !pre);
    dispatch(toggleSidebar());
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Header toggleDrawer={toggleDrawer} ref={headerRef} />
      <Drawer
        className={classes.drawer}
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
        sx={{ marginTop: `${headerHeight}px`, height: `calc(100% - ${headerHeight}px)` }}
      >
        {children}
      </Main>
    </Box>
  );
}
