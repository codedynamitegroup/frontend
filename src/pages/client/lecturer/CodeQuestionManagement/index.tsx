import { Box, TablePagination } from "@mui/material";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import TableTemplate from "components/common/table/TableTemplate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading1 from "components/text/Heading1";
import { routes } from "routes/routes";
import SearchBar from "components/common/search/SearchBar";
import { useTranslation } from "react-i18next";

const LecturerCodeQuestionManagement = () => {
  const { t } = useTranslation();
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
      difficulty: "Dễ",
      updateAt: "12-02-2022"
    },
    {
      id: 2,
      name: "Trung bình cộng",
      difficulty: "Trung bình",
      updateAt: "13-03-2023"
    },
    {
      id: 3,
      name: "Cây nhị phân",
      difficulty: "Trung bình",
      updateAt: "13-03-2023"
    },
    {
      id: 4,
      name: "Đệ quy",
      difficulty: "Trung bình",
      updateAt: "13-03-2023"
    },
    {
      id: 5,
      name: "Nhân chia",
      difficulty: "Khó",
      updateAt: "13-03-2023"
    }
  ];
  const customHeading = [
    t("common_num_order"),
    t("exam_management_create_question_name"),
    t("common_difficult_level"),
    t("common_edit_date")
  ];
  const customColumns = ["id", "name", "difficulty", "updateAt"];
  const navigate = useNavigate();
  const onEdit = (id: number) => {
    navigate(routes.lecturer.code_question.information.replace(":id", id.toString()));
  };
  const onDelete = (id: number) => {};
  const onSearchClickHandler = (val: string) => {};

  return (
    <Box id={classes.codequestionsBody}>
      <Heading1 fontWeight={"500"} translation-key='code_management_title'>
        {t("code_management_title")}
      </Heading1>
      <Box className={classes.btnWrapper}>
        <SearchBar onSearchClick={onSearchClickHandler} />
        <Button
          children={t("common_add_question")}
          btnType={BtnType.Primary}
          width='150px'
          onClick={() => {
            navigate(routes.lecturer.code_question.create);
          }}
          translation-key='common_add_question'
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
        labelRowsPerPage={t("common_table_row_per_page")} // Thay đổi text ở đây
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count, page }) => {
          return t("common_table_from_to", { from: from, to: to, countText: count });
        }}
        translation-key={["common_table_row_per_page"]}
      />
    </Box>
  );
};

export default LecturerCodeQuestionManagement;
