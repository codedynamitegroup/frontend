import { Box, Grid, Skeleton } from "@mui/material";
import classes from "./styles.module.scss";
import Heading2 from "components/text/Heading2";
import RecommendProblemCard from "./components/RecommendProblemCard";
import { useTranslation } from "react-i18next";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { useEffect, useState } from "react";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import { dA } from "@fullcalendar/core/internal-common";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";

export interface IRecommendedProblem {
  id: string;
  title: string;
  level: QuestionDifficultyEnum;
  numberStudiedPeople: number;
}

const RecommendedProblem = () => {
  const { t } = useTranslation();
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendCodeQuestion, setRecommendCodeQuestion] = useState<CodeQuestionEntity[]>([]);
  useEffect(() => {
    setRecommendLoading(true);
    CodeQuestionService.getRecommendedCodeQuestion()
      .then((data: CodeQuestionEntity[]) => {
        setRecommendCodeQuestion(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setRecommendLoading(false);
      });
  }, []);

  return (
    <Box className={classes.recommendedProblemsWrapper}>
      <Heading2 translation-key='list_problem_recommended_problem'>
        {t("list_problem_recommended_problem")}
      </Heading2>
      <Grid container spacing={3}>
        {recommendLoading &&
          [0, 1, 2].map((_, index) => (
            <Grid item xs={4} key={index}>
              <Skeleton variant='rounded' width={"100%"} height={200} />
            </Grid>
          ))}
        {!recommendLoading &&
          recommendCodeQuestion.map(
            (recommendedProblem, index) =>
              index < 3 && (
                <Grid item xs={4} key={index}>
                  <RecommendProblemCard
                    recommendProblem={{
                      id: recommendedProblem.id,
                      title: recommendedProblem.name,
                      level: recommendedProblem.difficulty,
                      numberStudiedPeople: recommendedProblem.numOfPeopleAttend
                    }}
                  />
                </Grid>
              )
          )}
      </Grid>
    </Box>
  );
};

export default RecommendedProblem;
