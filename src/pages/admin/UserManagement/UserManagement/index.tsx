import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Card, Divider, Grid, Stack } from "@mui/material";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUsers, setLoading } from "reduxes/authService/user";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { AppDispatch, RootState } from "store";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import classes from "./styles.module.scss";
import { setErrorMess } from "reduxes/AppStatus";
import { User } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";
import { ERoleName } from "models/authService/entity/role";

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
  lastLogin: string;
  isLinkedWithGoogle: boolean;
  isLinkedWithMicrosoft: boolean;
  createdAt: Date;
  roleName: string;
}

const UserManagement = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  const userState = useSelector((state: RootState) => state.user);

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
        dispatch(setUsers(getUsersResponse));
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
      handleGetUsers({
        searchName: value
      });
    },
    [handleGetUsers]
  );

  const tableHeading: GridColDef[] = [
    {
      field: "email",
      headerName: "Email",
      flex: 2,
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
      flex: 2,
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
      field: "roleName",
      headerName: t("common_role"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_role")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphSmall width={"auto"}>{params.row.roleName}</ParagraphSmall>;
      }
    },
    {
      field: "action",
      headerName: t("common_action"),
      type: "actions",
      flex: 0.8,
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
              navigate(routes.admin.users.edit.details.replace(":userId", params.row.userId), {
                state: {
                  contestName: params.row.name
                }
              });
            }}
          />,
          <GridActionsCellItem icon={<DeleteIcon />} label='Delete' />
        ];
      }
    }
  ];

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(() => userState.users.totalItems || 0, [userState.users]);

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

  const roleMapping = useMemo(
    () => [
      { name: ERoleName.ADMIN, label: t("role_system_admin") },
      { name: ERoleName.ADMIN_MOODLE, label: t("role_org_admin") },
      { name: ERoleName.LECTURER_MOODLE, label: t("role_lecturer") },
      { name: ERoleName.STUDENT_MOODLE, label: t("role_student") }
    ],
    [t]
  );

  const mappingRole = useCallback(
    (user: User) => {
      const matchedRole = roleMapping.find((role) =>
        user?.roles.some((userRole) => userRole?.name === role.name)
      );
      return matchedRole ? matchedRole.label : t("role_user");
    },
    [roleMapping, t]
  );

  const userListTable: UserManagementProps[] = useMemo(
    () =>
      userState.users.users.map((user) => {
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
          createdAt: user.createdAt,
          roleName: mappingRole(user)
        };
      }),
    [mappingRole, userState.users]
  );

  const handleApplyFilter = useCallback(() => {
    handleGetUsers({
      searchName: searchValue
    });
  }, [handleGetUsers, searchValue]);

  const handleCancelFilter = useCallback(() => {
    handleGetUsers({
      searchName: searchValue
    });
  }, [handleGetUsers, searchValue]);

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (userState.users.users.length > 0) return;
      dispatch(setInititalLoading(true));
      await handleGetUsers({
        searchName: ""
      });
      dispatch(setInititalLoading(false));
    };

    fetchUsers();
  }, [dispatch, handleGetUsers, userState.users.users]);

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <>
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
            <Heading1 translate-key='user_management'>{t("user_management")}</Heading1>
          </Grid>
          <Grid item xs={12}>
            <CustomSearchFeatureBar
              isLoading={userState.isLoading}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onHandleChange={handleSearchChange}
              createBtnText={t("user_create")}
              onClickCreate={() => {
                navigate(routes.admin.users.create);
              }}
              numOfResults={totalElement}
              filterKeyList={[
                {
                  label: t("common_status"),
                  value: "Status"
                }
              ]}
              currentFilterKey='Status'
              onHandleApplyFilter={handleApplyFilter}
              onHandleCancelFilter={handleCancelFilter}
            />
          </Grid>
          <Grid item xs={12}>
            {/* #F5F9FB */}
            <CustomDataGrid
              loading={userState.isLoading}
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
