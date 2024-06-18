import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Card, Divider } from "@mui/material";
import Heading1 from "components/text/Heading1";
import ParagraphSmall from "components/text/ParagraphSmall";
import { CodeSubmissionDetailEntity } from "models/codeAssessmentService/entity/CodeSubmissionDetailEntity";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch } from "store";
import classes from "./styles.module.scss";
import CustomDataGrid from "components/common/CustomDataGrid";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import Heading6 from "components/text/Heading6";
import { CodeSubmissionPaginationList } from "models/codeAssessmentService/entity/CodeSubmissionPaginationList";
import { GradingStatus } from "models/codeAssessmentService/enum/GradingStatus";

const AdminContestSubmissions = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { contestId } = useParams<{ contestId: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [contestDetails, setContestDetails] = useState<ContestEntity | null>(null);

  const [codeSubmissions, setCodeSubmissions] = useState<CodeSubmissionDetailEntity[]>([]);

  const handleGetContestById = useCallback(
    async (id: string) => {
      dispatch(setInititalLoading(true));
      try {
        const getContestDetailsResponse = await ContestService.getContestById(id);
        if (getContestDetailsResponse) {
          setContestDetails(getContestDetailsResponse);
        }
        dispatch(setInititalLoading(false));
      } catch (error: any) {
        console.log("error", error);
        dispatch(setInititalLoading(false));
      }
    },
    [dispatch]
  );

  const handleGetAdminCodeSubmissionsByContestId = useCallback(
    async ({
      contestId,
      pageNo,
      pageSize
    }: {
      contestId?: string;
      pageNo: number;
      pageSize: number;
    }) => {
      setIsLoading(true);
      try {
        // const getAdminCodeSubmissionsByContestIdResponse: CodeSubmissionPaginationList =
        //   await CodeSubmissionService.getAdminCodeSubmissionList({
        //     contestId,
        //     pageNo,
        //     pageSize
        //   });

        // console.log(
        //   "getAdminCodeSubmissionsByContestIdResponse",
        //   getAdminCodeSubmissionsByContestIdResponse
        // );
        setCodeSubmissions([
          {
            id: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
            codeQuestionId: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
            programmingLanguageId: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
            avgRuntime: 0,
            avgMemory: 0,
            createdAt: "2021-10-01",
            gradingStatus: GradingStatus.GRADING,
            maxGrade: 100,
            achievedGrade: 0,
            description: "description",
            user: {
              id: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
              firstName: "firstName",
              lastName: "lastName",
              email: "email"
            },
            codeQuestion: {
              id: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
              name: "name"
            },
            headCode: "headCode",
            bodyCode: "bodyCode",
            tailCode: "tailCode",
            sourceCode: "sourceCode",
            firstFailTestCase: {
              input: "input",
              output: "output",
              actualOutput: "actualOutput",
              stderr: "stderr",
              compileOutput: "compileOutput",
              runtime: "runtime",
              memory: "memory",
              message: "message",
              description: "description"
            }
          },
          {
            id: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c2",
            codeQuestionId: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
            programmingLanguageId: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
            avgRuntime: 0,
            avgMemory: 0,
            createdAt: "2021-10-01",
            gradingStatus: GradingStatus.GRADING,
            maxGrade: 100,
            achievedGrade: 0,
            description: "description",
            user: {
              id: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
              firstName: "firstName",
              lastName: "lastName",
              email: "email"
            },
            codeQuestion: {
              id: "a2e5afa6-f0c8-422e-8895-a706d1a1d6c1",
              name: "name"
            },
            headCode: "headCode",
            bodyCode: "bodyCode",
            tailCode: "tailCode",
            sourceCode: "sourceCode",
            firstFailTestCase: {
              input: "input",
              output: "output",
              actualOutput: "actualOutput",
              stderr: "stderr",
              compileOutput: "compileOutput",
              runtime: "runtime",
              memory: "memory",
              message: "message",
              description: "description"
            }
          }
        ]);
        setIsLoading(false);
      } catch (error: any) {
        console.log("error", error);
        setIsLoading(false);
      }
    },
    []
  );

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {};
  const rowClickHandler = (params: GridRowParams<any>) => {
    // console.log(params);
  };

  const totalElement = useMemo(() => 0, []);

  const tableHeading: GridColDef[] = [
    {
      field: "problem",
      headerName: t("common_problem"),
      flex: 0.5,
      renderHeader: () => {
        return (
          <Heading6 fontWeight={600} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_problem")}
          </Heading6>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphSmall width={"auto"}>{params.row.codeQuestion?.name || ""}</ParagraphSmall>
        );
      }
    },
    {
      field: "status",
      headerName: t("common_status"),
      flex: 0.5,
      renderHeader: () => {
        return (
          <Heading6 fontWeight={600} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_status")}
          </Heading6>
        );
      },
      renderCell: (params) => {
        return <ParagraphSmall width={"auto"}>{params.row.gradingStatus}</ParagraphSmall>;
      }
    },
    {
      field: "email",
      headerName: t("common_email"),
      flex: 0.6,
      renderHeader: () => {
        return (
          <Heading6 fontWeight={600} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_email")}
          </Heading6>
        );
      },
      renderCell: (params) => {
        return <ParagraphSmall width={"auto"}>{params.row.user?.email || ""}</ParagraphSmall>;
      }
    },
    {
      field: "language",
      headerName: t("common_programming_language"),
      flex: 0.7,
      renderHeader: () => {
        return (
          <Heading6 fontWeight={600} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_programming_language")}
          </Heading6>
        );
      },
      renderCell: (params) => {
        return <ParagraphSmall width={"auto"}>{params.row.programmingLanguageId}</ParagraphSmall>;
      }
    },
    {
      field: "runtime",
      headerName: t("common_runtime"),
      flex: 0.5,
      renderHeader: () => {
        return (
          <Heading6 fontWeight={600} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_runtime")}
          </Heading6>
        );
      },
      renderCell: (params) => {
        return <></>;
      }
    },
    {
      field: "memory",
      headerName: t("common_memory"),
      flex: 0.5,
      renderHeader: () => {
        return (
          <Heading6 fontWeight={600} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_memory")}
          </Heading6>
        );
      },
      renderCell: (params) => {
        return <></>;
      }
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (contestId) {
        await handleGetContestById(contestId);
        await handleGetAdminCodeSubmissionsByContestId({
          contestId,
          pageNo: 0,
          pageSize
        });
      }
    };
    fetchData();
  }, [contestId, handleGetAdminCodeSubmissionsByContestId, handleGetContestById, pageSize]);

  if (!contestId || !contestDetails) {
    return null;
  }
  return (
    <>
      <Card
        sx={{
          "& .MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "4px"
          },
          margin: "20px 20px 90px 20px",
          gap: "20px"
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.admin.contest.root)}
              translation-key='contest_management_title'
            >
              {t("contest_management_title")}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() =>
                navigate(routes.admin.contest.edit.details.replace(":contestId", contestId))
              }
            >
              {contestDetails.name}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall colorname='--blue-500'>{t("detail_problem_submission")}</ParagraphSmall>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            margin: "20px",
            minHeight: "600px"
          }}
        >
          <Heading1>{t("detail_problem_submission")}</Heading1>
          <Box
            sx={{
              margin: "20px 0"
            }}
          >
            <CustomDataGrid
              loading={isLoading}
              dataList={codeSubmissions}
              tableHeader={tableHeading}
              onSelectData={rowSelectionHandler}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={pageSize}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={true}
              getRowHeight={() => "auto"}
              onClickRow={rowClickHandler}
              sx={{
                "& .MuiDataGrid-cell": {
                  border: "none"
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f9fb"
                },
                "& .MuiDataGrid-toolbarContainer": {
                  backgroundColor: "#f5f9fb"
                }
              }}
              personalSx={true}
            />
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default AdminContestSubmissions;
