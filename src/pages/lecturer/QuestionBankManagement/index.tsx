import { Box, Tab, TabProps, Button } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Heading1 from "components/text/Heading1";

const CustomTab = styled((props: TabProps) => <Tab {...props} />)(({ theme }) => ({
  textTransform: "none",

  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(20),
  marginRight: theme.spacing(1)
}));
const QuestionBankManagement = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label='lab API tabs'>
            <CustomTab label='Chung' value='1' />
            <CustomTab label='Cá nhân' value='2' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Heading1 fontWeight={"500"}>Ngân hàng câu hỏi chung</Heading1>
          <Button>Thêm mới</Button>
        </TabPanel>
        <TabPanel value='2'>Item Two</TabPanel>
      </TabContext>
    </Box>
  );
};

export default QuestionBankManagement;
