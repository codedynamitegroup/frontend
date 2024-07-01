import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextTitle from "components/text/TextTitle";
import EmptyListView from "../../../EmptyListView";
import { useTranslation } from "react-i18next";
import { Box, Grid } from "@mui/material";
import CustomPagination from "components/common/pagination/CustomPagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { useDispatch } from "react-redux";
import { setErrorMess } from "reduxes/AppStatus";
import Heading6 from "components/text/Heading6";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { routes } from "routes/routes";
import { CircularProgress } from "@mui/joy";

interface UserRecentCodeQuestionProps {
  id: string;
  questionId: string;
  name: string;
  isPublic: boolean;
  difficulty: QuestionDifficultyEnum;
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  },
  // change cursor to pointer on hover
  "&:hover": {
    cursor: "pointer"
  }
}));

export default function UserRecentCodeQuestion() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{
    codeQuestions: {
      codeQuestions: UserRecentCodeQuestionProps[];
      currentPage: number;
      totalItems: number;
      totalPages: number;
    };
  }>({
    codeQuestions: {
      codeQuestions: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0
    }
  });
  const [pageNo, setPageNo] = useState(1);

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

  const dispatch = useDispatch();

  const handleGetRecentCodeQuestion = useCallback(
    async ({ pageNo = 0, pageSize = 10 }: { pageNo?: number; pageSize?: number }) => {
      setIsLoading(true);
      try {
        const getRecentCodeQuestionResponse = await CodeSubmissionService.getRecentCodeQuestion(
          pageNo,
          pageSize
        );
        setData((prev) => ({
          ...prev,
          codeQuestions: {
            currentPage: getRecentCodeQuestionResponse.currentPage,
            totalItems: getRecentCodeQuestionResponse.totalItems,
            totalPages: getRecentCodeQuestionResponse.totalPages,
            codeQuestions: getRecentCodeQuestionResponse.codeQuestions
          }
        }));
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
      }
      setIsLoading(false);
    },
    [dispatch, t]
  );

  useEffect(() => {
    const fetchRecentCodeQuestion = async () => {
      await handleGetRecentCodeQuestion({});
    };

    fetchRecentCodeQuestion();
  }, [dispatch, handleGetRecentCodeQuestion]);

  const navigate = useNavigate();
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
    handleGetRecentCodeQuestion({ pageNo: pageNo - 1 });
  };

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "10px"
          }}
        >
          <CircularProgress />
        </Box>
      ) : data.codeQuestions.codeQuestions.length === 0 ? (
        <EmptyListView />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableBody>
                {data.codeQuestions.codeQuestions.map((codeQuestion) => (
                  <StyledTableRow
                    key={codeQuestion.id}
                    onClick={() => {
                      navigate(
                        routes.user.problem.detail.description.replace(
                          ":problemId",
                          codeQuestion.id
                        )
                      );
                    }}
                  >
                    <StyledTableCell component='th' scope='row'>
                      <TextTitle>{codeQuestion.name}</TextTitle>
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {renderLevel(codeQuestion.difficulty)}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <CustomPagination
              count={data.codeQuestions.totalPages}
              page={pageNo}
              handlePageChange={handlePageChange}
              showFirstButton
              showLastButton
              size={"large"}
            />
          </Grid>
        </>
      )}
    </>
  );
}
