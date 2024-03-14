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
import { useTranslation } from "react-i18next";
import { feedbackCodeByByAI } from "service/FeedbackCodeByAI";
import { useState } from "react";

import MDEditor from "@uiw/react-md-editor";
import CircularProgress from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

interface Props {
  handleSubmissionDetail: () => void;
}
interface IFeedbackCodeByAI {
  id: number;
  feedback: string[];
  suggestCode: string;
}
export default function DetailSolution({ handleSubmissionDetail }: Props) {
  const { t } = useTranslation();
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
  const [loading, setLoading] = useState(false);
  const [feedbackCodeByAI, setFeedbackCodeByAI] = useState<IFeedbackCodeByAI | null>(null);
  const handleFeedbackCodeByAI = async () => {
    setLoading(true);
    const result = await feedbackCodeByByAI(cpp, "divideArray");
    if (result) {
      setFeedbackCodeByAI(result);
    }
    setLoading(false);
  };

  return (
    <Grid className={classes.root}>
      <Box className={classes.stickyBack} ref={stickyBackRef}>
        <Box onClick={handleSubmissionDetail} className={classes.backButton}>
          <ArrowBackIcon className={classes.backIcon} />
          <span translation-key='detail_problem_submission_detail_back'>
            {t("detail_problem_submission_detail_back")}
          </span>
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
            <ParagraphBody
              colorname='--green-500'
              fontWeight={"700"}
              translation-key='detail_problem_submission_accepted'
            >
              {t("detail_problem_submission_accepted")}
            </ParagraphBody>
            <Box className={classes.submissionAuthor}>
              <img
                src='https://kenhsao.net/wp-content/uploads/2023/09/hieuthuhai-la-ai.jpg'
                alt='avatar'
                className={classes.avatar}
              />
              <ParagraphExtraSmall fontWeight={"700"}>Nguyễn Văn A</ParagraphExtraSmall>
              <ParagraphExtraSmall translation-key='detail_problem_submission_detail_user_submission_time'>
                {t("detail_problem_submission_detail_user_submission_time", {
                  time: `05/03/2024 14:00`,
                  interpolation: { escapeValue: false }
                })}
              </ParagraphExtraSmall>
            </Box>
          </Box>
          <Button
            variant='contained'
            color='primary'
            translation-key='detail_problem_submission_detail_share_solution'
          >
            {t("detail_problem_submission_detail_share_solution")}
          </Button>
        </Box>
        <Grid container className={classes.submissionStatistical}>
          <Grid item xs={5.75} className={classes.statisticalTime}>
            <Container className={classes.title}>
              <AccessTimeIcon />
              <ParagraphSmall
                colorname={"--white"}
                translation-key='detail_problem_submission_detail_runtime'
              >
                {t("detail_problem_submission_detail_runtime")}
              </ParagraphSmall>
            </Container>
            <Container className={classes.data}>
              <ParagraphBody colorname={"--white"} fontSize={"20px"} fontWeight={"700"}>
                12ms
              </ParagraphBody>
            </Container>
          </Grid>
          <Grid item xs={0.5} />
          <Grid item xs={5.75} className={classes.statisticalMemory}>
            <Container className={classes.title}>
              <MemoryIcon />
              <ParagraphSmall
                colorname={"--white"}
                translation-key='detail_problem_submission_detail_memory'
              >
                {t("detail_problem_submission_detail_memory")}
              </ParagraphSmall>
            </Container>
            <Container className={classes.data}>
              <ParagraphBody colorname={"--white"} fontSize={"20px"} fontWeight={"700"}>
                13MB
              </ParagraphBody>
            </Container>
          </Grid>
        </Grid>
        <Box className={classes.submissionText}>
          <Box className={classes.submissionTitle}>
            <ParagraphBody
              fontWeight={700}
              translation-key='detail_problem_submission_detail_your_solution'
            >
              {t("detail_problem_submission_detail_your_solution")}
            </ParagraphBody>
            <LoadingButton
              loading={loading}
              variant='contained'
              color='primary'
              onClick={handleFeedbackCodeByAI}
            >
              Đánh giá bởi AI
            </LoadingButton>
          </Box>
          <MDEditor.Markdown source={cpp} />
        </Box>

        {feedbackCodeByAI && (
          <Box className={classes.submissionText}>
            <ParagraphBody fontWeight={700}>Đánh giá</ParagraphBody>

            <Box className={classes.evaluateText}>
              <ParagraphBody>{feedbackCodeByAI && feedbackCodeByAI.feedback}</ParagraphBody>
            </Box>
            <ParagraphBody fontWeight={700}>Bài làm được đề xuất bởi AI</ParagraphBody>

            <MDEditor.Markdown
              source={feedbackCodeByAI ? "```" + feedbackCodeByAI.suggestCode + "```" : ""}
            />
          </Box>
        )}
      </Box>
    </Grid>
  );
}
