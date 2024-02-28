import React from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "components/Header";
import { routes } from "routes/routes";
import { useNavigate } from "react-router-dom";
import ParagraphBody from "components/text/ParagraphBody";
import { Divider, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import MDEditor from "@uiw/react-md-editor";
import ArrowBack from "@mui/icons-material/ArrowBack";

export default function ShareSolution() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("**Hello world!!!**");

  return (
    <Grid className={classes.root}>
      <Header />
      <Container className={classes.container}>
        <Box className={classes.tabWrapper}>
          <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
            <ArrowBack />
            <span>Quay lại</span>
          </ParagraphBody>
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
            <Button variant='contained' className={classes.cancelBtn}>
              Hủy
            </Button>
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
