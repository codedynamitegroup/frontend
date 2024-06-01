import React, { useEffect } from "react";
import classes from "./styles.module.scss";
import { Box, Container, TextField } from "@mui/material";
import Heading5 from "components/text/Heading5";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import Heading3 from "components/text/Heading3";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "hooks";
import CircularProgress from "@mui/material/CircularProgress";

import { encode } from "punycode";
import { decodeBase64 } from "utils/base64";
export default function Result() {
  const { t } = useTranslation();
  const { result, loading } = useAppSelector((state) => state.executeResultData);
  const currentExecuteData = useAppSelector((state) => state.executeData);
  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <Box id={classes.root}>
      {loading === true && (
        <Container className={classes.container}>
          <CircularProgress />
        </Container>
      )}
      {result.status != null && loading === false && (
        <Container className={classes.container}>
          <Box className={classes.title}>
            <Heading3
              colorname={result.status.description === "Accepted" ? "--green-600" : "--red-error"}
            >
              {/* {t("detail_problem_test_case_success")} */}
              {result.status.description}
            </Heading3>
            {result.time && (
              <ParagraphSmall
                colorname='--gray-500'
                translation-key='detail_problem_test_case_runtime'
              >
                {t("detail_problem_test_case_runtime", { runtime: result.time })}
              </ParagraphSmall>
            )}
          </Box>

          <Box className={classes.result}>
            <ParagraphExtraSmall translation-key='detail_problem_input'>
              {t("detail_problem_input")}
              {": "}
            </ParagraphExtraSmall>
            <TextField
              multiline
              InputProps={{ readOnly: true }}
              fullWidth
              id='outlined-basic'
              variant='outlined'
              size='small'
              className={classes.input}
              value={currentExecuteData.stdin !== undefined ? currentExecuteData.stdin : ""}
            />
          </Box>

          <Box className={classes.result}>
            <ParagraphExtraSmall translation-key='detail_problem_output'>
              {t("detail_problem_output")}
              {": "}
            </ParagraphExtraSmall>
            <TextField
              multiline
              fullWidth
              InputProps={{ readOnly: true }}
              id='outlined-basic'
              variant='outlined'
              size='small'
              className={classes.input}
              value={
                currentExecuteData.expected_output !== undefined
                  ? currentExecuteData.expected_output
                  : ""
              }
            />
          </Box>
          {result.stdout && (
            <Box className={classes.result}>
              <ParagraphExtraSmall translation-key='detail_problem_actual_result'>
                {t("detail_problem_actual_result")}
                {": "}
              </ParagraphExtraSmall>
              <TextField
                multiline
                InputProps={{ readOnly: true }}
                fullWidth
                id='outlined-basic'
                variant='outlined'
                size='small'
                className={classes.input}
                value={decodeBase64(result.stdout)}
              />
            </Box>
          )}
          {result.message && (
            <Box className={classes.result}>
              <ParagraphExtraSmall>Message: {decodeBase64(result.message)}</ParagraphExtraSmall>
            </Box>
          )}
          {result.stderr && (
            <Box className={classes.result}>
              <ParagraphExtraSmall>Stderr: {decodeBase64(result.stderr)}</ParagraphExtraSmall>
            </Box>
          )}
          {result.compile_output && (
            <Box className={classes.result}>
              <ParagraphExtraSmall>
                Complie output: {decodeBase64(result.compile_output)}
              </ParagraphExtraSmall>
            </Box>
          )}
        </Container>
      )}
    </Box>
  );
}
