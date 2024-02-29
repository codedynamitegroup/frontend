import React from "react";
import { Box } from "@mui/material";
import classes from "./styles.module.scss";

import TableTemplate from "components/common/table/TableTemplate";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";
import { useNavigate } from "react-router";
import { routes } from "routes/routes";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ParagraphBody from "components/text/ParagraphBody";
export default function ProblemTable() {
  const customHeading = ["Trạng thái", "Tên bài toán", "Độ khó"];
  const customColumns = ["status", "name", "level"];
  const renderStatus = (status: number) => {
    if (status === 1) {
      return <CheckCircleIcon className={classes.iconCheck} />;
    }
    return "";
  };

  const renderLevel = (level: number) => {
    if (level === 0) {
      return (
        <ParagraphBody fontWeight={700} colorName={"--blue-500"}>
          Dễ
        </ParagraphBody>
      );
    }
    if (level === 1) {
      return (
        <ParagraphBody fontWeight={700} colorName={"--warning"}>
          Trung bình
        </ParagraphBody>
      );
    }
    return (
      <ParagraphBody fontWeight={700} colorName={"--red-error"}>
        Khó
      </ParagraphBody>
    );
  };
  const data = [
    {
      id: 1,
      status: renderStatus(0),
      name: "Tổng 2 số",
      level: renderLevel(0)
    },
    {
      id: 2,
      status: renderStatus(1),
      name: "Trung bình cộng",
      level: renderLevel(1)
    },
    {
      id: 3,
      status: renderStatus(0),
      name: "Phân số tối giản",
      level: renderLevel(1)
    },
    {
      id: 4,
      status: renderStatus(0),
      name: "Sắp xếp mảng tăng dần",
      level: renderLevel(2)
    },
    {
      id: 5,
      status: renderStatus(1),
      name: "Kiểm tra số nguyên tố",
      level: renderLevel(2)
    },
    {
      id: 6,
      status: renderStatus(1),
      name: "Đảo chuỗi",
      level: renderLevel(2)
    },
    {
      id: 7,
      status: renderStatus(0),
      name: "Tìm phần tử lớn nhất trong mảng",
      level: renderLevel(2)
    },
    {
      id: 8,
      status: renderStatus(1),
      name: "Số Fibonacci",
      level: renderLevel(0)
    },
    {
      id: 9,
      status: renderStatus(0),
      name: "Thuật toán tìm kiếm nhị phân",
      level: renderLevel(2)
    },
    {
      id: 10,
      status: renderStatus(0),
      name: "Đếm số lần xuất hiện của phần tử trong mảng",
      level: renderLevel(1)
    }
  ];
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const navigate = useNavigate();

  return (
    <Box className={classes.container}>
      <Box className={classes.table}>
        <TableTemplate
          customHeading={customHeading}
          customColumns={customColumns}
          data={data}
          isActionColumn={false}
          onViewDetailsClick={() => navigate(routes.user.problem.detail.replace(":id", "1"))}
        />
        <TablePagination
          component='div'
          rowsPerPageOptions={[5, 10, 25, 100]}
          count={data.length}
          page={Number(page)}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
          onRowsPerPageChange={handleChangeRowsPerPage}
          className={classes.pagination}
        />
      </Box>
    </Box>
  );
}
