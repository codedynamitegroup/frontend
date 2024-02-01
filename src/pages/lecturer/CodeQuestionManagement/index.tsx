import { Box, Container, Grid, TablePagination } from "@mui/material";
import Header from "components/Header";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import TableTemplate from "components/common/table/TableTemplate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading1 from "components/text/Heading1";
import { routes } from "routes/routes";
import SearchBar from "components/common/search/SearchBar";

const CodeQuestionManagement = () => {
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

  const data = [
    {
      id: 1,
      name: "Tổng 2 số",
      owner: "Nguyễn Văn A",
      difficulty: "Dễ",
      updateAt: "12-02-2022"
    },
    {
      id: 2,
      name: "Trung bình cộng",
      owner: "Nguyễn Văn A",
      difficulty: "Trung bình",
      updateAt: "13-03-2023"
    }
  ];
  const customHeading = ["STT", "Tên câu hỏi", "Người tạo", "Độ khó", "Ngày chỉnh sửa"];
  const customColumns = ["id", "name", "owner", "difficulty", "updateAt"];
  const navigate = useNavigate();
  const onEdit = (id: number) => {
    navigate(routes.lecturer.code_question.information.replace(":id", id.toString()));
  };
  const onDelete = (id: number) => {};
  const onSearchClickHandler = (val: string) => {};

  return (
    <Grid className={classes.root}>
      <Header />
      <Container className={classes.container}>
        <Heading1 fontWeight={"500"}>Quản lý câu hỏi code</Heading1>
        <Box className={classes.btnWrapper}>
          <SearchBar onSearchClick={onSearchClickHandler} />
          <Button
            children='Thêm câu hỏi'
            btnType={BtnType.Primary}
            width='150px'
            onClick={() => {
              navigate(routes.lecturer.code_question.create);
            }}
          />
        </Box>
        <TableTemplate
          data={data}
          customColumns={customColumns}
          customHeading={customHeading}
          isActionColumn={true}
          onEditClick={onEdit}
          onDeleteClick={onDelete}
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
      </Container>
    </Grid>
  );
};

export default CodeQuestionManagement;
