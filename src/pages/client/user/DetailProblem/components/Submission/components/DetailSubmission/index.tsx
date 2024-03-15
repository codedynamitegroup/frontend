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
  feedback: string;
  suggestCode: string;
  explainCode: string;
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

  function isFeedbackCodeByAI(obj: any): obj is IFeedbackCodeByAI {
    return (
      typeof obj.id === "number" &&
      typeof obj.feedback === "string" &&
      typeof obj.suggestCode === "string"
    );
  }

  const handleFeedbackCodeByAI = async () => {
    setLoading(true);
    await feedbackCodeByByAI(sourceCodeSubmission, codeQuestion)
      .then((result) => {
        if (result && isFeedbackCodeByAI(result)) {
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

  const markdownContent = `1. Khai báo biến:

  - \`left\`: Biến lưu trữ vị trí bắt đầu của chuỗi con hiện tại.
  - \`right\`: Biến lưu trữ vị trí kết thúc của chuỗi con hiện tại.
  - \`max\`: Biến lưu trữ độ dài chuỗi con dài nhất được tìm thấy.
  - \`set\`: Biến kiểu \`Set\` lưu trữ các ký tự đã xuất hiện trong chuỗi con hiện tại.
 2. Vòng lặp while:
 
  - Vòng lặp này sẽ chạy cho đến khi \`right\` bằng với độ dài của chuỗi \`s\`.
 3. Kiểm tra ký tự:
 
  - Kiểm tra xem ký tự tại vị trí \`right\` có trong \`set\` hay không.
  - Nếu không có:
    - Thêm ký tự vào \`set\`.
    - Tăng \`right\` lên 1 để di chuyển đến ký tự tiếp theo.
    - Cập nhật \`max\` nếu độ dài của \`set\` lớn hơn \`max\`.
  - Nếu có:
    - Xóa ký tự tại vị trí \`left\` khỏi \`set\`.
    - Tăng \`left\` lên 1 để di chuyển đến ký tự tiếp theo.
 4. Trả về kết quả:
 
  - Sau khi vòng lặp while kết thúc, \`max\` sẽ lưu trữ độ dài chuỗi con dài nhất không có ký tự lặp lại.
  - Trả về \`max\`.
 
 Cách thức hoạt động:
 
 - Thuật toán sử dụng một "cửa sổ trượt" để di chuyển qua chuỗi. Cửa sổ này bắt đầu từ vị trí 0 và mở rộng cho đến khi gặp một ký tự lặp lại.
 - Khi gặp một ký tự lặp lại, cửa sổ sẽ thu hẹp lại từ đầu cho đến khi ký tự lặp lại bị loại bỏ.
 - Độ dài của cửa sổ được cập nhật liên tục và giá trị lớn nhất sẽ được lưu trữ.
 - Sau khi cửa sổ trượt đến cuối chuỗi, độ dài chuỗi con dài nhất không có ký tự lặp lại sẽ được trả về.
 
 Ví dụ:
 
 - Cho chuỗi \`s = "abcabcbb"\`.
 - Ban đầu, \`left = 0\` và \`right = 0\`.
 - Cửa sổ trượt qua chuỗi:
   - \`right = 1\`: Ký tự \`a\` không có trong \`set\`, thêm vào \`set\` và tăng \`right\` lên 1.
   - \`right = 2\`: Ký tự \`b\` không có trong \`set\`, thêm vào \`set\` và tăng \`right\` lên 1.
   - \`right = 3\`: Ký tự \`c\` không có trong \`set\`, thêm vào \`set\` và tăng \`right\` lên 1.
   - \`right = 4\`: Ký tự \`a\` đã có trong \`set\`, xóa \`a\` khỏi \`set\` và tăng \`left\` lên 1.
   - \`right = 5\`: Ký tự \`b\` không có trong \`set\`, thêm vào \`set\` và tăng \`left\` lên 1.
   - \`right = 6\`: Ký tự \`c\` không có trong \`set\`, thêm vào \`set\` và tăng \`left\` lên 1.
 -   Sau khi vòng lặp while kết thúc, \`max = 3\`.
 -   Chuỗi con dài nhất không có ký tự lặp lại là \`"abc"\`.`;

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
                <MDEditor.Markdown
                  source={feedbackCodeByAI.feedback}
                  className={classes.markdown}
                />
              </Box>
            )}
            <ParagraphBody fontWeight={700}>Bài làm được đề xuất bởi AI</ParagraphBody>

            {feedbackCodeByAI.suggestCode && (
              <Box data-color-mode='light'>
                <MDEditor.Markdown source={"```java\n" + feedbackCodeByAI.suggestCode + ""} />
              </Box>
            )}
            {feedbackCodeByAI.explainCode && (
              <>
                <ParagraphBody fontWeight={700}>Giải thích chi tiết</ParagraphBody>
                <Box data-color-mode='light'>
                  <MDEditor.Markdown
                    source={feedbackCodeByAI.explainCode}
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
