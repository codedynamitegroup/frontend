import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { Typography } from "@mui/material";

interface PropsData {
  problemList: any;
  rankingList: any;
}

export default function ContestLeaderboard(props: PropsData) {
  const { problemList, rankingList } = props;
  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell
              align='center'
              rowSpan={2}
              color='var(--blue-100)'
              className={clsx(classes.tableHeader, classes.tableCell)}
            >
              Hạng
            </TableCell>
            <TableCell
              align='center'
              rowSpan={2}
              className={clsx(classes.tableHeader, classes.tableCell)}
            >
              Tên
            </TableCell>
            <TableCell
              align='center'
              colSpan={4}
              className={clsx(classes.tableHeader, classes.tableCell)}
            >
              Bài tập
            </TableCell>
            <TableCell
              align='center'
              rowSpan={2}
              className={clsx(classes.tableHeader, classes.tableCell)}
            >
              Tổng điểm
            </TableCell>
          </TableRow>
          <TableRow>
            {problemList.map((problem: any, index: any) => (
              <TableCell align='center' className={clsx(classes.tableCell)}>
                <Typography fontSize={"15px"}>{problem.name}</Typography>
                <Typography fontSize={"13px"}>({problem.maxScore} Điểm) </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rankingList.map((row: any, index: number) => (
            <TableRow key={row.rank} className={index % 2 === 0 ? classes.grayTableRow : null}>
              <TableCell className={clsx(classes.tableCell)} align='center'>
                {row.rank}
              </TableCell>
              <TableCell align='center' className={clsx(classes.tableCell)}>
                {row.name}{" "}
              </TableCell>
              {row.problemData.map((problem: any) => (
                <TableCell align='center' className={clsx(classes.tableCell)}>
                  {problem.point}
                </TableCell>
              ))}
              <TableCell align='center' className={clsx(classes.tableCell)}>
                <Typography color={"var(--orange-1)"}>{row.totalScore}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
