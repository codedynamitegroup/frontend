import { Box, CircularProgress, Link, Stack, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import classes from "./styles.module.scss";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import { routes } from "routes/routes";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import useAuth from "hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import Heading6 from "components/text/Heading6";
import ParagraphSmall from "components/text/ParagraphSmall";

export default function ProblemTable() {
  const { t } = useTranslation();
  const customHeading = ["Trạng thái", "Tên bài toán", "Độ khó"];

  const { isLoggedIn } = useAuth();

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
        <Heading6 fontWeight={600} colorname={"--green-500"}>
          {t("common_easy")}
        </Heading6>
      );
    }
    if (level === QuestionDifficultyEnum.MEDIUM) {
      return (
        <Heading6 fontWeight={600} colorname={"--orange-5"}>
          {t("common_medium")}
        </Heading6>
      );
    }
    return (
      <Heading6 fontWeight={600} colorname={"--red-hard"}>
        {t("common_hard")}
      </Heading6>
    );
  };
  const data = codeQuestionList.codeQuestions.map((value) => ({
    id: value.id,
    name: value.name,
    status: renderStatus(value.done === true ? 1 : 0),
    level: renderLevel(value.difficulty)
  }));

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
                      <Heading6 fontWeight={"700"} translation-key='common_status'>
                        {t("common_status")}
                      </Heading6>
                    </TableCell>
                    <TableCell align='left'>
                      <Heading6 fontWeight={"700"} translation-key='list_problem_problem_name'>
                        {t("list_problem_problem_name")}
                      </Heading6>
                    </TableCell>
                    <TableCell align='left' className={classes.status}>
                      <Heading6 fontWeight={"700"} translation-key='common_difficult_level'>
                        {t("common_difficult_level")}
                      </Heading6>
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
                          <ParagraphSmall fontWeight={"500"} className={classes.linkText}>
                            <Link
                              component={RouterLink}
                              to={routes.user.problem.detail.description.replace(
                                ":problemId",
                                row.id
                              )}
                              underline='hover'
                              color='inherit'
                            >
                              {row.name}
                            </Link>
                          </ParagraphSmall>
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
