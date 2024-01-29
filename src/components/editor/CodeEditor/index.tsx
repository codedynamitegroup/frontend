import React, { Dispatch } from "react";
import Editor from "@monaco-editor/react";
import editorAPI from "monaco-editor/esm/vs/editor/editor.api";
interface CodeEditorProps {
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
  language: string;
}

const CodeEditor = ({ value, setValue, language }: CodeEditorProps) => {
  const options: editorAPI.editor.IStandaloneEditorConstructionOptions = {
    autoIndent: "full",
    contextmenu: true,
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    minimap: {
      enabled: true
    },
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true
  };

  return (
    <Editor
      height='100vh'
      width='100vw'
      theme='light'
      defaultLanguage={language}
      defaultValue={value}
      onChange={(e: any) => {
        setValue(e.target.value);
      }}
      options={options}
    />
  );
};

export default CodeEditor;
