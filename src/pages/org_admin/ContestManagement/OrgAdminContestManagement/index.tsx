import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Card, Checkbox, Chip, Divider, Grid, Stack } from "@mui/material";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import Heading1 from "components/text/Heading1";
import Heading5 from "components/text/Heading5";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import useAuth from "hooks/useAuth";
import i18next from "i18next";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { routes } from "routes/routes";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch } from "store";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import classes from "./styles.module.scss";

interface ContestManagementProps extends ContestEntity {
  id: string;
  status: string;
}

const OrgAdminContestManagement = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  const [filters, setFilters] = React.useState<
    {
      key: string;
      value: string;
    }[]
  >([
    {
      key: "Status",
      value: ContestStartTimeFilterEnum.ALL
    }
  ]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<{
    isLoading: boolean;
    contests: {
      contests: ContestEntity[];
      currentPage: number;
      totalItems: number;
      totalPages: number;
    };
  }>({
    isLoading: false,
    contests: {
      contests: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0
    }
  });

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
      setData((prev) => ({
        ...prev,
        isLoading: true
      }));
      try {
        if (!loggedUser?.organization.organizationId) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
          return;
        }
        const getCertificateCoursesResponse = await ContestService.getContestsForOrgAdmin({
          searchName,
          startTimeFilter,
          orgId: loggedUser.organization.organizationId,
          pageNo,
          pageSize
        });
        setData((prev) => ({
          ...prev,
          isLoading: false,
          contests: getCertificateCoursesResponse
        }));
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        setData((prev) => ({
          ...prev,
          isLoading: false
        }));
      }
    },
    [dispatch, loggedUser?.organization.organizationId, t]
  );

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedContestId, setDeletedContestId] = useState<string>("");

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };

  const onDeleteConfirmDelete = async () => {
    ContestService.deleteContest(deletedContestId)
      .then((res) => {
        setPage(0);
        handleGetContests({
          searchName: searchValue,
          startTimeFilter: filters[0].value as ContestStartTimeFilterEnum,
          pageNo: 0,
          pageSize
        });
        dispatch(setSuccessMess(t("contest_delete_contest_success")));
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(setErrorMess(t("contest_delete_contest_fail")));
      })
      .finally(() => {
        setIsOpenConfirmDelete(false);
      });
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      setPage(0);
      handleGetContests({
        searchName: value,
        startTimeFilter: filters[0].value as ContestStartTimeFilterEnum
      });
    },
    [handleGetContests, filters]
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
            <Avatar
              sx={{ bgcolor: `${generateHSLColorByRandomText(`${params.row.name}`)}` }}
              alt={params.row.name}
              src={params.row.thumbnailUrl}
            >
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
            {params.row.endTime
              ? standardlizeUTCStringToLocaleString(params.row.endTime, currentLang)
              : t("contest_details_has_no_end_time")}
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
      field: "isPublic",
      headerName: t("contest_is_public"),
      flex: 0.5,
      align: "center",
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("contest_is_public")}
          </Heading5>
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
                routes.org_admin.contest.edit.details.replace(":contestId", params.row.contestId)
              );
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={() => {
              setDeletedContestId(params.row.contestId);
              setIsOpenConfirmDelete(true);
            }}
          />
        ];
      }
    }
  ];
  const totalElement = useMemo(() => data.contests.totalItems || 0, [data.contests]);

  const contestList: ContestManagementProps[] = useMemo(
    () =>
      data.contests.contests.map((contest: any) => {
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
    [data.contests]
  );

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPageSize(model.pageSize);
    setPage(model.page);
    handleGetContests({
      searchName: searchValue,
      startTimeFilter: ContestStartTimeFilterEnum.ALL,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };
  const rowClickHandler = (params: GridRowParams<any>) => {
    // console.log(params);
  };

  const handleApplyFilter = useCallback(() => {
    handleGetContests({
      searchName: searchValue,
      startTimeFilter: filters[0].value as ContestStartTimeFilterEnum
    });
  }, [handleGetContests, searchValue, filters]);

  const handleCancelFilter = useCallback(() => {
    setFilters([
      {
        key: "Status",
        value: ContestStartTimeFilterEnum.ALL
      }
    ]);
    handleGetContests({
      searchName: searchValue,
      startTimeFilter: ContestStartTimeFilterEnum.ALL
    });
  }, [handleGetContests, searchValue]);

  useEffect(() => {
    setCurrentLang(i18next.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  useEffect(() => {
    const fetchContests = async () => {
      handleGetContests({
        searchName: "",
        startTimeFilter: ContestStartTimeFilterEnum.ALL
      });
    };

    fetchContests();
  }, [handleGetContests]);

  return (
    <>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={t("dialog_confirm_delete_title")}
        description={t("dialog_confirm_delete_contest_description")}
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
            <CustomSearchFeatureBar
              isLoading={data.isLoading}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onHandleChange={handleSearchChange}
              createBtnText={t("contest_create")}
              onClickCreate={() => {
                navigate(routes.org_admin.contest.create);
              }}
              numOfResults={totalElement}
              filterKeyList={[
                {
                  label: t("common_status"),
                  value: "Status"
                }
              ]}
              filterValueList={{
                Status: [
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
              loading={data.isLoading}
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

export default OrgAdminContestManagement;
