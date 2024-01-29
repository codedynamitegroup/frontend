import { Box, Container, Grid } from "@mui/material";
import Header from "components/Header";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import InputTextField from "components/common/inputs/InputTextField";
import TextTitle from "components/text/TextTitle";
import { Textarea } from "@mui/joy";
import TextEditor from "components/editor/TextEditor";
import { useState } from "react";

interface Props {}

const CodeQuestionCreated = (props: Props) => {
  const [problemStatement, setProblemStatement] = useState<string>("Tính tổng 2 số");
  const [inputFormat, setInputFormat] = useState<string>(
    "Gồm 2 số nguyên a và b cách nhau bởi dấu cách, được nhập từ bàn phím"
  );
  const [outputFormat, setOutputFormat] = useState<string>(
    "Là một số nguyên cho biết tổng của a và b"
  );
  const [contraints, setContraints] = useState<string>("a và b là số nguyên");
  const [questionName, setQuestionName] = useState<string>("Tổng 2 số");

  return (
    <Grid className={classes.root}>
      <Header />
      <Container className={classes.container}>
        <Box className={classes.tabWrapper}>
          <ParagraphBody colorName='--gray-50' fontWeight={"600"}>
            <span>Quản lý câu hỏi code</span> {">"} <span>Tạo câu hỏi</span>
          </ParagraphBody>
        </Box>
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Heading1 fontWeight={"500"}>Tạo câu hỏi code</Heading1>
          <InputTextField title='Tên câu hỏi' type='text' value={questionName} />
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Mô tả câu hỏi</TextTitle>
            </Grid>
            <Grid item xs={9}>
              <Textarea
                defaultValue='Mô tả bài toán'
                sx={{ backgroundColor: "white" }}
                minRows={3}
                maxRows={3}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Phát biểu bài toán</TextTitle>
            </Grid>
            <Grid item xs={9}>
              <TextEditor value={problemStatement} onChange={setProblemStatement} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Định dạng đầu vào</TextTitle>
            </Grid>
            <Grid item xs={9}>
              <TextEditor value={inputFormat} onChange={setInputFormat} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Ràng buộc</TextTitle>
            </Grid>
            <Grid item xs={9}>
              <TextEditor value={contraints} onChange={setContraints} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Định dạng đầu ra</TextTitle>
            </Grid>
            <Grid item xs={9}>
              <TextEditor value={outputFormat} onChange={setOutputFormat} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Grid>
  );
};

export default CodeQuestionCreated;
