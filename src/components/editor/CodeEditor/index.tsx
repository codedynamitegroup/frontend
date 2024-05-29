import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { useCallback, useMemo } from "react";
import classes from "./styles.module.scss";
import { zebraStripes } from "@uiw/codemirror-extensions-zebra-stripes";

interface CodeEditorProps extends ReactCodeMirrorProps {
  highlightActiveLine?: boolean;
  fragments?: {
    id: number;
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  }[];
}

export const supportedLanguagesExtensions = [
  langs.java(),
  langs.javascript(),
  langs.cpp(),
  langs.python(),
  langs.angular(),
  langs.html()
];

const CodeEditor = ({
  value,
  readOnly,
  highlightActiveLine,
  fragments,
  ...rest
}: CodeEditorProps) => {
  const lineNumber = useMemo(() => {
    if (!fragments) return undefined;
    const lineNumbers: number[] = [];
    fragments.forEach((fragment) => {
      for (let i = fragment.startRow + 1; i <= fragment.endRow + 1; i++) {
        lineNumbers.push(i);
      }
    });
    return lineNumbers;
  }, [fragments]);

  const extensions = useMemo(() => {
    const extensions: any[] = [];

    if (
      fragments !== undefined &&
      lineNumber !== undefined &&
      lineNumber.length > 0 &&
      fragments.length > 0
    ) {
      extensions.push(
        zebraStripes({
          lineNumber: lineNumber,
          lightColor: "#aca2ff33",
          darkColor: "#aca2ff40"
        })
      );
    }

    return extensions.concat(supportedLanguagesExtensions);
  }, [fragments, lineNumber]);

  return (
    <CodeMirror
      id={classes.codeEditor}
      value={value}
      theme={githubLight}
      onChange={rest.onChange}
      readOnly={readOnly}
      basicSetup={{
        autocompletion: true,
        highlightActiveLine: highlightActiveLine !== undefined ? highlightActiveLine : true
      }}
      extensions={extensions}
    />
  );
};

export default CodeEditor;
