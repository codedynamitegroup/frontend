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
  IFeedbackCode,
  IFeedbackCodeByAI,
  ISourceCodeSubmission,
  feedbackCodeByByAI
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
	public int reverse(int x) {
		long result = 0;
		while (x != 0) {
			result = result*10 + x%10;
			x /= 10;
				if( result > Integer.MAX_VALUE || result < Integer.MIN_VALUE)
					return 0;
		}
		return (int)result;
	}
}`,
    language: "java"
  };
  const codeQuestion: ICodeQuestion = {
    title: "Reverse Integer",
    description: `
	Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

	Assume the environment does not allow you to store 64-bit integers (signed or unsigned).

	Example 1:
		Input: x = 123
		Output: 321

	Example 2:
		Input: x = -123
		Output: -321

	Example 3:
		Input: x = 120
		Output: 21`
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
  const [feedbackContent, setFeedbackContent] = useState<string>(``);

  function isFeedbackCodeByAI(obj: any): obj is IFeedbackCodeByAI {
    return (
      typeof obj.id === "number" &&
      typeof obj.feedback === "object" &&
      typeof obj.feedback.analysis === "object" &&
      typeof obj.feedback.improvementSuggestions === "string" &&
      typeof obj.feedback.improvementSuggestions === "string" &&
      typeof obj.suggestedCode === "string" &&
      obj.suggestedCode !== "" &&
      typeof obj.explainedCode === "string" &&
      obj.explainedCode !== ""
    );
  }

  const handleFeedbackCodeByAI = async () => {
    setLoading(true);
    await feedbackCodeByByAI(sourceCodeSubmission, codeQuestion)
      .then((result) => {
        if (result && isFeedbackCodeByAI(result)) {
          setFeedbackCodeByAI(result);
          const feedbackTemp: IFeedbackCode = result.feedback;
          if (feedbackTemp) {
            setFeedbackContent(`
### I. Phân tích

#### 1. Tính Đúng đắn:

${
  feedbackTemp.analysis?.correctness?.accuracy &&
  feedbackTemp.analysis?.correctness?.accuracy !== ""
    ? `- **Tính chính xác:** 

${feedbackTemp.analysis?.correctness?.accuracy}`
    : ""
}

${
  feedbackTemp.analysis?.correctness?.completeness &&
  feedbackTemp.analysis?.correctness?.completeness !== ""
    ? `- **Tính đầy đủ:** 

${feedbackTemp.analysis?.correctness?.completeness}`
    : ""
}

${
  feedbackTemp.analysis?.correctness?.consistency &&
  feedbackTemp.analysis?.correctness?.consistency !== ""
    ? `- **Tính nhất quán:**

${feedbackTemp.analysis?.correctness?.consistency}`
    : ""
}

#### 2. Tính hiệu quả:

${
  feedbackTemp.analysis?.efficiency?.executionTime &&
  feedbackTemp.analysis?.efficiency?.executionTime !== ""
    ? `- **Thời gian thực thi:**

${feedbackTemp.analysis?.efficiency?.executionTime}`
    : ""
}

${
  feedbackTemp.analysis?.efficiency?.memory && feedbackTemp.analysis?.efficiency?.memory !== ""
    ? `- **Bộ nhớ:**

${feedbackTemp.analysis?.efficiency?.memory}`
    : ""
}

${
  feedbackTemp.analysis?.efficiency?.complexity &&
  feedbackTemp.analysis?.efficiency?.complexity !== ""
    ? `- **Độ phức tạp:** 

${feedbackTemp.analysis?.efficiency?.complexity}`
    : ""
}

#### 3. Tính bảo trì:

${
  feedbackTemp.analysis?.maintainability?.readability &&
  feedbackTemp.analysis?.maintainability?.readability !== ""
    ? `- **Khả năng đọc hiểu:**

${feedbackTemp.analysis?.maintainability?.readability}`
    : ""
}

${
  feedbackTemp.analysis?.maintainability?.reuseability &&
  feedbackTemp.analysis?.maintainability?.reuseability !== ""
    ? `- **Khả năng tái sử dụng:**

${feedbackTemp.analysis?.maintainability?.reuseability}`
    : ""
}

${
  feedbackTemp.analysis?.maintainability?.extensibility &&
  feedbackTemp.analysis?.maintainability?.extensibility !== ""
    ? `- **Khả năng mở rộng:** 

${feedbackTemp.analysis?.maintainability?.extensibility}`
    : ""
}

#### 4. Khả năng mở rộng:

${
  feedbackTemp.analysis?.scalability?.dataScalability &&
  feedbackTemp.analysis?.scalability?.dataScalability !== ""
    ? `- **Khả năng mở rộng dữ liệu:**

${feedbackTemp.analysis?.scalability?.dataScalability}`
    : ""
}

${
  feedbackTemp.analysis?.scalability?.functionalScalability &&
  feedbackTemp.analysis?.scalability?.functionalScalability !== ""
    ? `- **Khả năng mở rộng chức năng:** 

${feedbackTemp.analysis?.scalability?.functionalScalability}  `
    : ""
}

### II. Gợi ý cải tiến

${feedbackTemp.improvementSuggestions}

### III. Kết luận

${feedbackTemp.conclusion}
`);
          }

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

        {feedbackCodeByAI && (
          <Box className={classes.submissionText}>
            <ParagraphBody fontWeight={700}>Đánh giá</ParagraphBody>

            {feedbackCodeByAI.feedback && (
              <Box data-color-mode='light'>
                <MDEditor.Markdown source={feedbackContent} className={classes.markdown} />
              </Box>
            )}
            <ParagraphBody fontWeight={700}>Bài làm được đề xuất bởi AI</ParagraphBody>

            {feedbackCodeByAI.suggestedCode && (
              <Box data-color-mode='light'>
                <MDEditor.Markdown source={"```java\n" + feedbackCodeByAI.suggestedCode + ""} />
              </Box>
            )}
            {feedbackCodeByAI.explainedCode && (
              <>
                <ParagraphBody fontWeight={700}>Giải thích chi tiết</ParagraphBody>
                <Box data-color-mode='light'>
                  <MDEditor.Markdown
                    source={feedbackCodeByAI.explainedCode}
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
