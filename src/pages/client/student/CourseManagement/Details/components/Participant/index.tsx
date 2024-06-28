import { Avatar, Box, CircularProgress, Grid, Stack } from "@mui/material";
import Link from "@mui/material/Link";
import Heading1 from "components/text/Heading1";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import CourseParticipantFeatureBar from "./components/FeatureBar";
import CustomDataGrid from "components/common/CustomDataGrid";
import { GridRowParams } from "@mui/x-data-grid";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CourseUserService } from "services/courseService/CourseUserService";
import { setLoadingCourseUser, setCourseUser } from "reduxes/courseService/courseUser";
import ParagraphBody from "components/text/ParagraphBody";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import Heading5 from "components/text/Heading5";
import classes from "./styles.module.scss";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
interface CourseParticipantProps {
  id: string;
  no: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const StudentCourseParticipant = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const courseUserState = useSelector((state: RootState) => state.courseUser);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(() => courseUserState.totalItems || 0, [courseUserState.totalItems]);
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState<
    {
      key: string;
      value: string;
    }[]
  >([
    {
      key: "role",
      value: t("common_all")
    }
  ]);
  const handleGetCourseUser = useCallback(
    async ({
      search,
      pageNo = 0,
      pageSize = 10
    }: {
      search?: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      if (
        !courseId ||
        (courseId === courseUserState.courseId && courseUserState.users.length > 0)
      ) {
        return;
      }

      dispatch(setLoadingCourseUser(true));
      try {
        const getCourseUserResponse = await CourseUserService.getUserByCourseId(courseId, {
          search,
          pageNo,
          pageSize
        });

        dispatch(
          setCourseUser({
            users: getCourseUserResponse.users,
            currentPage: getCourseUserResponse.currentPage,
            totalItems: getCourseUserResponse.totalItems,
            totalPages: getCourseUserResponse.totalPages,
            courseId: courseId
          })
        );
      } catch (error) {
        console.error("Failed to fetch course user", error);
      }
      dispatch(setLoadingCourseUser(false));
    },
    [courseId, courseUserState.users, courseUserState.courseId, dispatch]
  );

  useEffect(() => {
    handleGetCourseUser({ search: searchValue });
  }, [searchValue, handleGetCourseUser]);

  const tableHeading: GridColDef[] = [
    {
      field: "id",
      headerName: "STT",
      flex: 0.8,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            STT
          </Heading5>
        );
      },
      renderCell: (params) => <ParagraphBody fontWeight={500}>{params.row.no}</ParagraphBody>
    },
    {
      field: "email",
      headerName: t("common_email"),
      flex: 3,
      renderHeader: () => {
        return (
          <Heading5 nonoverflow width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_email")}
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
      field: "name",
      headerName: t("common_fullname"),
      flex: 2,
      renderHeader: () => {
        return (
          <Heading5 nonoverflow width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_fullname")}
          </Heading5>
        );
      },
      renderCell: (params) => (
        <ParagraphBody>
          {params.row.firstName} {params.row.lastName}
        </ParagraphBody>
      )
    },
    {
      field: "roles",
      headerName: t("common_role"),
      flex: 2,
      renderHeader: () => {
        return (
          <Heading5 nonoverflow width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_role")}
          </Heading5>
        );
      },
      renderCell: (params) => <ParagraphBody>{params.row.role}</ParagraphBody>
    }
  ];
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetCourseUser({ search: searchValue, pageNo: model.page, pageSize: model.pageSize });
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      handleGetCourseUser({
        search: value
      });
    },
    [handleGetCourseUser]
  );

  const courseParticipantListTable: CourseParticipantProps[] = useMemo(() => {
    if (courseUserState.users.length > 0) {
      return courseUserState.users.map((user, index) => ({
        id: user.userId,
        no: index + 1,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }));
    } else {
      return [];
    }
  }, [courseUserState.users]);

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  const handleApplyFilter = useCallback(() => {
    handleGetCourseUser({
      search: searchValue
    });
  }, [handleGetCourseUser, searchValue]);

  const handleCancelFilter = useCallback(() => {
    handleGetCourseUser({
      search: searchValue
    });
  }, [handleGetCourseUser, searchValue]);

  return (
    <Box className={classes.participantBody}>
      <Grid item xs={12}>
        <Heading1 translation-key='course_participant_title'>
          {t("course_participant_title")}
        </Heading1>
      </Grid>
      <Grid item xs={12}>
        <CustomSearchFeatureBar
          isLoading={courseUserState.isLoading}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onHandleChange={handleSearchChange}
          numOfResults={totalElement}
          filterKeyList={[
            {
              label: t("common_role"),
              value: "role"
            }
          ]}
          filterValueList={{
            role: [
              {
                label: t("common_all"),
                value: t("common_all")
              }
            ]
          }}
          filters={filters}
          handleChangeFilters={(newFilters: { key: string; value: string }[]) => {
            setFilters(newFilters);
          }}
          onHandleApplyFilter={handleApplyFilter}
          onHandleCancelFilter={handleCancelFilter}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomDataGrid
          loading={courseUserState.isLoading}
          dataList={courseParticipantListTable}
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
              backgroundColor: "var(--blue-5)"
            },
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "var(--blue-5)"
            }
          }}
          personalSx={true}
        />
      </Grid>
    </Box>
  );
};

export default StudentCourseParticipant;
