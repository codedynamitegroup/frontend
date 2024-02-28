import {
  Grid,
  Select,
  MenuItem,
  createTheme,
  TextField,
  Badge,
  BadgeProps,
  styled
} from "@mui/material";
import Button from "@mui/joy/Button";
import TextEditor from "../TextEditor";
import AnswerPoint from "utils/AnswerPoint";
import qtype from "utils/constant/Qtype";
import classes from "./styles.module.scss";

interface AnswerEditorProps {
  answerNumber: number;
  qtype: String;
}
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {}
}));
const AnswerEditor = (props: AnswerEditorProps) => {
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
        {props.qtype === qtype.multiple_choice.code && `Lựa chọn ${props.answerNumber}`}
        {props.qtype === qtype.short_answer.code && `Đáp án ${props.answerNumber}`}
      </Grid>
      <Grid item xs={12} md={9} className={classes.textEditor}>
        {props.qtype === qtype.multiple_choice.code && (
          <TextEditor placeholder='Nhập nội dung' value={""} />
        )}
        {props.qtype === qtype.short_answer.code && <TextField size='small' />}
      </Grid>

      <Grid item xs={12} md={3} textAlign={{ xs: "left", md: "right" }}>
        Phần trăm điểm chiếm
      </Grid>
      <Grid item xs={12} md={9}>
        <Select defaultValue={-1} size='small'>
          <MenuItem value={-1}>None</MenuItem>
          {AnswerPoint.map((item, i) => (
            <MenuItem value={i}>{`${item.percentNumber * 100}%`}</MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12} md={3} textAlign={{ xs: "left", md: "right" }}>
        Nhận xét chung
      </Grid>
      <Grid item xs={12} md={9} className={classes.textEditor}>
        <TextEditor placeholder='Nhập nhận xét ...' value={""} />
      </Grid>
      <Grid item xs={12} container justifyContent={"center"}>
        <Button color='primary' variant='outlined'>
          Xóa
        </Button>
      </Grid>
    </Grid>
  );
};

export default AnswerEditor;
