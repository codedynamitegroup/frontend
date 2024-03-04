import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { styled, useTheme } from "@mui/material/styles";
import { CalendarIcon } from "@mui/x-date-pickers";
import { DrawerHeader } from "components/Header";
import React from "react";
import { routes } from "routes/routes";
import SidebarManagement, { SidebarItem } from "../SidebarManagement";
import classes from "./styles.module.scss";
import { Button } from "@mui/material";
import images from "config/images";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ParagraphBody from "components/text/ParagraphBody";
import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { Logout, Person } from "@mui/icons-material";

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
    path: routes.user.contest.root
  },
  {
    name: "Khóa học",
    path: routes.student.course.management
  }
];

const auth: ILinkMenu[] = [
  {
    name: "Đăng nhập",
    path: routes.user.login.root
  },
  {
    name: "Đăng ký",
    path: routes.user.register.root
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
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const toogleDrawer = () => {
    setOpen((pre) => !pre);
  };

  const [state, setState] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setState(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setState(false);
    navigate(routes.user.homepage.root);
  };

  const handleLogo = () => {
    if (state === true) {
      navigate(routes.user.dashboard.root);
    } else {
      navigate(routes.user.homepage.root);
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <AppBar position='fixed' open={open} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label='open drawer'
              onClick={toogleDrawer}
              edge='start'
              sx={{
                mr: 2
                //...(open && { display: "none" })
              }}
            >
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
            <Box className={classes.logo} onClick={handleLogo}>
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
          {state === false ? (
            <Box className={classes.navbarAuthItem}>
              {auth.map((page, index) => (
                <Button key={index} className={classes.item} onClick={() => navigate(page.path)}>
                  {page.name}
                </Button>
              ))}
            </Box>
          ) : (
            <Box className={classes.profile}>
              <IconButton
                onClick={handleClick}
                size='small'
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup='true'
                aria-expanded={open ? "true" : undefined}
              >
                <img
                  className={classes.imageProfile}
                  src={
                    "https://icdn.dantri.com.vn/thumb_w/680/2023/06/25/34855533210416990734836827386162909364813774n-edited-1687683216865.jpeg"
                  }
                  alt='avatar'
                ></img>
                <ParagraphBody fontWeight={700}>HIEUTHUHAI</ParagraphBody>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        className={classes.menuProfile}
        open={openMenu}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate(routes.user.information)}>
          <ListItemIcon>
            <Person fontSize='small' />
          </ListItemIcon>
          Thông tin tài khoản
        </MenuItem>
        <MenuItem className={classes.logout} onClick={handleLogout}>
          <ListItemIcon>
            <Logout className={classes.iconLogout} fontSize='small' />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
      <Drawer
        className={classes.drawer}
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
