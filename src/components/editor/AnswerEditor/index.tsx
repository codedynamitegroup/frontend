import {
  Grid,
  Select,
  MenuItem,
  createTheme,
  TextField,
  Badge,
  BadgeProps,
  styled,
  Box
} from "@mui/material";
import TextEditor from "../TextEditor";
import AnswerPoint from "utils/AnswerPoint";
import qtype from "utils/constant/Qtype";
import CloseIcon from "@mui/icons-material/Close";
import { blue, red } from "@mui/material/colors";

interface AnswerEditorProps {
  answerNumber: number;
  qtype: String;
}
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 7,
    top: -6,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px"
  }
}));
const AnswerEditor = (props: AnswerEditorProps) => {
  const theme = createTheme();
  return (
    <StyledBadge
      badgeContent={
        <CloseIcon
          sx={{
            backgroundColor: blue[500],
            "&:hover": {
              backgroundColor: red[500]
            },
            boxSizing: "border-box",
            borderRadius: "50%"
          }}
        />
      }
    >
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
          {props.qtype === qtype.essay.code && `Lựa chọn ${props.answerNumber}`}
          {props.qtype === qtype.short_answer.code && `Đáp án ${props.answerNumber}`}
        </Grid>
        <Grid item xs={12} md={9}>
          {props.qtype === qtype.essay.code && (
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
        <Grid item xs={12} md={9}>
          <TextEditor placeholder='Nhập nhận xét ...' value={""} />
        </Grid>
      </Grid>
    </StyledBadge>
  );
};

export default AnswerEditor;
