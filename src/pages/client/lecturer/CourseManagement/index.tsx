import Grid from "@mui/material/Grid";
import SearchBar from "components/common/search/SearchBar";
import CourseCard from "./components/CourseCard";

import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewCardIcon from "@mui/icons-material/ViewModule";
import CourseList from "./components/CouseList";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import Heading1 from "components/text/Heading1";
import { useTranslation } from "react-i18next";
import { User } from "models/authService/entity/user";
import { CourseTypeEntity } from "models/courseService/entity/CourseTypeEntity";
import { CircularProgress } from "@mui/material";
import { CourseUserService } from "services/courseService/CourseUserService";
import { CourseTypeService } from "services/courseService/CourseTypeService";
import useAuth from "hooks/useAuth";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { setCourses } from "reduxes/courseService/course";

enum EView {
  cardView = 1,
  listView = 2
}

const LecturerCourses = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [courseTypes, setCourseTypes] = useState<CourseTypeEntity[]>([]);
  // const [courses, setCourses] = useState<CourseEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewType, setViewType] = useState<EView>(EView.listView);
  const courseState = useSelector((state: RootState) => state.course);
  const dispatch = useDispatch();

  const { loggedUser } = useAuth();

  const fetchCourseTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const getCourseTypeResponse = await CourseTypeService.getCourseTypes();
      setCourseTypes(getCourseTypeResponse.courseTypes);
    } catch (error) {
      console.error("Failed to fetch course types", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(
    async ({ search = searchText, courseType = selectedCategories, pageNo = 0, pageSize = 10 }) => {
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
    [searchText, selectedCategories, loggedUser?.userId]
  );

  useEffect(() => {
    fetchCourseTypes();
  }, []);

  useEffect(() => {
    if (loggedUser?.userId) {
      fetchCourses({ search: searchText, courseType: selectedCategories });
    }
  }, [searchText, selectedCategories, loggedUser?.userId, fetchCourses]);

  const handleViewChange = useCallback((event: React.MouseEvent<HTMLElement>, nextView: EView) => {
    setViewType(nextView);
  }, []);

  const handleCategoryFilterChange = useCallback(
    (selectedCategoryList: string[]) => {
      setSelectedCategories(selectedCategoryList);
      fetchCourses({ search: searchText, courseType: selectedCategoryList });
    },
    [fetchCourses, searchText]
  );

  const { t } = useTranslation();

  const filteredCourses = useMemo(() => {
    if (!selectedCategories.length) return courseState.courses;
    return courseState.courses.filter((course) =>
      selectedCategories.includes(course.courseType.name)
    );
  }, [courseState.courses, selectedCategories]);

  return (
    <Box id={classes.coursesBody}>
      <Heading1 className={classes.pageTitle} translation-key='course_list_title'>
        {t("course_list_title")}
      </Heading1>
      <SearchBar onSearchClick={setSearchText} />
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
        <>
          <Box className={classes.featureGroup}>
            <Box className={classes.filterContainer}>
              <ChipMultipleFilter
                label={t("course_filter")}
                defaultChipList={courseTypes.map((courseType) => courseType.name)}
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

          {viewType === EView.cardView ? (
            <Box sx={{ flexGrow: 1 }} className={classes.gridContainer}>
              <Grid container spacing={2}>
                {filteredCourses.map((course, index) => (
                  <Grid
                    className={classes.gridItem}
                    item
                    key={course.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <CourseCard
                      index={index}
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
                {filteredCourses.map((course) => (
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
        </>
      )}
    </Box>
  );
};

export default LecturerCourses;
