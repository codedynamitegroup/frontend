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
import {
  ICodeQuestion,
  IFeedbackCodeByAI,
  ISourceCodeSubmission,
  feedbackCodeByAI
} from "service/FeedbackCodeByAI";
import { useState } from "react";

import MDEditor from "@uiw/react-md-editor";
import LoadingButton from "@mui/lab/LoadingButton";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";

interface Props {
  handleSubmissionDetail: () => void;
}

export default function DetailSolution({ handleSubmissionDetail }: Props) {
  const { t } = useTranslation();
  const sourceCodeSubmission: ISourceCodeSubmission = {
    source_code: `
class Solution {
	public ListNode removeNthFromEnd(ListNode head, int n) {
		if (head == null || head.next == null)
			return null;
		int numNodes = 0;
		ListNode temp = head;
		while(temp != null) {
			temp = temp.next;
			numNodes++;
		}
		if (numNodes == n) {
			head = head.next;
			return  head;
		}
		ListNode cur = head.next;
		ListNode prev = head;
		int index = 1;
		while(cur != null) {
			if (numNodes - index == n) {
				prev.next = cur.next;
				cur = cur.next;
				break;
			}
			index++;
			prev = cur;
			cur = cur.next;
		}
	return head;
	}
}
`,
    language: "java"
  };
  const codeQuestion: ICodeQuestion = {
    title: "Remove Nth Node From End of List",
    description: `
		Given the head of a linked list, remove the n^th node from the end of the list and return its head.

		Example 1:
			Input: head = [1,2,3,4,5], n = 2
			Output: [1,2,3,5]

		Example 2:
			Input: head = [1], n = 1
			Output: []

		Example 3:
			Input: head = [1,2], n = 1
			Output: [1]
		`
  };
  const stickyBackRef = useRef<HTMLDivElement>(null);
  const { height: stickyBackHeight } = useBoxDimensions({
    ref: stickyBackRef
  });
  const [loading, setLoading] = useState(false);
  const [feedbackCode, setFeedbackCode] = useState<IFeedbackCodeByAI | null>(null);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);

  function isFeedbackCodeByAI(obj: any): obj is IFeedbackCodeByAI {
    return (
      typeof obj.feedback === "string" &&
      obj.feedback !== "" &&
      typeof obj.suggestedCode === "string" &&
      obj.suggestedCode !== "" &&
      typeof obj.explainedCode === "string" &&
      obj.explainedCode !== ""
    );
  }

  const handleFeedbackCodeByAI = async () => {
    setLoading(true);
    await feedbackCodeByAI(sourceCodeSubmission, codeQuestion)
      .then((result) => {
        if (result && isFeedbackCodeByAI(result)) {
          setFeedbackCode(result);
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
          <span translation-key='common_back'>{t("common_back")}</span>
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
          <Box className={classes.feedbackTitle}>
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
          <Box data-color-mode='light'>
            <MDEditor.Markdown source={"```java" + sourceCodeSubmission.source_code} />
          </Box>
        </Box>

        {feedbackCode && (
          <Box className={classes.submissionText}>
            <ParagraphBody fontWeight={700}>Đánh giá</ParagraphBody>

            {feedbackCode.feedback && (
              <Box data-color-mode='light'>
                <MDEditor.Markdown source={feedbackCode.feedback} className={classes.markdown} />
              </Box>
            )}
            <ParagraphBody fontWeight={700}>Bài làm được đề xuất bởi AI</ParagraphBody>

            {feedbackCode.suggestedCode && (
              <Box data-color-mode='light'>
                <MDEditor.Markdown source={"```java\n" + feedbackCode.suggestedCode + ""} />
              </Box>
            )}
            {feedbackCode.explainedCode && (
              <>
                <ParagraphBody fontWeight={700}>Giải thích chi tiết</ParagraphBody>
                <Box data-color-mode='light'>
                  <MDEditor.Markdown
                    source={feedbackCode.explainedCode}
                    className={classes.markdown}
                  />
                </Box>
              </>
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
