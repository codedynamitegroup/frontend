import React from "react";
import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TableTemplate from "components/common/table/TableTemplate";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";

export default function ProblemTable() {
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
  const difficulty = [
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
  const customHeading = ["Trạng thái", "Tên bài toán", "Độ khó"];
  const customColumns = ["status", "name", "difficulty"];
  const data = [
    {
      id: 1,
      status: "Chưa giải",
      name: "Tổng 2 số",
      difficulty: "Dễ"
    },
    {
      id: 2,
      status: "Đã giải",
      name: "Trung bình cộng",
      difficulty: "Trung bình"
    },
    {
      id: 3,
      status: "Chưa giải",
      name: "Phân số tối giản",
      difficulty: "Trung bình"
    },
    {
      id: 4,
      status: "Chưa giải",
      name: "Sắp xếp mảng tăng dần",
      difficulty: "Trung bình"
    },
    {
      id: 5,
      status: "Đã giải",
      name: "Kiểm tra số nguyên tố",
      difficulty: "Khó"
    },
    {
      id: 6,
      status: "Đã giải",
      name: "Đảo chuỗi",
      difficulty: "Dễ"
    },
    {
      id: 7,
      status: "Chưa giải",
      name: "Tìm phần tử lớn nhất trong mảng",
      difficulty: "Trung bình"
    },
    {
      id: 8,
      status: "Đã giải",
      name: "Số Fibonacci",
      difficulty: "Khó"
    },
    {
      id: 9,
      status: "Chưa giải",
      name: "Thuật toán tìm kiếm nhị phân",
      difficulty: "Khó"
    },
    {
      id: 10,
      status: "Chưa giải",
      name: "Đếm số lần xuất hiện của phần tử trong mảng",
      difficulty: "Trung bình"
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

  return (
    <Box className={classes.container}>
      <Box className={classes.filterSearch}>
        <Autocomplete
          disablePortal
          id='combo-box-demo'
          options={status}
          fullWidth
          renderInput={(params) => <TextField {...params} label='Trạng thái' />}
        />
        <Autocomplete
          disablePortal
          id='combo-box-demo'
          options={difficulty}
          fullWidth
          renderInput={(params) => <TextField {...params} label='Độ khó' />}
        />
        <OutlinedInput
          fullWidth
          placeholder='Tìm kiếm'
          startAdornment={
            <InputAdornment position='start'>
              <SearchIcon className={classes.icon} />
            </InputAdornment>
          }
        />
      </Box>
      <Box className={classes.table}>
        <TableTemplate
          customHeading={customHeading}
          customColumns={customColumns}
          data={data}
          isActionColumn={false}
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
        />
      </Box>
    </Box>
  );
}
