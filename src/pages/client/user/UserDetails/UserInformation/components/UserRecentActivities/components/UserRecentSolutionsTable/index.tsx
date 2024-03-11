import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextTitle from "components/text/TextTitle";
import EmptyListView from "../../../EmptyListView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { Box } from "@mui/material";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  },
  // change cursor to pointer on hover
  "&:hover": {
    cursor: "pointer"
  }
}));

export default function UserRecentSolutionsTable() {
  const { t } = useTranslation();
  const rows: {
    id: string;
    question_name: string;
    solution_name: string;
    diff_time: string;
  }[] = [
    {
      id: "0",
      question_name: "Remove Duplicates from Sorted List II",
      solution_name: "✅3 Method's || C++ || JAVA || PYTHON || Beginner Friendly🔥🔥🔥",
      diff_time: t("common_month_ago", { month: 10, count: 2 })
    },
    {
      id: "1",
      question_name: "Two Sum",
      solution_name: "✅ Beginner Friendly🔥🔥🔥",
      diff_time: t("common_month_ago", { month: 10, count: 2 })
    }
  ];

  if (rows.length === 0) {
    return <EmptyListView message='Chưa chia sẻ bài giải nào' />;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label='customized table'>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component='th' scope='row'>
                <TextTitle>{row.question_name + " - " + row.solution_name}</TextTitle>
              </StyledTableCell>
              <StyledTableCell align='right'>{row.diff_time}</StyledTableCell>
              <StyledTableCell align='right'>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <ParagraphBody>0</ParagraphBody>
                </Box>
              </StyledTableCell>
              <StyledTableCell align='right'>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                  <ParagraphBody>0</ParagraphBody>
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
