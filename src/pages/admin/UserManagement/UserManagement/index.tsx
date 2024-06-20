import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Card, Checkbox, Divider, Grid, Stack } from "@mui/material";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { AppDispatch, RootState } from "store";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import classes from "./styles.module.scss";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { User } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";
import { ERoleName } from "models/authService/entity/role";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import { setLoading } from "reduxes/Loading";
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
  isBelongToOrganization: boolean;
  createdAt: Date;
  roleName: string;
  isDeleted: boolean;
}

const UserManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
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
      key: "role",
      value: "ALL"
    }
  ]);

  const [userState, setUserState] = useState<PaginationList<User>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });
  const isLoadingState = useSelector((state: RootState) => state.loading);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedUserId, setDeletedUserId] = useState<string>("");
  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onDeleteConfirmDelete = async () => {
    UserService.deleteUserById(deletedUserId)
      .then((res) => {
        dispatch(setSuccessMess("Delete user successfully"));
        setUserState({
          currentPage: 0,
          totalItems: 0,
          totalPages: 0,
          items: []
        });
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(setErrorMess("Delete user failed"));
      })
      .finally(() => {
        setIsOpenConfirmDelete(false);
      });
  };
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
        setUserState({
          currentPage: getUsersResponse.currentPage,
          totalItems: getUsersResponse.totalItems,
          totalPages: getUsersResponse.totalPages,
          items: getUsersResponse.users
        });
        dispatch(setLoading(false));
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        // Show snackbar here
        dispatch(setLoading(false));
      }
    },
    [dispatch, t]
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
      flex: 2.5,
      renderHeader: () => {
        return (
          <Heading5 nonoverflow width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
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
      flex: 1.5,
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
      field: "isBelongToOrganization",
      headerName: t("common_is_belong_to_organization"),
      flex: 0.6,
      align: "center",
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_is_belong_to_organization")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <Checkbox
            disableRipple
            checked={params.row.isBelongToOrganization === true ? true : false}
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
          <GridActionsCellItem
            onClick={() => {
              setDeletedUserId(params.row.userId);
              setIsOpenConfirmDelete(true);
            }}
            icon={<DeleteIcon />}
            label='Delete'
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
        isDeleted: user.isDeleted,
        isBelongToOrganization: user.organization ? true : false
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
      // dispatch(setInititalLoading(true));
      await handleGetUsers({
        searchName: ""
      });
      // dispatch(setInititalLoading(false));
    };

    fetchUsers();
  }, [dispatch, handleGetUsers]);

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this user?'
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
              isLoading={isLoadingState.loading}
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
                  value: "blockStatus"
                },
                {
                  label: t("common_role"),
                  value: "role"
                }
              ]}
              filterValueList={{
                blockStatus: [
                  {
                    label: t("common_all"),
                    value: "ALL"
                  },
                  { label: t("common_active"), value: "ACTIVE" },
                  { label: t("common_inactive"), value: "INACTIVE" }
                ],
                role: [
                  {
                    label: t("common_all"),
                    value: "ALL"
                  },
                  {
                    label: t("role_system_admin"),
                    value: ERoleName.ADMIN
                  },
                  {
                    label: t("role_org_admin"),
                    value: ERoleName.ADMIN_MOODLE
                  },
                  {
                    label: t("role_lecturer"),
                    value: ERoleName.LECTURER_MOODLE
                  },
                  {
                    label: t("role_student"),
                    value: ERoleName.STUDENT_MOODLE
                  },
                  {
                    label: t("role_user"),
                    value: ERoleName.USER
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
              loading={isLoadingState.loading}
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
