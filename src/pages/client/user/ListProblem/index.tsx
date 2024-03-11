import Header from "components/Header";
import { Box, Chip, Container, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import LabTabs from "./components/TabTopic";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import BasicSelect from "components/common/select/BasicSelect";
import Footer from "components/Footer";
import useBoxDimensions from "hooks/useBoxDimensions";
interface Status {
  id: number;
  label: string;
}
interface Level {
  id: number;
  label: string;
}
const ListProblem = () => {
  const [levelProblem, setlevelProblem] = useState("0");
  const [statusProblem, setstatusProblem] = useState("0");

  const algorithms = [
    "Mảng",
    "Cây",
    "Đồ thị",
    "Vét cạn",
    "Quay lui",
    "Đệ quy",
    "Sắp xếp",
    "Tìm kiếm",
    "Chia để trị",
    "Nhánh cận",
    "Lập lịch",
    "Quy hoạch động",
    "Tham lam",
    "Bitmask",
    "Ngăn xếp",
    "Hàng đợi ưu tiên",
    "Hàng đợi",
    "Cấu trúc dữ liệu khác",
    "Tìm kiếm nhị phân",
    "Tìm kiếm nội suy",
    "Tìm kiếm nhị phân trên cây",
    "Tìm kiếm nhị phân trên đồ thị"
  ];
  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <main id={classes.main} style={{ marginTop: `${headerHeight}px` }}>
        <Box
          id={classes.banner}
          sx={{
            backgroundImage: `url(${images.background.homePageBackground})`
          }}
        >
          <Container id={classes.bannerContainer} className={classes.container}>
            <Heading1 colorname={"--white"}>Luyện tập</Heading1>
            <Heading3 colorname={"--white"}>
              Bạn muốn rèn luyện khả năng lập trình của bạn ? Hãy thử luyện tập ngay
            </Heading3>
            <Box id={classes.bannerSearch}>
              <Box className={classes.filterSearch}>
                <OutlinedInput
                  size='small'
                  fullWidth
                  placeholder='Tìm kiếm'
                  startAdornment={
                    <InputAdornment position='start'>
                      <SearchIcon className={classes.icon} />
                    </InputAdornment>
                  }
                  className={classes.searchInput}
                />
                <BasicSelect
                  labelId='select-assignment-section-label'
                  value={statusProblem}
                  onHandleChange={(value) => setstatusProblem(value)}
                  sx={{ maxWidth: "200px" }}
                  items={[
                    {
                      value: "0",
                      label: "Tất cả"
                    },
                    {
                      value: "1",
                      label: "Đã giải"
                    },
                    {
                      value: "2",
                      label: "Chưa giải"
                    }
                  ]}
                  backgroundColor='#FFFFFF'
                />
                <BasicSelect
                  labelId='select-assignment-section-label'
                  value={levelProblem}
                  onHandleChange={(value) => setlevelProblem(value)}
                  sx={{ maxWidth: "200px" }}
                  items={[
                    {
                      value: "0",
                      label: "Tất cả"
                    },
                    {
                      value: "1",
                      label: "Dễ"
                    },
                    {
                      value: "2",
                      label: "Trung bình"
                    },
                    {
                      value: "3",
                      label: "Khó"
                    }
                  ]}
                  backgroundColor='#FFFFFF'
                />
              </Box>
            </Box>
          </Container>
        </Box>
        <Box>
          <Container className={classes.container}>
            <Box className={classes.boxContent}>
              <Grid container>
                <Grid item xs={3.5}>
                  <Box className={classes.algorithmContainer}>
                    <Heading3>Các loại giải thuật:</Heading3>
                    <Box className={classes.algorithm}>
                      {algorithms.map((algorithm, index) => (
                        <Box className={classes.algorithmItem}>
                          <ParagraphBody>{algorithm}</ParagraphBody>
                          <Chip label={index} size='small' className={classes.chip} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={8}>
                  <Box className={classes.topic}>
                    <LabTabs />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </main>
      <Footer />
    </Grid>
  );
};

export default ListProblem;
