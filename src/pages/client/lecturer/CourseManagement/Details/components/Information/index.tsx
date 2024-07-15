import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CircularProgress } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useParams } from "react-router-dom";
import { CourseService } from "services/courseService/CourseService";
import { setCourseDetail } from "reduxes/courseService/course";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import Heading1 from "components/text/Heading1";
import CourseAnnouncement from "./components/Announcement";
import NotificationCard from "pages/client/student/CourseManagement/Details/components/Information/components/NotificationCard";
import { PaginationList } from "models/general";
import { PostService } from "services/courseService/PostService";
import { PostEntity } from "models/courseService/entity/PostEntity";
import { setLoadingPosts, setPosts } from "reduxes/courseService/post";

const LecturerCourseInformation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { courseId } = useParams<{ courseId: string }>();

  const courseState = useSelector((state: RootState) => state.course);
  const [courseData, setCourseData] = useState<CourseEntity | null>(null);
  const getCouseData = useCallback(
    async (courseId: string) => {
      try {
        const courseResponse = await CourseService.getCourseDetail(courseId);
        setCourseData(courseResponse);
        dispatch(setCourseDetail({ courseDetail: courseResponse }));
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );
  const postState = useSelector((state: RootState) => state.post);

  const handleGetPosts = useCallback(async () => {
    if (!courseId || (postState.courseId === courseId && postState.posts.items.length > 0)) {
      return;
    }

    dispatch(setLoadingPosts(true));
    try {
      const getPostsResponse = await PostService.getPostsByCourseId(courseId, {
        pageNo: 0,
        pageSize: 99999
      });
      dispatch(
        setPosts({
          posts: {
            currentPage: getPostsResponse.currentPage,
            totalItems: getPostsResponse.totalItems,
            totalPages: getPostsResponse.totalPages,
            items: getPostsResponse.posts
          },
          courseId: courseId
        })
      );
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
    dispatch(setLoadingPosts(false));
  }, [courseId, dispatch, postState.courseId, postState.posts.items.length]);

  useEffect(() => {
    handleGetPosts();
  }, [courseId, handleGetPosts]);
  useEffect(() => {
    const course = courseState.courses.find((course: CourseEntity) => course.id === courseId);

    if (course) {
      setCourseData(course);
      dispatch(setCourseDetail({ courseDetail: course }));
    } else {
      getCouseData(courseId ?? "");
    }
  }, [courseId, courseState.courses, dispatch, getCouseData]);

  return (
    <Grid container spacing={1} className={classes.gridContainer}>
      <Grid item xs={12}>
        <Card className={classes.courseImgCardContainer}>
          <CardMedia
            component='img'
            className={classes.courseImage}
            src='https://www.gstatic.com/classroom/themes/img_bookclub.jpg'
          />
          <Heading1 className={classes.nameCourseOverlay} colorname='--white'>
            {courseState.courseDetail?.name}
          </Heading1>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <CourseAnnouncement />
      </Grid>
      <Grid item xs={12}>
        {postState.isLoading ? (
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
          <Box className={classes.annoucementsWrapper}>
            {postState.posts.items.map((post: PostEntity) => (
              <NotificationCard post={post} key={post.postId} />
            ))}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
export default LecturerCourseInformation;
