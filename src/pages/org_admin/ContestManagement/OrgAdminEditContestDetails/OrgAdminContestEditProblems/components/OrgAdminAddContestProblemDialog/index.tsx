import { Checkbox, Grid } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomDialog from "components/common/dialogs/CustomDialog";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import Heading3 from "components/text/Heading3";
import Heading6 from "components/text/Heading6";
import ParagraphSmall from "components/text/ParagraphSmall";
import useAuth from "hooks/useAuth";
import { ContestQuestionEntity } from "models/coreService/entity/ContestQuestionEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setErrorMess } from "reduxes/AppStatus";
import { CoreCodeQuestionService } from "services/coreService/CoreCodeQuestionService";
import { AppDispatch } from "store";

interface OrgAdminAddContestProblemDialogQuestionInterface {
  id: string;
  questionId: string;
  orgId?: string;
  no: number;
  name: string;
  difficulty: string;
  isPublic: boolean;
  maxGrade: number;
  defaultMark: number;
}

interface OrgAdminAddContestProblemDialogProps extends DialogProps {
  title?: string;
  isReportExisted?: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: (newProblems: ContestQuestionEntity[]) => void;
  isConfirmLoading?: boolean;
  currentQuestionList: ContestQuestionEntity[];
}

enum FilterValue {
  ALL = "ALL",
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

export default function OrgAdminAddContestProblemDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  isConfirmLoading = false,
  isReportExisted,
  currentQuestionList,
  ...props
}: OrgAdminAddContestProblemDialogProps) {
  const { t } = useTranslation();
  const { loggedUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [filters, setFilters] = React.useState<
    {
      key: string;
      value: string;
    }[]
  >([
    {
      key: "Difficulty level",
      value: FilterValue.ALL
    }
  ]);

  const [data, setData] = React.useState<{
    codeQuestions: OrgAdminAddContestProblemDialogQuestionInterface[];
    currentPage: number;
    totalPage: number;
    totalItems: number;
  }>({
    codeQuestions: [],
    currentPage: 0,
    totalPage: 0,
    totalItems: 0
  });

  const handleGetOrgAdminCodeQuestions = React.useCallback(
    async ({
      search,
      isPublic,
      difficulty,
      pageNo = 0,
      pageSize = 5
    }: {
      search?: string;
      isPublic?: boolean;
      difficulty?: QuestionDifficultyEnum;
      pageNo?: number;
      pageSize?: number;
    }) => {
      setIsLoading(true);
      try {
        if (!loggedUser || !loggedUser.organization) {
          setIsLoading(false);
          dispatch(setErrorMess("Organization not found"));
          return;
        }
        const getAdminCodeQuestionsResponse =
          await CoreCodeQuestionService.getOrgAdminIsAllowedToImportCodeQuestions({
            orgId: loggedUser.organization.organizationId,
            search,
            isPublic,
            difficulty,
            pageNo,
            pageSize
          });
        setData({
          codeQuestions: getAdminCodeQuestionsResponse.qtypeCodeQuestions.map(
            (
              item: {
                id: string;
                question: {
                  organization?: {
                    id: string;
                    name: string;
                    description: string;
                  };
                  id: string;
                  name: string;
                  questionText: string;
                  generalFeedback: string;
                  difficulty: string;
                  defaultMark: number;
                };
                isPublic: boolean;
                maxGrade: number;
              },
              index: number
            ) => ({
              id: item.id,
              questionId: item.question.id,
              orgId: item.question.organization?.id,
              no: pageNo * pageSize + index + 1,
              name: item.question.name,
              difficulty: item.question.difficulty,
              isPublic: item.isPublic,
              maxGrade: item.maxGrade,
              defaultMark: item.question.defaultMark
            })
          ),
          currentPage: getAdminCodeQuestionsResponse.currentPage,
          totalPage: getAdminCodeQuestionsResponse.totalPage,
          totalItems: getAdminCodeQuestionsResponse.totalItems
        });
        setIsLoading(false);
      } catch (error: any) {
        console.error("error", error);
        setIsLoading(false);
      }
    },
    [dispatch, loggedUser]
  );

  const handleApplyFilter = React.useCallback(() => {
    const difficulty = filters.find((filter) => filter.key === "Difficulty level")?.value;
    const isPublic = filters.find((filter) => filter.key === "Is public")?.value;
    handleGetOrgAdminCodeQuestions({
      search: searchValue,
      isPublic: !isPublic || isPublic === "ALL" ? undefined : isPublic === "PUBLIC",
      difficulty:
        !difficulty || difficulty === FilterValue.ALL
          ? undefined
          : (difficulty as QuestionDifficultyEnum)
    });
  }, [filters, handleGetOrgAdminCodeQuestions, searchValue]);

  const handleCancelFilter = React.useCallback(() => {
    setFilters([
      {
        key: "Difficulty level",
        value: FilterValue.ALL
      }
    ]);
    handleGetOrgAdminCodeQuestions({
      search: searchValue
    });
  }, [handleGetOrgAdminCodeQuestions, searchValue]);

  const tableHeading: GridColDef[] = [
    { field: "no", headerName: t("common_no"), width: 100 },
    {
      field: "name",
      headerName: t("list_problem_problem_name"),
      flex: 1.5,
      renderCell: (params) => {
        return <ParagraphSmall fontWeight={"500"}>{params.row.name}</ParagraphSmall>;
      }
    },
    {
      field: "maxGrade",
      headerName: "Max grade",
      flex: 0.6,
      renderCell: (params) => {
        return <Heading6 fontWeight={600}>{params.row.maxGrade}</Heading6>;
      }
    },
    {
      field: "difficulty",
      headerName: t("common_difficulty_level"),
      flex: 0.6,
      renderCell: (params) => {
        return (
          <Heading6
            fontWeight={600}
            colorname={
              params.row.difficulty === FilterValue.EASY
                ? "--green-500"
                : params.row.difficulty === FilterValue.MEDIUM
                  ? "--orange-5"
                  : "--red-hard"
            }
          >
            {params.row.difficulty === FilterValue.EASY
              ? t("common_easy")
              : params.row.difficulty === FilterValue.MEDIUM
                ? t("common_medium")
                : params.row.difficulty === FilterValue.HARD
                  ? t("common_hard")
                  : params.row.difficulty}
          </Heading6>
        );
      }
    },
    {
      field: "isPublic",
      headerName: t("contest_is_public"),
      flex: 0.4,
      align: "center",
      renderHeader: () => {
        return (
          <Heading6 width={"auto"} sx={{ textAlign: "left" }}>
            {t("contest_is_public")}
          </Heading6>
        );
      },
      renderCell: (params) => {
        return (
          <Checkbox
            disableRipple
            checked={params.row.isPublic === true ? true : false}
            color={params.row.isPublic ? "success" : "error"}
            sx={{
              "&:hover": {
                backgroundColor: "transparent !important",
                cursor: "default"
              }
            }}
          />
        );
      }
    }
  ];

  const dataGridToolbar = { enableToolbar: true };

  const [rowSelection, setRowSelection] = React.useState<GridRowId[]>(
    currentQuestionList.map((item) => item.codeQuestionId) as GridRowId[]
  );

  const [selectedCodeQuestions, setSelectedCodeQuestions] = React.useState<ContestQuestionEntity[]>(
    currentQuestionList.map((item) => ({
      codeQuestionId: item.codeQuestionId,
      questionId: item.questionId,
      difficulty: item.difficulty,
      name: item.name,
      questionText: item.questionText,
      defaultMark: item.defaultMark,
      maxGrade: item.maxGrade
    }))
  );

  const rowSelectionHandler = React.useCallback(
    (selectedRowId: GridRowSelectionModel, details: GridCallbackDetails<any>) => {
      if (selectedRowId.length === 0) {
        // dispatch(setErrorMess("Please select at least one problem to add"));
        return;
      }
      const newCotestQuestionEntityList: ContestQuestionEntity[] = [];
      for (const id of selectedRowId) {
        const selectedRow = data.codeQuestions.find((item) => item.id === id);
        if (selectedRow) {
          newCotestQuestionEntityList.push({
            questionId: selectedRow.questionId,
            codeQuestionId: selectedRow.id,
            difficulty: selectedRow.difficulty,
            name: selectedRow.name,
            questionText: "",
            defaultMark: selectedRow.defaultMark,
            maxGrade: selectedRow.maxGrade
          });
        }
      }

      const selectedRowsUncheckedInCurrentPage = data.codeQuestions.filter(
        (item) => !selectedRowId.includes(item.id)
      );
      const newSelectedRowId: GridRowId[] = [...rowSelection, ...selectedRowId]
        .filter((item, index, self) => self.indexOf(item) === index)
        .filter((item) => {
          // check if the item is unchecked then remove it from the list
          if (selectedRowsUncheckedInCurrentPage.find((row) => row.id === item)) {
            return false;
          } else {
            return true;
          }
        });

      setRowSelection(newSelectedRowId);
      setSelectedCodeQuestions((prev) =>
        [...prev, ...newCotestQuestionEntityList]
          .filter(
            (item, index, self) =>
              self.findIndex((t) => t.codeQuestionId === item.codeQuestionId) === index
          )
          .filter((item) => newSelectedRowId.includes(item.codeQuestionId))
      );
    },
    [data.codeQuestions, rowSelection]
  );

  const pageChangeHandler = async (
    model: GridPaginationModel,
    details: GridCallbackDetails<any>
  ) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetOrgAdminCodeQuestions({
      search: searchValue,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const totalElement = data.totalItems;

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setPage(0);
      const difficulty = filters.find((filter) => filter.key === "Difficulty level")?.value;
      const isPublic = filters.find((filter) => filter.key === "Is public")?.value;
      handleGetOrgAdminCodeQuestions({
        search: value,
        isPublic: !isPublic || isPublic === "ALL" ? undefined : isPublic === "PUBLIC",
        difficulty:
          !difficulty || difficulty === FilterValue.ALL
            ? undefined
            : (difficulty as QuestionDifficultyEnum),
        pageNo: 0,
        pageSize: pageSize
      });
    },
    [handleGetOrgAdminCodeQuestions, pageSize, filters]
  );

  const handleConfirm = React.useCallback(() => {
    if (onHanldeConfirm) {
      onHanldeConfirm(selectedCodeQuestions);
    }
  }, [onHanldeConfirm, selectedCodeQuestions]);

  React.useEffect(() => {
    handleGetOrgAdminCodeQuestions({});
  }, [handleGetOrgAdminCodeQuestions]);

  if (!loggedUser || !loggedUser.organization) {
    return null;
  }

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={t("contest_import_problem_button")}
      onHanldeConfirm={handleConfirm}
      onHandleCancel={onHandleCancel}
      minWidth={"1000px"}
      {...props}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Heading3 translate-key='contest_problem_list'>{t("contest_problem_list")}</Heading3>
        </Grid>
        <Grid item xs={12}>
          <CustomSearchFeatureBar
            isLoading={isLoading}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onHandleChange={handleSearchChange}
            numOfResults={totalElement}
            filterKeyList={[
              {
                label: t("common_difficulty_level"),
                value: "Difficulty level"
              },
              {
                label: t("contest_is_public"),
                value: "Is public"
              }
            ]}
            filterValueList={{
              "Difficulty level": [
                {
                  label: t("common_all"),
                  value: FilterValue.ALL
                },
                {
                  label: t("common_easy"),
                  value: FilterValue.EASY
                },
                {
                  label: t("common_medium"),
                  value: FilterValue.MEDIUM
                },
                {
                  label: t("common_hard"),
                  value: FilterValue.HARD
                }
              ] as { label: string; value: string }[],
              "Is public": [
                {
                  label: t("common_all"),
                  value: "ALL"
                },
                {
                  label: t("common_public"),
                  value: "PUBLIC"
                },
                {
                  label: t("common_private"),
                  value: "PRIVATER"
                }
              ] as { label: string; value: string }[]
            }}
            filters={filters}
            handleChangeFilters={(filters: { key: string; value: string }[]) => {
              setFilters(filters);
            }}
            onHandleApplyFilter={handleApplyFilter}
            onHandleCancelFilter={handleCancelFilter}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomDataGrid
            loading={isLoading}
            dataList={data.codeQuestions}
            tableHeader={tableHeading}
            checkboxSelection={true}
            rowSelectionModel={rowSelection}
            onSelectData={(rowSelectionModel, details) =>
              rowSelectionHandler(rowSelectionModel, details)
            }
            dataGridToolBar={dataGridToolbar}
            page={page}
            pageSize={pageSize}
            totalElement={totalElement}
            onPaginationModelChange={pageChangeHandler}
            showVerticalCellBorder={false}
            // onClickRow={rowClickHandler}
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
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
