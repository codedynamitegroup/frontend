import { Box, TablePagination } from "@mui/material";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import TableTemplate from "components/common/table/TableTemplate";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading1 from "components/text/Heading1";
import { routes } from "routes/routes";
import SearchBar from "components/common/search/SearchBar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { QuestionService } from "services/courseService/QuestionService";
import { setQuestions } from "reduxes/courseService/question";

const LecturerCodeQuestionManagement = () => {
  const [searchText, setSearchText] = useState("");
  const dispath = useDispatch<AppDispatch>();
  const questionState = useSelector((state: RootState) => state.question);
  const searchHandle = async (searchText: string) => {
    setSearchText(searchText);
  };

  const handleGetQuestions = async ({
    search = searchText,
    pageNo = page,
    pageSize = rowsPerPage
  }: {
    search?: string;
    pageNo?: number;
    pageSize?: number;
  }) => {
    try {
      const getQuestionResponse = await QuestionService.getQuestions({
        search,
        pageNo,
        pageSize
      });
      dispath(setQuestions(getQuestionResponse));
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await QuestionService.deleteQuestion(questionId);
      handleGetQuestions({ search: searchText });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInitialQuestions = async () => {
      await handleGetQuestions({ search: searchText });
    };
    fetchInitialQuestions();
  }, [searchText]);

  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    handleGetQuestions({ search: searchText, pageNo: newPage, pageSize: rowsPerPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    handleGetQuestions({ search: searchText, pageNo: 0, pageSize: +event.target.value });
  };

  const customHeading = [
    t("common_num_order"),
    t("exam_management_create_question_name"),
    t("common_difficult_level"),
    t("common_edit_date")
  ];
  const customColumns = ["questionId", "name", "difficulty", "updatedAt"];
  const navigate = useNavigate();
  const onEdit = (id: number) => {
    navigate(routes.lecturer.code_question.information.replace(":questionId", id.toString()));
  };
  const onDelete = (id: number) => {
    handleDeleteQuestion(id.toString());
  };

  return (
    <Box id={classes.codequestionsBody}>
      <Heading1 fontWeight={"500"} translation-key='code_management_title'>
        {t("code_management_title")}
      </Heading1>
      <Box className={classes.btnWrapper}>
        <SearchBar onSearchClick={searchHandle} />
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
        data={questionState.questions}
        customColumns={customColumns}
        customHeading={customHeading}
        isActionColumn={true}
        onEditClick={onEdit}
        onDeleteClick={onDelete}
      />
      <TablePagination
        component='div'
        rowsPerPageOptions={[5, 10, 25, 100]}
        count={questionState.totalItems}
        page={questionState.currentPage}
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
