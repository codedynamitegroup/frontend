import { Grid, Select, MenuItem, createTheme } from "@mui/material";
import TextEditor from "../TextEditor";
import AnswerPoint from "utils/AnswerPoint";

const AnswerEditor = () => {
  const theme = createTheme();
  return (
    <Grid
      border={1}
      width={"auto"}
      marginX={theme.spacing(1)}
      columnSpacing={1}
      rowSpacing={1}
      paddingBottom={1}
      paddingX={1}
      container
    >
      <Grid item xs={12} md={3} textAlign={{ xs: "left", md: "right" }}>
        Lựa chọn 1
      </Grid>
      <Grid item xs={12} md={9}>
        <TextEditor placeholder='Nhập nội dung' value={""} />
      </Grid>

      <Grid item xs={12} md={3} textAlign={{ xs: "left", md: "right" }}>
        Điểm
      </Grid>
      <Grid item xs={12} md={9}>
        <Select defaultValue={0} size='small'>
          {AnswerPoint.map((item, i) => (
            <MenuItem value={i}>{`${item.percentNumber * 100}%`}</MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12} md={3} textAlign={{ xs: "left", md: "right" }}>
        Nhận xét chung
      </Grid>
      <Grid item xs={12} md={9}>
        <TextEditor placeholder='Nhập nhận xét ...' value={""} />
      </Grid>
    </Grid>
  );
};

export default AnswerEditor;
