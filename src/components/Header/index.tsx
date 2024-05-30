import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { styled, useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import classes from "./styles.module.scss";
import { useEffect } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import images from "config/images";
import { Menu, MenuItem, ListItemIcon, Grid } from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import ParagraphSmall from "components/text/ParagraphSmall";
import HeaderNotification from "./HeaderNotification";
import { logOut, selectCurrentUser } from "reduxes/Auth";
import { useDispatch, useSelector } from "react-redux";
import { User } from "models/authService/entity/user";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";
import { UserService } from "services/authService/UserService";

interface ILinkMenu {
  name: string;
  path: string;
  isActive?: boolean;
  position: "left" | "right";
}

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
}));

interface HeaderProps {
  toggleDrawer?: () => void;
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const drawerWidth = 240;
  const { t } = useTranslation();
  const { toggleDrawer } = props;
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open"
  })<AppBarProps>(({ theme, open }) => ({
    boxShadow: "none",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  }));

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const pagesHeaderDefault: ILinkMenu[] = [
    {
      name: "header_explore_course",
      path: routes.user.course_certificate.root,
      isActive: false,
      position: "left"
    },
    {
      name: "common_practice",
      path: routes.user.problem.root,
      isActive: false,
      position: "left"
    },
    {
      name: "header_contest",
      path: routes.user.contest.root,
      isActive: false,
      position: "left"
    },
    {
      name: "header_course",
      path: routes.student.course.management,
      isActive: false,
      position: "left"
    },
    {
      name: "header_login_button",
      path: routes.user.login.root,
      isActive: false,
      position: "right"
    },
    {
      name: "header_register_button",
      path: routes.user.register.root,
      isActive: false,
      position: "right"
    }
  ];

  const [pagesHeader, setPagesHeader] = React.useState<ILinkMenu[]>(pagesHeaderDefault);

  const dispatch = useDispatch();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const loggedUser: User = useSelector(selectCurrentUser);

  const handleClickPage = (page: any) => {
    if (
      localStorage.getItem("role") === "lecturer" &&
      page.path === routes.student.course.management
    ) {
      navigate(routes.lecturer.course.management);
    } else {
      navigate(page.path);
    }
  };

  const { pathname } = useLocation();

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
    return !!match;
  };

  useEffect(() => {
    if (activeRoute(routes.user.homepage.root) || activeRoute(routes.user.dashboard.root)) {
      setPagesHeader(pagesHeaderDefault);
    }
    const headerItem: ILinkMenu | undefined = pagesHeader.find((it: ILinkMenu) =>
      activeRoute(it.path)
    );

    if (!headerItem) {
      return;
    }

    const pagesHeaderUpdated = pagesHeader.map((item) => {
      if (item.name === headerItem.name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
      return item;
    });
    setPagesHeader(pagesHeaderUpdated);
  }, [pathname]);

  const handleLogout = async () => {
    UserService.logout()
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        const provider = localStorage.getItem("provider");
        if (provider === ESocialLoginProvider.MICROSOFT) {
          sessionStorage.clear();
        }
        localStorage.removeItem("provider");
        dispatch(logOut());
        navigate(routes.user.homepage.root);
      })
      .catch((error) => {
        console.error("Failed to logout", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      });
  };

  const handleLogo = () => {
    if (loggedUser) {
      navigate(routes.user.dashboard.root);
    } else {
      navigate(routes.user.homepage.root);
    }
  };

  return (
    <AppBar position='fixed' open={open} className={classes.header} ref={ref}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters className={classes.toolbar}>
          <Box className={classes.wrapper}>
            {toggleDrawer && (
              <IconButton
                aria-label='open drawer'
                onClick={toggleDrawer}
                edge='start'
                sx={{
                  mr: 2
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box className={classes.logo} onClick={handleLogo}>
              <img src={images.logo.appLogo} alt='logo' />
            </Box>
          </Box>
          <Box className={classes.navbarItem}>
            {pagesHeader
              .filter((page) => page.position === "left")
              .map((page, index) => (
                <Button
                  key={index}
                  sx={{ textTransform: "none", margin: "1rem" }}
                  className={classes.item}
                  onClick={() => handleClickPage(page)}
                >
                  <ParagraphSmall
                    className={page.isActive ? classes.isActive : ""}
                    fontWeight={600}
                    translation-key={page.name}
                    colorname={"--gray-50"}
                  >
                    {t(page.name)}
                  </ParagraphSmall>
                </Button>
              ))}
          </Box>
          <Box>
            <LanguageSelector />
          </Box>
          {!loggedUser ? (
            <Box className={classes.navbarAuthItem}>
              {pagesHeader
                .filter((page) => page.position === "right")
                .map((page, index) => (
                  <Button
                    key={index}
                    sx={{ textTransform: "none", margin: "1rem" }}
                    className={classes.item}
                    onClick={() => handleClickPage(page)}
                  >
                    <ParagraphSmall
                      className={page.isActive ? classes.isActive : ""}
                      fontWeight={600}
                      translation-key={page.name}
                      colorname={"--gray-50"}
                    >
                      {t(page.name)}
                    </ParagraphSmall>
                  </Button>
                ))}
            </Box>
          ) : (
            <Grid container direction='row' width='fit-content'>
              <Grid item marginTop='4px'>
                <HeaderNotification />
              </Grid>
              <Grid item>
                <Button
                  onClick={handleClick}
                  className={classes.profile}
                  size='small'
                  sx={{ ml: 2, textTransform: "none" }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? "true" : undefined}
                >
                  <img
                    className={classes.imageProfile}
                    src={
                      loggedUser.avatarUrl ? loggedUser.avatarUrl : images.avatar.avatarBoyDefault
                    }
                    alt='avatar'
                  ></img>
                  <ParagraphSmall fontWeight={600}>
                    {loggedUser.firstName + " " + loggedUser.lastName}
                  </ParagraphSmall>
                </Button>
              </Grid>
            </Grid>
          )}
        </Toolbar>
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
          <MenuItem
            onClick={() => navigate(routes.user.information)}
            translation-key='common_account_info'
          >
            <ListItemIcon>
              <Person fontSize='small' />
            </ListItemIcon>
            {t("common_account_info")}
          </MenuItem>
          <MenuItem
            className={classes.logout}
            onClick={handleLogout}
            translation-key='common_logout'
          >
            <ListItemIcon>
              <Logout className={classes.iconLogout} fontSize='small' />
            </ListItemIcon>
            {t("common_logout")}
          </MenuItem>
        </Menu>
        <Drawer
          className={classes.drawer}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box"
            },
            display: { xs: "flex", md: "none" }
          }}
          variant='persistent'
          anchor='left'
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? <CloseIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <List>
            {pagesHeader
              .filter((page) => page.position === "left")
              .map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <ParagraphSmall translation-key={item.name}>{item.name}</ParagraphSmall>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
          <Divider />
          <List>
            {pagesHeader
              .filter((page) => page.position === "right")
              .map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <ParagraphSmall translation-key={item.name}>{item.name}</ParagraphSmall>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Drawer>
      </Container>
    </AppBar>
  );
});
export default Header;
