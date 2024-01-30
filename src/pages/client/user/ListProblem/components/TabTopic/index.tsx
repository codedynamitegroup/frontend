import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ProblemTable from "../ProblemTable";
import classes from "./styles.module.scss";
import { styled } from "@mui/material/styles";

export default function LabTabs() {
  const [value, setValue] = React.useState("0");
  const topics = ["Tất cả", "Thuật toán", "Cơ sở dữ liệu", "Javascript"];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const StyledTabList = styled(TabList)({
    "& button": {
      borderRadius: "10px",
      backgroundColor: "#f2f3f4",
      marginRight: "10px"
    },
    "& button.Mui-selected": {
      backgroundColor: "var(--blue-500)",
      color: "#ffffff"
    },
    "& button.Mui-selected:hover": {
      backgroundColor: "var(--blue-500)",
      color: "#ffffff"
    },

    "& button:hover": {
      backgroundColor: "#E5E6E8"
    }
  });

  return (
    <Box className={classes.container}>
      <TabContext value={value}>
        <Box>
          <StyledTabList
            onChange={handleChange}
            aria-label='lab API tabs example'
            TabIndicatorProps={{ hidden: true }}
          >
            {topics.map((topic, index) => (
              <Tab key={index} label={topic} value={index.toString()} />
            ))}
          </StyledTabList>
        </Box>
        <TabPanel value='0' className={classes.tabPanel}>
          <ProblemTable />
        </TabPanel>
        <TabPanel value='1' className={classes.tabPanel}>
          <ProblemTable />
        </TabPanel>
        <TabPanel value='2' className={classes.tabPanel}>
          <ProblemTable />
        </TabPanel>
        <TabPanel value='3' className={classes.tabPanel}>
          <ProblemTable />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
