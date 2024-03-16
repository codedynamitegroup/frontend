import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { useCallback, useMemo } from "react";
import classes from "./styles.module.scss";
import { zebraStripes } from "@uiw/codemirror-extensions-zebra-stripes";

interface CodeEditorProps {
  value: string;
  readOnly?: boolean;
  highlightActiveLine?: boolean;
  buildFragments?: {
    id: number;
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  }[];
}

const CodeEditor = ({ value, readOnly, highlightActiveLine, buildFragments }: CodeEditorProps) => {
  const onChange = useCallback(
    () => (value: string, viewUpdate: ViewUpdate) => {
      // setValue(value);
      // console.log(value);
    },
    []
  );

  const lineNumber = useMemo(() => {
    if (!buildFragments) return undefined;
    const lineNumbers: number[] = [];
    buildFragments.forEach((fragment) => {
      for (let i = fragment.startRow + 1; i <= fragment.endRow + 1; i++) {
        lineNumbers.push(i);
      }
    });
    return lineNumbers;
  }, [buildFragments]);

  const extensions = useMemo(() => {
    const extensions: any[] = [];

    const supportedLanguagesExtensions = [
      langs.java(),
      langs.javascript(),
      langs.cpp(),
      langs.python(),
      langs.angular(),
      langs.html()
    ];

    if (
      buildFragments !== undefined &&
      lineNumber !== undefined &&
      lineNumber.length > 0 &&
      buildFragments.length > 0
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
  }, [buildFragments, lineNumber]);

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
      extensions={extensions}
    />
  );
};

export default CodeEditor;
