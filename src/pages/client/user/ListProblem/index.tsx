import Header from "components/Header";
import { Box, Chip, Container, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { useState, useEffect } from "react";
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
const status = [
  {
    id: 1,
    label: "Chưa giải"
  },
  {
    id: 2,
    label: "Đã giải"
  }
];
const level = [
  {
    id: 1,
    label: "Dễ"
  },
  {
    id: 2,
    label: "Trung bình"
  },
  {
    id: 3,
    label: "Khó"
  }
];
interface Status {
  id: number;
  label: string;
}
interface Level {
  id: number;
  label: string;
}
const ListProblem = () => {
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

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
  return (
    <Grid className={classes.root}>
      <Header />
      <Box
        id={classes.banner}
        sx={{
          backgroundImage: `url(${images.background.courseCertificatesBackground})`
        }}
      >
        <Container id={classes.bannerContainer}>
          <Heading1 colorName={"--white"}>Luyện tập</Heading1>
          <Heading3 colorName={"--white"}>
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
              <Autocomplete
                size='medium'
                id='combo-box-demo'
                options={status}
                value={selectedStatus}
                onChange={(event, newValue) => {
                  setSelectedStatus(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={!selectedStatus ? "Trạng thái" : ""}
                    InputLabelProps={{ shrink: false }}
                  />
                )}
                className={classes.autocomplete}
              />
              <Autocomplete
                size='medium'
                id='combo-box-demo'
                options={level}
                value={selectedLevel}
                onChange={(event, newValue) => {
                  setSelectedStatus(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={!selectedLevel ? "Độ khó" : ""}
                    InputLabelProps={{ shrink: false }}
                  />
                )}
                className={classes.autocomplete}
              />
            </Box>
          </Box>
        </Container>
      </Box>
      <Container>
        <Box className={classes.boxContent}>
          <Heading1>Danh sách bài tập</Heading1>
          <Grid container spacing={8}>
            <Grid item xs={4}>
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
            <Grid item xs={8}>
              <Box className={classes.topic}>
                <LabTabs />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Grid>
  );
};

export default ListProblem;
