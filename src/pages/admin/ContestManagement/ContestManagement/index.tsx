import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Card, Chip, Divider, Grid, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import Heading1 from "components/text/Heading1";
import Heading5 from "components/text/Heading5";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import i18next from "i18next";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setContests, setLoading } from "reduxes/coreService/Contest";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch, RootState } from "store";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import classes from "./styles.module.scss";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { setErrorMess } from "reduxes/AppStatus";

interface ContestManagementProps extends ContestEntity {
  id: string;
  status: string;
}

const ContestManagement = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [content, setContent] = useState("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [contestStatusFilter, setContestStatusFilter] = useState<ContestStartTimeFilterEnum>(
    ContestStartTimeFilterEnum.ALL
  );

  const contestState = useSelector((state: RootState) => state.contest);

  const dispatch = useDispatch<AppDispatch>();

  const handleGetContests = useCallback(
    async ({
      searchName,
      startTimeFilter = ContestStartTimeFilterEnum.ALL,
      pageNo = 0,
      pageSize = 10
    }: {
      searchName: string;
      startTimeFilter: ContestStartTimeFilterEnum;
      pageNo?: number;
      pageSize?: number;
    }) => {
      dispatch(setLoading(true));
      try {
        const getCertificateCoursesResponse = await ContestService.getContestsForAdmin({
          searchName,
          startTimeFilter,
          pageNo,
          pageSize
        });
        dispatch(setContests(getCertificateCoursesResponse));
        dispatch(setLoading(false));
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess("Please sign in to continue"));
        }
        // Show snackbar here
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      handleGetContests({
        searchName: value,
        startTimeFilter: contestStatusFilter
      });
    },
    [handleGetContests, contestStatusFilter]
  );

  const tableHeading: GridColDef[] = [
    {
      field: "name",
      headerName: t("common_name"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_name")}
          </Heading5>
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
          >
            <Avatar sx={{ bgcolor: grey[500] }} alt={params.row.name} src={params.row.thumbnailUrl}>
              {params.row.name.charAt(0)}
            </Avatar>
            <ParagraphSmall width={"auto"} fontWeight={500}>
              {params.row.name}
            </ParagraphSmall>
          </Stack>
        );
      }
    },
    {
      field: "createdBy",
      headerName: t("common_created_by"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_created_by")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphSmall width={"auto"}>
            {params.row.createdBy.firstName} {params.row.createdBy.lastName}
          </ParagraphSmall>
        );
      }
    },
    {
      field: "startTime",
      headerName: t("common_start_time"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_start_time")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphSmall width={"auto"}>
            {standardlizeUTCStringToLocaleString(params.row.startTime as string, currentLang)}
          </ParagraphSmall>
        );
      }
    },
    {
      field: "endTime",
      headerName: t("common_end_time"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_end_time")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphSmall width={"auto"}>
            {standardlizeUTCStringToLocaleString(params.row.endTime as string, currentLang)}
          </ParagraphSmall>
        );
      }
    },
    {
      field: "numOfParticipants",
      headerName: t("common_num_of_participants"),
      flex: 0.4,
      minWidth: 100,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_num_of_participants")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphSmall width={"auto"}>{params.row.numOfParticipants}</ParagraphSmall>;
      }
    },
    {
      field: "status",
      headerName: t("common_status"),
      flex: 0.7,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_status")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <Chip
            size='small'
            label={
              params.row.status === ContestStartTimeFilterEnum.UPCOMING
                ? t("common_upcoming")
                : params.row.status === ContestStartTimeFilterEnum.HAPPENING
                  ? t("common_in_progress")
                  : t("common_ended")
            }
            variant='outlined'
            color={
              params.row.status === ContestStartTimeFilterEnum.UPCOMING
                ? "primary"
                : params.row.status === ContestStartTimeFilterEnum.HAPPENING
                  ? "success"
                  : "error"
            }
            component={ParagraphSmall}
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
          <TextTitle width={"auto"} sx={{ textAlign: "left" }}>
            {t("common_action")}
          </TextTitle>
        );
      },
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            onClick={() => {
              navigate(
                routes.admin.contest.edit.details.replace(":contestId", params.row.contestId),
                {
                  state: {
                    contestName: params.row.name
                  }
                }
              );
            }}
          />,
          <GridActionsCellItem icon={<DeleteIcon />} label='Delete' />
        ];
      }
    }
  ];

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(
    () => contestState.contests.totalItems || 0,
    [contestState.contests]
  );

  const contestList: ContestManagementProps[] = useMemo(
    () =>
      contestState.contests.contests.map((contest) => {
        const status =
          contest.startTime && moment().utc().isBefore(contest.startTime)
            ? ContestStartTimeFilterEnum.UPCOMING
            : contest.endTime && moment().utc().isAfter(contest.endTime)
              ? ContestStartTimeFilterEnum.ENDED
              : ContestStartTimeFilterEnum.HAPPENING;

        return {
          id: contest.contestId,
          contestId: contest.contestId,
          name: contest.name,
          description: contest.description,
          prizes: contest.prizes,
          rules: contest.rules,
          scoring: contest.scoring,
          thumbnailUrl: contest.thumbnailUrl,
          startTime: contest.startTime,
          endTime: contest.endTime,
          questions: contest.questions,
          numOfParticipants: contest.numOfParticipants,
          status,
          isPublic: contest.isPublic,
          isRestrictedForum: contest.isRestrictedForum,
          isDisabledForum: contest.isDisabledForum,
          createdBy: contest.createdBy,
          createdAt: contest.createdAt,
          updatedAt: contest.updatedAt,
          updatedBy: contest.updatedBy
        };
      }),
    [contestState.contests]
  );

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetContests({
      searchName: searchValue,
      startTimeFilter: ContestStartTimeFilterEnum.ALL,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };
  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  const handleApplyFilter = useCallback(() => {
    handleGetContests({
      searchName: searchValue,
      startTimeFilter: contestStatusFilter
    });
  }, [handleGetContests, searchValue, contestStatusFilter]);

  const handleCancelFilter = useCallback(() => {
    setContestStatusFilter(ContestStartTimeFilterEnum.ALL);
    handleGetContests({
      searchName: searchValue,
      startTimeFilter: ContestStartTimeFilterEnum.ALL
    });
  }, [handleGetContests, searchValue]);

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  useEffect(() => {
    const fetchContests = async () => {
      dispatch(setInititalLoading(true));
      await handleGetContests({
        searchName: "",
        startTimeFilter: ContestStartTimeFilterEnum.ALL
      });
      dispatch(setInititalLoading(false));
    };

    fetchContests();
  }, [dispatch, handleGetContests]);

  return (
    <>
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={type}
        content={content}
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
            <ParagraphSmall colorname='--blue-500' translate-key='contest_management_title'>
              {t("contest_management_title")}
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
            <Heading1 translate-key='contest_management_title'>
              {t("contest_management_title")}
            </Heading1>
          </Grid>
          <Grid item xs={12}>
            {/* <CustomSearchFeatureBar
              isLoading={contestState.isLoading}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onHandleChange={handleSearchChange}
              createBtnText={t("contest_create")}
              onClickCreate={() => {
                navigate(routes.admin.contest.create);
              }}
              numOfResults={totalElement}
              filterKeyList={[
                {
                  label: t("common_status"),
                  value: "Status"
                }
              ]}
              filterValueList={
                [
                  {
                    label: t("common_all"),
                    value: ContestStartTimeFilterEnum.ALL
                  },
                  {
                    label: t("common_upcoming"),
                    value: ContestStartTimeFilterEnum.UPCOMING
                  },
                  {
                    label: t("common_in_progress"),
                    value: ContestStartTimeFilterEnum.HAPPENING
                  },
                  {
                    label: t("common_ended"),
                    value: ContestStartTimeFilterEnum.ENDED
                  }
                ] as { label: string; value: string }[]
              }
              currentFilterKey='Status'
              currentFilterValue={contestStatusFilter}
              handleFilterValueChange={(value:any) => {
                setContestStatusFilter(value as ContestStartTimeFilterEnum);
              }}
              onHandleApplyFilter={handleApplyFilter}
              onHandleCancelFilter={handleCancelFilter}
            /> */}
          </Grid>
          <Grid item xs={12}>
            {/* #F5F9FB */}
            <CustomDataGrid
              loading={contestState.isLoading}
              dataList={contestList}
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
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default ContestManagement;
