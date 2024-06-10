import { Box, CircularProgress, Stack, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import classes from "./styles.module.scss";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ParagraphBody from "components/text/ParagraphBody";
import { useAppSelector } from "hooks";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { PaginationList } from "models/codeAssessmentService/entity/PaginationList";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { routes } from "routes/routes";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import useAuth from "hooks/useAuth";

export default function ProblemTable() {
  const { t } = useTranslation();
  const customHeading = ["Trạng thái", "Tên bài toán", "Độ khó"];

  const auth = useAuth();

  const algorithmTag = useAppSelector((state) => state.algorithmnTag);
  const searchAndDifficultyAndSolved = useAppSelector(
    (state) => state.searchAndDifficultyAndSolved
  );
  const [codeQuestionList, setCodeQuestionList] = useState<PaginationList<CodeQuestionEntity>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    codeQuestions: []
  });
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  // console.log("page", page, "row perpage", rowsPerPage);

  const choosenTagList = algorithmTag.tagList.filter((value) => value.isChoosen);

  useEffect(() => {
    setLoading(true);
    CodeQuestionService.getCodeQuestion(
      {
        tag: choosenTagList.length > 0 ? choosenTagList : null,
        search: searchAndDifficultyAndSolved.searchKey,
        difficulty: searchAndDifficultyAndSolved.difficulty,
        solved: searchAndDifficultyAndSolved.solved
      },
      {
        pageNum: page,
        pageSize: rowsPerPage
      }
    )
      .then((data: PaginationList<CodeQuestionEntity>) => {
        setCodeQuestionList(data);
      })
      .catch((reason) => console.log(reason))
      .finally(() => setLoading(false));
  }, [algorithmTag.tagList, page, rowsPerPage, searchAndDifficultyAndSolved]);

  const renderStatus = (status: number) => {
    if (status === 1) {
      return (
        <Tooltip title={t("common_finish")}>
          <CheckCircleIcon className={classes.iconCheck} />
        </Tooltip>
      );
    }
    return "";
  };

  const renderLevel = (level: QuestionDifficultyEnum) => {
    if (level === QuestionDifficultyEnum.EASY) {
      return (
        <ParagraphBody fontWeight={700} colorname={"--green-easy"}>
          {t("common_easy")}
        </ParagraphBody>
      );
    }
    if (level === QuestionDifficultyEnum.MEDIUM) {
      return (
        <ParagraphBody fontWeight={700} colorname={"--orange-medium"}>
          {t("common_medium")}
        </ParagraphBody>
      );
    }
    return (
      <ParagraphBody fontWeight={700} colorname={"--red-hard"}>
        {t("common_hard")}
      </ParagraphBody>
    );
  };
  const data = codeQuestionList.codeQuestions.map((value) => ({
    id: value.id,
    name: value.name,
    status: renderStatus(value.done === true ? 1 : 0),
    level: renderLevel(value.difficulty)
  }));
  // = [
  //   {
  //     id: 1,
  //     status: renderStatus(0),
  //     name: "Tổng 2 số",
  //     level: renderLevel(0)
  //   },
  //   {
  //     id: 2,
  //     status: renderStatus(1),
  //     name: "Trung bình cộng",
  //     level: renderLevel(1)
  //   },
  //   {
  //     id: 3,
  //     status: renderStatus(0),
  //     name: "Phân số tối giản",
  //     level: renderLevel(1)
  //   },
  //   {
  //     id: 4,
  //     status: renderStatus(0),
  //     name: "Sắp xếp mảng tăng dần",
  //     level: renderLevel(2)
  //   },
  //   {
  //     id: 5,
  //     status: renderStatus(1),
  //     name: "Kiểm tra số nguyên tố",
  //     level: renderLevel(2)
  //   },
  //   {
  //     id: 6,
  //     status: renderStatus(1),
  //     name: "Đảo chuỗi",
  //     level: renderLevel(2)
  //   },
  //   {
  //     id: 7,
  //     status: renderStatus(0),
  //     name: "Tìm phần tử lớn nhất trong mảng",
  //     level: renderLevel(2)
  //   },
  //   {
  //     id: 8,
  //     status: renderStatus(1),
  //     name: "Số Fibonacci",
  //     level: renderLevel(0)
  //   },
  //   {
  //     id: 9,
  //     status: renderStatus(0),
  //     name: "Thuật toán tìm kiếm nhị phân",
  //     level: renderLevel(2)
  //   },
  //   {
  //     id: 10,
  //     status: renderStatus(0),
  //     name: "Đếm số lần xuất hiện của phần tử trong mảng",
  //     level: renderLevel(1)
  //   }
  // ];

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

  const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    &:hover,
    &:active {
      color: blue;
    }
  `;

  return (
    <Box className={classes.container}>
      {/* <Heading2 translation-key='list_problem'>{t("list_problem")}</Heading2> */}
      <Box className={classes.table}>
        {loading && (
          <Stack alignItems={"center"}>
            <CircularProgress />
          </Stack>
        )}
        {!loading && (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label='custom table'>
                <TableHead className={classes["table-head"]}>
                  <TableRow>
                    <TableCell align='center' className={classes.status}>
                      <ParagraphBody fontWeight={700} translation-key='common_status'>
                        {t("common_status")}
                      </ParagraphBody>
                    </TableCell>
                    <TableCell align='left'>
                      <ParagraphBody fontWeight={700} translation-key='list_problem_problem_name'>
                        {t("list_problem_problem_name")}
                      </ParagraphBody>
                    </TableCell>
                    <TableCell align='left' className={classes.status}>
                      <ParagraphBody fontWeight={700} translation-key='common_difficult_level'>
                        {t("common_difficult_level")}
                      </ParagraphBody>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data &&
                    data.length > 0 &&
                    data.map((row, rowIndex) => (
                      <TableRow
                        className={rowIndex % 2 === 0 ? classes.row : classes.row1}
                        key={rowIndex}
                        // onClick={() =>
                        //   navigate(routes.user.problem.detail.description.replace(":problemId", row.id))
                        // }
                      >
                        <TableCell align='center'>{row.status}</TableCell>
                        <TableCell className={classes.tableCell}>
                          <StyledLink
                            to={routes.user.problem.detail.description.replace(
                              ":problemId",
                              row.id
                            )}
                            style={{ pointerEvents: "auto" }}
                          >
                            {row.name}
                          </StyledLink>
                        </TableCell>
                        <TableCell>{row.level}</TableCell>
                      </TableRow>
                    ))}
                  {(!data || data.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={customHeading.length}>
                        <ParagraphBody
                          className={classes.noList}
                          translation-key='list_problem_not_found_data'
                        >
                          {t("list_problem_not_found_data")}
                        </ParagraphBody>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component='div'
              rowsPerPageOptions={[5, 10, 25, 100]}
              count={codeQuestionList.totalItems}
              page={Number(page)}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              translation-key='common_table_row_per_page'
              labelRowsPerPage={t("common_table_row_per_page")} // Thay đổi text ở đây
              onRowsPerPageChange={handleChangeRowsPerPage}
              className={classes.pagination}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
