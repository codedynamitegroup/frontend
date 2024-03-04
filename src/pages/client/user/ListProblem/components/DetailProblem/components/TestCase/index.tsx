import React from "react";
import classes from "./styles.module.scss";
import { Box, Container, TextField } from "@mui/material";
import Heading5 from "components/text/Heading5";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
export default function TestCase() {
  return (
    <Box id={classes.root}>
      <Container>
        <Box className={classes.testCase}>
          <ParagraphExtraSmall>s =</ParagraphExtraSmall>
          <TextField
            fullWidth
            id='outlined-basic'
            variant='outlined'
            value={"[1,2,3]"}
            size='small'
            className={classes.input}
          />
        </Box>

        <Box className={classes.testCase}>
          <ParagraphExtraSmall>s =</ParagraphExtraSmall>
          <TextField
            fullWidth
            id='outlined-basic'
            variant='outlined'
            size='small'
            value={"6"}
            className={classes.input}
          />
        </Box>
      </Container>
    </Box>
  );
}
