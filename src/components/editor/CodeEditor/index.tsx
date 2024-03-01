import React, { Dispatch } from "react";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import classes from "./styles.module.scss";

interface CodeEditorProps {
  value: string;
  readOnly?: boolean;
}

const CodeEditor = ({ value, readOnly }: CodeEditorProps) => {
  const onChange = (value: string, viewUpdate: ViewUpdate) => {
    // setValue(value);
    // console.log(value);
  };
  return (
    <CodeMirror
      value={value}
      id={classes.codeEditor}
      theme={githubLight}
      onChange={onChange}
      readOnly={readOnly}
      basicSetup={{
        autocompletion: true
      }}
      extensions={[langs.java(), langs.javascript(), langs.cpp()]}
    />
  );
};

export default CodeEditor;
