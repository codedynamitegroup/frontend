import { Textarea } from "@mui/joy";
import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import TextTitle from "components/text/TextTitle";
import { memo, useState } from "react";
import classes from "./styles.module.scss";

type Props = {};

enum EDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}
const CodeQuestionInformation = memo((props: Props) => {
  const [problemStatement, setProblemStatement] = useState<string>("Tính tổng 2 số");
  const [inputFormat, setInputFormat] = useState<string>(
    "Gồm 2 số nguyên a và b cách nhau bởi dấu cách, được nhập từ bàn phím"
  );
  const [outputFormat, setOutputFormat] = useState<string>(
    "Là một số nguyên cho biết tổng của a và b"
  );
  const [contraints, setContraints] = useState<string>("a và b là số nguyên");
  const [questionName] = useState<string>("Tổng 2 số");
  const [difficulty, setDifficulty] = useState<string>(EDifficulty.EASY);
  const handleChange = (event: SelectChangeEvent) => {
    setDifficulty(event.target.value);
  };

  return (
    <Box component='form' autoComplete='off' className={classes.formBody}>
      <InputTextField title='Tên câu hỏi' type='text' value={questionName} />
      <FormControl>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Độ khó</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Select value={difficulty} onChange={handleChange} sx={{ width: "200px" }}>
              <MenuItem value={EDifficulty.EASY}>Dễ</MenuItem>
              <MenuItem value={EDifficulty.MEDIUM}>Trung bình</MenuItem>
              <MenuItem value={EDifficulty.HARD}>Khó</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </FormControl>
      <FormControl>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Mô tả câu hỏi</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Textarea
              defaultValue='Mô tả bài toán'
              sx={{ backgroundColor: "white" }}
              minRows={3}
              maxRows={3}
            />
          </Grid>
        </Grid>
      </FormControl>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle>Phát biểu bài toán</TextTitle>
        </Grid>
        <Grid item xs={9}>
          <TextEditor value={problemStatement} onChange={setProblemStatement} />
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle>Định dạng đầu vào</TextTitle>
        </Grid>
        <Grid item xs={9}>
          <TextEditor value={inputFormat} onChange={setInputFormat} />
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle>Ràng buộc</TextTitle>
        </Grid>
        <Grid item xs={9}>
          <TextEditor value={contraints} onChange={setContraints} />
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle>Định dạng đầu ra</TextTitle>
        </Grid>
        <Grid item xs={9}>
          <TextEditor value={outputFormat} onChange={setOutputFormat} />
        </Grid>
      </Grid>
    </Box>
  );
});

export default CodeQuestionInformation;
