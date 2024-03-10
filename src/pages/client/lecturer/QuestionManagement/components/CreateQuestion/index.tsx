import {
  Box,
  Checkbox,
  Collapse,
  Container,
  Divider,
  Grid,
  ListItemButton,
  MenuItem,
  Select,
  Stack
} from "@mui/material";
import Header from "components/Header";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
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

interface Props {
  qtype: String;
}

const QuestionCreated = (props: Props) => {
  const [answerOpen, setAnswerOpen] = useState(true);
  const vi_name = useMemo(
    () => Object.values(qtype).find((value) => value.code === props.qtype)?.vi_name,
    [props.qtype]
  );
  const navigate = useNavigate();
  const matches = useMatches();
  const breadcrumbs = matches.some((value: any) => value.handle?.crumbName === "default");

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

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
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Heading1 fontWeight={"500"}>Thêm câu hỏi {vi_name}</Heading1>
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
          </Grid>

          <InputTextField title='Tên câu hỏi *' type='text' placeholder='Tên câu hỏi' required />

          <Grid container spacing={1} columns={12}>
            <Grid item xs={12} md={3}>
              <TextTitle>Mô tả câu hỏi *</TextTitle>
            </Grid>
            <Grid item xs={12} md={9} className={classes.textEditor}>
              <TextEditor placeholder='Nhập mô tả ...' value={""} required />
            </Grid>
          </Grid>

          <InputTextField
            title='Điểm mặc định *'
            type='text'
            placeholder='Điểm mặc định'
            required
          />

          <Grid container spacing={1} columns={12}>
            <Grid item xs={12} md={3}>
              <TextTitle>Nhận xét chung</TextTitle>
            </Grid>
            <Grid item xs={12} md={9} className={classes.textEditor}>
              <TextEditor placeholder='Nhập nhận xét chung ...' value={""} />
            </Grid>
          </Grid>

          {props.qtype === qtype.essay.code && (
            <Grid container spacing={1} columns={12}>
              <Grid item xs={12} md={3}>
                <TextTitle>Tiêu chí đánh giá </TextTitle>
              </Grid>
              <Grid item xs={12} md={9} className={classes.textEditor}>
                <TextEditor min placeholder='Nhập tiêu chí đánh giá ...' value={""} />
              </Grid>
            </Grid>
          )}
          {props.qtype === qtype.true_false.code && (
            <div>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle>Đáp án đúng *</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Select defaultValue={0} size='small' required>
                    <MenuItem value={0}>False</MenuItem>
                    <MenuItem value={1}>True</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Nhận xét câu trả lời đúng</TextTitle>
                </Grid>
                <Grid item xs={12} md={9} className={classes.textEditor}>
                  <TextEditor placeholder='Nhập nhận xét ...' value={""} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Nhận xét câu trả lời sai</TextTitle>
                </Grid>
                <Grid item xs={12} md={9} className={classes.textEditor}>
                  <TextEditor placeholder='Nhập nhận xét ...' value={""} />
                </Grid>
              </Grid>
            </div>
          )}

          {props.qtype === qtype.multiple_choice.code && (
            <Grid container spacing={1} columns={12}>
              <Grid item xs={12} md={3}>
                <TextTitle>Một hoặc nhiều câu trả lời đúng</TextTitle>
              </Grid>
              <Grid item xs={12} md={9}>
                <Select defaultValue={1} fullWidth={true} size='small'>
                  <MenuItem value={1}>Một câu trả lời đúng</MenuItem>
                  <MenuItem value={2}>Nhiều câu trả lời đúng</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={3}>
                <TextTitle>Xáo trộn đáp án</TextTitle>
              </Grid>
              <Checkbox defaultChecked />
            </Grid>
          )}
          {props.qtype === qtype.short_answer.code && (
            <Grid container spacing={1} columns={12}>
              <Grid item xs={3}>
                <TextTitle>Phân biệt hoa thường</TextTitle>
              </Grid>
              <Checkbox defaultChecked />
            </Grid>
          )}
          {(props.qtype === qtype.short_answer.code ||
            props.qtype === qtype.multiple_choice.code) && (
            <div>
              <ListItemButton onClick={() => setAnswerOpen(!answerOpen)} sx={{ paddingX: 0 }}>
                <Grid container alignItems={"center"} columns={12}>
                  <Grid item xs={12} md={3}>
                    <Heading2 sx={{ display: "inline" }}>Câu trả lời</Heading2>
                  </Grid>
                  <Grid item xs={12} md={9} display={"flex"} alignItems={"center"}>
                    {answerOpen ? <ExpandLess /> : <ExpandMore />}
                  </Grid>
                </Grid>
              </ListItemButton>

              <Collapse in={answerOpen} timeout='auto' unmountOnExit>
                <Stack spacing={{ xs: 4 }} useFlexGap>
                  <Divider />
                  <AnswerEditor answerNumber={1} qtype={props.qtype} />
                  <AnswerEditor answerNumber={2} qtype={props.qtype} />
                  <AnswerEditor answerNumber={3} qtype={props.qtype} />
                  <Grid container justifyContent={"center"}>
                    <Button>
                      <AddIcon />
                    </Button>
                  </Grid>

                  <Divider />
                </Stack>
              </Collapse>
            </div>
          )}
          {/* <Grid container justifyContent={"center"}>
            <Button
              color='primary'
              type='submit'
              variant='outlined'
              sx={{
                minWidth: "32%"
              }}
            >
              Thêm câu hỏi
            </Button>
          </Grid> */}
          <Box className={classes.stickyFooterContainer}>
            <Box className={classes.phantom} />
            <Box className={classes.stickyFooterItem}>
              <Button btnType={BtnType.Primary}>Tạo câu hỏi</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  );
};

export default QuestionCreated;
