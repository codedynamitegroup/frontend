import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/joy/IconButton";
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
import { Link as RouterLink, matchPath, useLocation, useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import images from "config/images";
import { Menu, MenuItem, ListItemIcon, Grid, Link, Avatar } from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import HeaderNotification from "./HeaderNotification";
import clsx from "clsx";
import useAuth from "hooks/useAuth";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import ParagraphBody from "components/text/ParagraphBody";
import useBoxDimensions from "hooks/useBoxDimensions";
import { setHeaderHeight } from "reduxes/SidebarStatus";

interface ILinkMenu {
  name: string;
  navigate_path: string;
  root_path: string;
  isActive?: boolean;
  position: "left" | "right";
}

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
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
  const {
    loggedUser,
    logout,
    isLecturer,
    isStudent,
    isSystemAdmin,
    isMoodleAdmin,
    isBelongToOrganization
  } = useAuth();
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus.isOpen);
  const dispatch = useDispatch();

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
      navigate_path: routes.user.course_certificate.root,
      root_path: routes.user.course_certificate.root_path,
      isActive: false,
      position: "left"
    },
    {
      name: "common_practice",
      navigate_path: routes.user.problem.root,
      root_path: routes.user.problem.root_path,
      isActive: false,
      position: "left"
    },
    {
      name: "header_contest",
      navigate_path: routes.user.contest.root,
      root_path: routes.user.contest.root_path,
      isActive: false,
      position: "left"
    },
    {
      name: "header_login_button",
      navigate_path: routes.user.login.root,
      root_path: routes.user.login.root,
      isActive: false,
      position: "right"
    },
    {
      name: "header_register_button",
      navigate_path: routes.user.register.root,
      root_path: routes.user.register.root,
      isActive: false,
      position: "right"
    }
  ];

  const [pagesHeader, setPagesHeader] = React.useState<ILinkMenu[]>(pagesHeaderDefault);

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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { pathname } = useLocation();

  const activeRoute = (routeName: string) => {
    const match = matchPath(routeName, pathname);
    return !!match;
  };

  useEffect(() => {
    if (activeRoute(routes.user.homepage.root) || activeRoute(routes.user.dashboard.root)) {
      setPagesHeader(pagesHeaderDefault);
    }
    const headerItem: ILinkMenu | undefined = pagesHeader.find((it: ILinkMenu) =>
      activeRoute(it.root_path)
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
  }, [pathname, loggedUser]);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  useEffect(() => {
    dispatch(setHeaderHeight(headerHeight));
  }, [dispatch, headerHeight]);

  return (
    <AppBar
      position='fixed'
      open={open}
      className={classes.header}
      sx={{
        paddingLeft: sidebarStatus && toggleDrawer ? "240px" : "0px"
      }}
    >
      <Toolbar disableGutters className={classes.toolbar} ref={headerRef}>
        <Box className={classes.toolbarGroup}>
          <Box className={classes.wrapper}>
            {toggleDrawer && (
              <IconButton
                aria-label='open drawer'
                onClick={toggleDrawer}
                sx={{
                  backgroundColor: sidebarStatus ? "var(--blue-light-4)" : "#EEEEEE",
                  transform: sidebarStatus ? "scaleX(1)" : "scaleX(-1)",
                  color: sidebarStatus ? "#002db3" : "var(--gray-80)",
                  marginRight: "10px"
                }}
                variant='soft'
              >
                <MenuOpenRoundedIcon />
              </IconButton>
            )}

            {(!toggleDrawer || sidebarStatus === false) && (
              <Box className={classes.logo}>
                <Link
                  component={RouterLink}
                  to={
                    loggedUser &&
                    !activeRoute(routes.admin.homepage.root) &&
                    !activeRoute(routes.org_admin.homepage.root)
                      ? routes.user.dashboard.root
                      : loggedUser && activeRoute(routes.org_admin.homepage.root)
                        ? routes.org_admin.users.root
                        : loggedUser && activeRoute(routes.admin.homepage.root)
                          ? routes.admin.dashboard
                          : routes.user.homepage.root
                  }
                  className={classes.textLink}
                >
                  <img src={images.logo.appLogo} alt='logo' />
                </Link>
              </Box>
            )}
          </Box>
          <Box className={classes.navbarItem} ml={2}>
            {!activeRoute(routes.admin.homepage.root) &&
              !activeRoute(routes.org_admin.homepage.root) &&
              pagesHeader
                .filter((page) => page.position === "left")
                .map((page, index) => (
                  <ParagraphBody
                    key={index}
                    className={clsx([page.isActive ? classes.isActive : "", classes.item])}
                    fontWeight={500}
                    fontSize={"15px"}
                    translation-key={page.name}
                    colorname={"--gray-50"}
                  >
                    <Link
                      component={RouterLink}
                      to={page.navigate_path}
                      translation-key={page.name}
                      className={classes.textLink}
                    >
                      {t(page.name)}
                    </Link>
                  </ParagraphBody>
                ))}

            {isStudent && (
              <ParagraphBody
                className={clsx([
                  activeRoute(routes.student.course.root) ? classes.isActive : "",
                  classes.item
                ])}
                fontWeight={500}
                translation-key='header_course'
                colorname={"--gray-50"}
                fontSize={"15px"}
              >
                <Link
                  component={RouterLink}
                  to={routes.student.course.management}
                  translation-key='header_course'
                  className={classes.textLink}
                >
                  {t("header_course")}
                </Link>
              </ParagraphBody>
            )}
            {isLecturer && (
              <ParagraphBody
                className={clsx([
                  activeRoute(routes.lecturer.course.management) ? classes.isActive : "",
                  classes.item
                ])}
                fontWeight={500}
                translation-key='header_course'
                colorname={"--gray-50"}
                fontSize={"15px"}
              >
                <Link
                  component={RouterLink}
                  to={routes.lecturer.course.management}
                  translation-key='header_course'
                  className={classes.textLink}
                >
                  {t("header_course")}
                </Link>
              </ParagraphBody>
            )}
            {!isBelongToOrganization &&
              !activeRoute(routes.admin.homepage.root) &&
              !activeRoute(routes.org_admin.homepage.root) && (
                <ParagraphBody
                  className={clsx([
                    activeRoute(routes.user.organization.root) ? classes.isActive : "",
                    classes.item
                  ])}
                  fontWeight={500}
                  translation-key='header_create_organization'
                  colorname={"--gray-50"}
                  fontSize={"15px"}
                >
                  <Link
                    component={RouterLink}
                    to={routes.user.organization.root}
                    translation-key='header_create_organization'
                    className={classes.textLink}
                  >
                    {t("header_create_organization")}
                  </Link>
                </ParagraphBody>
              )}
          </Box>
        </Box>

        <Box className={classes.toolbarGroup}>
          <Box>
            <LanguageSelector />
          </Box>
          {!loggedUser ? (
            <Box className={classes.navbarAuthItem}>
              {pagesHeader
                .filter((page) => page.position === "right")
                .map((page, index) => (
                  <ParagraphBody
                    key={index}
                    className={clsx([page.isActive ? classes.isActive : "", classes.item])}
                    fontWeight={500}
                    translation-key={page.name}
                    colorname={"--gray-50"}
                    fontSize={"15px"}
                  >
                    <Link
                      component={RouterLink}
                      to={page.navigate_path}
                      translation-key={page.name}
                      className={classes.textLink}
                    >
                      {t(page.name)}
                    </Link>
                  </ParagraphBody>
                ))}
            </Box>
          ) : (
            <Grid container direction='row' width='fit-content'>
              <Grid item marginTop='4px'>
                <HeaderNotification />
              </Grid>
              <Grid item>
                <PopupState variant='popover' popupId='demo-popup-menu'>
                  {(popupState) => (
                    <React.Fragment>
                      <Button
                        sx={{ textTransform: "none" }}
                        className={classes.profile}
                        {...bindTrigger(popupState)}
                      >
                        <Avatar
                          sx={{
                            bgcolor: `${generateHSLColorByRandomText(`${loggedUser.firstName} ${loggedUser.lastName}`)}`
                          }}
                          alt={loggedUser.email}
                          src={loggedUser.avatarUrl}
                          className={classes.avatarProfile}
                        >
                          {loggedUser.firstName.charAt(0)}
                        </Avatar>

                        <ParagraphBody fontWeight={500} colorname={"--gray-50"} fontSize={"15px"}>
                          {`${loggedUser.firstName} ${loggedUser.lastName}`}
                        </ParagraphBody>
                      </Button>
                      <Menu className={classes.menuProfile} {...bindMenu(popupState)}>
                        <MenuItem
                          onClick={() => {
                            popupState.close();
                            activeRoute(routes.admin.homepage.root)
                              ? navigate(routes.admin.information)
                              : activeRoute(routes.org_admin.homepage.root)
                                ? navigate(routes.org_admin.information)
                                : navigate(routes.user.information);
                          }}
                          translation-key='common_account_info'
                        >
                          <ListItemIcon>
                            <Person fontSize='small' />
                          </ListItemIcon>
                          {t("common_account_info")}
                        </MenuItem>
                        {isSystemAdmin && !activeRoute(routes.admin.homepage.root) && (
                          <MenuItem
                            onClick={() => {
                              popupState.close();
                              navigate(routes.admin.dashboard);
                            }}
                            translation-key='common_admin_page'
                          >
                            <ListItemIcon>
                              <Box className={classes.imgIcon}>
                                <img
                                  src={images.admin.adminManagement}
                                  alt='admin management img'
                                />
                              </Box>
                            </ListItemIcon>

                            {t("common_admin_page")}
                          </MenuItem>
                        )}
                        {((isSystemAdmin && activeRoute(routes.admin.homepage.root)) ||
                          (isMoodleAdmin && activeRoute(routes.org_admin.homepage.root))) && (
                          <MenuItem
                            onClick={() => {
                              popupState.close();
                              navigate(routes.user.dashboard.root);
                            }}
                            translation-key='common_user_page'
                          >
                            <ListItemIcon>
                              <Box className={classes.imgIcon}>
                                <img src={images.admin.clientPage} alt='client page img' />
                              </Box>
                            </ListItemIcon>

                            {t("common_user_page")}
                          </MenuItem>
                        )}
                        {isMoodleAdmin && !activeRoute(routes.org_admin.homepage.root) && (
                          <MenuItem
                            onClick={() => {
                              popupState.close();
                              navigate(routes.org_admin.users.root);
                            }}
                            translation-key='common_organization_page'
                          >
                            <ListItemIcon>
                              <Box className={classes.imgIcon}>
                                <img src={images.admin.organizationIc} alt='admin management img' />
                              </Box>
                            </ListItemIcon>

                            {t("common_organization_page")}
                          </MenuItem>
                        )}
                        <MenuItem
                          className={classes.logout}
                          onClick={() => {
                            popupState.close();
                            logout();
                          }}
                          translation-key='common_logout'
                        >
                          <ListItemIcon>
                            <Logout className={classes.iconLogout} fontSize='small' />
                          </ListItemIcon>
                          {t("common_logout")}
                        </MenuItem>
                      </Menu>
                    </React.Fragment>
                  )}
                </PopupState>
              </Grid>
            </Grid>
          )}
        </Box>
      </Toolbar>

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
                    primary={<ParagraphBody translation-key={item.name}>{item.name}</ParagraphBody>}
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
                    primary={<ParagraphBody translation-key={item.name}>{item.name}</ParagraphBody>}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
    </AppBar>
  );
});
export default React.memo(Header);
