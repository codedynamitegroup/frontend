import { Outlet } from "react-router-dom";
import { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Box, Tab, TabProps } from "@mui/material";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import classes from "./styles.module.scss";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { set } from "lodash";
import { setTab } from "reduxes/courseService/questionBankCategory";

const CustomTab = styled((props: TabProps) => <Tab {...props} />)(({ theme }) => ({
  textTransform: "none",

  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(20),
  marginRight: theme.spacing(1)
}));
const QuestionBankManagementLayout = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("1");
  const dispatch = useDispatch<AppDispatch>();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    dispatch(setTab(newValue));
  };

  return (
    <Box id={classes.questionBanksManagementBody}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label='lab API tabs'>
            <CustomTab
              label={i18next.format(t("common_general"), "firstUppercase")}
              translation-key='common_general'
              value='1'
            />
            <CustomTab
              label={i18next.format(t("common_personal"), "firstUppercase")}
              translation-key='common_personal'
              value='2'
            />
          </TabList>
        </Box>
        <Outlet context={{ value, setValue }} />
      </TabContext>
    </Box>
  );
};

export default QuestionBankManagementLayout;
