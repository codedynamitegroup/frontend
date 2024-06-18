import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link as RouterLink, matchPath } from "react-router-dom";
import { selected } from "reduxes/Selected";
import { RootState } from "store";
import classes from "./styles.module.scss";
import { Card } from "@mui/joy";
import { Box } from "@mui/material";
import { Link } from "@mui/material";
import useAuth from "hooks/useAuth";
import { routes } from "routes/routes";
import images from "config/images";

export interface SidebarItem {
  name: string;
  icon: JSX.Element;
  link?: string;
  children?: Array<{ name: string; link: string }>;
  "translation-key"?: string;
}

interface SidebarManagementProps {
  sideBarItem: SidebarItem[];
}

interface ILinkMenu {
  name: string;
  path: string;
  isActive?: boolean;
  position: "left" | "right";
}

export default function SidebarManagement(sideBarItemList: SidebarManagementProps) {
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locationHook = useLocation();
  const path = locationHook.pathname;
  const [sideBar, setSidebar] = useState<SidebarItem[]>(sideBarItemList.sideBarItem);
  const [openItems, setOpenItems] = useState<number | null>(null);
  useEffect(() => {
    setSidebar(sideBarItemList.sideBarItem);
  }, [sideBarItemList.sideBarItem]);

  useEffect(() => {
    sideBar.forEach((item, index) => {
      if (item.children) {
        item.children.forEach((child, childIndex) => {
          if (child.link.includes(path)) {
            dispatch(selected({ parentIndex: index, childIndex: childIndex }));
            setOpenItems(index);
            return;
          }
        });
      } else {
        if (item.link?.includes(path)) {
          dispatch(selected({ parentIndex: index, childIndex: -1 }));
          return;
        }
      }
    });
  }, [path]);
  const state = useSelector((state: RootState) => state.selected);

  const handleClick = (index: number, sideBarItem: SidebarItem, child: Array<{ name: string }>) => {
    if (sideBarItem.children === undefined) {
      dispatch(selected({ parentIndex: index, childIndex: -1 }));
      navigate(sideBarItem.link!!);
    }

    if (openItems === index) {
      setOpenItems(null);
    } else {
      setOpenItems(index);
      setSidebar(sideBarItemList.sideBarItem);
      if (child.length === 0) {
        setSidebar((prevSideBar) =>
          prevSideBar.map((item, i) =>
            i === index
              ? {
                  ...item
                }
              : item
          )
        );

        if (sideBarItem && sideBarItem.link) {
          navigate(sideBarItem.link);
        }
      }
    }
  };

  const handleClickChild = (parentIndex: number, childIndex: number) => {
    dispatch(selected({ parentIndex: parentIndex, childIndex: childIndex }));
    navigate(sideBar[parentIndex].children!![childIndex].link);
  };

  const { pathname } = useLocation();
  const activeRoute = (routeName: string) => {
    const match = matchPath(routeName, pathname);
    return !!match;
  };

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
  }, [pathname, loggedUser]);

  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
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
      <Card
        sx={{
          padding: "3px",
          margin: "20px",
          backgroundColor: "#fff",
          width: "90%"
        }}
        variant='soft'
      >
        <List>
          {sideBar.map((list, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleClick(index, list, list.children || [])}
                  className={classes.item}
                  selected={state.parentIndex === index && state.childIndex === -1}
                >
                  <ListItemIcon
                    sx={{
                      fontSize: "14px"
                    }}
                    className={classes.itemIcon}
                  >
                    {list.icon}
                  </ListItemIcon>
                  <ListItemText
                    translation-key={list["translation-key"] ? list["translation-key"] : "none"}
                    primary={list.name}
                    className={classes.itemText}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      letterSpacing: 0
                    }}
                  />
                  {list.children && (openItems === index ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {list.children && (
                <Collapse in={openItems === index} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    {list.children.map((item: any, childIndex) => (
                      <ListItemButton
                        key={childIndex}
                        onClick={() => handleClickChild(index, childIndex)}
                        className={classes.childItem}
                        selected={state.parentIndex === index && state.childIndex === childIndex}
                      >
                        <ListItemText secondary={item.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Box>
  );
}
