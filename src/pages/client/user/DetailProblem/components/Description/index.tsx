import { Box, Divider, Stack } from "@mui/material";
import TextEditor from "components/editor/TextEditor";
import { useEffect, useState } from "react";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import { useAppSelector } from "hooks";
import Heading5 from "components/text/Heading5";
import ReactQuill from "react-quill";

type Props = {};

const ProblemDetailDescription = (props: Props) => {
  const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);

  return (
    <Box id={classes.introduction}>
      <Box id={classes.courseDescription}>
        <Stack spacing={2}>
          <Box>
            <Heading3>{codeQuestion?.name}</Heading3>
            <ReactQuill
              value={codeQuestion?.problemStatement || ""}
              readOnly={true}
              theme={"bubble"}
            />
          </Box>

          <Box>
            <Heading5>Input format</Heading5>
            <ReactQuill value={codeQuestion?.inputFormat || ""} readOnly={true} theme={"bubble"} />
            <Heading5>Output format</Heading5>
            <ReactQuill value={codeQuestion?.outputFormat || ""} readOnly={true} theme={"bubble"} />
          </Box>

          <Box>
            <Heading5>Constraint</Heading5>
            <ReactQuill value={codeQuestion?.constraints || ""} readOnly={true} theme={"bubble"} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProblemDetailDescription;
