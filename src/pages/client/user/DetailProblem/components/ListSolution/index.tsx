import React, { lazy, memo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import {
  Avatar,
  ButtonBase,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack
} from "@mui/material";
import { useState } from "react";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faComment, faEye, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router";
import { routes } from "routes/routes";
import ParagraphBody from "components/text/ParagraphBody";
import SearchBar from "components/common/search/SearchBar";
import TuneIcon from "@mui/icons-material/Tune";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import { TagService } from "services/codeAssessmentService/TagService";
import cloneDeep from "lodash.clonedeep";
import { SharedSolutionService } from "services/codeAssessmentService/SharedSolutionService";
import { SharedSolutionPaginationList } from "models/codeAssessmentService/entity/SharedSolutionPaginationList";
import { SharedSolutionEntity } from "models/codeAssessmentService/entity/SharedSolutionEntity";
import images from "config/images";
import i18next from "i18next";

const DetailSolution = lazy(() => import("./components/DetailSolution"));

export default function ProblemDetailSolution({ maxHeight }: { maxHeight?: number }) {
  const navigate = useNavigate();

  const [tags, setTags] = useState<TagEntity[]>([]);
  const [newestSearch, setNewestSearch] = useState<boolean>(true);
  const [tagLoading, setTagLoading] = useState<boolean>(false);
  const [itemLoading, setItemLoading] = useState<boolean>(false);
  const pageSize = 2;
  const [pageNum, setPageNum] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [solutionItem, setSolutionItem] = useState<SharedSolutionEntity[]>([]);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);

  useEffect(() => {
    setTagLoading(true);
    TagService.getAllTag(false)
      .then((data: TagEntity[]) => {
        setTags(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setTagLoading(false));
  }, []);

  const users1 = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      title: "Bài giải hoàn hảo 100%",
      avatar: "https://kenhsao.net/wp-content/uploads/2023/09/hieuthuhai-la-ai.jpg",
      tags: ["Javascript", "C++", "Java"],
      upVote: 100,
      view: 100,
      comment: 100
    },
    {
      id: 2,
      name: "Trần Thị B",
      title: "Phát triển ứng dụng di động với React Native",
      avatar: "https://vcdn-giaitri.vnecdn.net/2023/01/04/mono-2-1672831377-5615-1672832004.jpg",
      tags: ["React Native", "JavaScript", "Mobile Development"],
      upVote: 75,
      view: 120,
      comment: 50
    },
    {
      id: 3,
      name: "Lê Minh C",
      title: "Thủ thuật hiệu suất trong lập trình Python",
      avatar:
        "https://vcdn1-giaitri.vnecdn.net/2021/01/27/mtptung2-1611762083-2801-1611762227.jpg?w=500&h=300&q=100&dpr=2&fit=crop&s=6xnMEsZXHKurpgmEg6R4BQ",
      tags: ["Python", "Performance Optimization"],
      upVote: 90,
      view: 80,
      comment: 30
    },
    {
      id: 4,
      name: "Phạm Thị D",
      title: "Hướng dẫn sử dụng Git và GitHub",
      avatar: "https://static-images.vnncdn.net/files/publish/2023/10/27/coi00238-1273.jpg",
      tags: ["Git", "GitHub", "Version Control"],
      upVote: 120,
      view: 150,
      comment: 80
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      title: "Tìm hiểu về Machine Learning cơ bản",
      avatar:
        "https://kenh14cdn.com/203336854389633024/2023/12/7/photo-5-17019311412871244871657.jpg",
      tags: ["Machine Learning", "Python", "Data Science"],
      upVote: 110,
      view: 100,
      comment: 60
    },
    {
      id: 6,
      name: "Ngọc Hà F",
      title: "Xây dựng RESTful API với Node.js và Express",
      avatar:
        "https://avatar-ex-swe.nixcdn.com/singer/avatar/2022/08/01/b/e/a/1/1659321743301_600.jpg",
      tags: ["Node.js", "Express", "API"],
      upVote: 80,
      view: 90,
      comment: 40
    },
    {
      id: 7,
      name: "Minh Tuấn G",
      title: "Làm thế nào để trở thành lập trình viên chuyên nghiệp",
      avatar:
        "https://vcdn1-giaitri.vnecdn.net/2022/02/08/thao-linh-jpeg-1644313181-2294-1644314017.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=zUwYLKE1lqSsl-q5y7qskw",
      tags: ["Career", "Professional Development"],
      upVote: 95,
      view: 110,
      comment: 70
    },
    {
      id: 8,
      name: "Thu Hương H",
      title: "Sử dụng CSS Grid để thiết kế giao diện hiệu quả",
      avatar: "https://photo-zmp3.zmdcdn.me/avatars/e/f/d/f/efdfd4aba55631f1abb67ed14c3e4d5a.jpg",
      tags: ["CSS", "Web Design", "Frontend"],
      upVote: 85,
      view: 95,
      comment: 45
    },
    {
      id: 9,
      name: "Anh Khoa I",
      title: "Những tính năng mới trong ES6",
      avatar:
        "https://cdnphoto.dantri.com.vn/zUE-6_ehgDi2vteoMkFdwmAV6AA=/thumb_w/1020/2023/08/08/3650580497515720401033635799974617027618960n-edited-1691435487104.jpeg",
      tags: ["JavaScript", "ES6", "Programming"],
      upVote: 105,
      view: 85,
      comment: 55
    },
    {
      id: 10,
      name: "Mai Lan J",
      title: "Phân tích dữ liệu với pandas trong Python",
      avatar:
        "https://yt3.googleusercontent.com/ytc/AIf8zZTK2KUUa44Zm5kZgh2F13MK5trw-KmE8K7v68GEKg=s900-c-k-c0x00ffffff-no-rj",
      tags: ["Python", "Data Analysis", "Pandas"],
      upVote: 88,
      view: 75,
      comment: 35
    }
  ];
  const [users, setUser] = useState(users1);

  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  const stickyFilterRef = useRef<HTMLDivElement>(null);
  const { height: stickyFilterHeight } = useBoxDimensions({
    ref: stickyFilterRef
  });
  const [solutionDetail, setSolutionDetail] = useState(true);
  const handleSolutionDetail = () => {
    setSolutionDetail(!solutionDetail);
  };
  const [searchKey, setSearchKey] = useState<string>("");
  const [timer, setTimer] = useState<number | undefined>(undefined);

  const searchHandle = (searchVal: string) => {
    setSearchKey(searchVal);

    // clearTimeout(timer);
    // const newTimer = window.setTimeout(() => {
    //   console.log(searchVal);
    //   setSearchKey(searchVal);
    // }, 1000);

    // setTimer(newTimer);
  };

  const { problemId, courseId, lessonId } = useParams<{
    problemId: string;
    courseId: string;
    lessonId: string;
  }>();

  const openShareInNewTab = () => {
    if (problemId) navigate(routes.user.problem.solution.share.replace(":problemId", problemId));
    else if (courseId && lessonId)
      navigate(
        routes.user.course_certificate.detail.lesson.share_solution
          .replace(":courseId", courseId)
          .replace(":lessonId", lessonId)
      );
  };
  const displayTag = [
    ...tags.filter((item) => item.isChoosen),
    ...tags.filter((item) => !item.isChoosen)
  ];
  const handleSelectTag = (id: string) => {
    let newTagList = cloneDeep(tags);
    newTagList.forEach((value) => {
      if (value.id === id) value.isChoosen = !value.isChoosen;
    });
    setTags(newTagList);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openFilterNewest = Boolean(anchorEl);
  const handleCloseFilterNewest = () => {
    setAnchorEl(null);
  };
  const handleOpenFilterNewest = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const choosenTagList = tags.filter((item) => item.isChoosen);
  useEffect(() => {
    if (problemId) {
      setItemLoading(true);
      SharedSolutionService.getSharedSolution(
        problemId,
        {
          searchKey,
          newest: newestSearch,
          filterTags: choosenTagList.length > 0 ? choosenTagList : null
        },
        { pageSize, pageNum }
      )
        .then((data: SharedSolutionPaginationList) => {
          setSolutionItem(data.sharedSolution);
          setTotalPage(data.totalPages);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setItemLoading(false));
    }
  }, [problemId, searchKey, tags, pageNum, newestSearch]);
  const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNum(value - 1);
  };

  return (
    <Box
      className={classes.containerListSolution}
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : "100%" }}
      overflow={"auto"}
    >
      {solutionDetail === true ? (
        <Stack height={"100%"}>
          <Box
            className={classes.stickyFilter}
            onScroll={(e) => {
              console.log("cc ", e.target);
            }}
          >
            <Grid container className={classes.filterContainer}>
              <Grid item xs={8}>
                <SearchBar onSearchClick={searchHandle} />
              </Grid>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={2} className={classes.filter}>
                <IconButton id='newest-button' onClick={handleOpenFilterNewest}>
                  <TuneIcon />
                  <ParagraphBody
                    translation-key={
                      newestSearch
                        ? "detail_problem_discussion_filter_newest"
                        : "detail_problem_discussion_filter_oldest"
                    }
                  >
                    {t(
                      newestSearch
                        ? "detail_problem_discussion_filter_newest"
                        : "detail_problem_discussion_filter_oldest"
                    )}
                  </ParagraphBody>
                </IconButton>
                <Menu
                  id='newest-menu'
                  aria-labelledby='newest-button'
                  anchorEl={anchorEl}
                  open={openFilterNewest}
                  onClose={handleCloseFilterNewest}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setNewestSearch(true);
                      handleCloseFilterNewest();
                    }}
                  >
                    {t("detail_problem_discussion_filter_newest")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setNewestSearch(false);
                      handleCloseFilterNewest();
                    }}
                  >
                    {t("detail_problem_discussion_filter_oldest")}
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
            <Box className={classes.tagItem}>
              <Box className={classes.tagAll} translation-key='common_all'>
                {t("common_all")}
              </Box>
              <Box className={classes.tag}>
                <Box className={classes.tagLanguage}>
                  {displayTag.map(
                    (tag, index) =>
                      index < 7 && (
                        <Chip
                          key={tag.id}
                          onClick={() => handleSelectTag(tag.id)}
                          sx={{
                            border: tag.isChoosen ? 1 : 0,
                            padding: "15px 8px",
                            backgroundColor: "var(--gray-10)",
                            fontFamily: "Montserrat"
                          }}
                          // label={algorithm.numOfCodeQuestion}
                          label={tag.name}
                          size='small'
                        />
                      )
                  )}
                </Box>
                <Box
                  className={classes.tagAlgorithm}
                  style={{ display: isExpanded ? "flex" : "none" }}
                >
                  {displayTag.map(
                    (tag, index) =>
                      index > 7 && (
                        <Chip
                          key={tag.id}
                          onClick={() => handleSelectTag(tag.id)}
                          sx={{
                            border: tag.isChoosen ? 1 : 0,
                            padding: "15px 8px",
                            backgroundColor: "var(--gray-10)",
                            fontFamily: "Montserrat"
                          }}
                          // label={algorithm.numOfCodeQuestion}
                          label={tag.name}
                          size='small'
                        />
                      )
                  )}
                </Box>
              </Box>
              <ExpandMoreIcon
                style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                className={classes.expandIcon}
                onClick={handleExpandClick}
              />
            </Box>
            <Box className={classes.shareSolution}>
              <Box
                className={classes.shareSolutionTitle}
                translation-key='detail_problem_discussion_share_solution_to_help'
              >
                {t("detail_problem_discussion_share_solution_to_help")}
              </Box>
              <Button
                component='label'
                variant='contained'
                startIcon={<FontAwesomeIcon icon={faPenToSquare} className={classes.shareIcon} />}
                className={classes.shareButton}
                onClick={openShareInNewTab}
                translation-key='detail_problem_discussion_share_your_solution'
              >
                {t("detail_problem_discussion_share_your_solution")}
              </Button>
            </Box>
          </Box>
          {itemLoading && (
            <Stack marginTop={3} alignItems={"center"}>
              <CircularProgress />
            </Stack>
          )}
          {!itemLoading && (
            <Stack overflow={"auto"}>
              {solutionItem.map((item) => {
                return (
                  <>
                    <ButtonBase
                      onClick={() => {
                        setSelectedSolutionId(item.sharedSolutionId);
                        handleSolutionDetail();
                      }}
                      focusRipple
                      sx={{
                        justifyContent: "flex-start",
                        fontFamily: "Montserrat, sans-serif",
                        textAlign: "left",
                        fontSize: "16px",
                        "&:hover": {
                          background: "var(--gray-2)"
                        }
                      }}
                    >
                      <Box className={classes.solutionInfo} key={item.sharedSolutionId}>
                        <Box className={classes.solutionTitle}>
                          <Box className={classes.avatar}>
                            <Avatar
                              sx={{ bgcolor: "var(--green-500)" }}
                              alt={item.user.firstName}
                              src={item.user.avatarUrl}
                            >
                              {item.user.firstName.charAt(0)}
                            </Avatar>
                          </Box>
                          <Box className={classes.nameTitleContainer}>
                            <Box className={classes.name}>
                              {i18next.language === "vi"
                                ? `${item.user?.lastName ?? ""} ${item.user?.firstName ?? ""}`
                                : `${item.user?.firstName ?? ""} ${item.user?.lastName ?? ""}`}
                            </Box>
                            <Box className={classes.title}>{item.title}</Box>
                          </Box>
                        </Box>
                        <Box className={classes.tagLanguageSolution}>
                          {item.tags.slice(0, 3).map((tag) => {
                            return (
                              <Box key={tag.id} className={classes.item}>
                                {tag.name}
                              </Box>
                            );
                          })}
                        </Box>
                        <Box className={classes.solutionButton}>
                          {/* <Box className={classes.upVote}>
                          <FontAwesomeIcon icon={faThumbsUp} className={classes.solutionIcon} />
                          <Box className={classes.upVoteNumber}>{user.upVote}</Box>
                        </Box> */}
                          <Box className={classes.view}>
                            <FontAwesomeIcon icon={faEye} className={classes.solutionIcon} />
                            <Box className={classes.viewNumber}>{item.totalView}</Box>
                          </Box>
                          <Box className={classes.comment}>
                            <FontAwesomeIcon icon={faComment} className={classes.solutionIcon} />
                            <Box className={classes.commentNumber}>{item.totalComment}</Box>
                          </Box>
                        </Box>
                      </Box>
                    </ButtonBase>
                    <Divider flexItem />
                  </>
                );
              })}
              {/* <Button onClick={() => setUser([...users, ...users1])}>Load more</Button> */}
              <Stack alignItems={"center"}>
                <Pagination
                  count={totalPage}
                  onChange={handleChangePagination}
                  page={pageNum + 1}
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      ) : (
        <Box className={classes.detailSolution}>
          <DetailSolution
            selectedSolutionId={selectedSolutionId}
            handleSolutionDetail={handleSolutionDetail}
          />
        </Box>
      )}
    </Box>
  );
}
