import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
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
import { Controller, useFormContext } from "react-hook-form";
import { dispatch } from "d3";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { useDispatch } from "react-redux";

type Props = {};

export interface ICodeConverterResponse {
  program_language: string;
  code_stub: string;
}
export interface ICodeConverterRequest {
  program_language: string;
}
type ProgrammingLanguageFormValue = {
  programmingLanguages: ProgrammingLanguageAdminEntity[];
};
const CodeQuestionCodeStubs = memo((props: Props) => {
  const { t } = useTranslation();
  const programmingLanguageMethod = useFormContext<ProgrammingLanguageFormValue>();

  const availableLanguage = programmingLanguageMethod.getValues("programmingLanguages");
  const selectedLanguageNames: ICodeConverterRequest[] = availableLanguage
    .filter((value) => value.choosen)
    .map((value) => ({ program_language: value.name }));
  const firstSelect = availableLanguage.findIndex((value) => value.choosen);
  const existSelect = firstSelect !== -1;

  const [selectedCodeStubLanguage, setSelectedCodeStubLanguage] = useState<number>(-1);
  const [codeStub, setCodeStub] = useState("");
  const [selectedConvertedLanguage, setSelectedConvertedLanguage] = useState<number>(-1);
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
      dispatch(setErrorMess("Code stubs generated successfully!"));
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
            type='submit'
            translation-key='code_management_detail_template_create'
            onClick={handleGenerate}
          >
            {t("code_management_detail_template_create")}
          </JoyButton>
        </Box>
      </Box>
      <Heading5
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
            <CodeEditor
              value={
                selectedCodeStubLanguage > -1
                  ? availableLanguage[selectedCodeStubLanguage].bodyCode
                  : ""
              }
              readOnly={true}
              height='100%'
            />
          </Box>
        </Box>
      </Box>
    </>
  );
});

export default CodeQuestionCodeStubs;
