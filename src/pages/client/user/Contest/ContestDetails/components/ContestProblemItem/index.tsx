import { Box, Chip, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { EContestStatus } from "../..";

export enum EContestProblemDifficulty {
  easy = "Dễ",
  medium = "Trung bình",
  advance = "Khó"
}

interface PropsData {
  name: string;
  maxScore: number;
  point?: number;
  difficulty: string;
  submission?: number;
  maxSubmission: number;
}

const ContestProblemItem = (props: PropsData) => {
  const { name, maxScore, point, difficulty, submission, maxSubmission } = props;
  const scoreClickHandler = () => {
    console.log("score click");
  };
  const submissionTryClickHandler = () => {
    console.log("submit click");
  };

  return (
    <Paper className={classes.container}>
      <Grid container alignItems={"center"} justifyContent='space-between'>
        <Grid item>
          <Stack direction={"column"} className={classes.problemDetailContainer}>
            <Link href='#' underline='none'>
              <Typography
                fontWeight={400}
                lineHeight={1.4}
                color='#2a2a2a'
                fontSize='21px'
                fontFamily={"OpenSans, Arial, Helvetica, sans - serif"}
                className={classes.problemNameText}
              >
                {name}
              </Typography>
            </Link>

            <Chip
              size='small'
              label={difficulty}
              color={
                difficulty === EContestProblemDifficulty.easy
                  ? "success"
                  : difficulty === EContestProblemDifficulty.medium
                    ? "warning"
                    : "error"
              }
              sx={{ width: "fit-content" }}
            />
          </Stack>
        </Grid>
        <Grid item justifyContent='end'>
          <Stack direction={"row"}>
            <Box
              className={clsx(classes.submissionContainer, classes.roundContainer)}
              onClick={scoreClickHandler}
            >
              <Typography fontSize={"20px"} className={classes.roundedInfoText}>
                {submission !== undefined ? `${submission}/` : ""}
                {maxSubmission}
              </Typography>
              <Typography fontSize={"12px"} className={classes.roundedInfoText}>
                lần nộp
              </Typography>
            </Box>

            <Box
              className={clsx(classes.scoreContainer, classes.roundContainer)}
              onClick={submissionTryClickHandler}
            >
              <Typography fontSize={"20px"} className={classes.roundedInfoText}>
                {point !== undefined ? `${point}/` : ""}
                {maxScore}
              </Typography>
              <Typography fontSize={"12px"} className={classes.roundedInfoText}>
                Điểm
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContestProblemItem;
