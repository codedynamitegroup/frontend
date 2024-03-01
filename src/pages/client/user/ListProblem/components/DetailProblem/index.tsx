import React, { useMemo, useRef } from "react";
import classes from "./styles.module.scss";
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent, Tabs } from "@mui/material";
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
import LessonDetailDescription from "./components/Description";
import LessonDetailSolution from "./components/ListSolution";
import LessonDetailSubmission from "./components/Submission";
import useBoxDimensions from "utils/useBoxDimensions";
import ProblemDetailDescription from "./components/Description";
import ProblemDetailSolution from "./components/ListSolution";
import ProblemDetailSubmission from "./components/Submission";

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

  const { problemId } = useParams<{ problemId: string }>();
  const { pathname } = useLocation();

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (problemId) navigate(tabs[newTab].replace(":problemId", problemId));
  };

  const tabs: string[] = useMemo(() => {
    return [
      routes.user.problem.detail.description,
      routes.user.problem.detail.solution,
      routes.user.problem.detail.submission
    ];
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { height: breadcrumbHeight } = useBoxDimensions({
    ref: breadcumpRef
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

  const marginRef = useRef<number>(10);
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
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall
              colorName='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.user.problem.root)}
            >
              Danh sách các bài tập
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall colorName='--blue-500'>Hello world</ParagraphSmall>
          </Box>
        </Box>
        <Grid
          container
          className={classes.codeContainer}
          style={{
            height: `calc(100% - ${breadcrumbHeight}px)`
          }}
        >
          <Grid item xs={12} md={5.95} className={classes.leftBody}>
            <Box id={classes.tabWrapper} ref={tabRef}>
              <Tabs
                value={activeTab}
                onChange={handleChange}
                aria-label='basic tabs example'
                className={classes.tabs}
              >
                <Tab
                  sx={{ textTransform: "none" }}
                  label={<ParagraphBody>Mô tả</ParagraphBody>}
                  value={0}
                />
                <Tab
                  sx={{ textTransform: "none" }}
                  label={<ParagraphBody>Thảo luận</ParagraphBody>}
                  value={1}
                />
                <Tab
                  sx={{ textTransform: "none" }}
                  label={<ParagraphBody>Bài nộp</ParagraphBody>}
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
          </Grid>
          <Grid item xs={0} md={0.1}></Grid>
          <Grid item xs={12} md={5.95} className={classes.rightBody}>
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
