import React, { Dispatch } from "react";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";

interface CodeEditorProps {
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
}

const CodeEditor = ({ value, setValue }: CodeEditorProps) => {
  const onChange = (value: string, viewUpdate: ViewUpdate) => {
    setValue(value);
    console.log(value);
  };
  return (
    <CodeMirror
      value={value}
      height='100vh'
      theme={githubLight}
      onChange={onChange}
      basicSetup={{
        autocompletion: true
      }}
      extensions={[langs.java(), langs.javascript()]}
    />
  );
};

export default CodeEditor;
