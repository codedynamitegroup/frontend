import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import classes from "./styles.module.scss";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import images from "config/images";
import { Avatar } from "@mui/material";
import { RootState } from "store";
import { selected } from "reduxes/Selected";
import Heading1 from "components/text/Heading1";

export interface SidebarItem {
  name: string;
  icon: JSX.Element;
  link?: string;
  children?: Array<{ name: string; link: string }>;
}

interface SidebarManagementProps {
  sideBarItem: SidebarItem[];
}

export default function SidebarManagement(sideBarItemList: SidebarManagementProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locationHook = useLocation();
  const path = locationHook.pathname;
  const [sideBar, setSidebar] = useState<SidebarItem[]>(sideBarItemList.sideBarItem);
  const [openItems, setOpenItems] = useState<number | null>(null);

  useEffect(() => {
    sideBar.map((item, index) => {
      if (item.children) {
        item.children.map((child, childIndex) => {
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
                  ...item,
                  icon: React.cloneElement(item.icon, {
                    className: classes.selectedIcon
                  })
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

  return (
    <Box className={classes.boxContainer}>
      <Drawer variant='permanent' anchor='left' className={classes.sideBar}>
        <Box className={classes.TitleContainer} sx={{ padding: "0 16px" }}>
          <Heading1>Hello</Heading1>
        </Box>
        <Box>
          <List>
            {sideBar.map((list, index) => (
              <React.Fragment key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleClick(index, list, list.children || [])}
                    className={classes.item}
                    selected={state.parentIndex === index && state.childIndex === -1}
                  >
                    <ListItemIcon>{list.icon}</ListItemIcon>
                    <ListItemText primary={list.name} className={classes.itemText} />
                    {list.children && (openItems === index ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </ListItem>
                {list.children && (
                  <Collapse in={openItems === index} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                      {list.children.map((item, childIndex) => (
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
        </Box>
      </Drawer>
    </Box>
  );
}
