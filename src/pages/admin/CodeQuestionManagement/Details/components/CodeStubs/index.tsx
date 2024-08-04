import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField
} from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import classes from "./styles.module.scss";
import TextTitle from "components/text/TextTitle";
import { Textarea } from "@mui/joy";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/text/ParagraphBody";
import CodeEditor from "components/editor/CodeEditor";
import Heading5 from "components/text/Heading5";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import CodeConverterAI from "services/AIService/CodeConverterAI";
import JoyButton from "@mui/joy/Button";
import { ProgrammingLanguageAdminEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageAdminEntity";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { dispatch } from "d3";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { useDispatch } from "react-redux";
import { decodeBase64, encodeBase64, removeNewLine } from "utils/base64";
import { PlayArrow } from "@mui/icons-material";
import { ExecuteService } from "services/codeAssessmentService/ExecuteService";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";

type Props = {};

export interface ICodeConverterResponse {
  program_language: string;
  code_stub: string;
}
export interface ICodeConverterRequest {
  program_language: string;
}
type ResultValue = {
  message: string | null;
  stderr: string | null;
  compile_output: string | null;
  stdout: string | null;
};
type ProgrammingLanguageFormValue = {
  programmingLanguages: ProgrammingLanguageAdminEntity[];
};
const CodeQuestionCodeStubs = memo((props: Props) => {
  const { t } = useTranslation();
  const programmingLanguageMethod = useFormContext<ProgrammingLanguageFormValue>();
  const programmingLanguageFieldArray = useFieldArray({
    control: programmingLanguageMethod.control,
    name: "programmingLanguages",
    keyName: "plid"
  });
  const availableLanguage = programmingLanguageMethod.getValues("programmingLanguages");

  const selectedLanguageNames: ICodeConverterRequest[] = availableLanguage
    .filter((value) => value.choosen)
    .map((value) => ({ program_language: value.name }));
  const firstSelect = availableLanguage.findIndex((value) => value.choosen);
  const existSelect = firstSelect !== -1;

  const [selectedCodeStubLanguage, setSelectedCodeStubLanguage] = useState<number>(-1);
  const [codeStub, setCodeStub] = useState("");
  const [input, setInput] = useState("");
  const [executeLoading, setExecuteLoading] = useState(false);
  const [selectedConvertedLanguage, setSelectedConvertedLanguage] = useState<number>(-1);
  const [result, setResult] = useState<ResultValue>({
    message: null,
    stderr: null,
    compile_output: null,
    stdout: null
  });
  useEffect(() => {
    if (firstSelect !== -1) {
      setSelectedCodeStubLanguage(firstSelect);
      setSelectedConvertedLanguage(firstSelect);
    }
  }, [firstSelect]);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const genJob = await CodeConverterAI(
        availableLanguage[selectedConvertedLanguage].name,
        codeStub,
        selectedLanguageNames
      );

      if (genJob !== undefined) {
        const data = await Promise.all(genJob);
        const flatData = data.flat(Infinity);
        let formPointer = 0;
        let i = 0;
        let formLength = availableLanguage.length;
        while (formPointer < formLength) {
          if (availableLanguage[formPointer].choosen) {
            programmingLanguageMethod.setValue(
              `programmingLanguages.${formPointer}.bodyCode`,
              flatData[i].code_stub
            );
            i++;
          }
          formPointer++;
        }
        dispatch(setSuccessMess("Code stubs generated successfully!"));
      }
    } catch (error) {
      console.error("Error generating text:", error);
      dispatch(setErrorMess("Code stubs generated failed!"));
    } finally {
      setIsLoading(false);
    }
  };

  return !existSelect ? (
    <Heading5
      fontStyle={"italic"}
      fontWeight={"400"}
      colorname='--gray-50'
      translation-key='code_management_detail_no_language_selected'
    >
      {t("code_management_detail_no_language_selected")}
    </Heading5>
  ) : (
    <>
      <Box component='form' autoComplete='off' className={classes.formBody}>
        <Heading5
          fontStyle={"italic"}
          fontWeight={"400"}
          colorname='--gray-50'
          translation-key='code_management_detail_template_tip'
        >
          {t("code_management_detail_template_tip")}
        </Heading5>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='code_management_detail_template'>
              {t("code_management_detail_template")}
            </TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Box className={classes.codeStubsContainer}>
              <Box className={classes.codeStubsWrapper}>
                <Box className={classes.codeStubHead}>
                  <FormControl>
                    <Select
                      value={selectedConvertedLanguage}
                      onChange={(e) => {
                        setSelectedConvertedLanguage(e.target.value as number);
                      }}
                      sx={{ bgcolor: "white", width: "150px" }}
                    >
                      {availableLanguage.map(
                        (item, index) =>
                          item.choosen === true && (
                            <MenuItem key={index} value={index}>
                              {item.name}
                            </MenuItem>
                          )
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box className={classes.codeStubBody} style={{ height: `350px` }}>
                  <CodeEditor
                    value={codeStub}
                    onChange={(value) => {
                      setCodeStub(value);
                    }}
                    height='100%'
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box className={classes.btnWrapper}>
          <JoyButton
            loading={isLoading}
            disabled={!existSelect}
            color='primary'
            translation-key='code_management_detail_template_create'
            onClick={handleGenerate}
          >
            {t("code_management_detail_template_create")}
          </JoyButton>
        </Box>
      </Box>
      <Heading5
        marginTop={2}
        fontStyle={"italic"}
        fontWeight={"400"}
        colorname='--gray-50'
        translation-key='code_management_detail_template_description'
      >
        {t("code_management_detail_template_description")}
      </Heading5>
      <Box mt={2} className={classes.codeStubsContainer}>
        <Box className={classes.codeStubsWrapper}>
          <Box className={classes.codeStubHead}>
            <FormControl>
              <Select
                value={selectedCodeStubLanguage}
                onChange={(e) => {
                  setSelectedCodeStubLanguage(e.target.value as number);
                }}
                sx={{ bgcolor: "white", width: "150px" }}
              >
                {availableLanguage.map(
                  (item, index) =>
                    item.choosen === true && (
                      <MenuItem key={index} value={index}>
                        {item.name}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </Box>
          <Box className={classes.codeStubBody} style={{ height: `350px` }}>
            {programmingLanguageFieldArray.fields.map(
              (value, index) =>
                value.choosen &&
                index === selectedCodeStubLanguage && (
                  <Controller
                    key={value.plid}
                    name={`programmingLanguages.${index}.bodyCode`}
                    control={programmingLanguageMethod.control}
                    render={({ field: { value, onChange } }) => (
                      <CodeEditor
                        value={
                          value
                          // selectedCodeStubLanguage > -1
                          //   ? availableLanguage[selectedCodeStubLanguage].bodyCode
                          //   : ""
                        }
                        onChange={(val) => {
                          onChange(val);
                        }}
                        height='100%'
                      />
                    )}
                  />
                )
            )}
          </Box>
        </Box>
        <Box marginY={2} className={classes.btnWrapper}>
          <JoyButton
            loading={executeLoading}
            // disabled={!existSelect}
            color='success'
            translation-key='detail_problem_execute'
            onClick={() => {
              let obj: any = { ...availableLanguage[selectedCodeStubLanguage] };
              setExecuteLoading(true);
              ExecuteService.tryExecute(
                obj.judge0Id,
                input,
                availableLanguage[selectedCodeStubLanguage].bodyCode ?? ""
              )
                .then((val: ResultValue) => {
                  setResult(val);
                })
                .finally(() => setExecuteLoading(false));
            }}
          >
            <PlayArrow />
            {t("detail_problem_execute")}
          </JoyButton>
        </Box>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            id='outlined-basic'
            variant='outlined'
            placeholder='Input'
            size='small'
            value={input}
            onChange={(val) => {
              setInput(val.target.value);
            }}
          />
          {result.message && (
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
                value={decodeBase64(removeNewLine(result.message ?? ""))}
                variant='standard'
                inputProps={{ style: { color: "var(--red-text)" } }}
              />
            </Box>
          )}
          {result.stderr && (
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
                value={decodeBase64(removeNewLine(result.stderr ?? ""))}
                variant='standard'
                inputProps={{ style: { color: "var(--red-text)" } }}
              />
            </Box>
          )}
          {result.compile_output && (
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
                value={decodeBase64(removeNewLine(result.compile_output ?? ""))}
                variant='standard'
                inputProps={{ style: { color: "var(--red-text)" } }}
              />
            </Box>
          )}
          {result.stdout !== null && (
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
                value={decodeBase64(removeNewLine(result.stdout ?? ""))}
              />
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
});

export default CodeQuestionCodeStubs;
const styles = {
  errorBox: {
    backgroundColor: "var(--red-background)",
    borderRadius: 1,
    paddingX: 1
  }
};
