import { Box, Container, Grid, Tab, Tabs } from "@mui/material";
import Header from "components/Header";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button, { BtnType } from "components/common/buttons/Button";
import TabPanel from "components/TabPanel";
import CodeQuestionInformation from "./components/Information";

interface Props {}
enum ETab {
  DETAILS,
  TEST_CASES,
  CODE_STUBS,
  LANGUAGES
}

const CodeQuestionDetails = (props: Props) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ETab>(ETab.DETAILS);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Grid className={classes.root}>
      <Header />
      <Container className={classes.container}>
        <Box className={classes.tabWrapper}>
          <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
            <span onClick={() => navigate("/lecturer/code-management")}>Quản lý câu hỏi code</span>{" "}
            {">"} <span onClick={() => navigate("/lecturer/code-management/1")}>Tổng 2 số</span>
          </ParagraphBody>
        </Box>

        <Box className={classes.body}>
          <Heading1 fontWeight={"500"}>Tổng 2 số</Heading1>
          <Box sx={{ border: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label='basic tabs example'
              className={classes.tabs}
            >
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Thông tin</ParagraphBody>}
                value={ETab.DETAILS}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Test cases</ParagraphBody>}
                value={ETab.TEST_CASES}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Code mẫu</ParagraphBody>}
                value={ETab.CODE_STUBS}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={<ParagraphBody>Ngôn ngữ</ParagraphBody>}
                value={ETab.LANGUAGES}
              />
            </Tabs>
          </Box>
          <TabPanel value={activeTab} index={ETab.DETAILS}>
            <CodeQuestionInformation />
          </TabPanel>
        </Box>
      </Container>
      <Box className={classes.stickyFooterContainer}>
        <Box className={classes.phantom} />
        <Box className={classes.stickyFooterItem}>
          <Button btnType={BtnType.Primary}>Lưu thay đổi</Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default CodeQuestionDetails;
