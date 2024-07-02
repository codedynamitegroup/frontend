import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { memo, useRef, useState } from "react";
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

type Props = {};

enum ELanguage {
  JAVA = "java",
  CPP = "cpp",
  JAVASCRIPT = "javascript"
}
interface QCodeStub {
  language: ELanguage;
  codeStub: string;
}
export interface ICodeConverterResponse {
  program_language: string;
  code_stub: string;
}
export interface ICodeConverterRequest {
  program_language: string;
}

const CodeQuestionCodeStubs = memo((props: Props) => {
  const { t } = useTranslation();

  const [convertedCodeStub, setConvertedCodeStub] = useState<string>("");

  const convert_language_request: ICodeConverterRequest[] = [
    {
      program_language: "C (GCC 8.3.0)"
    },
    {
      program_language: "C++ (GCC 7.4.0)"
    },
    {
      program_language: "C# (Mono 6.6.0.161)"
    },
    {
      program_language: "Java (OpenJDK 13.0.1)"
    },
    {
      program_language: "PHP (7.4.1)"
    },
    {
      program_language: "Python (3.8.1)"
    },
    {
      program_language: "Ruby (2.7.0)"
    },
    {
      program_language: "TypeScript (3.7.4)"
    },
    {
      program_language: "Swift (5.2.3)"
    },
    {
      program_language: "Rust (1.40.0)"
    },
    {
      program_language: "Pascal (FPC 3.0.4)"
    },
    {
      program_language: "Kotlin (1.3.70)"
    },
    {
      program_language: "JavaScript (Node.js 12.14.0)"
    },
    {
      program_language: "Go (1.13.5)"
    },
    {
      program_language: "Clojure (1.10.1)"
    }
  ];
  const [convertedCodeStubList, setConvertedCodeStubList] = useState<ICodeConverterResponse[]>([]);

  const [selectedConvertedLanguage, setSelectedConvertedLanguage] = useState<string>(
    convert_language_request[0].program_language
  );

  const handleChangeConvertedLanguage = (event: SelectChangeEvent) => {
    const selectedLanguageChange = event.target.value;
    setSelectedConvertedLanguage(selectedLanguageChange);
  };

  const [selectedCodeStubLanguage, setSelectedCodeStubLanguage] = useState<string>(
    convert_language_request[0].program_language
  );

  const handleChangeCodeStubLanguage = (event: SelectChangeEvent) => {
    const selectedLanguageChange = event.target.value;
    setSelectedCodeStubLanguage(selectedLanguageChange);
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      for await (const chunk of CodeConverterAI(
        selectedConvertedLanguage,
        convertedCodeStub,
        convert_language_request
      )) {
        if (chunk) {
          setConvertedCodeStubList(chunk);
        }
      }
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const findIndexSelectedCodeStubLanguage = () => {
    const foundCodeStub = convertedCodeStubList.find(
      (item) => item.program_language === selectedCodeStubLanguage
    );
    return foundCodeStub ? foundCodeStub : null;
  };

  return (
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
                      onChange={handleChangeConvertedLanguage}
                      sx={{ bgcolor: "white", width: "150px" }}
                    >
                      {convert_language_request.map((item, index) => (
                        <MenuItem key={index} value={item.program_language}>
                          {item.program_language}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box className={classes.codeStubBody} style={{ height: `350px` }}>
                  <CodeEditor
                    value={convertedCodeStub}
                    onChange={setConvertedCodeStub}
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
                onChange={handleChangeCodeStubLanguage}
                sx={{ bgcolor: "white", width: "150px" }}
              >
                {convert_language_request.map((item, index) => (
                  <MenuItem key={index} value={item.program_language}>
                    {item.program_language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box className={classes.codeStubBody} style={{ height: `350px` }}>
            <CodeEditor
              value={
                findIndexSelectedCodeStubLanguage()
                  ? findIndexSelectedCodeStubLanguage()?.code_stub
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
