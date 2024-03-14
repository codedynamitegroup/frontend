import React, { useMemo, useRef } from "react";
import classes from "./styles.module.scss";
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tabs
} from "@mui/material";
import { Box } from "@mui/system";
import { Route, Routes, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import Tab from "@mui/material/Tab";
import CodeEditor from "components/editor/CodeEditor";
import { useState } from "react";
import CodeIcon from "@mui/icons-material/Code";
import "react-quill/dist/quill.bubble.css"; // hoặc 'react-quill/dist/quill.bubble.css' cho theme bubble
import Header from "components/Header";
import ParagraphBody from "components/text/ParagraphBody";
import { routes } from "routes/routes";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import ProblemDetailDescription from "./components/Description";
import ProblemDetailSolution from "./components/ListSolution";
import ProblemDetailSubmission from "./components/Submission";
import { Resizable } from "re-resizable";
import TestCase from "./components/TestCase";
import Result from "./components/Result";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PublishIcon from "@mui/icons-material/Publish";
import { useTranslation } from "react-i18next";
enum ELanguage {
  JAVA = "java",
  CPP = "cpp",
  JAVASCRIPT = "javascript"
}
interface QCodeStub {
  language: ELanguage;
  codeStubHead: string;
  codeStubBody: string;
  codeStubTail: string;
}

export default function DetailProblem() {
  const navigate = useNavigate();
  const codeStubs: QCodeStub[] = [
    {
      language: ELanguage.JAVA,
      codeStubHead: `
import java.io.*;
import java.math.*;
import java.security.*;
import java.text.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.regex.*;
import java.util.stream.*;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
	`,
      codeStubBody: `
class Result {
	/*
		* Complete the 'sumOfTwoIntegers' function below.
		*
		* The function is expected to return an INTEGER.
		* The function accepts following parameters:
		*  1. INTEGER a
		*  2. INTEGER b
		*/

	public static int sumOfTwoIntegers(int a, int b) {
	// Write your code here
	
	}
		}
			`,
      codeStubTail: `
public class Solution {
	public static void main(String[] args) throws IOException {
			BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
			BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")));

			int a = Integer.parseInt(bufferedReader.readLine().trim());

			int b = Integer.parseInt(bufferedReader.readLine().trim());

			int result = Result.sumOfTwoIntegers(a, b);

			bufferedWriter.write(String.valueOf(result));
			bufferedWriter.newLine();

			bufferedReader.close();
			bufferedWriter.close();
	}
		}`
    },
    {
      language: ELanguage.JAVASCRIPT,
      codeStubHead: `'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
		inputString += inputStdin;
});

process.stdin.on('end', function() {
		inputString = inputString.split('\n');

		main();
});

function readLine() {
		return inputString[currentLine++];
}`,
      codeStubBody: `
/*
 * Complete the 'sumOfTwoIntegers' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. INTEGER a
 *  2. INTEGER b
 */

function sumOfTwoIntegers(a, b) {
    // Write your code here

}`,
      codeStubTail: `
function main() {
	const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

	const a = parseInt(readLine().trim(), 10);

	const b = parseInt(readLine().trim(), 10);

	const result = sumOfTwoIntegers(a, b);

	ws.write(result + '\n');

	ws.end();
}`
    },
    {
      language: ELanguage.CPP,
      codeStubHead: `#include <bits/stdc++.h>

	using namespace std;
	string ltrim(const string &);
	string rtrim(const string &);
					
			`,
      codeStubBody: `
			/*
 * Complete the 'sumOfTwoIntegers' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. INTEGER a
 *  2. INTEGER b
 */

int sumOfTwoIntegers(int a, int b) {

}
			`,
      codeStubTail: `
int main()
	{
		ofstream fout(getenv("OUTPUT_PATH"));

		string a_temp;
		getline(cin, a_temp);

		int a = stoi(ltrim(rtrim(a_temp)));

		string b_temp;
		getline(cin, b_temp);

		int b = stoi(ltrim(rtrim(b_temp)));

		int result = sumOfTwoIntegers(a, b);

		fout << result << "\n";

		fout.close();

		return 0;
	}
	
	string ltrim(const string &str) {
			string s(str);
	
			s.erase(
					s.begin(),
					find_if(s.begin(), s.end(), not1(ptr_fun<int, int>(isspace)))
			);
	
			return s;
	}
	
	string rtrim(const string &str) {
			string s(str);
	
			s.erase(
					find_if(s.rbegin(), s.rend(), not1(ptr_fun<int, int>(isspace))).base(),
					s.end()
			);
	
			return s;
	}			
		`
    }
  ];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(ELanguage.JAVA);
  const [selectedCodeStub, setSelectedCodeStub] = useState<QCodeStub>(codeStubs[0]);
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    const selectedLanguage = event.target.value;
    setSelectedLanguage(selectedLanguage);
    const selectedStub = codeStubs.find((stub) => stub.language === selectedLanguage);
    if (selectedStub) {
      setSelectedCodeStub(selectedStub);
    }
  };

  const { problemId, courseId, lessonId } = useParams<{
    problemId: string;
    courseId: string;
    lessonId: string;
  }>();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (problemId) navigate(tabs[newTab].replace(":problemId", problemId));
    else if (courseId && lessonId)
      navigate(tabs[newTab].replace(":courseId", courseId).replace(":lessonId", lessonId));
  };

  const tabs: string[] = useMemo(() => {
    if (problemId)
      return [
        routes.user.problem.detail.description,
        routes.user.problem.detail.solution,
        routes.user.problem.detail.submission
      ];
    else {
      return [
        routes.user.course_certificate.detail.lesson.description,
        routes.user.course_certificate.detail.lesson.solution,
        routes.user.course_certificate.detail.lesson.submission
      ];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = matchPath(pathname, routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (problemId) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":problemId", problemId)));
      if (index === -1) return 0;
      return index;
    } else if (courseId && lessonId) {
      const index = tabs.findIndex((it) =>
        activeRoute(it.replace(":courseId", courseId).replace(":lessonId", lessonId))
      );
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const [testCaseTab, setTestCaseTab] = useState(0);
  const handleTestCaseChange = (event: any, newValue: any) => {
    setTestCaseTab(newValue);
  };

  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { height: breadcrumbHeight } = useBoxDimensions({
    ref: breadcumpRef
  });

  const breadcumpWrapperRef = useRef<HTMLDivElement>(null);
  const { width: breadcumpWrapperWidth } = useBoxDimensions({
    ref: breadcumpWrapperRef
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const tabRef = useRef<HTMLDivElement>(null);
  const { height: tabHeight } = useBoxDimensions({
    ref: tabRef
  });
  const codeStubHeadRef = useRef<HTMLDivElement>(null);
  const { height: codeStubHeadHeight } = useBoxDimensions({
    ref: codeStubHeadRef
  });

  const [width001, setWidth001] = useState("50%");
  const [width002, setWidth002] = useState("50%");

  const handleResize001 = (e: any, direction: any, ref: any, d: any) => {
    const newWidth001 = ref.style.width;
    const newWidth002 = `${100 - parseFloat(newWidth001)}%`;

    setWidth001(newWidth001);
    setWidth002(newWidth002);
  };

  const marginRef = useRef<number>(10);
  const { t } = useTranslation();
  return (
    <Box className={classes.root}>
      <Header ref={headerRef} />
      <Box
        className={classes.body}
        style={{
          height: `calc(100% - ${headerHeight + marginRef.current * 2}px)`,
          marginTop: `${headerHeight}px`,
          gap: `${marginRef.current}px`,
          marginBottom: `${marginRef.current}px`
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          {problemId && (
            <Box id={classes.breadcumpWrapper} ref={breadcumpWrapperRef}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.user.problem.root)}
              >
                {t("list_problem")}
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorname='--blue-500'>Hello world</ParagraphSmall>
            </Box>
          )}
          {courseId && lessonId && (
            <Box id={classes.breadcumpWrapper} ref={breadcumpWrapperRef}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.user.course_certificate.root)}
              >
                Danh sách khóa học
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => {
                  if (courseId)
                    navigate(
                      routes.user.course_certificate.detail.lesson.root.replace(
                        ":courseId",
                        courseId
                      )
                    );
                }}
              >
                Học C++ cơ bản
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorname='--blue-500'>Hello world</ParagraphSmall>
            </Box>
          )}
          <Box className={classes.submit}>
            <Button
              className={classes.runBtn}
              variant='contained'
              color='primary'
              translation-key='detail_problem_execute'
            >
              <PlayArrowIcon />
              {t("detail_problem_execute")}
            </Button>
            <Button
              className={classes.submitBtn}
              color='primary'
              translation-key='detail_problem_submit'
            >
              <PublishIcon />
              {t("detail_problem_submit")}
            </Button>
          </Box>
          <Box
            style={{
              width: `${breadcumpWrapperWidth}px`
            }}
          ></Box>
        </Box>
        <Grid
          container
          className={classes.codeContainer}
          style={{
            height: `calc(100% - ${breadcrumbHeight}px)`
          }}
        >
          <Resizable
            size={{ width: width001, height: "100%" }}
            minWidth={0}
            maxWidth={"100%"}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            onResize={handleResize001}
          >
            <Box className={classes.leftBody}>
              <Box id={classes.tabWrapper} ref={tabRef}>
                <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  aria-label='basic tabs example'
                  className={classes.tabs}
                >
                  <Tab
                    sx={{ textTransform: "none" }}
                    translation-key='detail_problem_description'
                    label={<ParagraphBody>{t("detail_problem_description")}</ParagraphBody>}
                    value={0}
                  />
                  <Tab
                    sx={{ textTransform: "none" }}
                    translation-key='detail_problem_discussion'
                    label={<ParagraphBody>{t("detail_problem_discussion")}</ParagraphBody>}
                    value={1}
                  />
                  <Tab
                    sx={{ textTransform: "none" }}
                    translation-key='detail_problem_submission'
                    label={<ParagraphBody>{t("detail_problem_submission")}</ParagraphBody>}
                    value={2}
                  />
                </Tabs>
              </Box>

              <Box
                id={classes.tabBody}
                style={{
                  height: `calc(100% - ${tabHeight}px)`
                }}
              >
                <Routes>
                  <Route path={"description"} element={<ProblemDetailDescription />} />
                  <Route path={"solution"} element={<ProblemDetailSolution />} />
                  <Route path={"submission"} element={<ProblemDetailSubmission />} />
                </Routes>
              </Box>
            </Box>
          </Resizable>

          <Resizable
            size={{ width: width002, height: "100%" }}
            minWidth={0}
            maxWidth={"100%"}
            enable={{
              top: false,
              right: false,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            // onResize={handleResize002}
          >
            <Box className={classes.rightBody}>
              <Box className={classes.codeStubContainer}>
                <Box id={classes.codeStubHead} ref={codeStubHeadRef}>
                  <CodeIcon />
                  <FormControl>
                    <Select
                      value={selectedLanguage}
                      onChange={handleChangeLanguage}
                      sx={{ bgcolor: "white", width: "150px", height: "40px" }}
                    >
                      <MenuItem value={ELanguage.JAVA}>Java</MenuItem>
                      <MenuItem value={ELanguage.JAVASCRIPT}>Javascript</MenuItem>
                      <MenuItem value={ELanguage.CPP}>C++</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  style={{
                    height: `calc(100% - ${codeStubHeadHeight}px)`,
                    overflow: "auto"
                  }}
                >
                  <CodeEditor
                    value={selectedCodeStub.codeStubHead.concat(
                      selectedCodeStub.codeStubBody,
                      selectedCodeStub.codeStubTail
                    )}
                  />
                </Box>
              </Box>
              <Box className={classes.codeTestcaseContainer}>
                <Box className={classes.testcaseContainer}>
                  <Box className={classes.testcaseBody}>
                    <Box id={classes.tabWrapper} ref={tabRef}>
                      <Tabs
                        value={testCaseTab}
                        onChange={handleTestCaseChange}
                        aria-label='basic tabs example'
                        className={classes.tabs}
                      >
                        <Tab
                          sx={{ textTransform: "none" }}
                          label={<ParagraphBody>Test Cases</ParagraphBody>}
                          value={0}
                        />
                        <Tab
                          sx={{ textTransform: "none" }}
                          translation-key='detail_problem_result'
                          label={<ParagraphBody>{t("detail_problem_result")}</ParagraphBody>}
                          value={1}
                        />
                      </Tabs>
                    </Box>

                    <Box
                      className={classes.tabBody}
                      style={{
                        height: `calc(50% - ${tabHeight}px)`
                      }}
                    >
                      {testCaseTab === 0 ? <TestCase /> : <Result />}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Resizable>
        </Grid>
      </Box>
    </Box>
  );
}
