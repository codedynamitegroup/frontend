import React from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import { Divider, Grid } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DetailSolution from "./components/DetailSolution";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faComment, faEye, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router";
import { routes } from "routes/routes";
import ParagraphBody from "components/text/ParagraphBody";
import SearchBar from "components/common/search/SearchBar";
import TuneIcon from "@mui/icons-material/Tune";
import useBoxDimensions from "hooks/useBoxDimensions";

export default function ProblemDetailSolution() {
  const navigate = useNavigate();
  const filter = [
    {
      id: 1,
      label: "Mới nhất"
    },
    {
      id: 2,
      label: "Nhiều vote nhất"
    }
  ];
  const tags = [
    "Java",
    "C++",
    "Javascript",
    "ReactJS",
    "NodeJS",
    "Python",
    "Ruby",
    "C#",
    "C",
    "C++",
    "PHP",
    "Kotlin",
    "Rust"
  ];

  const algorithmTag = [
    "Sorting",
    "Searching",
    "Array",
    "String",
    "Linked List",
    "Stack",
    "Queue",
    "Binary Tree",
    "Binary Search Tree",
    "Heap",
    "Hashing",
    "Graph",
    "Matrix",
    "Advanced Data Structure",
    "Backtracking",
    "Dynamic Programming"
  ];

  const users = [
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

  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  const stickyFilterRef = useRef<HTMLDivElement>(null);
  const { height: stickyFilterHeight } = useBoxDimensions({
    ref: stickyFilterRef
  });

  console.log("stickyFilterHeight", stickyFilterHeight);

  const [solutionDetail, setSolutionDetail] = useState(true);
  const handleSolutionDetail = () => {
    setSolutionDetail(!solutionDetail);
  };

  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };

  const openShareInNewTab = () => {
    window.open(routes.user.problem.solution.share.replace(":problemId", "1"), "_blank");
  };

  return (
    <Box className={classes.containerListSolution}>
      {solutionDetail === true ? (
        <Box className={classes.listSolution}>
          <Box className={classes.stickyFilter} ref={stickyFilterRef}>
            <Grid container className={classes.filterContainer}>
              <Grid item xs={8}>
                <SearchBar onSearchClick={searchHandle} />
              </Grid>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={2} className={classes.filter}>
                <TuneIcon />
                <ParagraphBody>Mới nhất</ParagraphBody>
              </Grid>
            </Grid>
            <Box className={classes.tagItem}>
              <Box className={classes.tagAll}>Tất cả</Box>
              <Box className={classes.tag}>
                <Box className={classes.tagLanguage}>
                  {tags.map((tag, index) => {
                    return (
                      <Box key={index} className={classes.item}>
                        {tag}
                      </Box>
                    );
                  })}
                </Box>

                <Box
                  className={classes.tagAlgorithm}
                  style={{ display: isExpanded ? "flex" : "none" }}
                >
                  {algorithmTag.map((tag, index) => {
                    return (
                      <Box key={index} className={classes.item}>
                        {tag}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <ExpandMoreIcon
                style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                className={classes.expandIcon}
                onClick={handleExpandClick}
              />
            </Box>
            <Box className={classes.shareSolution}>
              <Box className={classes.shareSolutionTitle}>
                Bài làm của bạn đánh bại 82% bài làm khác về thời gian{" "}
              </Box>
              <Button
                component='label'
                variant='contained'
                startIcon={<FontAwesomeIcon icon={faPenToSquare} className={classes.shareIcon} />}
                className={classes.shareButton}
                onClick={openShareInNewTab}
              >
                Chia sẻ bài giải
              </Button>
            </Box>
          </Box>
          <Box
            className={classes.solutionContainer}
            style={{
              height: `calc(100% - ${stickyFilterHeight}px)`
            }}
          >
            <Box className={classes.solutionItem}>
              {users.map((user) => {
                return (
                  <Box
                    onClick={handleSolutionDetail}
                    className={classes.solutionInfo}
                    key={user.id}
                  >
                    <Box className={classes.solutionTitle}>
                      <Box className={classes.avatar}>
                        <img className={classes.imgAvatar} src={user.avatar} alt='avatar'></img>
                      </Box>
                      <Box className={classes.nameTitleContainer}>
                        <Box className={classes.name}>{user.name}</Box>
                        <Box className={classes.title}>{user.title}</Box>
                      </Box>
                    </Box>
                    <Box className={classes.tagLanguageSolution}>
                      {user.tags.slice(0, 3).map((tag, index) => {
                        return (
                          <Box key={index} className={classes.item}>
                            {tag}
                          </Box>
                        );
                      })}
                    </Box>
                    <Box className={classes.solutionButton}>
                      <Box className={classes.upVote}>
                        <FontAwesomeIcon icon={faThumbsUp} className={classes.solutionIcon} />
                        <Box className={classes.upVoteNumber}>{user.upVote}</Box>
                      </Box>
                      <Box className={classes.view}>
                        <FontAwesomeIcon icon={faEye} className={classes.solutionIcon} />
                        <Box className={classes.viewNumber}>{user.view}</Box>
                      </Box>
                      <Box className={classes.comment}>
                        <FontAwesomeIcon icon={faComment} className={classes.solutionIcon} />
                        <Box className={classes.commentNumber}>{user.comment}</Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box className={classes.detailSolution}>
          <DetailSolution handleSolutionDetail={handleSolutionDetail} />
        </Box>
      )}
    </Box>
  );
}
