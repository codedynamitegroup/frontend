import { Outlet } from "react-router-dom";
import { useRef, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Box, Tab, TabProps, Grid, Container } from "@mui/material";

import classes from "./styles.module.scss";
import Header from "components/Header";
import { styled } from "@mui/material/styles";
import useBoxDimensions from "utils/useBoxDimensions";

const CustomTab = styled((props: TabProps) => <Tab {...props} />)(({ theme }) => ({
  textTransform: "none",

  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(20),
  marginRight: theme.spacing(1)
}));
const QuestionBankManagementLayout = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });
  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <main style={{ marginTop: `${headerHeight}px` }} id={classes.main}>
        <Container className={classes.container}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label='lab API tabs'>
                <CustomTab label='Chung' value='1' />
                <CustomTab label='Cá nhân' value='2' />
              </TabList>
            </Box>
            <Outlet context={[value, setValue]} />
          </TabContext>
        </Container>
      </main>
    </Grid>
  );
};

export default QuestionBankManagementLayout;
