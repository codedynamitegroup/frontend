import React, { Dispatch, SetStateAction } from "react";
import Editor from "@monaco-editor/react";
import editorAPI from "monaco-editor/esm/vs/editor/editor.api";
import classes from "./styles.module.scss";
import { useEffect } from "react";
import { useState } from "react";
interface CodeEditorProps {
  language: string;
}

const CodeEditor = ({ language }: CodeEditorProps) => {
  const [value, setValue] = React.useState("");
  function handleOnChange(value?: string) {
    setValue(value!);
  }
  const [editorDimensions, setEditorDimensions] = useState({
    width: window.innerWidth / 2,
    height: window.innerHeight / 2
  });
  useEffect(() => {
    const handleResize = () => {
      setEditorDimensions({
        width: window.innerWidth / 2,
        height: window.innerHeight / 2
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const options: editorAPI.editor.IStandaloneEditorConstructionOptions = {
    autoIndent: "full",
    contextmenu: true,
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    minimap: {
      enabled: false
    },
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true,
    wordWrap: "on"
  };

  return (
    <Editor
      width={`${editorDimensions.width}px`}
      height={`${editorDimensions.height}px`}
      theme='light'
      defaultLanguage={language}
      defaultValue={value}
      onChange={handleOnChange}
      options={options}
    />
  );
};

export default CodeEditor;
