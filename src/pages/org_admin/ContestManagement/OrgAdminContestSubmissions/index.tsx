import { Avatar, Box, Stack } from "@mui/material";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomBreadCrumb from "components/common/Breadcrumb";
import CustomDataGrid from "components/common/CustomDataGrid";
import Heading1 from "components/text/Heading1";
import Heading6 from "components/text/Heading6";
import ParagraphSmall from "components/text/ParagraphSmall";
import { CodeSubmissionDetailEntity } from "models/codeAssessmentService/entity/CodeSubmissionDetailEntity";
import { CodeSubmissionPaginationList } from "models/codeAssessmentService/entity/CodeSubmissionPaginationList";
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
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { kiloByteToMegaByte, roundedNumber } from "utils/number";
import classes from "./styles.module.scss";

const OrgAdminContestSubmissions = () => {
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
        const getAdminCodeSubmissionsByContestIdResponse: CodeSubmissionPaginationList =
          await CodeSubmissionService.getAdminCodeSubmissionList({
            contestId,
            pageNo,
            pageSize
          });
        setCodeSubmissions(getAdminCodeSubmissionsByContestIdResponse.codeSubmissions);
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
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetAdminCodeSubmissionsByContestId({
      contestId,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };
  const rowClickHandler = (params: GridRowParams<any>) => {
    navigate(
      routes.org_admin.contest.submission_detail
        .replace(":submissionId", params.id.toString() || "")
        .replace(":contestId", contestId || "")
    );
  };

  const totalElement = useMemo(() => codeSubmissions.length, [codeSubmissions]);

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
          <ParagraphSmall fontWeight={500} width={"auto"}>
            {params.row.codeQuestion?.name || ""}
          </ParagraphSmall>
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
        return (
          <Heading6
            fontWeight={700}
            colorname={
              params.row.gradingStatus === "GRADING"
                ? "--orange-4"
                : params.row.description !== "Accepted"
                  ? "--red-error"
                  : "--green-600"
            }
          >
            {params.row.gradingStatus === "GRADING"
              ? params.row.gradingStatus
              : params.row.description ??
                (params.row.gradingStatus === "GRADING_SYSTEM_UNAVAILABLE"
                  ? "GRADING SYSTEM UNAVAILABLE"
                  : "")}
          </Heading6>
        );
      }
    },
    {
      field: "email",
      headerName: t("common_email"),
      flex: 0.6,
      minWidth: 270,
      renderHeader: () => {
        return (
          <Heading6 fontWeight={600} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_email")}
          </Heading6>
        );
      },
      renderCell: (params) => {
        return (
          <Stack
            direction='row'
            gap={2}
            alignItems='center'
            justifyContent='flex-start'
            margin={"5px"}
            sx={{
              textOverflow: "ellipsis"
            }}
          >
            <Avatar
              sx={{
                bgcolor: `${generateHSLColorByRandomText(`${params.row.firstName} ${params.row.lastName}`)}`
              }}
              alt={params.row.user.email}
              src={params.row.user?.avatarUrl}
            >
              {params.row.user.firstName.charAt(0)}
            </Avatar>
            <ParagraphSmall fontWeight={500}>{params.row.user.email}</ParagraphSmall>
          </Stack>
        );
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
        return (
          <ParagraphSmall fontWeight={500} width={"auto"}>
            {params.row.programmingLanguageName}
          </ParagraphSmall>
        );
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
        return (
          <ParagraphSmall fontWeight={500} width={"auto"}>
            {params.row.avgRuntime === undefined || params.row.gradingStatus === "GRADING"
              ? "N/A"
              : `${roundedNumber(params.row.avgRuntime, 3)}s`}
          </ParagraphSmall>
        );
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
        return (
          <ParagraphSmall fontWeight={500} width={"auto"}>
            {params.row.avgMemory === undefined || params.row.gradingStatus === "GRADING"
              ? "N/A"
              : `${roundedNumber(kiloByteToMegaByte(params.row.avgMemory), 3)}MB`}
          </ParagraphSmall>
        );
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
      <Box>
        <Box className={classes.breadcump}>
          <Box id={classes.breadcumpWrapper}>
            <CustomBreadCrumb
              breadCrumbData={[
                { navLink: routes.org_admin.contest.root, label: t("contest_management_title") },
                {
                  navLink: routes.org_admin.contest.edit.details.replace(":contestId", contestId),
                  label: contestDetails.name
                }
              ]}
              lastBreadCrumbLabel={t("detail_problem_submission")}
            />
          </Box>
        </Box>
        <Box
          sx={{
            margin: "0 20px",
            minHeight: "700px"
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
      </Box>
    </>
  );
};

export default OrgAdminContestSubmissions;
