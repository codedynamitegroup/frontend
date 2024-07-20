import { Avatar, Checkbox, Grid, Link, Stack } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomDialog from "components/common/dialogs/CustomDialog";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import i18next from "i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import Heading5 from "components/text/Heading5";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PaginationList } from "models/general";
import useAuth from "hooks/useAuth";
import { UserResponseEntity } from "models/courseService/entity/UserResponseEntity";
import { CourseUserService } from "services/courseService/CourseUserService";
import { ERoleMoodle } from "models/courseService/enum/ERoleMoodle";
import { AssignUsersToCourseCommand } from "models/courseService/entity/custom/AssignUsersToCourseCommand";

export interface UserManagementProps {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  avatarUrl: string;
}

interface AssignUserToCourseDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  handleUserSelected: (user: any) => void;
  children?: React.ReactNode;
  isConfirmLoading?: boolean;
  handleGetUsersProps: (params: { searchName: string; pageNo?: number; pageSize?: number }) => void;
}

export default function AssignUserToCourseDialog({
  open,
  title,
  handleClose,
  children,
  isConfirmLoading = false,
  handleUserSelected,
  handleGetUsersProps,
  ...props
}: AssignUserToCourseDialogProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const { loggedUser } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();

  const [userState, setUserState] = useState<PaginationList<UserResponseEntity>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });
  const [isLoadingListUsers, setIsLoadingListUserss] = useState<boolean>(false);

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
      if (!loggedUser?.organization?.organizationId || !courseId) return;
      setIsLoadingListUserss(true);
      try {
        const getUsersResponse = await CourseUserService.getAllUsersAbleToAssignToCourse({
          search: searchName,
          pageNo,
          pageSize,
          courseId: courseId,
          organizationId: loggedUser.organization.organizationId
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
    [dispatch, t, loggedUser?.organization?.organizationId, courseId]
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
          <ParagraphBody width={"auto"}>
            {params.row.firstName} {params.row.lastName}
          </ParagraphBody>
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
    }
  ];

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(() => userState.totalItems || 0, [userState.totalItems]);
  const [selectedRowsId, setSelectedRowsId] = useState<string[]>([]);

  const dataGridToolbar = { enableToolbar: true };
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

  const userListTable: UserManagementProps[] = useMemo(() => {
    if (userState.items.length > 0) {
      return userState.items.map((user) => ({
        id: user.userId,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        roleName: mappingRole(user.roleMoodleId)
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
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  useEffect(() => {
    const fetchUsers = async () => {
      await handleGetUsers({
        searchName: ""
      });
    };

    fetchUsers();
  }, [dispatch, handleGetUsers]);

  const rowClickHandler = (params: GridRowParams<any>) => {};

  const onHandleConfirm = async () => {
    if (!courseId) {
      dispatch(setErrorMess("Course ID is not found"));
      return;
    } else if (selectedRowsId.length === 0) {
      dispatch(setErrorMess("Please select at least one user"));
      return;
    }

    const assignUsersToCourseCommand: AssignUsersToCourseCommand = {
      courseId: courseId,
      userIds: selectedRowsId
    };
    await CourseUserService.assignUsersToCourse(assignUsersToCourseCommand)
      .then(() => {
        dispatch(setSuccessMess("Assign users to course successfully"));
        handleGetUsersProps({ searchName: "" });
        handleClose();
      })
      .catch((error: any) => {
        dispatch(setErrorMess("Assign users to course failed"));
        console.error("error", error);
      });
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      minWidth={"1000px"}
      onHanldeConfirm={onHandleConfirm}
      {...props}
    >
      <Grid container spacing={2}>
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
          <CustomDataGrid
            loading={isLoadingListUsers}
            dataList={userListTable}
            tableHeader={tableHeading}
            onSelectData={rowSelectionHandler}
            dataGridToolBar={dataGridToolbar}
            checkboxSelection
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
    </CustomDialog>
  );
}
