import React from "react";
import classes from "./styles.module.scss";
import { Box, Container, TextField } from "@mui/material";
import Heading5 from "components/text/Heading5";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import Heading3 from "components/text/Heading3";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useTranslation } from "react-i18next";
export default function Result() {
  const { t } = useTranslation();
  return (
    <Box id={classes.root}>
      <Container className={classes.container}>
        <Box className={classes.title}>
          <Heading3 colorname='--green-600' translation-key='detail_problem_test_case_success'>
            {t("detail_problem_test_case_success")}
          </Heading3>
          <ParagraphSmall colorname='--gray-500' translation-key='detail_problem_test_case_runtime'>
            {t("detail_problem_test_case_runtime", { runtime: 12 })}
          </ParagraphSmall>
        </Box>
        <Box className={classes.result}>
          <ParagraphExtraSmall>Đầu vào: </ParagraphExtraSmall>
          <TextField
            fullWidth
            id='outlined-basic'
            variant='outlined'
            size='small'
            className={classes.input}
            value={"s = [1,2,3]"}
          />
          <TextField
            fullWidth
            id='outlined-basic'
            variant='outlined'
            size='small'
            className={classes.input}
            value={"p = [4,6,3]"}
          />
        </Box>

        <Box className={classes.result}>
          <ParagraphExtraSmall>Đầu ra: </ParagraphExtraSmall>
          <TextField
            fullWidth
            id='outlined-basic'
            variant='outlined'
            size='small'
            className={classes.input}
            value={"[5,6,7,8,1]"}
          />
        </Box>

        <Box className={classes.result}>
          <ParagraphExtraSmall>Kết quả: </ParagraphExtraSmall>
          <TextField
            fullWidth
            id='outlined-basic'
            variant='outlined'
            size='small'
            className={classes.input}
            value={"[5,6,7,8,1]"}
          />
        </Box>
      </Container>
    </Box>
  );
}
