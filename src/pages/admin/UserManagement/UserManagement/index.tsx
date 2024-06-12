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
import { User } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";

interface UserManagementProps {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  address: string;
  dob: Date;
  lastLogin: Date;
  isLinkedWithGoogle: boolean;
  isLinkedWithMicrosoft: boolean;
  createdAt: Date;
}

const UserManagement = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [content, setContent] = useState("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [contestStatusFilter, setContestStatusFilter] = useState<ContestStartTimeFilterEnum>(
    ContestStartTimeFilterEnum.ALL
  );

  const contestState = useSelector((state: RootState) => state.contest);

  const dispatch = useDispatch<AppDispatch>();

  const handleGetUsers = useCallback(
    async ({
      searchName,
      pageNo = 0,
      pageSize = 10
    }: {
      searchName: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      dispatch(setLoading(true));
      try {
        const getUsersResponse = await UserService.getAllUser({
          searchName,
          pageNo,
          pageSize
        });
        setUserList(getUsersResponse.users);
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

  // const handleSearchChange = useCallback(
  //   (value: string) => {
  //     handleGetContests({
  //       searchName: value,
  //       startTimeFilter: contestStatusFilter
  //     });
  //   },
  //   [handleGetContests, contestStatusFilter]
  // );

  const tableHeading: GridColDef[] = [
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            Email
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
              sx={{ bgcolor: "var(--green-500)" }}
              alt={params.row.email}
              src={params.row.avatarUrl}
            >
              {params.row.firstName.charAt(0)}
            </Avatar>
            <ParagraphSmall width={"auto"} fontWeight={500}>
              {params.row.email}
            </ParagraphSmall>
          </Stack>
        );
      }
    },
    {
      field: "fullname",
      headerName: t("common_fullname"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_fullname")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphSmall width={"auto"}>
            {params.row.firstName} {params.row.lastName}
          </ParagraphSmall>
        );
      }
    },
    {
      field: "lastLogin",
      headerName: t("common_last_login"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_last_login")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphSmall width={"auto"}>
            {standardlizeUTCStringToLocaleString(params.row.lastLogin as string, currentLang)}
          </ParagraphSmall>
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

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetUsers({
      searchName: searchValue,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  const userListTable: UserManagementProps[] = useMemo(
    () =>
      userList.map((user) => {
        return {
          id: user.userId,
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          lastLogin: user.lastLogin,
          phone: user.phone,
          address: user.address,
          dob: user.dob,
          isLinkedWithGoogle: user.isLinkedWithGoogle,
          isLinkedWithMicrosoft: user.isLinkedWithMicrosoft,
          createdAt: user.createdAt
        };
      }),
    [userList]
  );

  // const handleApplyFilter = useCallback(() => {
  //   handleGetContests({
  //     searchName: searchValue,
  //     startTimeFilter: contestStatusFilter
  //   });
  // }, [handleGetContests, searchValue, contestStatusFilter]);

  // const handleCancelFilter = useCallback(() => {
  //   setContestStatusFilter(ContestStartTimeFilterEnum.ALL);
  //   handleGetContests({
  //     searchName: searchValue,
  //     startTimeFilter: ContestStartTimeFilterEnum.ALL
  //   });
  // }, [handleGetContests, searchValue]);

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setInititalLoading(true));
      await handleGetUsers({
        searchName: ""
      });
      dispatch(setInititalLoading(false));
    };

    fetchUsers();
  }, [dispatch, handleGetUsers]);

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

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
            <ParagraphSmall colorname='--blue-500' translate-key='user_detail_account_management'>
              {t("user_detail_account_management")}
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
            <Heading1 translate-key='user_detail_account_management'>
              {t("user_detail_account_management")}
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
              dataList={userListTable}
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

export default UserManagement;
