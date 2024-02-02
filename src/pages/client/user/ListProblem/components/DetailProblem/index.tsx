import React from "react";
import classes from "./styles.module.scss";
import { Grid } from "@mui/material";
import Header from "../../../../../../components/Header";
import { Box } from "@mui/system";
import ParagraphBody from "../../../../../../components/text/ParagraphBody";
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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ListSolution from "./components/ListSolution";
import "react-quill/dist/quill.bubble.css"; // hoặc 'react-quill/dist/quill.bubble.css' cho theme bubble
import TextEditor from "components/editor/TextEditor";

export default function DetailProblem() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("0");
  const topics = ["Mô tả", "Bài giải", "Bài nộp"];
  const languages = [
    {
      id: 1,
      label: "Javascript"
    },
    {
      id: 2,
      label: "C++"
    },
    {
      id: 3,
      label: "Java"
    }
  ];

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
          <ParagraphBody className={classes.linkLevel} colorName='--gray-50' fontWeight={"600"}>
            <span onClick={() => navigate("/lecturer/code-management")}>Quản lý câu hỏi code</span>{" "}
            {">"}{" "}
            <span onClick={() => navigate("/lecturer/code-management/create")}>Tạo câu hỏi</span>
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
                <Box className={classes.tabPanelContent}></Box>
              </TabPanel>
            </TabContext>
          </Box>
          <Box className={classes.editorCode}>
            <Box className={classes.editorCodeBody}>
              {/* <Box className={classes.title}>
                <CodeIcon className={classes.codeIcon} />
                <ParagraphBody fontWeight={"600"}>Code</ParagraphBody>
              </Box>
              <CodeEditor language='javascript' /> */}
            </Box>
            <Box className={classes.submit}></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
