import { Grid, Link } from "@mui/material";
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
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useTranslation } from "react-i18next";
import JoyButton from "@mui/joy/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ParagraphSmall from "components/text/ParagraphSmall";
import { Link as RouterLink } from "react-router-dom";
import classes from "./styles.module.scss";
import Heading6 from "components/text/Heading6";

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
  const [filterValue, setFilterValue] = React.useState<string>(FilterValue.ALL);

  const [questionList, setQuestionList] = React.useState<any[]>([
    {
      id: "1",
      no: 1,
      name: "Problem 1",
      difficulty: "EASY"
    },
    {
      id: "2",
      no: 2,
      name: "Problem 2",
      difficulty: "MEDIUM"
    },
    {
      id: "3",
      no: 3,
      name: "Problem 3",
      difficulty: "HARD"
    },
    {
      id: "4",
      no: 4,
      name: "Problem 4",
      difficulty: "EASY"
    },
    {
      id: "5",
      no: 5,
      name: "Problem 5",
      difficulty: "MEDIUM"
    },
    {
      id: "6",
      no: 6,
      name: "Problem 6",
      difficulty: "HARD"
    },
    {
      id: "7",
      no: 7,
      name: "Problem 7",
      difficulty: "EASY"
    },
    {
      id: "8",
      no: 8,
      name: "Problem 8",
      difficulty: "MEDIUM"
    },
    {
      id: "9",
      no: 9,
      name: "Problem 9",
      difficulty: "HARD"
    },
    {
      id: "10",
      no: 10,
      name: "Problem 10",
      difficulty: "EASY"
    },
    {
      id: "11",
      no: 11,
      name: "Problem 11",
      difficulty: "MEDIUM"
    },
    {
      id: "12",
      no: 12,
      name: "Problem 12",
      difficulty: "HARD"
    },
    {
      id: "13",
      no: 13,
      name: "Problem 13",
      difficulty: "EASY"
    },
    {
      id: "14",
      no: 14,
      name: "Problem 14",
      difficulty: "MEDIUM"
    },
    {
      id: "15",
      no: 15,
      name: "Problem 15",
      difficulty: "HARD"
    }
  ]);

  const handleApplyFilter = React.useCallback(() => {}, []);

  const handleCancelFilter = React.useCallback(() => {
    setFilterValue(FilterValue.ALL);
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
      flex: 1,
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
      field: "action",
      headerName: t("common_action"),
      type: "actions",
      flex: 0.6,
      renderHeader: () => {
        return (
          <TextTitle width={"auto"} sx={{ textAlign: "left" }}>
            {t("common_action")}
          </TextTitle>
        );
      },
      getActions: (params) => {
        return [
          <GridActionsCellItem
            label='Add'
            onClick={() => {}}
            icon={
              <JoyButton
                variant='plain'
                onClick={() => {}}
                startDecorator={<AddCircleOutlineIcon />}
              >
                {t("common_add")}
              </JoyButton>
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
    console.log(model);
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
              }
            ]}
            filterValueList={
              [
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
              ] as { label: string; value: string }[]
            }
            currentFilterKey='Difficulty level'
            currentFilterValue={filterValue}
            handleFilterValueChange={(value: any) => {
              setFilterValue(value as FilterValue);
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
