import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
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
import Heading4 from "components/text/Heading4";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import images from "config/images";
import { Avatar, Menu, MenuItem, ListItemIcon } from "@mui/material";

interface ILinkMenu {
  name: string;
  path: string;
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
  forwardedRef?: React.Ref<HTMLDivElement>;
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const drawerWidth = 240;

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

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
  const [state, setState] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position='fixed' open={open} className={classes.header} ref={ref}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              ...(open && { display: "none" })
            }}
          >
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleDrawerOpen}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
          </Box>
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

          {/* <Box className={classes.navbarAuthItem}>
            {auth.map((page, index) => (
              <Button key={index} className={classes.item} onClick={() => navigate(page.path)}>
                {page.name}
              </Button>
            ))}
          </Box> */}
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
            </IconButton>
          </Box>
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
          <MenuItem onClick={handleClose}>
            <Avatar /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Avatar /> My account
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            {/* <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon> */}
            Add another account
          </MenuItem>
          <MenuItem onClick={handleClose}>
            {/* <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon> */}
            Settings
          </MenuItem>
          <MenuItem onClick={handleClose}>
            {/* <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon> */}
            Logout
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
            {pages.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemText primary={<Typography align='center'>{item.name}</Typography>} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {auth.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemText primary={<Typography align='center'>{item.name}</Typography>} />
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
