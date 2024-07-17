import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { AppBar, Box, Tab, TabProps, Tabs, Toolbar } from "@mui/material";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import classes from "./styles.module.scss";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { set } from "lodash";
import { setTab } from "reduxes/courseService/questionBankCategory";

const AntTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
    display: "none"
  },
  "& .MuiTabs-flexContainer": {
    width: "fit-content",
    padding: "4px 3px",
    gap: "10px",
    borderRadius: 8
  }
});

const AntTab = styled((props: TabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: "none",
  width: "fit-content",
  minHeight: 29,
  borderRadius: 10,
  padding: "10px 16px",
  fontSize: 16,
  [theme.breakpoints.up("sm")]: {
    minWidth: 0
  },
  fontWeight: 500,
  color: "rgba(0, 0, 0, 0.85)",
  fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Roboto"'].join(","),
  "&:hover": {
    color: "#1976d2",
    backgroundColor: "#ECF4FD",
    transition: "all 0.2s ease-in-out",
    opacity: 1
  },
  "&.Mui-selected": {
    color: "#1976d2",
    backgroundColor: "#ECF4FD",
    fontWeight: theme.typography.fontWeightMedium
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#d1eaff"
  }
}));

const QuestionBankManagementLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("1");
  const dispatch = useDispatch<AppDispatch>();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    dispatch(setTab(newValue));
    navigate("/lecturer/question-bank-management");
  };

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  return (
    <Box id={classes.questionBanksManagementBody}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <AppBar
            position='fixed'
            className={classes.tabs}
            sx={{
              top: `${sidebarStatus.headerHeight}px`,
              left: sidebarStatus.isOpen ? `${sidebarStatus.sidebarWidth}px` : 0
            }}
          >
            <Toolbar>
              <AntTabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                <AntTab label={i18next.format(t("common_general"), "firstUppercase")} value={"1"} />
                <AntTab
                  label={i18next.format(t("common_personal"), "firstUppercase")}
                  value={"2"}
                />
              </AntTabs>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </Box>
        <Outlet context={{ value, setValue }} />
      </TabContext>
    </Box>
  );
};

export default QuestionBankManagementLayout;
