import { Box, Divider, Grid, InputLabel, Pagination, Stack } from "@mui/material";
import { Card } from "@mui/joy";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import { PaginationList } from "models/codeAssessmentService/entity/PaginationList";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
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
import ParagraphBody from "components/text/ParagraphBody";
import { setSuccessMess } from "reduxes/AppStatus";
import BasicSelect from "components/common/select/BasicSelect";
import { Controller, useForm } from "react-hook-form";
import { AddCircleRounded } from "@mui/icons-material";
import AutoSearchBar from "components/common/search/AutoSearchBar";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
enum FilterDifficultValue {
  ALL = "ALL",
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}
enum FilterScopeValue {
  ALL = "ALL",
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC"
}
type SearchCodeQuestionForm = {
  scope: FilterScopeValue;
  difficultLevel: FilterDifficultValue;
  search: string;
};
const AdminCodeQuestionManagement = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [codeQuestions, setCodeQuestions] = useState<CodeQuestionEntity[]>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [isCodeQuestionLoading, setIsCodeQuestionLoading] = useState(false);
  const searchHandle = async (searchText: string) => {
    setSearchText(searchText);
  };
  const { control: searchControl, watch: searchWatch } = useForm<SearchCodeQuestionForm>({
    defaultValues: {
      scope: FilterScopeValue.ALL,
      difficultLevel: FilterDifficultValue.ALL,
      search: ""
    }
  });
  const mapFilterScopeValueToIsPublic = (value: FilterScopeValue): boolean | null => {
    if (value === FilterScopeValue.ALL) return null;
    if (value === FilterScopeValue.PRIVATE) return false;
    return true;
  };
  const mapFilterDifficultValueToQuestionDifficultyEnum = (
    value: FilterDifficultValue
  ): QuestionDifficultyEnum | null => {
    if (value === FilterDifficultValue.ALL) return null;
    if (value === FilterDifficultValue.EASY) return QuestionDifficultyEnum.EASY;
    if (value === FilterDifficultValue.HARD) return QuestionDifficultyEnum.HARD;
    return QuestionDifficultyEnum.MEDIUM;
  };
  const watchAll = searchWatch();
  const fetchCodeQuestions = useCallback(() => {
    setIsCodeQuestionLoading(true);
    CodeQuestionService.getAdminCodeQuestion(
      {
        search: watchAll.search,
        difficulty: mapFilterDifficultValueToQuestionDifficultyEnum(watchAll.difficultLevel),
        isPublic: mapFilterScopeValueToIsPublic(watchAll.scope)
      },
      { pageNum: page, pageSize: rowsPerPage }
    )
      .then((data: PaginationList<CodeQuestionEntity>) => {
        setCodeQuestions(data.codeQuestions);
        setTotalItem(data.totalItems);
        console.log(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsCodeQuestionLoading(false);
      });
  }, [watchAll, page, rowsPerPage]);
  useEffect(() => {
    fetchCodeQuestions();
  }, [watchAll.difficultLevel, watchAll.scope, page, rowsPerPage]);
  const [timer, setTimer] = useState<number | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timer);
    const newTimer = window.setTimeout(() => {
      fetchCodeQuestions();
    }, 250);
    setTimer(newTimer);
  }, [watchAll.search]);
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
            {params.row.difficulty === QuestionDifficultyEnum.HARD
              ? t("common_hard")
              : params.row.difficulty === QuestionDifficultyEnum.MEDIUM
                ? t("common_medium")
                : params.row.difficulty === QuestionDifficultyEnum.EASY
                  ? t("common_easy")
                  : "Không xác định"}
          </ParagraphBody>
        );
      }
    },
    // {
    //   field: "updated",
    //   sortable: false,
    //   flex: 2,
    //   headerName: t("code_question_updated"),
    //   renderCell: (params) => (
    //     <div>
    //       <ParagraphBody>{params.row.updatedByName}</ParagraphBody>
    //       <div>{dayjs(params.row.updatedAt).format("DD/MM/YYYY HH:mm")}</div>
    //     </div>
    //   )
    // },
    {
      field: "operation",
      sortable: false,
      flex: 1,
      type: "actions",
      cellClassName: "actions",
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            sx={{
              color: "primary.main"
            }}
            onClick={() => {
              navigate(
                "/admin/code-questions/detail/:codeQuestionId".replace(
                  ":codeQuestionId",
                  params.row.id
                )
              );
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            className='textPrimary'
            onClick={() => {
              setDeletedCodeQuestionId(params.id as string);
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

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setRowsPerPage(model.pageSize);
  };

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this question?'
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />
      <Box>
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
            <Card
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                padding: "10px 10px"
              }}
              variant='outlined'
              color='neutral'
            >
              <Stack direction='row' gap={1} display='flex' alignItems='center' width={"100%"}>
                <ParagraphBody width={"100px"}>{t("common_filter_by")}</ParagraphBody>
                <Controller
                  name='scope'
                  control={searchControl}
                  render={({ field: { onChange, value, ref } }) => (
                    <BasicSelect
                      labelId='scope-id'
                      ref={ref}
                      label={t("common_scope")}
                      onHandleChange={onChange}
                      borderRadius='12px'
                      value={value}
                      sx={{ maxWidth: "200px" }}
                      translation-key={[
                        "common_status",
                        "common_all",
                        "list_problem_solved_done",
                        "list_problem_solved_not_done"
                      ]}
                      items={[
                        {
                          value: FilterScopeValue.ALL,
                          label: t("common_all")
                        },
                        {
                          value: FilterScopeValue.PUBLIC,
                          label: t("common_public")
                        },
                        {
                          value: FilterScopeValue.PRIVATE,
                          label: t("common_private")
                        }
                      ]}
                      backgroundColor='#FFFFFF'
                    />
                  )}
                />
                <Controller
                  name='difficultLevel'
                  control={searchControl}
                  render={({ field: { onChange, value, ref } }) => (
                    <BasicSelect
                      labelId='difficult-level-id'
                      ref={ref}
                      value={value}
                      label={t("common_difficult_level")}
                      onHandleChange={onChange}
                      borderRadius='12px'
                      sx={{ maxWidth: "200px" }}
                      translation-key={[
                        "common_difficult_level",
                        "common_all",
                        "common_easy",
                        "common_medium",
                        "common_hard"
                      ]}
                      items={[
                        {
                          value: FilterDifficultValue.ALL,
                          label: t("common_all")
                        },
                        {
                          value: FilterDifficultValue.EASY,
                          label: t("common_easy")
                        },
                        {
                          value: FilterDifficultValue.MEDIUM,
                          label: t("common_medium")
                        },
                        {
                          value: FilterDifficultValue.HARD,
                          label: t("common_hard")
                        }
                      ]}
                      backgroundColor='#FFFFFF'
                    />
                  )}
                />
              </Stack>
            </Card>
            <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
            <Box className={classes.searchWrapper}>
              <Stack direction='row' gap={2}>
                <Controller
                  name='search'
                  control={searchControl}
                  render={({ field }) => (
                    <AutoSearchBar
                      value={field.value}
                      setValue={field.onChange}
                      onHandleChange={() => {}}
                      maxWidth='50%'
                    />
                  )}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%"
                  }}
                >
                  <Button
                    variant='contained'
                    borderRadius='12px'
                    onClick={() => {
                      navigate(routes.admin.code_question.create);
                    }}
                    startIcon={<AddCircleRounded />}
                    sx={{
                      backgroundColor: "var(--blue-2) !important"
                    }}
                  >
                    <ParagraphBody fontSize={"14px"} fontWeight={"500"} colorname='--ghost-white'>
                      {t("create_question_code")}
                    </ParagraphBody>
                  </Button>
                </Box>
              </Stack>
            </Box>
            {/* <CustomSearchFeatureBar
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
            /> */}
          </Grid>
          <Grid item xs={12}>
            {/* #F5F9FB */}
            <CustomDataGrid
              loading={isCodeQuestionLoading}
              dataList={codeQuestions.map((question, index) => ({
                stt: page * rowsPerPage + index + 1,
                id: question.id,
                name: question.name,
                difficulty: question.difficulty
              }))}
              tableHeader={tableHeading}
              onSelectData={rowSelectionHandler}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={rowsPerPage}
              totalElement={totalItem}
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
      </Box>
    </>
  );
};

export default AdminCodeQuestionManagement;
