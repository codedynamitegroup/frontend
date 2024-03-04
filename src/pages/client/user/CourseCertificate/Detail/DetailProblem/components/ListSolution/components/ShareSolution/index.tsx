import React, { useRef } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "components/Header";
import { routes } from "routes/routes";
import { useNavigate } from "react-router-dom";
import { Divider, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import MDEditor from "@uiw/react-md-editor";
import ArrowBack from "@mui/icons-material/ArrowBack";
import useBoxDimensions from "hooks/useBoxDimensions";

export default function LessonShareSolution() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("**Hello world!!!**");
  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

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
        <Box
          className={classes.stickyBack}
          onClick={() =>
            navigate(
              routes.user.course_certificate.detail.lesson.solution.replace(":lessonId", "1")
            )
          }
        >
          <Box className={classes.backButton}>
            <ArrowBack className={classes.backIcon} />
            <span>Quay lại</span>
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
            placeholder='Tiêu đề'
            fullWidth
            InputLabelProps={{
              shrink: false
            }}
            className={classes.titleInput}
          ></TextField>
          <Box className={classes.actionBtn}>
            <Button variant='contained' className={classes.postBtn}>
              Đăng
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
