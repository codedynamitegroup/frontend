import {
  Box,
  Container,
  Grid,
  Stack,
  Select,
  MenuItem,
  Checkbox,
  Collapse,
  createTheme,
  ListItemButton,
  Divider
} from "@mui/material";
import Header from "components/Header";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import InputTextField from "components/common/inputs/InputTextField";
import TextTitle from "components/text/TextTitle";
import { Textarea } from "@mui/joy";
import TextEditor from "components/editor/TextEditor";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/joy/Button";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AnswerEditor from "components/editor/AnswerEditor";
import AddIcon from "@mui/icons-material/Add";
import qtype from "utils/constant/Qtype";

interface Props {
  qtype: String;
}

const QuestionCreated = (props: Props) => {
  const [answerOpen, setAnswerOpen] = useState(true);
  const theme = createTheme();
  const vi_name = useMemo(
    () => Object.values(qtype).find((value) => value.code === props.qtype)?.vi_name,
    [props.qtype]
  );

  return (
    <Grid className={classes.root}>
      <Header />
      <Container className={classes.container}>
        <Box className={classes.tabWrapper}>...&gt;...</Box>
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Heading1 fontWeight={"500"}>Thêm câu hỏi {vi_name}</Heading1>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={12} md={3}>
              <TextTitle>Category</TextTitle>
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
            <Grid item xs={12} md={9}>
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
            <Grid item xs={12} md={9}>
              <TextEditor placeholder='Nhập nhận xét chung ...' value={""} />
            </Grid>
          </Grid>

          {props.qtype === qtype.essay.code && (
            <Grid container spacing={1} columns={12}>
              <Grid item xs={12} md={3}>
                <TextTitle>Tiêu chí đánh giá </TextTitle>
              </Grid>
              <Grid item xs={12} md={9}>
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
                  <TextTitle>Nhận xét trả lời true</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextEditor placeholder='Nhập nhận xét ...' value={""} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextTitle>Nhận xét trả lời false</TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
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
          <Grid container justifyContent={"center"}>
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
          </Grid>
        </Box>
      </Container>
    </Grid>
  );
};

export default QuestionCreated;
