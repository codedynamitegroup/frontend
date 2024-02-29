import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
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
  point?: number | string;
  difficulty: string;
  submission?: number | string;
  maxSubmission: number;
}

const ContestProblemItem = (props: PropsData) => {
  const { name, maxScore, point, difficulty, submission, maxSubmission } = props;
  return (
    <Paper className={classes.container}>
      <Grid container alignItems={"center"} justifyContent='space-between'>
        <Grid item>
          <Stack direction={"column"} className={classes.problemDetailContainer}>
            <Typography
              fontWeight={400}
              lineHeight={1.4}
              color='#2a2a2a'
              fontSize='21px'
              fontFamily={"OpenSans, Arial, Helvetica, sans - serif"}
            >
              {name}
            </Typography>
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
            <Box className={clsx(classes.submissionContainer, classes.roundContainer)}>
              <Typography fontSize={"20px"} color={"var(--gray-50)"}>
                {submission ? `${submission}/` : ""}
                {maxSubmission}
              </Typography>
              <Typography fontSize={"12px"} color={"var(--gray-50)"}>
                lần nộp
              </Typography>
            </Box>

            <Box className={clsx(classes.scoreContainer, classes.roundContainer)}>
              <Typography fontSize={"20px"} color={"var(--gray-50)"}>
                {point ? `${point}/` : ""}
                {maxScore}
              </Typography>
              <Typography fontSize={"12px"} color={"var(--gray-50)"}>
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
