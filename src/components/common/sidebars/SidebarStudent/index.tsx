import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { styled, useTheme } from "@mui/material/styles";
import { CalendarIcon } from "@mui/x-date-pickers";
import Header, { DrawerHeader } from "components/Header";
import React from "react";
import { routes } from "routes/routes";
import SidebarManagement, { SidebarItem } from "../SidebarManagement";
import classes from "./styles.module.scss";
import { Button } from "@mui/material";
import images from "config/images";
import { useNavigate } from "react-router-dom";
interface ILinkMenu {
  name: string;
  path: string;
}

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

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const pages: ILinkMenu[] = [
  {
    name: "Khám phá",
    path: routes.user.course_certificate.root
  },
  {
    name: "Luyện tập",
    path: routes.user.problem.root
  },
  {
    name: "Cuộc thi",
    path: "/"
  }
];

const auth: ILinkMenu[] = [
  {
    name: "Đăng nhập",
    path: "/login"
  },
  {
    name: "Đăng ký",
    path: "/register"
  }
];

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    // width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

export default function SideBarLecturer({ children }: any) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toogleDrawer = () => {
    setOpen((pre) => !pre);
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <AppBar position='fixed' open={open}>
        <Toolbar className={classes.toolbar}>
          <Box sx={{ display: "flex" }}>
            <IconButton
              aria-label='open drawer'
              onClick={toogleDrawer}
              edge='start'
              sx={{
                mr: 2
                //...(open && { display: "none" })
              }}
            >
              <MenuIcon sx={{ color: "white" }} />
            </IconButton>
            <Box className={classes.logo}>
              <img className={classes.imageLogo} src={images.logo.logo} alt='logo' />
            </Box>
            <Box className={classes.navbarItem}>
              {pages.map((page, index) => (
                <Button key={index} className={classes.item} onClick={() => navigate(page.path)}>
                  {page.name}
                </Button>
              ))}
            </Box>
          </Box>
          <Box className={classes.navbarAuthItem}>
            {auth.map((page, index) => (
              <Button key={index} className={classes.item} onClick={() => navigate(page.path)}>
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop: "64px"
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        {/* <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader> */}
        <SidebarManagement sideBarItem={sideBarItemListData} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
