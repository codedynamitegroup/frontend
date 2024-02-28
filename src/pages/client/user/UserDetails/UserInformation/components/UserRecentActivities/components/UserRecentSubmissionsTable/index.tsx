import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextTitle from "components/text/TextTitle";
import EmptyListView from "../../../EmptyListView";

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

export default function UserRecentSubmissionsTable() {
  const rows: {
    id: string;
    name: string;
    diff_time: string;
  }[] = [
    { id: "0", name: "Remove Duplicates from Sorted List II", diff_time: "10 tháng trước" },
    { id: "1", name: "Two Sum", diff_time: "10 tháng trước" },
    { id: "2", name: "Search a 2D Matrix", diff_time: "1 năm trước" },
    { id: "3", name: "Search a 2D Matrix II", diff_time: "1 năm trước" },
    {
      id: "4",
      name: "Find First and Last Position of Element in Sorted Array",
      diff_time: "1 năm trước"
    },
    { id: "5", name: "Find Minimum in Rotated Sorted Array", diff_time: "1 năm trước" },
    { id: "6", name: "Find Minimum in Rotated Sorted Array II", diff_time: "1 năm trước" },
    { id: "7", name: "Search in Rotated Sorted Array", diff_time: "1 năm trước" },
    { id: "8", name: "Search in Rotated Sorted Array II", diff_time: "1 năm trước" },
    { id: "9", name: "Search Insert Position", diff_time: "1 năm trước" }
  ];

  if (rows.length === 0) {
    return <EmptyListView message='Chưa có bài làm nào' />;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label='customized table'>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component='th' scope='row'>
                <TextTitle>{row.name}</TextTitle>
              </StyledTableCell>
              <StyledTableCell align='right'>{row.diff_time}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
