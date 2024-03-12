import React from "react";
import classes from "./styles.module.scss";
import { Box, Container, TextField } from "@mui/material";
import Heading5 from "components/text/Heading5";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import Heading3 from "components/text/Heading3";
import ParagraphSmall from "components/text/ParagraphSmall";
export default function Result() {
  return (
    <Box id={classes.root}>
      <Container className={classes.container}>
        <Box className={classes.title}>
          <Heading3 colorname='--green-600'>Thành công</Heading3>
          <ParagraphSmall colorname='--gray-500'>Thời gian: 12ms</ParagraphSmall>
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
