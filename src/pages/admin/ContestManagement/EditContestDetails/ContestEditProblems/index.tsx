import {
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import Heading4 from "components/text/Heading4";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import JoyButton from "@mui/joy/Button";
import Heading6 from "components/text/Heading6";
import ParagraphBody from "components/text/ParagraphBody";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";

const ContestEditProblems = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<
    {
      id: string;
      name: string;
      level: string;
    }[]
  >([]);
  return (
    <Grid
      container
      gap={2}
      direction='column'
      className={classes.container}
      sx={{
        margin: "0px 20px 20px 20px",
        width: "calc(100% - 40px)",
        minHeight: "600px"
      }}
    >
      <Grid item xs={12}>
        <Heading4 translate-key='contest_problems'>{t("contest_problems")}</Heading4>
        <ParagraphSmall
          fontStyle={"italic"}
          sx={{ marginTop: "10px" }}
          translate-key='contest_problems_description'
        >
          {t("contest_problems_description")}
        </ParagraphSmall>
      </Grid>
      <JoyButton
        color='primary'
        sx={{ width: "150px" }}
        variant='outlined'
        translate-key='contest_add_problem_button'
      >
        {t("contest_add_problem_button")}
      </JoyButton>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label='custom table'>
            <TableHead className={classes["table-head"]}>
              <TableRow>
                <TableCell
                  align='left'
                  sx={{
                    width: "10%"
                  }}
                >
                  <Heading6 fontWeight={"700"} translation-key='common_no'>
                    {t("common_no")}
                  </Heading6>
                </TableCell>
                <TableCell
                  align='left'
                  sx={{
                    width: "40%"
                  }}
                >
                  <Heading6 fontWeight={"700"} translation-key='common_name'>
                    {t("common_name")}
                  </Heading6>
                </TableCell>
                <TableCell
                  align='left'
                  sx={{
                    width: "20%"
                  }}
                >
                  <Heading6 fontWeight={"700"} translation-key='common_max_score'>
                    {t("common_max_score")}
                  </Heading6>
                </TableCell>
                <TableCell
                  align='left'
                  className={classes.status}
                  sx={{
                    width: "30%"
                  }}
                >
                  <Heading6 fontWeight={"700"}></Heading6>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data &&
                data.length > 0 &&
                data.map((row, rowIndex) => (
                  <TableRow
                    className={rowIndex % 2 === 0 ? classes.row : classes.row1}
                    key={rowIndex}
                    // onClick={() =>
                    //   navigate(routes.user.problem.detail.description.replace(":problemId", row.id))
                    // }
                  >
                    <TableCell align='center'>{rowIndex}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <ParagraphSmall fontWeight={"500"} className={classes.linkText}>
                        <Link
                          component={RouterLink}
                          to={routes.user.problem.detail.description.replace(":problemId", row.id)}
                          underline='hover'
                          color='inherit'
                        >
                          {row.name}
                        </Link>
                      </ParagraphSmall>
                    </TableCell>
                    <TableCell>{row.level}</TableCell>
                  </TableRow>
                ))}
              {(!data || data.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{
                      textAlign: "center"
                    }}
                  >
                    <ParagraphBody
                      className={classes.noList}
                      translation-key='list_problem_not_found_data'
                    >
                      {t("list_problem_not_found_data")}
                    </ParagraphBody>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ContestEditProblems;
