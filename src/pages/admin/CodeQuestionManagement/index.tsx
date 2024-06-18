import { Box, Card, Divider, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import TableTemplate from "components/common/table/TableTemplate";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading1 from "components/text/Heading1";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { QuestionService } from "services/courseService/QuestionService";
import { clearCodeQuestion } from "reduxes/courseService/question";
import dayjs from "dayjs";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import ParagraphSmall from "components/text/ParagraphSmall";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import CustomDataGrid from "components/common/CustomDataGrid";
import React from "react";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { CoreCodeQuestionService } from "services/coreService/CoreCodeQuestionService";
import { setCodeQuestions } from "reduxes/coreService/CodeQuestion";
import ParagraphBody from "components/text/ParagraphBody";
import { setSuccessMess } from "reduxes/AppStatus";
enum FilterValue {
  ALL = "ALL",
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}
const AdminCodeQuestionManagement = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const codeQuestionState = useSelector((state: RootState) => state.codeQuestion);
  const searchHandle = async (searchText: string) => {
    setSearchText(searchText);
  };
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const tableHeading: GridColDef[] = [
    {
      field: "stt",
      sortable: false,
      flex: 0.7,
      align: "center",
      headerName: t("common_no")
    },
    {
      field: "name",
      sortable: false,
      flex: 2.5,
      headerName: t("code_question_name")
    },
    {
      field: "difficulty",
      sortable: false,
      flex: 1.5,
      headerName: t("code_question_difficulty"),
      renderCell: (params) => {
        return (
          <ParagraphBody>
            {params.row.difficulty === "HARD"
              ? t("common_hard")
              : params.row.difficulty === "MEDIUM"
                ? t("common_medium")
                : params.row.difficulty === "EASY"
                  ? t("common_easy")
                  : "Không xác định"}
          </ParagraphBody>
        );
      }
    },
    {
      field: "updated",
      sortable: false,
      flex: 2,
      headerName: t("code_question_updated"),
      renderCell: (params) => (
        <div>
          <ParagraphBody>{params.row.updatedByName}</ParagraphBody>
          <div>{dayjs(params.row.updatedAt).format("DD/MM/YYYY HH:mm")}</div>
        </div>
      )
    },
    {
      field: "operation",
      sortable: false,
      flex: 1,
      type: "actions",
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Save'
            sx={{
              color: "primary.main"
            }}
            onClick={() => {
              // todo edit question
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Cancel'
            className='textPrimary'
            onClick={() => {
              setDeletedCodeQuestionId(id as string);
              setIsOpenConfirmDelete(true);
            }}
            sx={{
              color: red[500]
            }}
          />
        ];
      },
      headerName: t("common_action")
    }
  ];

  const dispatch = useDispatch();

  const handleGetAdminCodeQuestions = React.useCallback(
    async ({
      search,
      isPublic,
      difficulty,
      pageNo = 0,
      pageSize = 10
    }: {
      search?: string;
      isPublic?: boolean;
      difficulty?: QuestionDifficultyEnum;
      pageNo?: number;
      pageSize?: number;
    }) => {
      setIsLoading(true);
      try {
        const getAdminCodeQuestionsResponse = await CoreCodeQuestionService.getAdminCodeQuestions({
          search,
          isPublic,
          difficulty,
          pageNo,
          pageSize
        });
        dispatch(setCodeQuestions(getAdminCodeQuestionsResponse));
        setIsLoading(false);
      } catch (error: any) {
        console.error("error", error);
        setIsLoading(false);
      }
    },
    [dispatch, t]
  );

  useEffect(() => {
    const fetchInitialQuestions = async () => {
      await handleGetAdminCodeQuestions({ search: searchText });
    };
    fetchInitialQuestions();
  }, [searchText]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const onEdit = (questionId: number) => {
    navigate(routes.admin.code_question.information.replace(":questionId", questionId.toString()));
  };

  const [deletedCodeQuestionId, setDeletedCodeQuestionId] = useState<string>("");
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onDeleteConfirmDelete = async () => {
    QuestionService.deleteQuestion(deletedCodeQuestionId)
      .then(() => {
        dispatch(setSuccessMess("Delete code question successfully"));
        dispatch(clearCodeQuestion());
      })
      .catch((error) => {
        console.log(error);
        dispatch(setSuccessMess("Delete code question failed"));
      })
      .finally(() => {
        setIsOpenConfirmDelete(false);
      });
  };

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const totalElement = useMemo(
    () => codeQuestionState.totalItems || 0,
    [codeQuestionState.questions]
  );

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setRowsPerPage(model.pageSize);
    handleGetAdminCodeQuestions({
      search: searchText,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };
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

  const handleApplyFilter = React.useCallback(() => {
    const difficulty = filters.find((filter) => filter.key === "Difficulty level")?.value;
    const isPublic = filters.find((filter) => filter.key === "Is public")?.value;
    handleGetAdminCodeQuestions({
      search: searchText,
      isPublic: !isPublic || isPublic === "ALL" ? undefined : isPublic === "PUBLIC",
      difficulty:
        !difficulty || difficulty === FilterValue.ALL
          ? undefined
          : (difficulty as QuestionDifficultyEnum)
    });
  }, [filters, handleGetAdminCodeQuestions, searchText]);

  const handleCancelFilter = React.useCallback(() => {
    setFilters([
      {
        key: "Difficulty level",
        value: FilterValue.ALL
      }
    ]);
    handleGetAdminCodeQuestions({
      search: searchText
    });
  }, [handleGetAdminCodeQuestions, searchText]);

  return (
    <>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this question?'
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />
      <Card
        sx={{
          margin: "20px",
          "& .MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "4px"
          }
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall colorname='--blue-500' translate-key='code_management_title'>
              {t("code_management_title")}
            </ParagraphSmall>
          </Box>
        </Box>
        <Divider />
        <Grid
          container
          spacing={2}
          sx={{
            padding: "20px"
          }}
        >
          <Grid item xs={12}>
            <Heading1 translate-key='code_management_title'>{t("code_management_title")}</Heading1>
          </Grid>
          <Grid item xs={12}>
            <CustomSearchFeatureBar
              isLoading={codeQuestionState.isLoading}
              searchValue={searchText}
              setSearchValue={setSearchText}
              onHandleChange={searchHandle}
              createBtnText={t("code_management_create_new_title")}
              onClickCreate={() => {
                navigate(routes.admin.code_question.create);
              }}
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
            {/* #F5F9FB */}
            <CustomDataGrid
              loading={codeQuestionState.isLoading}
              dataList={codeQuestionState.questions.map((question, index) => ({
                stt: index + 1,
                id: question.question.id,
                name: question.question.name,
                difficulty: question.question.difficulty,
                updatedByName:
                  question.question.updatedBy.lastName +
                  " " +
                  question.question.updatedBy.firstName,
                updated: question.question.updatedAt
              }))}
              tableHeader={tableHeading}
              onSelectData={rowSelectionHandler}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={rowsPerPage}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={true}
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
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default AdminCodeQuestionManagement;
