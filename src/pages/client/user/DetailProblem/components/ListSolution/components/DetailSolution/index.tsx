import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack
} from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import Heading4 from "components/text/Heading4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faEye,
  faCalendar,
  faComments,
  faThumbsDown,
  faComment
} from "@fortawesome/free-regular-svg-icons";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { TextareaAutosize } from "@mui/base";
import Button from "@mui/material/Button";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MDEditor from "@uiw/react-md-editor";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "hooks";
import { setLoading } from "reduxes/Loading";
import { SharedSolutionService } from "services/codeAssessmentService/SharedSolutionService";
import { SharedSolutionEntity } from "models/codeAssessmentService/entity/SharedSolutionEntity";
import images from "config/images";
import i18next from "i18next";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CommentPaginationList } from "models/codeAssessmentService/entity/CommentPaginationList";
import { CommentEntity } from "models/codeAssessmentService/entity/CommentEntity";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import useAuth from "hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";

type FormCommentValue = {
  comment: string;
};
interface Props {
  handleSolutionDetail: () => void;
  selectedSolutionId: string | null;
}
const toDateFormate = (str: string | undefined, format: string) => {
  try {
    if (str === undefined) return str;

    return standardlizeUTCStringToLocaleString(str, format);
  } catch (err) {
    console.error(err);
    return str;
  }
};
export default function DetailSolution({ handleSolutionDetail, selectedSolutionId }: Props) {
  const { t } = useTranslation();

  const schema = Yup.object().shape({
    comment: Yup.string()
      .required(`${t("detail_problem_discussion_detail_comment")} ${t("common_cannot_be_blank")}`)
      .test(
        "not-blank",
        `${t("detail_problem_discussion_detail_comment")} ${t("common_cannot_be_blank")}`,
        (value) => value !== undefined && value.trim().length > 0
      )
  });

  const dispatch = useAppDispatch();
  const auth = useAuth();
  const navigate = useNavigate();
  const [solution, setSolution] = useState<SharedSolutionEntity | null>(null);
  const { problemId, courseId, lessonId } = useParams<{
    problemId: string;
    courseId: string;
    lessonId: string;
  }>();
  const [commentLoading, setCommentLoading] = useState(false);
  const pageSize = 10;
  const [pageNum, setPageNum] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [newest, setNewest] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editSolutionAnchorEl, setEditSolutionAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpenConfirmDeleteSolution, setIsOpenConfirmDeleteSolution] = useState(false);
  const onCancleConfirmDeleteSolution = () => {
    setIsOpenConfirmDeleteSolution(false);
  };
  const onAcceptConfirmDeleteSolution = () => {
    if (solution?.sharedSolutionId) {
      SharedSolutionService.deleteSharedSolution(solution.sharedSolutionId)
        .then((data) => {
          handleSolutionDetail();
        })
        .catch((err) => console.log(err));
    }
    setIsOpenConfirmDeleteSolution(false);
  };
  const openFilterNewest = Boolean(anchorEl);
  const handleCloseFilterNewest = () => {
    setAnchorEl(null);
  };
  const handleOpenFilterNewest = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const openSolutionEditAnchorEl = Boolean(editSolutionAnchorEl);
  const handleClickSolutionEdit = (event: React.MouseEvent<HTMLElement>) => {
    setEditSolutionAnchorEl(event.currentTarget);
  };
  const handleCloseSolutionEdit = () => {
    setEditSolutionAnchorEl(null);
  };
  const openEditSolution = () => {
    if (problemId)
      navigate(routes.user.problem.solution.share.replace(":problemId", problemId), {
        state: {
          content: solution?.content,
          title: solution?.title,
          tags: solution?.tags,
          edit: true,
          solutionId: solution?.sharedSolutionId
        }
      });
  };

  useEffect(() => {
    if (selectedSolutionId) {
      dispatch(setLoading(true));
      SharedSolutionService.getDetailSharedSolution(selectedSolutionId)
        .then((data: SharedSolutionEntity) => {
          setSolution(data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  }, []);
  useEffect(() => {
    fetchCommentData();
  }, [newest, pageNum]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormCommentValue>({
    resolver: yupResolver(schema)
  });
  const fetchCommentData = () => {
    if (selectedSolutionId) {
      setCommentLoading(true);
      SharedSolutionService.getRootComments(selectedSolutionId, pageNum, pageSize, newest)
        .then((data: CommentPaginationList) => {
          setTotalPage(data.totalPages);
          setTotalItem(data.totalItems);
          setComments(data.comments);
        })
        .catch((err) => console.log(err))
        .then(() => {
          setCommentLoading(false);
        });
    }
  };
  const onSubmit: SubmitHandler<FormCommentValue> = (data) => {
    if (selectedSolutionId !== null)
      SharedSolutionService.createComment({
        sharedSolutionId: selectedSolutionId,
        content: data.comment
      })
        .then((data) => {
          fetchCommentData();
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNum(value - 1);
  };

  const stickyBackRef = useRef<HTMLDivElement>(null);
  const { height: stickyBackHeight } = useBoxDimensions({
    ref: stickyBackRef
  });
  return (
    <Box className={classes.containerDetailSolution}>
      <Box className={classes.stickyBack} ref={stickyBackRef}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Box onClick={handleSolutionDetail} className={classes.backButton}>
            <ArrowBackIcon className={classes.backIcon} />
            <span translation-key='common_back'>{t("common_back")}</span>
          </Box>
          {auth.loggedUser.userId === solution?.user.id && (
            <>
              <IconButton
                id='edit-solution-button'
                aria-controls={openSolutionEditAnchorEl ? "edit-solution-menu" : undefined}
                aria-haspopup='true'
                aria-expanded={openSolutionEditAnchorEl ? "true" : undefined}
                onClick={handleClickSolutionEdit}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id='edit-solution-menu'
                aria-labelledby='edit-solution-button'
                anchorEl={editSolutionAnchorEl}
                open={openSolutionEditAnchorEl}
                onClose={handleCloseSolutionEdit}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
              >
                <MenuItem onClick={openEditSolution}>{t("common_edit")}</MenuItem>
                <MenuItem onClick={() => setIsOpenConfirmDeleteSolution(true)}>
                  {t("common_remove")}
                </MenuItem>
              </Menu>
              <ConfirmDelete
                isOpen={isOpenConfirmDeleteSolution}
                title={t("dialog_confirm_delete_title")}
                description={t("dialog_confirm_delete_shared_solution")}
                onCancel={onCancleConfirmDeleteSolution}
                onDelete={onAcceptConfirmDeleteSolution}
              />
            </>
          )}
        </Stack>
        <Divider />
      </Box>

      <Box
        className={classes.solutionContainer}
        style={{
          height: `calc(100% - ${stickyBackHeight}px)`
        }}
      >
        {solution && (
          <>
            <Box className={classes.solutionTitle}>
              <Heading4>{solution.title}</Heading4>
            </Box>
            <Box className={classes.userInfo}>
              <Box className={classes.avatar}>
                <Avatar
                  sx={{
                    bgcolor: `${generateHSLColorByRandomText(`${solution.user?.firstName} ${solution.user?.lastName}`)}`
                  }}
                  alt={solution.user?.firstName}
                  src={solution.user?.avatarUrl}
                >
                  {solution.user?.firstName.charAt(0)}
                </Avatar>
              </Box>
              <Box className={classes.nameInfoContainer}>
                <Box className={classes.name}>
                  {i18next.language === "vi"
                    ? `${solution.user?.lastName ?? ""} ${solution.user?.firstName ?? ""}`
                    : `${solution.user?.firstName ?? ""} ${solution.user?.lastName ?? ""}`}
                </Box>
                <Box className={classes.solutionButton}>
                  {/* <Box className={classes.upVote}>
                    <FontAwesomeIcon icon={faThumbsUp} className={classes.solutionIcon} />
                    <Box className={classes.upVoteNumber}>1000</Box>
                  </Box> */}
                  <Box className={classes.view}>
                    <FontAwesomeIcon icon={faEye} className={classes.solutionIcon} />
                    <Box className={classes.viewNumber}>{solution.totalView}</Box>
                  </Box>
                  <Box className={classes.calendar}>
                    <FontAwesomeIcon icon={faCalendar} className={classes.solutionIcon} />
                    <Box className={classes.calendarNumber}>
                      {toDateFormate(solution.createdAt, i18next.language) ?? ""}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={classes.tagLanguageSolution}>
              {solution.tags.map((tag) => {
                return (
                  <Box className={classes.item} key={tag.id}>
                    {tag.name}
                  </Box>
                );
              })}
            </Box>
            <Box data-color-mode='light'>
              <MDEditor.Markdown source={solution.content ?? ""} className={classes.markdown} />
            </Box>

            <Box className={classes.commentContainer}>
              <Box className={classes.commentTitleContainer}>
                <Box className={classes.commentTitle}>
                  <FontAwesomeIcon icon={faComments} className={classes.commentIcon} />
                  <Box
                    className={classes.commentNumber}
                    translation-key='detail_problem_discussion_detail_comment_count'
                  >
                    {t("detail_problem_discussion_detail_comment_count", {
                      commentNumber: totalItem
                    })}
                  </Box>
                </Box>
                <Box className={classes.filterComment}>
                  <Button
                    id='newest-button'
                    onClick={handleOpenFilterNewest}
                    sx={{ textTransform: "none" }}
                  >
                    <ParagraphBody
                      translation-key={
                        newest
                          ? "detail_problem_discussion_filter_newest"
                          : "detail_problem_discussion_filter_oldest"
                      }
                    >
                      {`${t("common_filter_by")}: ${t(
                        newest
                          ? "detail_problem_discussion_filter_newest"
                          : "detail_problem_discussion_filter_oldest"
                      )}`}
                    </ParagraphBody>
                  </Button>
                  <Menu
                    id='newest-menu'
                    aria-labelledby='newest-button'
                    anchorEl={anchorEl}
                    open={openFilterNewest}
                    onClose={handleCloseFilterNewest}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setNewest(true);
                        handleCloseFilterNewest();
                      }}
                    >
                      {t("detail_problem_discussion_filter_newest")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNewest(false);
                        handleCloseFilterNewest();
                      }}
                    >
                      {t("detail_problem_discussion_filter_oldest")}
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
              <Box className={classes.commentBox}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextareaAutosize
                    aria-label='empty textarea'
                    translation-key='detail_problem_discussion_your_comment'
                    placeholder={t("detail_problem_discussion_your_comment")}
                    className={classes.textArea}
                    minRows={5}
                    {...register("comment")}
                    aria-invalid={errors.comment ? true : false}
                  />

                  <Button
                    type='submit'
                    variant='contained'
                    className={classes.commentButton}
                    translation-key='detail_problem_discussion_detail_comment'
                  >
                    {t("detail_problem_discussion_detail_comment")}
                  </Button>
                </form>
              </Box>
              {errors.comment && (
                <ParagraphBody colorname='--red-error'>{errors.comment.message}</ParagraphBody>
              )}
              <Box className={classes.commentList}>
                <Box className={classes.commentItem}>
                  {commentLoading && (
                    <Stack alignItems={"center"} marginTop={1}>
                      <CircularProgress />
                    </Stack>
                  )}
                  {!commentLoading &&
                    comments.map((comment) => {
                      return (
                        <>
                          <Box className={classes.commentInfo} key={comment.user.id}>
                            <Box className={classes.commentInfoUser}>
                              <Avatar
                                sx={{
                                  bgcolor: `${generateHSLColorByRandomText(`${comment.user?.firstName} ${comment.user?.lastName}`)}`
                                }}
                                alt={comment.user?.firstName}
                                src={comment.user?.avatarUrl}
                              >
                                {comment.user?.firstName.charAt(0)}
                              </Avatar>
                              <Box className={classes.commentName}>
                                {i18next.language === "vi"
                                  ? `${comment.user?.lastName ?? ""} ${solution.user?.firstName ?? ""}`
                                  : `${comment.user?.firstName ?? ""} ${comment.user?.lastName ?? ""}`}
                              </Box>
                            </Box>
                            <Box className={classes.commentText}>
                              <Markdown children={comment.content} remarkPlugins={[gfm]} />
                            </Box>
                            {/* <Box className={classes.commentAction}>
                          <Box className={classes.upVote}>
                            <FontAwesomeIcon icon={faThumbsUp} className={classes.commentIcon} />
                            <span>{user.upVote}</span>
                          </Box>
                          <Box className={classes.downVote}>
                            <FontAwesomeIcon icon={faThumbsDown} className={classes.commentIcon} />
                          </Box>

                          <Box className={classes.commentIcon}>
                            <FontAwesomeIcon icon={faComment} className={classes.commentIcon} />
                          </Box>

                          <Box className={classes.reply}>
                            <FontAwesomeIcon icon={faReply} className={classes.commentIcon} />
                            <span translation-key='detail_problem_discussion_detail_reply'>
                              {t("detail_problem_discussion_detail_reply")}
                            </span>
                          </Box>
                        </Box> */}
                          </Box>
                          <Divider />
                        </>
                      );
                    })}
                  <Stack alignItems={"center"}>
                    <Pagination
                      count={totalPage}
                      onChange={handleChangePagination}
                      page={pageNum + 1}
                    />
                  </Stack>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
      {/* <Box className={classes.stickyUpvote}>
        <Box className={classes.upvoteButton}>
          <FontAwesomeIcon icon={faThumbsUp} className={classes.upvoteIcon} />
          <span>120</span>
        </Box>
        <Box className={classes.downVote}>
          <FontAwesomeIcon icon={faThumbsDown} className={classes.commentIcon} />
        </Box>
        <Box className={classes.commentIcon}>
          <FontAwesomeIcon icon={faComment} className={classes.commentIcon} />
          <span>120</span>
        </Box>
      </Box> */}
    </Box>
  );
}
