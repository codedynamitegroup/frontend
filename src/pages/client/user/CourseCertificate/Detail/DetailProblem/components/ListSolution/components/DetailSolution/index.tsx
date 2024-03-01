import React, { useRef } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Divider } from "@mui/material";
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
import useBoxDimensions from "utils/useBoxDimensions";

interface Props {
  handleSolutionDetail: () => void;
}
export default function DetailSolution({ handleSolutionDetail }: Props) {
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

  const markdownContent = `
  ### Approaches
(Also explained in the code)
**Bold text**

1. hehe
    - The goal is to divide the given array into groups of three consecutive elements. This decision likely comes from the requirement or nature of the problem being solved.
2. Sorting for Comparison:
    - Sorting the array is done to simplify the process of comparing the elements within each group. When the array is sorted, the minimum and maximum elements for each group can be easily identified.
3. Setting a Condition (k):
    - The condition involving k is introduced to filter out groups based on the difference between the maximum and minimum elements within each group. This condition ensures that the elements in a group are within a certain range.
4. Iterative Approach:
    - The code iterates through the sorted array in steps of 3, forming groups and checking the condition for each group. If a group meets the condition, it is added to the result. If any group fails the condition, the function returns an empty result.


### Complexity
- Time complexity: O(nlogn)
- Space complexity: O(n)


### Code
\`\`\`cpp
class Solution {
public:
    vector<vector<int>> divideArray(vector<int>& nums, int ki) {
       vector<vector<int>> ans;
        sort(nums.begin(),nums.end());
        int i=0;
        int j=1;
        int k=2;
        while(k<nums.size()){
            if(nums[j]-nums[i]<=ki&&nums[k]-nums[i]<=ki&&nums[k]-nums[j]<=ki){
                ans.push_back({nums[i],nums[j],nums[k]});
                i=i+3;
                j=j+3;
                k=k+3;
            }
            else{
                return {};
            }
        }
        return ans;
    }
};
\`\`\`
`;
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

  const stickyBackRef = useRef<HTMLDivElement>(null);
  const { height: stickyBackHeight } = useBoxDimensions({
    ref: stickyBackRef
  });

  console.log("stickyBackHeight", stickyBackHeight);
  return (
    <Box className={classes.containerDetailSolution}>
      <Box className={classes.stickyBack} ref={stickyBackRef}>
        <Box onClick={handleSolutionDetail} className={classes.backButton}>
          <ArrowBackIcon className={classes.backIcon} />
          <span>Quay lại</span>
        </Box>
        <Divider />
      </Box>

      <Box
        className={classes.solutionContainer}
        style={{
          height: `calc(100% - ${stickyBackHeight}px)`
        }}
      >
        <Box className={classes.solutionTitle}>
          <Heading4>Cách giải đánh bại 100%</Heading4>
        </Box>
        <Box className={classes.userInfo}>
          <Box className={classes.avatar}>
            <img
              className={classes.imgAvatar}
              src='https://kenhsao.net/wp-content/uploads/2023/09/hieuthuhai-la-ai.jpg'
              alt='avatar'
            ></img>
          </Box>
          <Box className={classes.nameInfoContainer}>
            <Box className={classes.name}>Nguyễn Văn A</Box>
            <Box className={classes.solutionButton}>
              <Box className={classes.upVote}>
                <FontAwesomeIcon icon={faThumbsUp} className={classes.solutionIcon} />
                <Box className={classes.upVoteNumber}>1000</Box>
              </Box>
              <Box className={classes.view}>
                <FontAwesomeIcon icon={faEye} className={classes.solutionIcon} />
                <Box className={classes.viewNumber}>25504</Box>
              </Box>
              <Box className={classes.calendar}>
                <FontAwesomeIcon icon={faCalendar} className={classes.solutionIcon} />
                <Box className={classes.calendarNumber}>12-12-2022</Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={classes.tagLanguageSolution}>
          {tags.slice(0, 3).map((tag, index) => {
            return (
              <Box className={classes.item} key={index}>
                {tag}
              </Box>
            );
          })}
        </Box>
        <Box data-color-mode='light'>
          <MDEditor.Markdown source={markdownContent} />
        </Box>

        <Box className={classes.commentContainer}>
          <Box className={classes.commentTitleContainer}>
            <Box className={classes.commentTitle}>
              <FontAwesomeIcon icon={faComments} className={classes.commentIcon} />
              <Box className={classes.commentNumber}>Bình luận (10)</Box>
            </Box>
            <Box className={classes.filterComment}>Lọc theo: Mới nhất</Box>
          </Box>
          <Box className={classes.commentBox}>
            <TextareaAutosize
              aria-label='empty textarea'
              placeholder='Bình luận của bạn'
              className={classes.textArea}
              minRows={5}
            />
            <Button variant='contained' className={classes.commentButton}>
              Bình luận
            </Button>
          </Box>
          <Box className={classes.commentList}>
            <Box className={classes.commentItem}>
              {users.map((user) => {
                return (
                  <Box className={classes.commentInfo} key={user.id}>
                    <Box className={classes.commentInfoUser}>
                      <img className={classes.imgAvatar} src={user.avatar} alt='avatar'></img>
                      <Box className={classes.commentName}>{user.name}</Box>
                    </Box>
                    <Box className={classes.commentText}>
                      <Markdown children={user.comment} remarkPlugins={[gfm]} />
                    </Box>
                    <Box className={classes.commentAction}>
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
                        <span>Trả lời</span>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
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
