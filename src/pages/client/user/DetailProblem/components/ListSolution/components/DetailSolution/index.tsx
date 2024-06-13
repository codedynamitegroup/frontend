import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Divider, FormControl, Pagination, Stack } from "@mui/material";
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
  const [solution, setSolution] = useState<SharedSolutionEntity | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const pageSize = 10;
  const [pageNum, setPageNum] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [newest, setNewest] = useState(true);
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

  //   const markdownContent = `
  //   ### Approaches
  // (Also explained in the code)
  // **Bold text**

  // 1. Step 1
  //     - Easy solution !!!, everyone knows how to solve this problem.

  // ### Complexity
  // - Time complexity: O(1)

  // ### Code
  // \`\`\`cpp
  // class Solution {
  // public:
  //     vector<vector<int>> divideArray(vector<int>& nums, int ki) {
  //        vector<vector<int>> ans;
  //         sort(nums.begin(),nums.end());
  //         int i=0;
  //         int j=1;
  //         int k=2;
  //         while(k<nums.size()){
  //             if(nums[j]-nums[i]<=ki&&nums[k]-nums[i]<=ki&&nums[k]-nums[j]<=ki){
  //                 ans.push_back({nums[i],nums[j],nums[k]});
  //                 i=i+3;
  //                 j=j+3;
  //                 k=k+3;
  //             }
  //             else{
  //                 return {};
  //             }
  //         }
  //         return ans;
  //     }
  // };
  // \`\`\`
  // `;
  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://kenhsao.net/wp-content/uploads/2023/09/hieuthuhai-la-ai.jpg",
      comment: "Bài làm của bạn rất hay, cách giải rất chi tiết, nhưng tôi có vài góp ý **hehe**",
      upVote: 100
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://kenhsao.net/wp-content/uploads/2023/09/hieuthuhai-la-ai.jpg",
      comment: "Bài làm của bạn rất hay, cách giải rất chi tiết, nhưng tôi có vài góp ý **hehe**",
      upVote: 100
    },
    {
      id: 3,
      name: "Nguyễn Văn C",
      avatar: "https://kenhsao.net/wp-content/uploads/2023/09/hieuthuhai-la-ai.jpg",
      comment: "Bài làm của bạn rất hay, cách giải rất chi tiết, nhưng tôi có vài góp ý **hehe**",
      upVote: 100
    },
    {
      id: 4,
      name: "Trần Thị D",
      avatar: "https://kenhsao.net/wp-content/uploads/2023/09/hieuthuhai-la-ai.jpg",
      comment: "Bài làm của bạn rất hay, cách giải rất chi tiết, nhưng tôi có vài góp ý **hehe**",
      upVote: 100
    }
  ];

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
        <Box onClick={handleSolutionDetail} className={classes.backButton}>
          <ArrowBackIcon className={classes.backIcon} />
          <span translation-key='common_back'>{t("common_back")}</span>
        </Box>
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
                    {t("detail_problem_discussion_detail_comment_count", { commentNumber: 10 })}
                  </Box>
                </Box>
                <Box className={classes.filterComment}>Lọc theo: Mới nhất</Box>
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
                  {comments.map((comment) => {
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
