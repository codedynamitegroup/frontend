import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { useCallback } from "react";
import classes from "./styles.module.scss";

interface CodeEditorProps {
  value: string;
  readOnly?: boolean;
  highlightActiveLine?: boolean;
}

const CodeEditor = ({ value, readOnly, highlightActiveLine }: CodeEditorProps) => {
  const onChange = useCallback(
    () => (value: string, viewUpdate: ViewUpdate) => {
      // setValue(value);
      // console.log(value);
    },
    []
  );

  return (
    <CodeMirror
      id={classes.codeEditor}
      minHeight={"150px"}
      value={value}
      theme={githubLight}
      onChange={onChange}
      readOnly={readOnly}
      basicSetup={{
        autocompletion: true,
        highlightActiveLine: highlightActiveLine ?? true
      }}
      extensions={[
        langs.java(),
        langs.javascript(),
        langs.cpp(),
        langs.python(),
        langs.angular(),
        langs.html()
      ]}
    />
  );
};

export default CodeEditor;
