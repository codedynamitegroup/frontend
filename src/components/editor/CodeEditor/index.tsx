import Editor from "@monaco-editor/react";
import editorAPI from "monaco-editor/esm/vs/editor/editor.api";
import classes from "./styles.module.scss";
interface CodeEditorProps {
  value: string;
  language: string;
  showMinimap: boolean;
  readOnly: boolean;
}

const CodeEditor = ({ value, language, showMinimap, readOnly }: CodeEditorProps) => {
  const options: editorAPI.editor.IStandaloneEditorConstructionOptions = {
    autoIndent: "full",
    contextmenu: true,
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    minimap: {
      enabled: showMinimap
    },
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: readOnly,
    cursorStyle: "line",
    automaticLayout: true
  };

  return (
    <Editor
      theme='light'
      language={language}
      value={value}
      options={options}
      className={classes.editor}
    />
  );
};

export default CodeEditor;