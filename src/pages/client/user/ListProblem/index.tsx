import Header from "components/Header";
import { Box, Container, Grid, TablePagination } from "@mui/material";
import classes from "./styles.module.scss";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import LabTabs from "./components/TabTopic";
import exp from "constants";

const ListProblem = () => {
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

  const topics = ["Tất cả", "Thuật toán", "Cơ sở dữ liệu", "Javascript"];

  // Số lượng phần tử hiển thị ban đầu
  const [visibleItemCount, setVisibleItemCount] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setVisibleItemCount(6);
    } else if (window.innerWidth <= 900) {
      setVisibleItemCount(10);
    } else {
      setVisibleItemCount(15);
    }
  };
  useEffect(() => {
    // Run the function once to set the initial state
    handleResize();

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Hàm để hiển thị toàn bộ danh sách
  const showAllItems = () => {
    setVisibleItemCount(algorithms.length);
    setIsShow(true);
  };
  const showLessItems = () => {
    handleResize();
    setIsShow(false);
  };
  return (
    <Grid className={classes.root}>
      <Header />
      <Box className={classes.boxContent}>
        <Box className={classes.boxTitle}>Danh sách bài tập</Box>
        <Box className={classes.typeAlgorithm}>Các loại giải thuật:</Box>
        <Box className={classes.algorithm}>
          {algorithms.slice(0, visibleItemCount).map((algorithm) => (
            <Box className={classes.algorithmItem}>{algorithm}</Box>
          ))}
          {!isShow ? (
            <Button className={classes.showMoreButton} onClick={showAllItems}>
              Xem thêm
            </Button>
          ) : (
            <Button className={classes.showMoreButton} onClick={showLessItems}>
              Ẩn
            </Button>
          )}
        </Box>
        <Box className={classes.topic}>
          <LabTabs />
        </Box>
      </Box>
    </Grid>
  );
};

export default ListProblem;