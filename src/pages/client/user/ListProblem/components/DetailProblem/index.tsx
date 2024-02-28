import React from "react";
import classes from "./styles.module.scss";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ReactQuill from "react-quill";
import CodeEditor from "components/editor/CodeEditor";
import { useState } from "react";
import CodeIcon from "@mui/icons-material/Code";
import ListSolution from "./components/ListSolution";
import "react-quill/dist/quill.bubble.css"; // hoặc 'react-quill/dist/quill.bubble.css' cho theme bubble
import Header from "components/Header";
import ParagraphBody from "components/text/ParagraphBody";
import { routes } from "routes/routes";
import Submission from "./components/Submission";

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
  const [value, setValue] = React.useState("0");
  const topics = ["Mô tả", "Bài giải", "Bài nộp"];
  const codeStubs: QCodeStub[] = [
    {
      language: ELanguage.JAVA,
      codeStubHead: `	import java.io.*;
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
      codeStubBody: `class Result {
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
      codeStubTail: `int main()
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

  const htmlContent =
    "<h2>1. Two Sum</a></h2>" +
    "<p>Given an array of integers&nbsp;<code>nums</code>&nbsp;and an integer&nbsp;<code>target</code>, return&nbsp;<em>indices of the two numbers such that they add up to&nbsp;<code>target</code></em>.</p>" +
    "<p>You may assume that each input would have&nbsp;<strong><em>exactly</em>&nbsp;one solution</strong>, and you may not use the&nbsp;<em>same</em>&nbsp;element twice.</p>" +
    "<p>You can return the answer in any order.</p>" +
    "<p>&nbsp;</p>" +
    "<p><strong>Example 1:</strong></p>" +
    "<pre>" +
    "<strong>Input:</strong> nums = [2,7,11,15], target = 9\n" +
    "<strong>Output:</strong> [0,1]\n" +
    "<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].\n" +
    "</pre>" +
    "\n<p><strong>Example 2:</strong></p>" +
    "<pre>" +
    "<strong>Input:</strong> nums = [3,2,4], target = 6\n" +
    "<strong>Output:</strong> [1,2]\n" +
    "</pre>" +
    "\n<p><strong>Example 3:</strong></p>" +
    "<pre>" +
    "<strong>Input:</strong> nums = [3,3], target = 6\n" +
    "<strong>Output:</strong> [0,1]</pre>";
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const CustomReactQuill = styled(ReactQuill)`
    .ql-editor {
      overflow: hidden !important;
      height: 100% !important;
    }
    .ql-container {
      height: 100% !important;
    }
    .ql-snow .ql-editor pre.ql-syntax {
      background-color: #f2f3f4;
      color: black;
    }
    .ql-container.ql-snow {
      border: none;
    }
  `;

  return (
    <Box className={classes.root}>
      <Header />
      <Box className={classes.boxContainer}>
        <Box className={classes.tabWrapper}>
          <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
            <span onClick={() => navigate(routes.user.problem.root)}>Bài tập rèn luyện</span> {">"}{" "}
            <span>Two sum</span>
          </ParagraphBody>
        </Box>
        <Box className={classes.codeContainer}>
          <Box className={classes.tabContent}>
            <TabContext value={value}>
              <Box>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'
                  TabIndicatorProps={{ hidden: true }}
                  className={classes.stickyTabList} // Thêm class mới vào đây
                >
                  {topics.map((topic, index) => (
                    <Tab key={index} label={topic} value={index.toString()} />
                  ))}
                </TabList>
              </Box>
              <TabPanel value='0' className={classes.tabPanelTopic}>
                <Box className={classes.tabPanelContent}>
                  <CustomReactQuill
                    value={htmlContent}
                    readOnly={true}
                    modules={{
                      toolbar: false
                    }}
                    className={classes.quillEditor}
                  />
                </Box>
              </TabPanel>
              <TabPanel value='1' className={classes.tabPanel}>
                <Box className={classes.tabPanelContent}>
                  <ListSolution />
                </Box>
              </TabPanel>
              <TabPanel value='2' className={classes.tabPanel}>
                <Box className={classes.tabPanelContent}>
                  <Submission />
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
          <Box className={classes.codeStubsWrapper}>
            <Box className={classes.codeStubHead}>
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
            <Box className={classes.codeStubBody}>
              <CodeEditor
                value={selectedCodeStub.codeStubHead.concat(
                  selectedCodeStub.codeStubBody,
                  selectedCodeStub.codeStubTail
                )}
                readOnly={true}
                language={selectedLanguage}
                showMinimap={false}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
