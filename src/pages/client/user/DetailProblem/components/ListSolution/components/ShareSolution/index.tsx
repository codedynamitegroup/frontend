import React, { useRef } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "components/Header";
import { routes } from "routes/routes";
import { useNavigate, useParams } from "react-router-dom";
import { Divider, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import MDEditor from "@uiw/react-md-editor";
import ArrowBack from "@mui/icons-material/ArrowBack";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";

export default function ShareSolution() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = React.useState("**Hello world!!!**");
  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const { problemId, courseId, lessonId } = useParams<{
    problemId: string;
    courseId: string;
    lessonId: string;
  }>();

  const handleBackButton = () => {
    if (problemId) navigate(routes.user.problem.detail.solution.replace(":problemId", problemId));
    else if (courseId && lessonId)
      navigate(
        routes.user.course_certificate.detail.lesson.solution
          .replace(":courseId", courseId)
          .replace(":lessonId", lessonId)
      );
  };
  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <Container
        className={classes.container}
        style={{
          marginTop: `${headerHeight}px`,
          height: `calc(100% - ${headerHeight}px)`
        }}
      >
        <Box className={classes.stickyBack} onClick={handleBackButton}>
          <Box className={classes.backButton}>
            <ArrowBack className={classes.backIcon} />
            <span translation-key='detail_problem_submission_detail_back'>
              {t("detail_problem_submission_detail_back")}
            </span>
          </Box>
        </Box>
        <Divider />
        <Box className={classes.content}>
          <TextField
            id='outlined-multiline-static'
            multiline
            rows={2}
            defaultValue=''
            variant='standard'
            InputProps={{
              disableUnderline: true,
              style: { fontSize: "20px" } // Thêm dòng này
            }}
            placeholder={t("detail_problem_discussion_share_solution_title")}
            translation-key='detail_problem_discussion_share_solution_title'
            fullWidth
            InputLabelProps={{
              shrink: false
            }}
            className={classes.titleInput}
          ></TextField>
          <Box className={classes.actionBtn}>
            <Button
              variant='contained'
              className={classes.postBtn}
              translation-key='detail_problem_discussion_share_solution_post'
            >
              {t("detail_problem_discussion_share_solution_post")}
            </Button>
          </Box>
          <Box data-color-mode='light'>
            <MDEditor
              value={value}
              onChange={(val) => {
                setValue(val!);
              }}
              className={classes.markdownEditor}
            />
          </Box>
        </Box>
      </Container>
    </Grid>
  );
}
