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
import { setErrorMess } from "reduxes/AppStatus";
import useAuth from "hooks/useAuth";
import { PaginationList } from "models/general";
import { CourseTypeEntity } from "models/courseService/entity/CourseTypeEntity";
import { CourseTypeService } from "services/courseService/CourseTypeService";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface CourseTypeDataGridProps {
  id: number;
  courseTypeId: string;
  name: string;
  organizationId: string;
}

const CourseTypeManagementOrganizationAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const { loggedUser } = useAuth();

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

  const [courseTypeState, setCourseTypeState] = useState<PaginationList<CourseTypeEntity>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });
  const [isLoadingListCourseTypes, setIsLoadingListCourseTypes] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleGetCourseTypes = useCallback(
    async ({
      searchName,
      pageNo = 0,
      pageSize = 10
    }: {
      searchName: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      if (!loggedUser?.organization) return;
      setIsLoadingListCourseTypes(true);
      try {
        const getCourseTypesResponse = await CourseTypeService.getCourseTypeByOrganizationId(
          loggedUser?.organization.organizationId,
          {
            search: searchName,
            pageNo: pageNo,
            pageSize: pageSize
          }
        );
        setCourseTypeState({
          currentPage: getCourseTypesResponse.currentPage,
          totalItems: getCourseTypesResponse.totalItems,
          totalPages: getCourseTypesResponse.totalPages,
          items: getCourseTypesResponse.courseTypes
        });
        setIsLoadingListCourseTypes(false);
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        // Show snackbar here
        setIsLoadingListCourseTypes(false);
      }
    },
    [dispatch, loggedUser, t]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      handleGetCourseTypes({
        searchName: value
      });
    },
    [handleGetCourseTypes]
  );

  const tableHeading: GridColDef[] = [
    {
      field: "id",
      headerName: t("common_no"),
      flex: 0.5,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_no")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphBody width={"auto"}>{params.row.id}</ParagraphBody>;
      }
    },
    {
      field: "name",
      headerName: t("common_name"),
      flex: 2,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_name")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphBody width={"auto"}>{params.row.name}</ParagraphBody>;
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
            icon={<VisibilityIcon />}
            label='Edit'
            sx={{
              color: "primary.main"
            }}
            onClick={() => {
              navigate(
                routes.org_admin.course_type.course.root.replace(
                  ":courseTypeId",
                  params.row.courseTypeId
                )
              );
            }}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            sx={{
              color: "primary.main"
            }}
            onClick={() => {}}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Cancel'
            className='textPrimary'
            onClick={() => {}}
            sx={{
              color: red[500]
            }}
          />
        ];
      }
    }
  ];

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(() => courseTypeState.totalItems || 0, [courseTypeState.totalItems]);

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetCourseTypes({
      searchName: searchValue,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  const courseTypeListTable: CourseTypeDataGridProps[] = useMemo(() => {
    if (courseTypeState.items.length > 0) {
      return courseTypeState.items.map((courseType, index) => ({
        id: index + 1,
        courseTypeId: courseType.courseTypeId,
        name: courseType.name,
        organizationId: courseType.organizationId
      }));
    } else {
      return [];
    }
  }, [courseTypeState.items]);

  const handleApplyFilter = useCallback(() => {
    handleGetCourseTypes({
      searchName: searchValue
    });
  }, [handleGetCourseTypes, searchValue]);

  const handleCancelFilter = useCallback(() => {
    handleGetCourseTypes({
      searchName: searchValue
    });
  }, [handleGetCourseTypes, searchValue]);

  useEffect(() => {
    const fetchUsers = async () => {
      await handleGetCourseTypes({
        searchName: ""
      });
    };

    fetchUsers();
  }, [handleGetCourseTypes]);

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
            <Heading1 translate-key='course_type_management'>
              {t("course_type_management")}
            </Heading1>
          </Grid>
          <Grid item xs={12}>
            <CustomSearchFeatureBar
              isLoading={isLoadingListCourseTypes}
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
              loading={isLoadingListCourseTypes}
              dataList={courseTypeListTable}
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

export default CourseTypeManagementOrganizationAdmin;
