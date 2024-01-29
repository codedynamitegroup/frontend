import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link, Outlet, useLocation, useParams, useSearchParams } from "react-router-dom";
import classes from "./styles.module.scss";

interface PropsData {
  routeList: Array<string>;
  labelList: Array<string>;
}

const CustomTabPanel = (props: PropsData) => {
  const paramList = useParams();
  const history = useLocation();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {};
  const replacedRouteList = props.routeList.map((route) => {
    for (const paramKey of Object.keys(paramList)) {
      if (route.includes(paramKey))
        route = route.replace(`:${paramKey}`, String(paramList[paramKey]));
    }
    return route;
  });

  return (
    <Box className={classes.container}>
      <Tabs
        className={classes.tabContainer}
        value={history.pathname}
        onChange={handleChange}
        aria-label='basic tabs example'
      >
        {replacedRouteList.map((route, index) => (
          <Tab
            label={props.labelList[index]}
            component={Link}
            to={route}
            value={route}
            key={route}
          />
        ))}
      </Tabs>
      <Outlet />
    </Box>
  );
};

export default CustomTabPanel;
