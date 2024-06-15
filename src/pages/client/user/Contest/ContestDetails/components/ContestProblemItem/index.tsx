import { Box, Chip, Divider, Grid, Link, Paper, Stack } from "@mui/material";
import clsx from "clsx";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";
import classes from "./styles.module.scss";

export enum EContestProblemDifficulty {
  easy = "easy",
  medium = "medium",
  advance = "advance"
}

interface PropsData {
  contestId: string;
  problemId: string;
  name: string;
  maxScore: number;
  point?: number;
  difficulty: string;
  submission?: number;
  maxSubmission: number;
}

const ContestProblemItem = (props: PropsData) => {
  const { contestId, problemId, name, maxScore, point, difficulty, submission, maxSubmission } =
    props;
  const { t } = useTranslation();

  return (
    <Paper className={classes.container}>
      <Grid container alignItems={"center"} justifyContent='space-between'>
        <Grid item xs={9}>
          <Link
            component={RouterLink}
            to={routes.user.contest.detail.problems.description
              .replace(":contestId", contestId)
              .replace(":problemId", problemId)}
            underline='none'
          >
            <Stack direction={"column"} className={classes.problemDetailContainer}>
              <TextTitle className={classes.problemNameText}>{name}</TextTitle>

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
            <Box className={clsx(classes.submissionContainer, classes.roundContainer)}>
              <ParagraphBody fontSize={"20px"} className={classes.roundedInfoText}>
                {submission !== undefined ? `${submission}` : ""}
              </ParagraphBody>
              <ParagraphBody
                fontSize={"12px"}
                className={classes.roundedInfoText}
                translation-key='common_submit'
              >
                {t("common_submit")}
              </ParagraphBody>
            </Box>

            <Box
              className={clsx(classes.scoreContainer, classes.roundContainer)}
              // onClick={submissionTryClickHandler}
            >
              <ParagraphBody fontSize={"20px"} className={classes.roundedInfoText}>
                {point !== undefined ? `${point}/` : ""}
                {maxScore}
              </ParagraphBody>
              <ParagraphBody
                fontSize={"12px"}
                className={classes.roundedInfoText}
                translation-key='common_score'
              >
                {t("common_score")}
              </ParagraphBody>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContestProblemItem;
