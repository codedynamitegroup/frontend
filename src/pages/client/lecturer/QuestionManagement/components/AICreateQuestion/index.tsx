import {
  Box,
  Checkbox,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  ListItemButton,
  MenuItem,
  Select,
  Stack
} from "@mui/material";
import Header from "components/Header";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { useMemo, useRef, useState } from "react";
import { useMatches, useNavigate } from "react-router-dom";
import classes from "./styles.module.scss";
// import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Button, { BtnType } from "components/common/buttons/Button";
import AnswerEditor from "components/editor/AnswerEditor";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import useBoxDimensions from "hooks/useBoxDimensions";
import { TextareaAutosize } from "@mui/base";
import TextArea from "@uiw/react-md-editor/lib/components/TextArea/index.nohighlight";
import { Textarea } from "@mui/joy";
import Heading6 from "components/text/Heading6";
import Heading5 from "components/text/Heading5";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Edit from "@mui/icons-material/Edit";
import Heading4 from "components/text/Heading4";
import Delete from "@mui/icons-material/Delete";
import run from "./generate";
import CircularProgress from "@mui/material/CircularProgress";

const AIQuestionCreated = () => {
  const [answerOpen, setAnswerOpen] = useState(true);
  const navigate = useNavigate();
  const matches = useMatches();
  const breadcrumbs = matches.some((value: any) => value.handle?.crumbName === "default");
  console.log(matches);
  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const [modeEdit, setModeEdit] = useState(false);

  const multiple_choice = [
    {
      id: 1,
      question: "Ai là người đặt cau hỏi này ?",
      answers: [
        { id: 1, content: "Dương Chí Thông" },
        { id: 2, content: "Nguyễn Quốc Tuấn" },
        { id: 3, content: "Trương Gia Tiến" }
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Trương Gia Tiến có dâm không ?",
      answers: [
        { id: 1, content: "Có" },
        { id: 2, content: "Không" },
        { id: 3, content: "Biến thái" }
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Ai là nhà lãnh đạo trong team bạn?",
      answers: [
        { id: 1, content: "Đặng Ngọc Tiến" },
        { id: 2, content: "Nguyễn Quốc Tuấn" },
        { id: 3, content: "Trương Gia Tiến" }
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Con cặc lodi Tuấn là ai",
      answers: [
        { id: 1, content: "Dương Chí Thông" },
        { id: 2, content: "Nguyễn Quốc Tuấn" },
        { id: 3, content: "Trương Gia Tiến" }
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "Sơn Tùng M-TP tên thật là gì?",
      answers: [
        { id: 1, content: "Nguyễn Thanh Tùng" },
        { id: 2, content: "Trịnh Trần Phương Tuấn" },
        { id: 3, content: "Nguyễn Thanh Hoàng" }
      ],
      correctAnswer: 0
    }
  ];

  const [question, setQuestion] = useState([] as any[]);
  const [lengthQuestion, setLengthQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [number_question, setNumberQuestion] = useState(5);
  const [level, setLevel] = useState(10);
  const [qtype, setQtype] = useState(20);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setQuestion((prevQuestions) => {
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
    setQuestion((prevQuestions) => {
      return prevQuestions.filter((q) => q.id !== index);
    });
  };
  const handleGenerate = async () => {
    setLoading(true);
    setQuestion([]);
    const data = await run(topic, qtype, number_question, level);
    if (data) {
      setLoading(false);
      setQuestion(data.questions);
      setLengthQuestion(data.length);
    }
  };
  console.log(level);

  const handleButtonClick = () => {
    setModeEdit(!modeEdit);
  };

  return (
    <Grid className={classes.root}>
      {breadcrumbs && <Header ref={headerRef} />}
      <Container style={{ marginTop: `${headerHeight}px` }} className={classes.container}>
        <Box className={classes.tabWrapper}>
          {breadcrumbs ? (
            <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
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
            <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
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
          <Grid xs={6}>
            <Box component='form' className={classes.formBody} autoComplete='off'>
              <Heading1 fontWeight={"500"}>Thêm câu hỏi </Heading1>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle>Danh mục</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Select defaultValue={10} fullWidth={true} size='small' required>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Chủ đề</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Textarea
                    onChange={(e: any) => setTopic(e.target.value)}
                    value={topic}
                    placeholder='Nhập chủ đề'
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
                    <MenuItem value={10}>Tự luận</MenuItem>
                    <MenuItem value={20}>Trắc nghiệm</MenuItem>
                    <MenuItem value={30}>Trả lời ngắn</MenuItem>
                    <MenuItem value={40}>Đúng sai</MenuItem>
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
                    <MenuItem value={10}>Dễ</MenuItem>
                    <MenuItem value={20}>Trung bình</MenuItem>
                    <MenuItem value={30}>Khó</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <Button onClick={handleGenerate} btnType={BtnType.Primary}>
                Tạo câu hỏi
              </Button>

              {/* <Box className={classes.stickyFooterContainer}>
            <Box className={classes.phantom} />
            <Box className={classes.stickyFooterItem}>
              <Button btnType={BtnType.Primary}>Tạo câu hỏi</Button>
            </Box>
          </Box> */}
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box className={classes.listQuestion}>
              {question.length != 0 && (
                <Button btnType={BtnType.Primary} onClick={handleButtonClick}>
                  {modeEdit ? "Lưu" : "Chỉnh sửa"}
                </Button>
              )}
              {question.length === 0 && (
                <CircularProgress className={loading ? classes.loading : classes.none} />
              )}{" "}
              {question &&
                question.map((value, index) => {
                  return (
                    <Box className={classes.questionCard}>
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
                            value.answers.map((answer: any, index: any) => {
                              return (
                                <Box className={classes.answerItem}>
                                  <FormControlLabel
                                    value={index}
                                    control={modeEdit ? <Radio /> : <></>}
                                    label={String.fromCharCode(65 + index)}
                                    labelPlacement='start'
                                    className={classes.radio}
                                  />

                                  {value.correctAnswer === index ? (
                                    <ParagraphBody
                                      className={
                                        modeEdit ? classes.answerContentEdit : classes.answerContent
                                      }
                                      contentEditable={modeEdit}
                                      colorName='--green-500'
                                    >
                                      {answer.content}
                                    </ParagraphBody>
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
        </Grid>
      </Container>
    </Grid>
  );
};

export default AIQuestionCreated;
