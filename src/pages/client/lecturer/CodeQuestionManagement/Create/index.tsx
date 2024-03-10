import { Box, Container, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import InputTextField from "components/common/inputs/InputTextField";
import TextTitle from "components/text/TextTitle";
import TextEditor from "components/editor/TextEditor";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button, { BtnType } from "components/common/buttons/Button";
import SidebarLecturer from "components/common/sidebars/SidebarLecturer";
import { routes } from "routes/routes";

interface Props {}

const LecturerCodeQuestionCreation = memo((props: Props) => {
  const [problemDescription, setProblemDescription] = useState<string>("Mô tả bài toán");
  const [problemStatement, setProblemStatement] = useState<string>("Tính tổng 2 số");
  const [inputFormat, setInputFormat] = useState<string>(
    "Gồm 2 số nguyên a và b cách nhau bởi dấu cách, được nhập từ bàn phím"
  );
  const [outputFormat, setOutputFormat] = useState<string>(
    "Là một số nguyên cho biết tổng của a và b"
  );
  const [contraints, setContraints] = useState<string>("a và b là số nguyên");
  const [questionName] = useState<string>("Tổng 2 số");
  const navigate = useNavigate();

  return (
    <>
      <Box id={classes.codequestionCreationBody}>
        <Box className={classes.tabWrapper}>
          <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
            <span onClick={() => navigate(routes.lecturer.code_question.management)}>
              Quản lý câu hỏi code
            </span>{" "}
            {">"}{" "}
            <span onClick={() => navigate(routes.lecturer.code_question.create)}>Tạo câu hỏi</span>
          </ParagraphBody>
        </Box>
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Heading1 fontWeight={"500"}>Tạo câu hỏi code</Heading1>
          <InputTextField title='Tên câu hỏi' type='text' value={questionName} />
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Mô tả bài toán</TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={problemDescription} onChange={setProblemDescription} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Phát biểu bài toán</TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={problemStatement} onChange={setProblemStatement} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Định dạng đầu vào</TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={inputFormat} onChange={setInputFormat} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Ràng buộc</TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={contraints} onChange={setContraints} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Định dạng đầu ra</TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={outputFormat} onChange={setOutputFormat} />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={classes.stickyFooterContainer}>
        <Box className={classes.phantom} />
        <Box className={classes.stickyFooterItem}>
          <Button btnType={BtnType.Primary}>Tạo câu hỏi</Button>
        </Box>
      </Box>
    </>
  );
});

export default LecturerCodeQuestionCreation;
