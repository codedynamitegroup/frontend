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

enum EView {
  cardView = 1,
  listView = 2
}

const StudentCourses: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [courseTypes, setCourseTypes] = useState<CourseTypeEntity[]>([]);
  const [courses, setCourses] = useState<CourseEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewType, setViewType] = useState<EView>(EView.listView);

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
        setCourses(getCourseResponse.courses);
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
    if (!selectedCategories.length) return courses;
    return courses.filter((course) => selectedCategories.includes(course.courseType.name));
  }, [courses, selectedCategories]);

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
      )}
      <Box
        sx={{ flexGrow: 1, marginTop: viewType === EView.cardView ? "0" : "20px" }}
        className={classes.gridContainer}
      >
        <Grid container spacing={viewType === EView.cardView ? 2 : 4}>
          {filteredCourses.map((course) => (
            <Grid
              item
              xs={12}
              sm={viewType === EView.cardView ? 6 : 12}
              md={viewType === EView.cardView ? 4 : 12}
              lg={viewType === EView.cardView ? 3 : 12}
              key={course.id}
            >
              {viewType === EView.cardView ? (
                <CourseCard
                  courseId={course.id}
                  courseAvatarUrl={"https://picsum.photos/200"}
                  courseCategory={course.courseType.name}
                  courseName={course.name}
                  teacherList={course.teachers}
                />
              ) : (
                <CourseList
                  courseId={course.id}
                  courseAvatarUrl={"https://picsum.photos/200"}
                  courseCategory={course.courseType.name}
                  courseName={course.name}
                  teacherList={course.teachers}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default StudentCourses;
