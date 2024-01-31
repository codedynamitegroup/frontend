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
  TextField,
  Tooltip
} from "@mui/material";
import React, { memo, useState } from "react";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button, { BtnType } from "components/common/buttons/Button";
import TestCasePopup from "./components/PopupAddTestCase";

type Props = {};

const CodeQuestionTestCases = memo((props: Props) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openTestCasePopup, setOpenTestCasePopup] = useState<boolean>(false);
  const [itemEdit, setItemEdit] = useState<any>(null);
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
      input: "input01.txt",
      output: "output01.txt",
      inputValue: "1\n2",
      outputValue: "3",
      sample: true,
      score: 0
    },
    {
      id: 2,
      input: "input02.txt",
      output: "output02.txt",
      inputValue: "3\n2",
      outputValue: "5",
      sample: false,
      score: 10
    },
    {
      id: 3,
      input: "input03.txt",
      output: "output03.txt",
      inputValue: "2\n2",
      outputValue: "4",
      sample: false,
      score: 100
    },
    {
      id: 4,
      input: "input04.txt",
      output: "output04.txt",
      inputValue: "3\n3",
      outputValue: "6",
      sample: false,
      score: 5
    },
    {
      id: 5,
      input: "input05.txt",
      output: "output05.txt",
      inputValue: "5\n2",
      outputValue: "7",
      sample: false,
      score: 10
    },
    {
      id: 6,
      input: "input06.txt",
      output: "output06.txt",
      inputValue: "2\n12",
      outputValue: "14",
      sample: false,
      score: 10
    }
  ]);
  const tableHeads = ["STT", "Đầu vào", "Đầu ra", "Mẫu", "Điểm", "Hành động"];

  const onEdit = (id: number) => {
    setOpenTestCasePopup(true);
    setItemEdit(data.find((item) => item.id === id));
  };
  const onDelete = (id: number) => {};
  const handleCheckboxChange = (id: number) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, sample: !item.sample } : item))
    );
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { value } = event.target;
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, score: parseInt(value) } : item))
    );
  };

  return (
    <Box className={classes["body"]}>
      <Box className={classes["btn-wrapper"]}>
        <Button btnType={BtnType.Outlined}>Tải lên tệp zip</Button>
        <Button btnType={BtnType.Primary} onClick={() => setOpenTestCasePopup(true)}>
          Thêm test case
        </Button>
      </Box>
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
                  }`}
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
                    className={`${classes["col-table-body"]}                           
										`}
                  >
                    <ParagraphBody>{row.input}</ParagraphBody>
                  </TableCell>

                  <TableCell
                    align='left'
                    className={`${classes["col-table-body"]}                           
										`}
                  >
                    <ParagraphBody>{row.output}</ParagraphBody>
                  </TableCell>

                  <TableCell
                    align='left'
                    className={`${classes["col-table-body"]}                           
										`}
                  >
                    <Checkbox
                      value={row.sample}
                      color='primary'
                      checked={row.sample}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </TableCell>

                  <TableCell
                    align='left'
                    className={`${classes["col-table-body"]}                           
										`}
                  >
                    <TextField
                      value={row.score}
                      type='number'
                      size='small'
                      onChange={(e: any) => handleScoreChange(e, row.id)}
                    />
                  </TableCell>

                  <TableCell align='left' className={classes["cell-actions"]}>
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
                      <Tooltip title='Xóa'>
                        <IconButton size='medium' onClick={() => onDelete(row.id)}>
                          <FontAwesomeIcon icon={faTrash} />
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
      <TestCasePopup
        itemEdit={itemEdit}
        open={openTestCasePopup}
        setOpen={setOpenTestCasePopup}
        setItemEdit={setItemEdit}
      />
    </Box>
  );
});

export default CodeQuestionTestCases;
