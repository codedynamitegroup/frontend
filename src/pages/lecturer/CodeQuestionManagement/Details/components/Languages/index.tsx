import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from "@mui/material";
import React, { memo, useState } from "react";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Heading5 from "components/text/Heading5";

type Props = {};

const CodeQuestionLanguages = memo((props: Props) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [data, setData] = useState([
    {
      id: 1,
      name: "ADA",
      timeLimit: 3,
      memoryLimit: 512,
      isSelected: true
    },
    {
      id: 2,
      name: "C++",
      timeLimit: 2,
      memoryLimit: 512,
      isSelected: true
    },
    {
      id: 3,
      name: "Java 15",
      timeLimit: 4,
      memoryLimit: 2048,
      isSelected: false
    }
  ]);
  const tableHeads = [
    "STT",
    "Ngôn ngữ",
    "Giới hạn thời gian(giây)",
    "Giới hạn bộ nhớ(MB)",
    "Hành động"
  ];

  const onEdit = (id: number) => {};
  const handleCheckboxChange = (id: number) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, isSelected: !item.isSelected } : item))
    );
  };

  return (
    <Box className={classes["body"]}>
      <Heading5 fontStyle={"italic"} fontWeight={"400"} colorName='--gray-50'>
        Dưới đây là danh sách các ngôn ngữ lập trình có sẵn
      </Heading5>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='custom table'>
          <TableHead className={classes["table-head"]}>
            <TableRow>
              {tableHeads.map((heading, index) => (
                <TableCell
                  key={index}
                  align='left'
                  className={`${classes["table-cell"]} ${
                    heading === "STT" ? classes["small-heading"] : ""
                  } ${heading === "Ngôn ngữ" ? classes["col-table-language-name"] : ""}  `}
                >
                  <ParagraphBody fontWeight={700}>{heading}</ParagraphBody>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.length > 0 &&
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell
                    align='left'
                    className={`${classes["col-table-body"]}                           
										`}
                  >
                    <ParagraphBody>{row.id}</ParagraphBody>
                  </TableCell>
                  <TableCell
                    align='left'
                    className={`${classes["col-table-body"]} ${classes["col-table-language-name"]}`}
                  >
                    <Checkbox
                      value={row.isSelected}
                      color='primary'
                      checked={row.isSelected}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                    <ParagraphBody>{row.name}</ParagraphBody>
                  </TableCell>

                  <TableCell
                    align='left'
                    className={`${classes["col-table-body"]}                           
										`}
                  >
                    <ParagraphBody>{row.timeLimit} giây</ParagraphBody>
                  </TableCell>

                  <TableCell
                    align='left'
                    className={`${classes["col-table-body"]}                           
										`}
                  >
                    <ParagraphBody>{row.memoryLimit} MB</ParagraphBody>
                  </TableCell>

                  <TableCell align='center' className={classes["cell-actions"]}>
                    <Box>
                      <Tooltip title='Chỉnh sửa'>
                        <IconButton
                          aria-label='edit'
                          size='medium'
                          onClick={() => {
                            onEdit(row.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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
  );
});

export default CodeQuestionLanguages;
