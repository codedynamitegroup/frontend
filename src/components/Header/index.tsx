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

function Header() {
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
      path: "/"
    }
  ];

  const auth: ILinkMenu[] = [
    {
      name: "Đăng nhập",
      path: "/"
    },
    {
      name: "Đăng ký",
      path: "/"
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

  return (
    <AppBar position='static' open={open} className={classes.header}>
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

          <Box className={classes.navbarAuthItem}>
            <Button className={classes.item} onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
            <Button className={classes.item} onClick={() => navigate("/register")}>
              Đăng ký
            </Button>
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
}
export default Header;
