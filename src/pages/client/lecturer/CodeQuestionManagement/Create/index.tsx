import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import InputTextField from "components/common/inputs/InputTextField";
import TextTitle from "components/text/TextTitle";
import TextEditor from "components/editor/TextEditor";
import { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button, { BtnType } from "components/common/buttons/Button";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import { QuestionEntity } from "models/courseService/entity/QuestionEntity";
import { QuestionService } from "services/courseService/QuestionService";

interface Props {}

const LecturerCodeQuestionCreation = memo((props: Props) => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<QuestionEntity>({
    questionId: "",
    organizationId: "",
    difficulty: "",
    name: "",
    questionText: "",
    generalFeedback: "",
    defaultMark: 0,
    createdAt: "",
    updatedAt: "",
    message: ""
  });

  const handleGetQuestionById = async (id: string) => {
    try {
      const response = await QuestionService.getQuestionById(id);
      setQuestion(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await handleGetQuestionById(questionId ?? "");
    };
    fetchInitialData();
  }, []);

  const { t } = useTranslation();
  const [problemDescription, setProblemDescription] = useState<string>("Mô tả bài toán");
  const [problemStatement, setProblemStatement] = useState<string>("Tính tổnfsdfdsfg 2 số");
  const [inputFormat, setInputFormat] = useState<string>("");
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
          <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
            <span
              onClick={() => navigate(routes.lecturer.code_question.management)}
              translation-key='code_management_title'
            >
              {t("code_management_title")}
            </span>{" "}
            {">"}{" "}
            <span
              onClick={() => navigate(routes.lecturer.code_question.create)}
              translation-key='code_management_create_new_title'
            >
              {t("code_management_create_new_title")}
            </span>
          </ParagraphBody>
        </Box>
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Heading1 fontWeight={"500"}>{t("code_management_create_new_title")}</Heading1>
          <InputTextField
            translation-key='code_management_create_new_title'
            title={t("code_management_create_new_title")}
            type='text'
            value={questionName}
          />
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle translation-key='code_management_create_description'>
                {t("code_management_create_description")}
              </TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={problemDescription} onChange={setProblemDescription} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3} translation-key='code_management_create_statement'>
              <TextTitle>{t("code_management_create_statement")}</TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={problemStatement} onChange={setProblemStatement} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle translation-key='code_management_create_input_format'>
                {t("code_management_create_input_format")}sfsaf
              </TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={question.name} onChange={setInputFormat} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle translation-key='code_management_create_constraint'>
                {t("code_management_create_constraint")}
              </TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor value={contraints} onChange={setContraints} />
            </Grid>
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle translation-key='code_management_create_output_format'>
                {t("code_management_create_output_format")}
              </TextTitle>
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
          <Button btnType={BtnType.Primary} translation-key='exam_management_create_new_question'>
            {t("exam_management_create_new_question")}
          </Button>
        </Box>
      </Box>
    </>
  );
});

export default LecturerCodeQuestionCreation;
