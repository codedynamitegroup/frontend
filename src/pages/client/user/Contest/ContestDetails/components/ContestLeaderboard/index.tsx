import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { Box, Link, TableFooter, Typography } from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import TablePagination from "@mui/material/TablePagination";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

interface PropsData {
  problemList: any;
  rankingList: any;
  currentUserRank: any;
}

export default function ContestLeaderboard(props: PropsData) {
  const { problemList, rankingList, currentUserRank } = props;
  const isCurrentUserInTable = !!rankingList.filter(
    (user: any) => JSON.stringify(user) === JSON.stringify(currentUserRank)
  ).length;
  const onPageChange = () => {};
  const { t } = useTranslation();
  return (
    <Box>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell
                align='center'
                rowSpan={2}
                color='var(--blue-100)'
                className={clsx(classes.tableHeader, classes.tableCell)}
                translation-key='contest_detail_leaderboard_rank'
              >
                {t("contest_detail_leaderboard_rank")}
              </TableCell>
              <TableCell
                align='center'
                rowSpan={2}
                className={clsx(classes.tableHeader, classes.tableCell)}
                translation-key='common_participant'
              >
                {i18next.format(t("common_participant"), "firstUppercase")}
              </TableCell>
              <TableCell
                align='center'
                rowSpan={2}
                className={clsx(classes.tableHeader, classes.tableCell)}
                translation-key='contest_detail_leaderboard_total_time'
              >
                {t("contest_detail_leaderboard_total_time")}
              </TableCell>
              <TableCell
                align='center'
                rowSpan={2}
                className={clsx(classes.tableHeader, classes.tableCell)}
                translation-key='common_score'
              >
                {t("common_score")}
              </TableCell>
              <TableCell
                align='center'
                colSpan={4}
                className={clsx(classes.tableHeader, classes.tableCell)}
                translation-key='common_problem'
              >
                {t("common_problem")}
              </TableCell>
            </TableRow>
            <TableRow>
              {problemList.map((problem: any, index: any) => (
                <TableCell key={problem.name} align='center' className={clsx(classes.tableCell)}>
                  <Typography fontSize={"15px"}>{problem.name}</Typography>
                  <Typography fontSize={"13px"} translation-key='common_score'>
                    ({problem.maxScore} {t("common_score")})
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isCurrentUserInTable ? (
              <>
                <TableRow sx={{ backgroundColor: "var(--green-50)" }}>
                  <TableCell className={clsx(classes.tableCell)} align='center'>
                    {currentUserRank.rank}
                  </TableCell>
                  <TableCell align='center' className={clsx(classes.tableCell)}>
                    <Link
                      component={RouterLink}
                      to='#'
                      underline='none'
                      className={classes.participantInfo}
                      translation-key='common_you'
                    >
                      {currentUserRank.name} ({t("common_you")})
                    </Link>
                  </TableCell>
                  <TableCell align='center' className={clsx(classes.tableCell)}>
                    <Typography color={"var(--orange-1)"}>{"00:50:20"}</Typography>
                  </TableCell>
                  <TableCell align='center' className={clsx(classes.tableCell)}>
                    <Typography color={"var(--orange-1)"}>{currentUserRank.totalScore}</Typography>
                  </TableCell>
                  {currentUserRank.problemData.map((problem: any, index: number) => (
                    <TableCell key={index} align='center' className={clsx(classes.tableCell)}>
                      {problem.tries > 0 ? (
                        <Box>
                          <Typography fontSize={"18px"} fontWeight={600}>
                            {problem.point}
                          </Typography>
                          <Typography
                            className={classes.tableSecondaryData}
                            translation-key='common_submit'
                          >
                            {problem.tries} {t("common_submit")}
                          </Typography>
                          <Typography className={classes.tableSecondaryData}>
                            {"00:02:12"}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography>-</Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell colSpan={1000} className={classes.tableCell} align='center'>
                    <MoreIcon />
                  </TableCell>
                </TableRow>
              </>
            ) : null}

            {rankingList.map((row: any, index: number) => (
              <TableRow key={index} className={index % 2 === 0 ? classes.grayTableRow : null}>
                <TableCell className={clsx(classes.tableCell)} align='center'>
                  {row.rank}
                </TableCell>
                <TableCell align='center' className={clsx(classes.tableCell)}>
                  <Link
                    component={RouterLink}
                    to='#'
                    underline='none'
                    className={classes.participantInfo}
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell align='center' className={clsx(classes.tableCell)}>
                  <Typography color={"var(--orange-1)"}>
                    {/* {row.problemData.reduce(
                    (currentValue: any, problem: any) => problem.point + currentValue,
                    0
                  )} */}
                    {"00:50:20"}
                  </Typography>
                </TableCell>
                <TableCell align='center' className={clsx(classes.tableCell)}>
                  <Typography color={"var(--orange-1)"}>{row.totalScore}</Typography>
                </TableCell>
                {row.problemData.map((problem: any, index: any) => (
                  <TableCell align='center' className={clsx(classes.tableCell)} key={index}>
                    {problem.tries > 0 ? (
                      <Box>
                        <Typography fontSize={"18px"} fontWeight={600}>
                          {problem.point}
                        </Typography>
                        <Typography
                          className={classes.tableSecondaryData}
                          translation-key='common_submit'
                        >
                          {problem.tries} {t("common_submit")}
                        </Typography>
                        <Typography className={classes.tableSecondaryData}>{"00:02:12"}</Typography>
                      </Box>
                    ) : (
                      <Typography>-</Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            <TableRow>
              <TablePagination
                count={20}
                page={0}
                rowsPerPage={5}
                rowsPerPageOptions={[5, 10, 20]}
                labelRowsPerPage={t("common_table_row_per_page")} // Thay đổi text ở đây
                colSpan={10000}
                className={classes.tableCell}
                onPageChange={onPageChange}
                labelDisplayedRows={({ from, to, count }) => {
                  return t("common_table_from_to", {
                    from: `${from}`,
                    to: `${to}`,
                    countText: count !== -1 ? count : `${t("common_more_than")} ${to}`
                  });
                }}
                translation-key={[
                  "common_table_row_per_page",
                  "common_table_from_to",
                  "common_more_than"
                ]}
              />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
