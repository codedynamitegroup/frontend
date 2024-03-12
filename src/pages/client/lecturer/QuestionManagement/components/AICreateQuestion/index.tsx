import { Box, Container, Grid, IconButton, MenuItem, Select } from "@mui/material";
import Header from "components/Header";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { useRef, useState } from "react";
import { useMatches, useNavigate } from "react-router-dom";
import classes from "./styles.module.scss";
// import Button from "@mui/joy/Button";
import Button, { BtnType } from "components/common/buttons/Button";
import { routes } from "routes/routes";
import useBoxDimensions from "hooks/useBoxDimensions";
import { Textarea } from "@mui/joy";
import Heading6 from "components/text/Heading6";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Heading4 from "components/text/Heading4";
import Delete from "@mui/icons-material/Delete";
import { IFormatQuestion, IQuestion } from "./generate";
import { createQuestionByAI } from "./generate";
import CircularProgress from "@mui/material/CircularProgress";
import SnackbarAlert from "components/common/SnackbarAlert";
export enum AlertType {
  Success = "success",
  INFO = "info",
  Warning = "warning",
  Error = "error"
}
export enum EQType {
  Essay = 1,
  MultipleChoice = 2,
  ShortAnswer = 3,
  TrueFalse = 4
}
export enum EQuestionLevel {
  Easy = 1,
  Medium = 2,
  Hard = 3
}
const AIQuestionCreated = () => {
  const navigate = useNavigate();
  const matches = useMatches();
  const breadcrumbs = matches.some((value: any) => value.handle?.crumbName === "default");

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const [modeEdit, setModeEdit] = useState(false);

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [lengthQuestion, setLengthQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [desciption, setDesciption] = useState("");
  const [number_question, setNumberQuestion] = useState(5);
  const [level, setLevel] = useState<EQuestionLevel>(EQuestionLevel.Easy);
  const [qtype, setQtype] = useState<EQType>(EQType.MultipleChoice);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("Tạo câu hỏi thành công");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((q) => {
        if (q.id === index) {
          return { ...q, correctAnswer: parseInt(event.target.value) };
        } else {
          return q;
        }
      });
    });
  };
  const handleDelete = (index: number) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.filter((q) => q.id !== index);
    });
  };
  const handleGenerate = async () => {
    setLoading(true);
    setQuestions([]);
    await createQuestionByAI(topic, desciption, qtype, number_question, level)
      .then((data: IFormatQuestion) => {
        if (data) {
          setLoading(false);
          setQuestions(data.questions);
          setLengthQuestion(data.questions.length);
          setOpenSnackbarAlert(true);
          setAlertContent("Tạo câu hỏi thành công");
          setAlertType(AlertType.Success);
        }
      })
      .catch((err) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Tạo câu hỏi thất bại, hãy thử lại lần nữa");
        setAlertType(AlertType.Error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleButtonClick = () => {
    setModeEdit(!modeEdit);
  };

  return (
    <Grid className={classes.root}>
      {breadcrumbs && <Header ref={headerRef} />}
      <Container style={{ marginTop: `${headerHeight}px` }} className={classes.container}>
        <Box className={classes.tabWrapper}>
          {breadcrumbs ? (
            <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
              <span onClick={() => navigate(routes.lecturer.course.management)}>
                Quản lý khoá học
              </span>{" "}
              {"> "}
              <span
                onClick={() =>
                  navigate(routes.lecturer.course.information.replace(":courseId", "1"))
                }
              >
                CS202 - Nhập môn lập trình
              </span>{" "}
              {"> "}
              <span onClick={() => navigate(routes.lecturer.course.assignment)}>
                Xem bài tập
              </span>{" "}
              {"> "}
              <span onClick={() => navigate(routes.lecturer.exam.create)}>
                Tạo bài kiểm tra
              </span>{" "}
              {"> "}
              <span>Tạo câu hỏi</span>
            </ParagraphBody>
          ) : (
            <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
              {matches.map((value: any, i) => {
                if (value.handle === undefined) return null;
                return (
                  <span
                    onClick={() => {
                      if (value.handle?.state)
                        navigate(value.pathname, { state: value.handle?.state });
                      else navigate(value.pathname);
                    }}
                  >
                    {i !== matches.length - 1
                      ? `${value.handle?.crumbName} > `
                      : `${value.handle?.crumbName}`}
                  </span>
                );
              })}
            </ParagraphBody>
          )}
        </Box>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={6}>
            <Box component='form' className={classes.formBody} autoComplete='off'>
              <Heading1 fontWeight={"500"}>Thêm câu hỏi </Heading1>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle>Danh mục</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Select value={1} fullWidth={true} size='small' required>
                    <MenuItem value={1}>Ten</MenuItem>
                    <MenuItem value={2}>Twenty</MenuItem>
                    <MenuItem value={3}>Thirty</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Chủ đề</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <InputTextField
                    onChange={(e: any) => setTopic(e.target.value)}
                    value={topic}
                    placeholder='Nhập chủ đề'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Mô tả</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Textarea
                    onChange={(e: any) => setDesciption(e.target.value)}
                    value={desciption}
                    placeholder='Nhập mô tả'
                    minRows={6}
                    maxRows={6}
                    size='lg'
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Loại câu hỏi</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Select
                    value={qtype}
                    onChange={(e: any) => setQtype(e.target.value)}
                    fullWidth={true}
                    size='small'
                    required
                  >
                    <MenuItem value={EQType.Essay}>Tự luận</MenuItem>
                    <MenuItem value={EQType.MultipleChoice}>Trắc nghiệm</MenuItem>
                    <MenuItem value={EQType.ShortAnswer}>Trả lời ngắn</MenuItem>
                    <MenuItem value={EQType.TrueFalse}>Đúng sai</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Số lượng câu hỏi</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <InputTextField
                    type='number'
                    value={number_question}
                    onChange={(e: any) => {
                      if (e.target.value < 1) {
                        setNumberQuestion(1);
                      }
                      setNumberQuestion(e.target.value);
                    }}
                    placeholder='Nhập số lượng câu hỏi'
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Độ khó</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Select
                    value={level}
                    onChange={(e: any) => setLevel(e.target.value)}
                    fullWidth={true}
                    size='small'
                    required
                  >
                    <MenuItem value={EQuestionLevel.Easy}>Dễ</MenuItem>
                    <MenuItem value={EQuestionLevel.Medium}>Trung bình</MenuItem>
                    <MenuItem value={EQuestionLevel.Hard}>Khó</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <Button onClick={handleGenerate} btnType={BtnType.Primary}>
                Tạo câu hỏi
              </Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className={classes.listQuestion}>
              {questions?.length !== 0 && (
                <Button btnType={BtnType.Primary} onClick={handleButtonClick}>
                  {modeEdit ? "Lưu" : "Chỉnh sửa"}
                </Button>
              )}
              {questions?.length === 0 && (
                <CircularProgress className={loading ? classes.loading : classes.none} />
              )}
              {questions &&
                questions.map((value: IQuestion, index) => {
                  return (
                    <Box className={classes.questionCard} key={index}>
                      <Heading6 fontWeight={"500"}>
                        {index + 1}/{lengthQuestion}
                      </Heading6>
                      <Heading4
                        className={modeEdit ? classes.questionEdit : classes.question}
                        fontWeight={"600"}
                        contentEditable={modeEdit}
                      >
                        {value.question}
                      </Heading4>
                      <Box className={classes.answer}>
                        <RadioGroup
                          aria-labelledby='demo-radio-buttons-group-label'
                          defaultValue='female'
                          name='radio-buttons-group'
                          value={value.correctAnswer}
                          onChange={(event) => handleChange(event, value.id)}
                        >
                          {value.answers &&
                            value.answers.map((answer, index) => {
                              return (
                                <Box className={classes.answerItem} key={index}>
                                  {value.correctAnswer ? (
                                    <>
                                      <FormControlLabel
                                        value={index}
                                        control={modeEdit ? <Radio /> : <></>}
                                        label={String.fromCharCode(65 + index)}
                                        labelPlacement='start'
                                        className={classes.radio}
                                      />
                                      {value.correctAnswer === index + 1 && (
                                        <ParagraphBody
                                          className={
                                            modeEdit
                                              ? classes.answerContentEdit
                                              : classes.answerContent
                                          }
                                          contentEditable={modeEdit}
                                          colorname='--green-500'
                                        >
                                          {answer.content}
                                        </ParagraphBody>
                                      )}
                                      {value.correctAnswer !== index + 1 && (
                                        <ParagraphBody
                                          className={
                                            modeEdit
                                              ? classes.answerContentEdit
                                              : classes.answerContent
                                          }
                                          contentEditable={modeEdit}
                                        >
                                          {answer.content}
                                        </ParagraphBody>
                                      )}
                                    </>
                                  ) : (
                                    <ParagraphBody
                                      className={
                                        modeEdit ? classes.answerContentEdit : classes.answerContent
                                      }
                                      contentEditable={modeEdit}
                                    >
                                      {answer.content}
                                    </ParagraphBody>
                                  )}
                                </Box>
                              );
                            })}
                        </RadioGroup>
                      </Box>
                      <Box className={modeEdit ? classes.btnContainer : classes.none}>
                        <IconButton
                          className={classes.deleteBtn}
                          onClick={() => handleDelete(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          </Grid>
          <SnackbarAlert
            open={openSnackbarAlert}
            setOpen={setOpenSnackbarAlert}
            type={alertType}
            content={alertContent}
          />
        </Grid>
      </Container>
    </Grid>
  );
};

export default AIQuestionCreated;
