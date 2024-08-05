import React, { useEffect, useState, useCallback, useMemo } from "react";
import Grid from "@mui/material/Grid";
import SearchBar from "components/common/search/SearchBar";
import CourseCard from "./components/CourseCard";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewCardIcon from "@mui/icons-material/ViewModule";
import CourseList from "./components/CouseList";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import Heading1 from "components/text/Heading1";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@mui/material";
import { CourseTypeService } from "services/courseService/CourseTypeService";
import { CourseUserService } from "services/courseService/CourseUserService";
import useAuth from "hooks/useAuth";
import { CourseTypeEntity } from "models/courseService/entity/CourseTypeEntity";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import { useDispatch } from "react-redux";
import { setCourses } from "reduxes/courseService/course";
import { useSelector } from "react-redux";
import { RootState } from "store";
import CustomPagination from "components/common/pagination/CustomPagination";

enum EView {
  cardView = 1,
  listView = 2
}

const StudentCourses: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [courseTypes, setCourseTypes] = useState<CourseTypeEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIdCategories, setSelectedIdCategories] = useState<string[]>([]);
  const [viewType, setViewType] = useState<EView>(EView.listView);
  const dispatch = useDispatch();
  const { loggedUser } = useAuth();
  const courseState = useSelector((state: RootState) => state.course);
  const [pageNo, setPageNo] = useState(1);

  const fetchCourseTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!loggedUser?.organization?.organizationId) return;

      const getCourseTypeResponse = await CourseTypeService.getCourseTypeByOrganizationId(
        loggedUser.organization.organizationId,
        {
          search: "",
          pageNo: 0,
          pageSize: 9999
        }
      );
      setCourseTypes(getCourseTypeResponse.courseTypes);
    } catch (error) {
      console.error("Failed to fetch course types", error);
    } finally {
      setIsLoading(false);
    }
  }, [loggedUser?.organization?.organizationId]);

  const fetchCourses = useCallback(
    async ({
      search = searchText,
      courseType = selectedIdCategories,
      pageNo = 0,
      pageSize = 4
    }) => {
      if (!loggedUser?.userId) return;

      setIsLoading(true);

      try {
        const getCourseResponse = await CourseUserService.getAllCourseByUserId(loggedUser.userId, {
          search,
          courseType,
          pageNo,
          pageSize
        });
        dispatch(setCourses(getCourseResponse));
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchText, selectedIdCategories, loggedUser?.userId, dispatch]
  );

  useEffect(() => {
    fetchCourseTypes();
  }, [fetchCourseTypes]);

  useEffect(() => {
    if (loggedUser?.userId) {
      fetchCourses({ search: searchText, courseType: selectedIdCategories });
    }
  }, [searchText, selectedIdCategories, loggedUser?.userId, fetchCourses]);

  const handleViewChange = useCallback((event: React.MouseEvent<HTMLElement>, nextView: EView) => {
    setViewType(nextView);
  }, []);

  const handleCategoryFilterChange = useCallback(
    (selectedCategoryList: string[]) => {
      const selectedCategoryListTemp: string[] = courseTypes
        .map((courseType) => {
          if (selectedCategoryList.includes(courseType.name)) {
            return courseType.courseTypeId;
          }
          return undefined;
        })
        .filter((name): name is string => name !== undefined);
      setSelectedCategories(selectedCategoryList);
      setSelectedIdCategories(selectedCategoryListTemp);
    },
    [courseTypes]
  );

  const { t } = useTranslation();

  const filteredCourses = useMemo(() => {
    if (!selectedCategories.length) return courseState.courses;
    return courseState.courses.filter((course) =>
      selectedCategories.includes(course.courseType.name)
    );
  }, [courseState.courses, selectedCategories]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (loggedUser?.userId) {
      setPageNo(value);
      fetchCourses({ search: searchText, courseType: selectedIdCategories, pageNo: value - 1 });
    }
  };

  return (
    <Box id={classes.coursesBody}>
      <Heading1 className={classes.pageTitle} translation-key='course_list_title'>
        {t("course_list_title")}
      </Heading1>
      <Box className={classes.featureGroup}>
        <SearchBar onSearchClick={setSearchText} />
        <Box className={classes.filterContainer}>
          <ChipMultipleFilter
            label={t("course_filter")}
            defaultChipList={courseTypes.map((courseType) => courseType.name)}
            filterList={selectedCategories}
            onFilterListChangeHandler={handleCategoryFilterChange}
            translation-key='course_filter'
          />
        </Box>
      </Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "10px"
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box className={classes.gridContainer}>
          {filteredCourses.map((course) => (
            <Box className={classes.courseCard} key={course.id}>
              <CourseList
                courseId={course.id}
                courseAvatarUrl={"https://picsum.photos/200"}
                courseCategory={course.courseType.name}
                courseName={course.name}
                teacherList={course.teachers}
              />
            </Box>
          ))}
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <CustomPagination
              count={courseState.totalPages}
              page={pageNo}
              handlePageChange={handlePageChange}
              showFirstButton
              showLastButton
              size={"large"}
            />
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default StudentCourses;
