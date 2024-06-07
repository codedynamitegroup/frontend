import React, { useEffect, useState, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { setCourses, setLoading } from "reduxes/courseService/courseUser";

import { CourseService } from "services/courseService/CourseService";
import { CourseTypeService } from "services/courseService/CourseTypeService";
import { setCourseTypes } from "reduxes/courseService/course_type";
import { CircularProgress } from "@mui/material";
import { CourseTypeEntity } from "models/courseService/entity/CourseTypeEntity";
import { User } from "models/authService/entity/user";
import { selectCurrentUser } from "reduxes/Auth";
import { CourseUserService } from "services/courseService/CourseUserService";
import useAuth from "hooks/useAuth";

enum EView {
  cardView = 1,
  listView = 2
}

const StudentCourses = () => {
  const [searchText, setSearchText] = useState("");
  const [courseTypes, setCourseTypesState] = useState<CourseTypeEntity[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const courseState = useSelector((state: RootState) => state.courseUser);

  const courseTypeState = useSelector((state: RootState) => state.courseType);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const searchHandle = useCallback(async (searchText: string) => {
    setSearchText(searchText);
  }, []);

  const { loggedUser } = useAuth();

  const handleGetCourseTypes = useCallback(async () => {
    dispatch(setLoading({ isLoading: true }));

    try {
      const getCourseTypeResponse = await CourseTypeService.getCourseTypes();
      setCourseTypesState(getCourseTypeResponse.courseTypes);
      dispatch(setCourseTypes(getCourseTypeResponse));
      dispatch(setLoading({ isLoading: false }));
    } catch (error) {
      console.error("Failed to fetch course types", error);
      dispatch(setLoading({ isLoading: false }));
    }
  }, [dispatch]);

  const handleGetCourses = useCallback(
    async ({ search = searchText, courseType = selectedCategories, pageNo = 0, pageSize = 10 }) => {
      if (!loggedUser?.userId) return;

      dispatch(setLoading({ isLoading: true }));

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
        dispatch(setLoading({ isLoading: false }));
      }
    },
    [dispatch, searchText, selectedCategories, loggedUser?.userId]
  );

  useEffect(() => {
    handleGetCourseTypes();
  }, [handleGetCourseTypes]);

  useEffect(() => {
    if (loggedUser?.userId) {
      handleGetCourses({ search: searchText, courseType: selectedCategories });
    }
  }, [searchText, selectedCategories, loggedUser?.userId]);

  // Ensure handleGetCourses is called on component mount if userId is available

  const [viewType, setViewType] = useState(EView.listView);

  const handleViewChange = useCallback((event: React.MouseEvent<HTMLElement>, nextView: number) => {
    setViewType(nextView);
  }, []);

  const handleCategoryFilterChange = useCallback(
    (selectedCategoryList: Array<string>) => {
      setSelectedCategories(selectedCategoryList);
      handleGetCourses({ search: searchText, courseType: selectedCategoryList });
    },
    [handleGetCourses, searchText]
  );

  const { t } = useTranslation();

  return (
    <Box id={classes.coursesBody}>
      <Heading1 className={classes.pageTitle} translation-key='course_list_title'>
        {t("course_list_title")}
      </Heading1>
      <SearchBar onSearchClick={searchHandle} />
      {courseState.isLoading ? (
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
        <Box className={classes.featureGroup}>
          <Box className={classes.filterContainer}>
            <ChipMultipleFilter
              label={t("course_filter")}
              defaultChipList={courseTypeState.courseTypes.map((courseType) => courseType.name)}
              filterList={selectedCategories}
              onFilterListChangeHandler={handleCategoryFilterChange}
              translation-key='course_filter'
            />
          </Box>

          <ToggleButtonGroup
            className={classes.changeViewButtonGroup}
            value={viewType}
            exclusive
            onChange={handleViewChange}
          >
            <ToggleButton value={EView.listView} aria-label='list'>
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value={EView.cardView} aria-label='module'>
              <ViewCardIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
      {viewType === EView.cardView ? (
        <Box sx={{ flexGrow: 1 }} className={classes.gridContainer}>
          <Grid container spacing={2}>
            {courseState.courses.map((course, index) => (
              <Grid className={classes.gridItem} item key={course.id} xs={12} sm={6} md={4} lg={3}>
                <CourseCard
                  courseId={course.id}
                  courseAvatarUrl={"https://picsum.photos/200"}
                  courseCategory={course.courseType.name}
                  courseName={course.name}
                  teacherList={course.teachers}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, marginTop: "20px" }} className={classes.gridContainer}>
          <Grid container spacing={4}>
            {courseState.courses.map((course) => (
              <Grid item xs={12} sm={12} md={12} lg={12} key={course.id}>
                <CourseList
                  courseId={course.id}
                  courseAvatarUrl={"https://picsum.photos/200"}
                  courseCategory={course.courseType.name}
                  courseName={course.name}
                  teacherList={course.teachers}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default StudentCourses;
