import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ProblemTable from "../ProblemTable";
import classes from "./styles.module.scss";
import { styled } from "@mui/material/styles";
import RecommendedProblem from "../RecommendedProblem";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function LabTabs() {
  const { t } = useTranslation();
  const [value, setValue] = React.useState("0");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const StyledTabList = styled(TabList)({
    "& button": {
      borderRadius: "10px",
      backgroundColor: "white",
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
      backgroundColor: "var(--blue-500)",
      color: "white"
    }
  });
  const spacingInTabPanel = "20px";
  return (
    <Box className={classes.container}>
      <TabContext value={value}>
        {/* <Box>
          <StyledTabList
            onChange={handleChange}
            aria-label='lab API tabs example'
            TabIndicatorProps={{ hidden: true }}
            translation-key='common_all'
          >
            {topics.map((topic, index) => (
              <Tab sx={{ fontSize: "12px" }} key={index} label={topic} value={index.toString()} />
            ))}
          </StyledTabList>
        </Box> */}
        <TabPanel value='0' className={classes.tabPanel}>
          <Stack spacing={spacingInTabPanel}>
            <RecommendedProblem />
            <ProblemTable />
          </Stack>
        </TabPanel>
        <TabPanel value='1' className={classes.tabPanel}>
          <Stack spacing={spacingInTabPanel}>
            <RecommendedProblem />
            <ProblemTable />
          </Stack>
        </TabPanel>
        <TabPanel value='2' className={classes.tabPanel}>
          <Stack spacing={spacingInTabPanel}>
            <RecommendedProblem />
            <ProblemTable />
          </Stack>
        </TabPanel>
        <TabPanel value='3' className={classes.tabPanel}>
          <Stack spacing={spacingInTabPanel}>
            <RecommendedProblem />
            <ProblemTable />
          </Stack>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
