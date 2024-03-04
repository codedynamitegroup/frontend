import { Button, Container, Grid } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Divider } from "@mui/material";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useRef } from "react";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MemoryIcon from "@mui/icons-material/Memory";
import ParagraphSmall from "components/text/ParagraphSmall";

import MDEditor from "@uiw/react-md-editor";

interface Props {
  handleSubmissionDetail: () => void;
}
export default function LessonDetailSubmission({ handleSubmissionDetail }: Props) {
  const cpp = `\`\`\`cpp
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
    \`\`\``;
  const stickyBackRef = useRef<HTMLDivElement>(null);
  const { height: stickyBackHeight } = useBoxDimensions({
    ref: stickyBackRef
  });
  return (
    <Grid className={classes.root}>
      <Box className={classes.stickyBack} ref={stickyBackRef}>
        <Box onClick={handleSubmissionDetail} className={classes.backButton}>
          <ArrowBackIcon className={classes.backIcon} />
          <span>Quay lại</span>
        </Box>
        <Divider />
      </Box>
      <Box
        className={classes.submissionContainer}
        style={{
          height: `calc(100% - ${stickyBackHeight}px)`
        }}
      >
        <Box className={classes.submissionInfo}>
          <Box className={classes.submissionTitle}>
            <ParagraphBody colorName='--green-500' fontWeight={"700"}>
              Đã chấp nhận
            </ParagraphBody>
            <Box className={classes.submissionAuthor}>
              <img
                src='https://kenhsao.net/wp-content/uploads/2023/09/hieuthuhai-la-ai.jpg'
                alt='avatar'
                className={classes.avatar}
              />
              <ParagraphExtraSmall fontWeight={"700"}>Nguyễn Văn A</ParagraphExtraSmall>
              <ParagraphExtraSmall>đã nộp vào 05/03/2024 14:00</ParagraphExtraSmall>
            </Box>
          </Box>
          <Button variant='contained' color='primary'>
            Chia sẻ bài giải
          </Button>
        </Box>
        <Grid container className={classes.submissionStatistical}>
          <Grid item xs={5.75} className={classes.statisticalTime}>
            <Container className={classes.title}>
              <AccessTimeIcon />
              <ParagraphSmall colorName={"--white"}>Thời gian chạy</ParagraphSmall>
            </Container>
            <Container className={classes.data}>
              <ParagraphBody colorName={"--white"} fontSize={"20px"} fontWeight={"700"}>
                12ms
              </ParagraphBody>
            </Container>
          </Grid>
          <Grid item xs={0.5} />
          <Grid item xs={5.75} className={classes.statisticalMemory}>
            <Container className={classes.title}>
              <MemoryIcon />
              <ParagraphSmall colorName={"--white"}>Bộ nhớ</ParagraphSmall>
            </Container>
            <Container className={classes.data}>
              <ParagraphBody colorName={"--white"} fontSize={"20px"} fontWeight={"700"}>
                13MB
              </ParagraphBody>
            </Container>
          </Grid>
        </Grid>
        <Box className={classes.submissionText}>
          <ParagraphBody fontWeight={700}>Bài làm của bạn</ParagraphBody>
          <MDEditor.Markdown source={cpp} />
        </Box>
      </Box>
    </Grid>
  );
}
