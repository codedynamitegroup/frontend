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
import LoadingButton from "@mui/lab/LoadingButton";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";

interface Props {
  handleSubmissionDetail: () => void;
}
export interface IFeedbackCodeByAI {
  id: number;
  feedback: string[];
  suggestCode: string;
}

export interface ICodeQuestion {
  title: string;
  description: string;
}

export interface ISourceCodeSubmission {
  source_code: string;
  language: string;
}
export default function DetailSolution({ handleSubmissionDetail }: Props) {
  const { t } = useTranslation();
  const sourceCodeSubmission: ISourceCodeSubmission = {
    source_code: `
	class Solution {
		public int lengthOfLongestSubstring(String s) {
			int left = 0, right = 0, max = 0;
			Set<Character> set = new HashSet();

			while(right < s.length()) {
				if (!set.contains(s.charAt(right))) {
					set.add(s.charAt(right));
					right++;
					max = Math.max(max, set.size());
				} else {
					set.remove(s.charAt(left));
					left++;
				}
			}
			return max;
		}
	}`,
    language: "java"
  };
  const codeQuestion: ICodeQuestion = {
    title: "Longest Substring Without Repeating Characters",
    description: `
		Given a string s, find the length of the longest substring without repeating characters.

		Example 1:
		Input: s = "abcabcbb"
		Output: 3
		Explanation: The answer is "abc", with the length of 3.

		Example 2:
		Input: s = "bbbbb"
		Output: 1
		Explanation: The answer is "b", with the length of 1.

		Example 3:
		Input: s = "pwwkew"
		Output: 3
		Explanation: The answer is "wke", with the length of 3.
		Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
		`
  };
  const stickyBackRef = useRef<HTMLDivElement>(null);
  const { height: stickyBackHeight } = useBoxDimensions({
    ref: stickyBackRef
  });
  const [loading, setLoading] = useState(false);
  const [feedbackCodeByAI, setFeedbackCodeByAI] = useState<IFeedbackCodeByAI | null>(null);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);

  const handleFeedbackCodeByAI = async () => {
    setLoading(true);
    await feedbackCodeByByAI(sourceCodeSubmission, codeQuestion)
      .then((result) => {
        if (result) {
          setFeedbackCodeByAI(result);
          setOpenSnackbarAlert(true);
          setAlertContent("Đánh giá thành công");
          setAlertType(AlertType.Success);
        } else {
          throw new Error("Internal server error");
        }
      })
      .catch((err) => {
        console.error("Error generating content:", err);
        setOpenSnackbarAlert(true);
        setAlertContent("Đánh giá thất bại, hãy thử lại lần nữa");
        setAlertType(AlertType.Error);
      })
      .finally(() => {
        setLoading(false);
      });
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
          <MDEditor.Markdown source={"```java\n" + sourceCodeSubmission.source_code} />
        </Box>

        {feedbackCodeByAI && (
          <Box className={classes.submissionText}>
            <ParagraphBody fontWeight={700}>Đánh giá</ParagraphBody>

            <Box className={classes.evaluateText}>
              {feedbackCodeByAI.feedback &&
                feedbackCodeByAI.feedback?.length > 0 &&
                feedbackCodeByAI.feedback.map((feedback, index) => (
                  <ParagraphBody key={index}>- {feedback}</ParagraphBody>
                ))}
            </Box>
            <ParagraphBody fontWeight={700}>Bài làm được đề xuất bởi AI</ParagraphBody>

            {feedbackCodeByAI.suggestCode && (
              <MDEditor.Markdown source={"```java\n" + feedbackCodeByAI.suggestCode + ""} />
            )}
          </Box>
        )}
      </Box>
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={alertType}
        content={alertContent}
      />
    </Grid>
  );
}
