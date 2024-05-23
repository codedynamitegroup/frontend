import { Box, Chip, Divider, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export enum EContestProblemDifficulty {
  easy = "easy",
  medium = "medium",
  advance = "advance"
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
  const { t } = useTranslation();

  return (
    <Paper className={classes.container}>
      <Grid container alignItems={"center"} justifyContent='space-between'>
        <Grid item xs={9}>
          <Link component={RouterLink} to='#' underline='none'>
            <Stack direction={"column"} className={classes.problemDetailContainer}>
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

              <Chip
                size='small'
                label={
                  difficulty === EContestProblemDifficulty.easy
                    ? t("common_easy")
                    : difficulty === EContestProblemDifficulty.medium
                      ? t("common_medium")
                      : t("common_hard")
                }
                sx={{
                  width: "fit-content",
                  color: "white",
                  backgroundColor:
                    difficulty === EContestProblemDifficulty.easy
                      ? "var(--green-600)"
                      : difficulty === EContestProblemDifficulty.medium
                        ? "var(--warning)"
                        : "var(--orange-2)"
                }}
                translation-key={["common_easy", "common_medium", "common_hard"]}
              />
            </Stack>
          </Link>
        </Grid>
        <Grid item justifyContent='end' xs={3}>
          <Stack direction={"row"}>
            <Divider orientation='vertical' flexItem />
            <Box
              className={clsx(classes.submissionContainer, classes.roundContainer)}
              onClick={scoreClickHandler}
            >
              <Typography fontSize={"20px"} className={classes.roundedInfoText}>
                {/* {submission !== undefined ? `${submission}/` : ""}
                {maxSubmission} */}
                {submission !== undefined ? `${submission}` : ""}
              </Typography>
              <Typography
                fontSize={"12px"}
                className={classes.roundedInfoText}
                translation-key='common_submit'
              >
                {t("common_submit")}
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
              <Typography
                fontSize={"12px"}
                className={classes.roundedInfoText}
                translation-key='common_score'
              >
                {t("common_score")}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContestProblemItem;
