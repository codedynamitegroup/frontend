import DeleteIcon from "@mui/icons-material/Delete";
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
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "store";
import classes from "./styles.module.scss";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { UserService } from "services/authService/UserService";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import Button, { BtnType } from "components/common/buttons/Button";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import { PaginationList } from "models/general";
import { CourseUserResponse } from "models/courseService/entity/UserCourseEntity";
import { CourseUserService } from "services/courseService/CourseUserService";
import AssignUserToCourseDialog from "./AssignUser";
import { ERoleMoodle } from "models/courseService/enum/ERoleMoodle";
import { UserResponseEntity } from "models/courseService/entity/UserResponseEntity";
import { UnassignUsersToCourseCommand } from "models/courseService/entity/custom/UnassignUsersToCourseCommand";

interface CourseUserManagementProps {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const CourseUserManagement = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>("");
  const { courseId } = useParams<{ courseId: string }>();

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

  const [userState, setUserState] = useState<PaginationList<UserResponseEntity>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });
  const [isLoadingListUsers, setIsLoadingListUsers] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const roleMapping = useMemo(
    () => [
      { name: ERoleMoodle.ADMIN, label: t("role_system_admin") },
      { name: ERoleMoodle.LECTURER, label: t("role_lecturer") },
      { name: ERoleMoodle.STUDENT, label: t("role_student") }
    ],
    [t]
  );

  const mappingRole = useCallback(
    (roleMoodleId: string) => {
      const matchedRole = roleMapping.find((role) => roleMoodleId === role.name);
      return matchedRole ? matchedRole.label : "";
    },
    [roleMapping]
  );

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
      if (!courseId) return;
      setIsLoadingListUsers(true);
      try {
        const getUsersResponse = await CourseUserService.getUserByCourseId(courseId, {
          search: searchName,
          pageNo: pageNo,
          pageSize: pageSize
        });
        setUserState({
          currentPage: getUsersResponse.currentPage,
          totalItems: getUsersResponse.totalItems,
          totalPages: getUsersResponse.totalPages,
          items: getUsersResponse.users
        });
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        // Show snackbar here
      }
      setIsLoadingListUsers(false);
    },
    [dispatch, t, courseId]
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
      field: "role",
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
        return <ParagraphBody width={"auto"}>{params.row.role}</ParagraphBody>;
      }
    }
  ];

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(() => userState.totalItems || 0, [userState.totalItems]);

  const dataGridToolbar = { enableToolbar: true };
  const [selectedRowsId, setSelectedRowsId] = useState<string[]>([]);

  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    setSelectedRowsId(selectedRowId.map((row) => row.toString()));
  };
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetUsers({
      searchName: searchValue,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  const userListTable: CourseUserManagementProps[] = useMemo(() => {
    if (userState.items.length > 0) {
      return userState.items.map((user) => ({
        id: user.userId,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: mappingRole(`${user.roleMoodleId}`)
      }));
    } else {
      return [];
    }
  }, [userState.items, mappingRole]);

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
    const fetchUsers = async () => {
      await handleGetUsers({
        searchName: ""
      });
    };

    fetchUsers();
  }, [dispatch, handleGetUsers]);

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onUnassignedUserConfirmDelete = async () => {
    if (!courseId) {
      dispatch(setErrorMess("Course ID is not found"));
      setIsOpenConfirmDelete(false);
      return;
    } else if (selectedRowsId.length === 0) {
      dispatch(setErrorMess("Please select at least one user"));
      setIsOpenConfirmDelete(false);
      return;
    }

    const unassignUsersToCourseCommand: UnassignUsersToCourseCommand = {
      courseId: courseId,
      userIds: selectedRowsId
    };
    await CourseUserService.unassignUsersToCourse(unassignUsersToCourseCommand)
      .then(() => {
        dispatch(setSuccessMess("Unassign users to course successfully"));
        handleGetUsers({ searchName: "" });
      })
      .catch((error: any) => {
        dispatch(setErrorMess("Unassign users to course failed"));
        console.error("error", error);
      })
      .finally(() => {
        setIsOpenConfirmDelete(false);
      });
  };

  const [isOpenedAddUserDialog, setIsOpenedAddUserDialog] = useState(false);

  const handleOpenAddUserDialog = () => {
    setIsOpenedAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setIsOpenedAddUserDialog(false);
  };

  const handleUserSelected = (user: CourseUserManagementProps) => {
    // setUserSelected(user);
    // reset({
    //   roleName: roleNameList.find((role) => role.name === user.roleName)
    // });
  };

  return (
    <>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm unassigned user"}
        description='Are you sure you want to unassigned this user to course?'
        onCancel={onCancelConfirmDelete}
        onDelete={onUnassignedUserConfirmDelete}
      />
      {isOpenedAddUserDialog && (
        <AssignUserToCourseDialog
          open={isOpenedAddUserDialog}
          title={t("user_select_from_list")}
          handleClose={handleCloseAddUserDialog}
          handleUserSelected={handleUserSelected}
          handleGetUsersProps={handleGetUsers}
          maxWidth='md'
        />
      )}
      <Grid
        container
        spacing={2}
        sx={{
          padding: "20px"
        }}
      >
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
          <Box className={classes.btnWrapper}>
            <Button
              onClick={() => {
                setIsOpenedAddUserDialog(true);
              }}
              btnType={BtnType.Primary}
              translation-key='course_assign_member'
            >
              {t("course_assign_member")}
            </Button>
            <Button
              onClick={() => {
                setIsOpenConfirmDelete(true);
              }}
              btnType={BtnType.Secondary}
              translation-key='course_unassign_member'
            >
              {t("course_unassign_member")}
            </Button>
          </Box>
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
            checkboxSelection
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
    </>
  );
};

export default CourseUserManagement;
