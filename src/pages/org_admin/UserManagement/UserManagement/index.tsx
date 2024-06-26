import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Checkbox, Grid, Stack } from "@mui/material";
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
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import i18next from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { AppDispatch } from "store";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import { setErrorMess } from "reduxes/AppStatus";
import { User } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";
import { ERoleName } from "models/authService/entity/role";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import useAuth from "hooks/useAuth";
import { PaginationList } from "models/general";

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
  isDeleted: boolean;
}

const UserManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const { loggedUser } = useAuth();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  const [filters, setFilters] = useState<
    {
      key: string;
      value: string;
    }[]
  >([
    {
      key: "Status",
      value: "ALL"
    }
  ]);

  const [userState, setUserState] = useState<PaginationList<User>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });
  const [isLoadingListUsers, setIsLoadingListUserss] = useState<boolean>(false);

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
      if (!loggedUser || !loggedUser?.organization) return;
      setIsLoadingListUserss(true);
      try {
        const getUsersResponse = await UserService.getAllUserByOrganization({
          searchName: searchName,
          pageNo: pageNo,
          pageSize: pageSize,
          id: loggedUser.organization.organizationId
        });
        setUserState({
          currentPage: getUsersResponse.currentPage,
          totalItems: getUsersResponse.totalItems,
          totalPages: getUsersResponse.totalPages,
          items: getUsersResponse.users
        });
        setIsLoadingListUserss(false);
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        // Show snackbar here
        setIsLoadingListUserss(false);
      }
    },
    [dispatch, loggedUser, t]
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
              sx={{
                bgcolor: `${generateHSLColorByRandomText(`${params.row.firstName} ${params.row.lastName}`)}`
              }}
              alt={params.row.email}
              src={params.row.avatarUrl}
            >
              {params.row.firstName.charAt(0)}
            </Avatar>
            <ParagraphBody width={"auto"} fontWeight={500}>
              {params.row.email}
            </ParagraphBody>
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
          <ParagraphBody width={"auto"}>
            {params.row.firstName} {params.row.lastName}
          </ParagraphBody>
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
          <ParagraphBody width={"auto"}>
            {standardlizeUTCStringToLocaleString(params.row.lastLogin as string, currentLang)}
          </ParagraphBody>
        );
      }
    },
    {
      field: "isDeleted",
      headerName: t("common_is_blocked"),
      flex: 0.6,
      align: "center",
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_is_blocked")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <Checkbox
            disableRipple
            checked={params.row.isDeleted === true ? true : false}
            color={params.row.isDeleted ? "success" : "error"}
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
        return <ParagraphBody width={"auto"}>{params.row.roleName}</ParagraphBody>;
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
              navigate(routes.org_admin.users.edit.details.replace(":userId", params.row.userId), {
                state: {
                  contestName: params.row.name
                }
              });
            }}
          />
        ];
      }
    }
  ];

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(() => userState.totalItems || 0, [userState.totalItems]);

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

  const userListTable: UserManagementProps[] = useMemo(() => {
    if (userState.items.length > 0) {
      return userState.items.map((user) => ({
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
        roleName: mappingRole(user),
        isDeleted: user.isDeleted
      }));
    } else {
      return [];
    }
  }, [mappingRole, userState.items]);

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
      if (userState.items.length > 0) return;
      // dispatch(setLoading(true));
      await handleGetUsers({
        searchName: ""
      });
      // dispatch(setLoading(false));
    };

    fetchUsers();
  }, [dispatch, handleGetUsers, userState.items]);

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <>
      <Box>
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
              isLoading={isLoadingListUsers}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onHandleChange={handleSearchChange}
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
                    value: "ALL"
                  },
                  {
                    label: t("common_active"),
                    value: "ACTIVE"
                  },
                  {
                    label: t("common_inactive"),
                    value: "INACTIVE"
                  }
                ]
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
              loading={isLoadingListUsers}
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
      </Box>
    </>
  );
};

export default UserManagement;
