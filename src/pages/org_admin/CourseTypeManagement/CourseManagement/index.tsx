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
import { useNavigate, useParams } from "react-router-dom";
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
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import { CourseService } from "services/courseService/CourseService";
import { UserCourseEntity } from "models/courseService/entity/UserCourseEntity";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import CustomBreadCrumb from "components/common/Breadcrumb";
import classes from "./styles.module.scss";

interface CourseDataGridProps {
  id: number;
  courseId: string;
  teachers: UserCourseEntity[];
  name: string;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const CourseManagementOrganizationAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const { loggedUser } = useAuth();
  const { courseTypeId } = useParams<{ courseTypeId: string }>();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

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

  const [courseState, setCourseState] = useState<PaginationList<CourseEntity>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });
  const [isFetchingCourse, setIsFetchingCourse] = useState<boolean>(false);
  const [isLoadingListCourseTypes, setIsLoadingListCourseTypes] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleGetCourses = useCallback(
    async ({
      searchName,
      pageNo = 0,
      pageSize = 10
    }: {
      searchName: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      if (!loggedUser?.organization || !courseTypeId || isFetchingCourse) return;
      setIsLoadingListCourseTypes(true);
      try {
        const getCourseResponse = await CourseService.getAllCoursesByOrganizationId(
          loggedUser?.organization.organizationId,
          {
            search: searchName,
            pageNo: pageNo,
            pageSize: pageSize,
            courseType: [courseTypeId]
          }
        );
        setCourseState({
          currentPage: getCourseResponse.currentPage,
          totalItems: getCourseResponse.totalItems,
          totalPages: getCourseResponse.totalPages,
          items: getCourseResponse.courses
        });
        setIsFetchingCourse(true);
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
    [dispatch, loggedUser, t, courseTypeId, isFetchingCourse]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      handleGetCourses({
        searchName: value
      });
    },
    [handleGetCourses]
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
      field: "teachers",
      headerName: t("role_lecturer"),
      flex: 2,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("role_lecturer")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return params.row.teachers.map((teacher: UserCourseEntity, index: number) => (
          <ParagraphBody key={teacher.userId} width={"auto"}>
            {`${teacher.lastName} ${teacher.firstName}`}
            {index < params.row.teachers.length - 1 && <>,&nbsp;</>}
          </ParagraphBody>
        ));
      }
    },
    {
      field: "updatedAt",
      headerName: t("common_updated_at"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_updated_at")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphBody width={"auto"}>
            {standardlizeUTCStringToLocaleString(params.row.updatedAt as string, currentLang)}
          </ParagraphBody>
        );
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
            sx={{
              color: "primary.main"
            }}
            onClick={() => {
              if (!courseTypeId) return;
              navigate(
                routes.org_admin.course_type.course.edit.details
                  .replace(":courseId", params.row.courseId)
                  .replace(":courseTypeId", courseTypeId)
              );
            }}
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
  const totalElement = useMemo(() => courseState.totalItems || 0, [courseState.totalItems]);

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetCourses({
      searchName: searchValue,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  const courseListTable: CourseDataGridProps[] = useMemo(() => {
    if (courseState.items.length > 0) {
      return courseState.items.map((course, index) => ({
        id: index + 1,
        courseId: course.id,
        name: course.name,
        teachers: course.teachers,
        visible: course.visible,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }));
    } else {
      return [];
    }
  }, [courseState.items]);

  const handleApplyFilter = useCallback(() => {
    handleGetCourses({
      searchName: searchValue
    });
  }, [handleGetCourses, searchValue]);

  const handleCancelFilter = useCallback(() => {
    handleGetCourses({
      searchName: searchValue
    });
  }, [handleGetCourses, searchValue]);

  useEffect(() => {
    const fetchCourses = async () => {
      await handleGetCourses({
        searchName: ""
      });
    };

    fetchCourses();
  }, [handleGetCourses]);

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
          <Box className={classes.breadcump}>
            <Box id={classes.breadcumpWrapper}>
              <CustomBreadCrumb
                breadCrumbData={[
                  {
                    navLink: routes.org_admin.course_type.root,
                    label: t("course_type_management")
                  }
                ]}
                lastBreadCrumbLabel={t("common_course_management")}
              />
            </Box>
          </Box>
          <Grid item xs={12}>
            <Heading1 translate-key='common_course_management'>
              {t("common_course_management")}
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
              createBtnText={t("common_add_new")}
              onClickCreate={() => {
                if (!courseTypeId) return;
                navigate(
                  routes.org_admin.course_type.course.create.replace(":courseTypeId", courseTypeId)
                );
              }}
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
              dataList={courseListTable}
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

export default CourseManagementOrganizationAdmin;
