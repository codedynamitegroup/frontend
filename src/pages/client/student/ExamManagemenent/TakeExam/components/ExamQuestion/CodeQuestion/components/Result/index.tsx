import { useEffect, useState } from "react";
import classes from "./styles.module.scss";
import { Box, Skeleton, Stack, TextField } from "@mui/material";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import Heading3 from "components/text/Heading3";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks";
import CircularProgress from "@mui/material/CircularProgress";

import { decodeBase64, removeNewLine } from "utils/base64";
import ParagraphBody from "components/text/ParagraphBody";
import { Judge0ResponseEntity } from "models/codeAssessmentService/entity/Judge0ResponseEntity";
import { Chip } from "@mui/joy";

interface PropsData {
  questionId: string;
  loading: boolean;
}

export default function Result(props: PropsData) {
  const { questionId, loading } = props;
  const { t } = useTranslation();
  const [focusTestCase, setFocusTestCase] = useState(0);

  const { result = [], error = null } = useAppSelector(
    (state) => state.takeExamCodeQuestion?.codeQuestion?.[questionId] || {}
  );

  useEffect(() => {
    result.forEach((value: Judge0ResponseEntity) =>
      console.log(decodeBase64(removeNewLine(value.compile_output ?? "")))
    );
  }, [error, result]);

  return (
    <Box id={classes.container}>
      {loading ? (
        <>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Skeleton variant='rounded' width={70} height={34} />
            <Skeleton variant='rounded' width={70} height={34} />
            <Skeleton variant='rounded' width={70} height={34} />
            <Skeleton variant='rounded' width={70} height={34} />
          </Stack>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Skeleton variant='text' width={160} height={30} />
            <Skeleton variant='text' width={90} height={18} />
          </Stack>
          <Skeleton variant='text' height={170} />
          <Skeleton variant='text' height={100} />
          <Skeleton variant='text' height={100} />
        </>
      ) : (
        <>
          {error !== null && <ParagraphBody>{error}</ParagraphBody>}
          {!error && (
            <>
              {result.length < 1 && loading === false && (
                <ParagraphBody>No result found</ParagraphBody>
              )}
              {result.length > 0 && loading === false && (
                <>
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    {result.map((_, index) => (
                      <Chip
                        size='lg'
                        key={index}
                        color='neutral'
                        variant={focusTestCase === index ? "solid" : "soft"}
                        onClick={() => setFocusTestCase(index)}
                        sx={{
                          borderRadius: "8px",
                          padding: "5px 10px"
                        }}
                      >
                        {`Case ${index + 1}`}
                      </Chip>
                    ))}
                  </Stack>
                  <Box className={classes.title}>
                    <Heading3
                      colorname={
                        result?.[focusTestCase]?.status?.description === "Accepted"
                          ? "--green-600"
                          : "--red-error"
                      }
                    >
                      {result?.[focusTestCase].status?.description ?? "No description"}
                    </Heading3>
                    {result?.[focusTestCase].time && (
                      <ParagraphSmall
                        colorname='--gray-500'
                        translation-key='detail_problem_test_case_runtime'
                      >
                        {t("detail_problem_test_case_runtime", {
                          runtime: result[focusTestCase].time
                        })}
                      </ParagraphSmall>
                    )}
                  </Box>

                  {result[focusTestCase].message && (
                    <Box className={classes.result} sx={styles.errorBox}>
                      <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                        Message
                      </ParagraphBody>
                      <TextField
                        multiline
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true
                        }}
                        fullWidth
                        size='small'
                        className={classes.input}
                        value={decodeBase64(removeNewLine(result[focusTestCase].message ?? ""))}
                        variant='standard'
                        inputProps={{ style: { color: "var(--red-text)" } }}
                      />
                    </Box>
                  )}
                  {result[focusTestCase].stderr && (
                    <Box className={classes.result} sx={styles.errorBox}>
                      <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                        Stderr
                      </ParagraphBody>
                      <TextField
                        multiline
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true
                        }}
                        fullWidth
                        size='small'
                        className={classes.input}
                        value={decodeBase64(removeNewLine(result[focusTestCase].stderr ?? ""))}
                        variant='standard'
                        inputProps={{ style: { color: "var(--red-text)" } }}
                      />
                    </Box>
                  )}
                  {result[focusTestCase].compile_output && (
                    <Box className={classes.result} sx={styles.errorBox}>
                      <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                        Complie output
                      </ParagraphBody>
                      <TextField
                        multiline
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true
                        }}
                        fullWidth
                        size='small'
                        className={classes.input}
                        value={decodeBase64(
                          removeNewLine(result[focusTestCase].compile_output ?? "")
                        )}
                        variant='standard'
                        inputProps={{ style: { color: "var(--red-text)" } }}
                      />
                    </Box>
                  )}

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
                      value={
                        result[focusTestCase].input_data !== null
                          ? result[focusTestCase].input_data
                          : ""
                      }
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
                        result[focusTestCase].output_data !== null
                          ? result[focusTestCase].output_data
                          : ""
                      }
                    />
                  </Box>
                  {result[focusTestCase].stdout !== null && (
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
                        value={decodeBase64(removeNewLine(result[focusTestCase].stdout ?? ""))}
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}

const styles = {
  errorBox: {
    backgroundColor: "var(--red-background)",
    borderRadius: 1,
    paddingX: 1
  }
};
