import { Box, Grid } from "@mui/material";
import { memo, useState } from "react";
import classes from "./styles.module.scss";
import TextTitle from "components/text/TextTitle";
import { Textarea } from "@mui/joy";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/text/ParagraphBody";
import CodeEditor from "components/editor/CodeEditor";

type Props = {};

const CodeQuestionCodeStubs = memo((props: Props) => {
  const [codeStubHead, setCodeStubHead] = useState<string>(
    `	import java.io.*;
	import java.math.*;
	import java.security.*;
	import java.text.*;
	import java.util.*;
	import java.util.concurrent.*;
	import java.util.function.*;
	import java.util.regex.*;
	import java.util.stream.*;
	import static java.util.stream.Collectors.joining;
	import static java.util.stream.Collectors.toList;
	`
  );
  const [codeStubBody, setCodeStubBody] = useState<string>(`class Result {

    /*
     * Complete the 'sumOfTwoIntegers' function below.
     *
     * The function is expected to return an INTEGER.
     * The function accepts following parameters:
     *  1. INTEGER a
     *  2. INTEGER b
     */

    public static int sumOfTwoIntegers(int a, int b) {
    // Write your code here

    }

}
	`);
  const [codeStubTail, setCodeStubTail] = useState<string>(`public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")));

        int a = Integer.parseInt(bufferedReader.readLine().trim());

        int b = Integer.parseInt(bufferedReader.readLine().trim());

        int result = Result.sumOfTwoIntegers(a, b);

        bufferedWriter.write(String.valueOf(result));
        bufferedWriter.newLine();

        bufferedReader.close();
        bufferedWriter.close();
    }
}
	`);
  return (
    <>
      <Box component='form' autoComplete='off' className={classes.formBody}>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>DSL cho code mẫu</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Textarea
              defaultValue={`function(integer, sumOfTwoIntegers, integer a, integer b)

integer(a)

integer(b)

invoke(integer, result, sumOfTwoIntegers, a, b)

print(integer,result)`}
              sx={{ backgroundColor: "white" }}
              minRows={5}
              maxRows={5}
            />
          </Grid>
        </Grid>
        <Box className={classes.btnWrapper}>
          <Button btnType={BtnType.Primary} width='150px' type='submit'>
            Tạo code mẫu
          </Button>
        </Box>
      </Box>
      <Box className={classes.codeStubsBody}>
        <Box className={classes.codeStubsWrapper}>
          <Box className={classes.codeStubHead}>
            <ParagraphBody fontWeight={700}>Head</ParagraphBody>
          </Box>
          <Box className={classes.codeStubBody}>
            <CodeEditor showMinimap={false} readOnly={true} value={codeStubHead} language='java' />
          </Box>
        </Box>
        <Box className={classes.codeStubsWrapper}>
          <Box className={classes.codeStubHead}>
            <ParagraphBody fontWeight={700}>Body</ParagraphBody>
          </Box>
          <Box className={classes.codeStubBody}>
            <CodeEditor showMinimap={false} readOnly={true} value={codeStubBody} language='java' />
          </Box>
        </Box>
        <Box className={classes.codeStubsWrapper}>
          <Box className={classes.codeStubHead}>
            <ParagraphBody fontWeight={700}>Tail</ParagraphBody>
          </Box>
          <Box className={classes.codeStubBody}>
            <CodeEditor showMinimap={false} readOnly={true} value={codeStubTail} language='java' />
          </Box>
        </Box>
      </Box>
    </>
  );
});

export default CodeQuestionCodeStubs;
