import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Checkbox, Grid, Link, Stack } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomDialog from "components/common/dialogs/CustomDialog";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import Heading3 from "components/text/Heading3";
import Heading6 from "components/text/Heading6";
import ParagraphSmall from "components/text/ParagraphSmall";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import classes from "./styles.module.scss";

interface AddContestProblemDialogProps extends DialogProps {
  title?: string;
  isReportExisted?: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  isConfirmLoading?: boolean;
}

enum FilterValue {
  ALL = "ALL",
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

export default function AddContestProblemDialog({
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
  ...props
}: AddContestProblemDialogProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [searchValue, setSearchValue] = React.useState<string>("");
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

  const [questionList, setQuestionList] = React.useState<any[]>([
    {
      id: "1",
      no: 1,
      name: "Problem 1",
      difficulty: "EASY",
      isPublic: true
    },
    {
      id: "2",
      no: 2,
      name: "Problem 2",
      difficulty: "MEDIUM",
      isPublic: false
    },
    {
      id: "3",
      no: 3,
      name: "Problem 3",
      difficulty: "HARD",
      isPublic: true
    },
    {
      id: "4",
      no: 4,
      name: "Problem 4",
      difficulty: "EASY",
      isPublic: false
    },
    {
      id: "5",
      no: 5,
      name: "Problem 5",
      difficulty: "MEDIUM",
      isPublic: true
    },
    {
      id: "6",
      no: 6,
      name: "Problem 6",
      difficulty: "HARD",
      isPublic: true
    },
    {
      id: "7",
      no: 7,
      name: "Problem 7",
      difficulty: "EASY",
      isPublic: false
    },
    {
      id: "8",
      no: 8,
      name: "Problem 8",
      difficulty: "MEDIUM",
      isPublic: true
    },
    {
      id: "9",
      no: 9,
      name: "Problem 9",
      difficulty: "HARD",
      isPublic: false
    },
    {
      id: "10",
      no: 10,
      name: "Problem 10",
      difficulty: "EASY",
      isPublic: false
    },
    {
      id: "11",
      no: 11,
      name: "Problem 11",
      difficulty: "MEDIUM",
      isPublic: true
    },
    {
      id: "12",
      no: 12,
      name: "Problem 12",
      difficulty: "HARD",
      isPublic: true
    },
    {
      id: "13",
      no: 13,
      name: "Problem 13",
      difficulty: "EASY",
      isPublic: true
    },
    {
      id: "14",
      no: 14,
      name: "Problem 14",
      difficulty: "MEDIUM",
      isPublic: true
    },
    {
      id: "15",
      no: 15,
      name: "Problem 15",
      difficulty: "HARD",
      isPublic: false
    }
  ]);

  const handleApplyFilter = React.useCallback(() => {}, []);

  const handleCancelFilter = React.useCallback(() => {
    setFilters([
      {
        key: "Difficulty level",
        value: FilterValue.ALL
      }
    ]);
  }, []);

  const tableHeading: GridColDef[] = [
    { field: "no", headerName: "STT", width: 100 },
    {
      field: "name",
      headerName: "Problem Name",
      flex: 2,
      renderCell: (params) => {
        return (
          <ParagraphSmall fontWeight={"500"} className={classes.linkText}>
            <Link component={RouterLink} to={"#"} underline='hover' color='inherit'>
              {params.row.name}
            </Link>
          </ParagraphSmall>
        );
      }
    },
    {
      field: "difficulty",
      headerName: "Difficulty level",
      flex: 0.8,
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
      flex: 0.5,
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
    },
    {
      field: "action",
      headerName: t("common_action"),
      type: "actions",
      flex: 0.6,
      renderHeader: () => {
        return (
          <Heading6 width={"auto"} sx={{ textAlign: "left" }}>
            {t("common_action")}
          </Heading6>
        );
      },
      getActions: (params) => {
        return [
          <GridActionsCellItem
            label='Add'
            onClick={() => {}}
            icon={
              <Stack direction='row' gap={1} display='flex' alignItems='center'>
                <AddCircleOutlineIcon htmlColor='#1976d2' />
                <Heading6 fontWeight={"700"} colorname={"--blue-link"} translate-key='common_add'>
                  {t("common_add")}
                </Heading6>
              </Stack>
            }
          />
        ];
      }
    }
  ];

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    // console.log(model);
  };
  const page = 0;
  const pageSize = 5;
  const totalElement = questionList.length;

  const rowClickHandler = (params: GridRowParams<any>) => {
    // console.log(params);
  };

  const handleSearchChange = React.useCallback((value: string) => {}, []);

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={t("contest_import_problem_button")}
      actionsDisabled={true}
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
            dataList={questionList}
            tableHeader={tableHeading}
            onSelectData={rowSelectionHandler}
            dataGridToolBar={dataGridToolbar}
            page={page}
            pageSize={pageSize}
            totalElement={totalElement}
            onPaginationModelChange={pageChangeHandler}
            showVerticalCellBorder={false}
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
    </CustomDialog>
  );
}
