import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import {
  Avatar,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip
} from "@mui/material";
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
import { PostService } from "services/courseService/PostService";
import { PostEntity } from "models/courseService/entity/PostEntity";
import { clearPosts, setLoadingPosts, setPosts } from "reduxes/courseService/post";
import EditAnnoucementDialog from "./components/EditAnnouncementDialog";
import i18next from "i18next";
import useAuth from "hooks/useAuth";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";

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

  const [editPost, setEditPost] = useState<PostEntity | null>(null);
  const [isOpenEditPostDialog, setOpenEditPostDialog] = useState(false);

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedPostId, setDeletedPostId] = useState<string>("");

  const postState = useSelector((state: RootState) => state.post);
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  useEffect(() => {
    setCurrentLang(i18next.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);
  const { isLecturer } = useAuth();

  const handleCloseEditPostDialog = () => {
    setOpenEditPostDialog(false);
  };

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };

  const onDeleteConfirmDelete = async () => {
    setIsOpenConfirmDelete(false);
    PostService.deletePostById(deletedPostId)
      .then((res) => {
        dispatch(setSuccessMess("Delete post successfully"));
        dispatch(clearPosts());
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(setErrorMess("Delete user failed"));
      })
      .finally(() => {
        setIsOpenConfirmDelete(false);
      });
  };

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
              <Card className={classes.annoucementCard}>
                <CardContent>
                  <Grid container alignItems='center' spacing={2} flexDirection={"row"}>
                    <Grid item>
                      <Avatar
                        sx={{
                          bgcolor: `${generateHSLColorByRandomText(`${post?.createdBy.firstName} ${post?.createdBy.lastName}`)}`
                        }}
                        alt={post?.createdBy.email}
                        src={post?.createdBy.avatarUrl}
                      >
                        {post?.createdBy.firstName.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid
                      item
                      xs={11}
                      flexDirection={"row"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Stack flexDirection={"column"}>
                        <Box>
                          <Heading5>{post?.title}</Heading5>
                        </Box>
                        <Stack flexDirection={"row"} alignItems={"center"}>
                          <ParagraphBody fontWeight={500} colorname='--gray-50'>
                            By&nbsp;
                          </ParagraphBody>
                          <ParagraphBody fontWeight={500} colorname='--blue-3'>
                            {post?.createdBy.firstName} {post?.createdBy.lastName}
                          </ParagraphBody>
                          <ParagraphBody fontWeight={500} colorname='--gray-50'>
                            &nbsp;-&nbsp;
                            {standardlizeUTCStringToLocaleString(
                              post?.createdAt as string,
                              currentLang
                            )}
                          </ParagraphBody>
                        </Stack>
                      </Stack>

                      {isLecturer && (
                        <Stack flexDirection={"row"}>
                          <Tooltip title='Edit'>
                            <IconButton
                              onClick={() => {
                                setOpenEditPostDialog(true);
                                setEditPost(post);
                              }}
                            >
                              <EditIcon className={classes.iconEdit} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton
                              onClick={() => {
                                setIsOpenConfirmDelete(true);
                                setDeletedPostId(post.postId);
                              }}
                            >
                              <DeleteIcon className={classes.iconDelete} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mt: 2 }}>
                    <ReactQuill value={post?.content} readOnly={true} theme='bubble' />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Grid>
      {isOpenEditPostDialog && (
        <EditAnnoucementDialog
          onClose={handleCloseEditPostDialog}
          open={isOpenEditPostDialog}
          post={editPost}
        />
      )}
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this announcement?'
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />
    </Grid>
  );
};
export default LecturerCourseInformation;
