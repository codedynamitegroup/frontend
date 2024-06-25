import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef } from "react";
import { routes } from "routes/routes";
import SidebarManagement, { SidebarItem } from "../SidebarManagement";
import classes from "./styles.module.scss";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import images from "config/images";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CodeIcon from "@mui/icons-material/Code";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { setSidebarWidth } from "reduxes/SidebarStatus";
import { useDispatch } from "react-redux";

const drawerWidth = 270;

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

export default function SidebarSystemAdmin({ open, toggleDrawer, children }: any) {
  const { t } = useTranslation();
  const sideBarItemListData: SidebarItem[] = [
    {
      name: t("common_dashboard"),
      "translation-key": "common_dashboard",
      icon: <DashboardRoundedIcon className={classes.itemIcon} />,
      link: routes.admin.dashboard
    },
    {
      name: t("side_bar_contest_management"),
      "translation-key": "side_bar_contest_management",
      icon: <EmojiEventsOutlinedIcon className={classes.itemIcon} />,
      link: routes.admin.contest.root
    },
    {
      name: t("side_bar_user_management"),
      "translation-key": "side_bar_user_management",
      icon: <PersonIcon className={classes.itemIcon} />,
      link: routes.admin.users.root
    },
    {
      name: t("side_bar_certificate_course"),
      "translation-key": "side_bar_certificate_course",
      icon: <WorkspacePremiumOutlinedIcon className={classes.itemIcon} />,
      link: routes.admin.certificate.root,
      children: [
        { name: t("certificate_course_list"), link: routes.admin.certificate.root },

        {
          name: t("create_certificate_course_title"),
          link: routes.admin.certificate.create
          // icon: <AddCircleRoundedIcon className={classes.itemIcon} />
        }
      ]
    },
    {
      name: t("side_bar_code_management"),
      "translation-key": "side_bar_code_management",
      icon: <CodeIcon className={classes.itemIcon} />,
      link: routes.admin.code_question.root
    },
    {
      name: t("side_bar_question_bank_management"),
      "translation-key": "side_bar_question_bank_management",
      icon: <AccountBalanceIcon className={classes.itemIcon} />,
      link: routes.admin.question_bank.root
    },
    {
      name: t("side_bar_organization_management"),
      "translation-key": "side_bar_organization_management",
      icon: <img className={classes.img} src={images.admin.organizationIc} alt='org ic' />,
      link: routes.admin.organizations.root
    }
  ];
  // const [open, setOpen] = React.useState(true);

  // const toggleDrawer = () => {
  //   setOpen((pre) => !pre);
  // };

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const { width: sidebarWidth } = useBoxDimensions({
    ref: sidebarRef
  });
  const dispatch = useDispatch();

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
