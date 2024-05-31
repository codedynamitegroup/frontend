import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Heading2 from "components/text/Heading2";
import RecommendProblemCard from "./components/RecommendProblemCard";
import { useTranslation } from "react-i18next";

export enum ELevelProblem {
  Easy = 1,
  Medium = 2,
  Hard = 3
}
export interface IRecommendedProblem {
  title: string;
  level: ELevelProblem;
  numberStudiedPeople: number;
}

const RecommendedProblem = () => {
  const { t } = useTranslation();
  const recommendedProblems: IRecommendedProblem[] = [
    {
      title: "Sắp xếp mảng tăng dần",
      level: 1,
      numberStudiedPeople: 100
    },
    {
      title: "Tổng 2 số",
      level: 2,
      numberStudiedPeople: 100
    },
    {
      title: "Phân số tối giản",
      level: 2,
      numberStudiedPeople: 100
    }
  ];
  return (
    <Box className={classes.recommendedProblemsWrapper}>
      <Heading2 translation-key='list_problem_hot_problem'>
        {t("list_problem_hot_problem")}
      </Heading2>
      <Grid container spacing={3}>
        {recommendedProblems.map((recommendedProblem, index) => (
          <Grid item xs={4} key={index}>
            <RecommendProblemCard recommendProblem={recommendedProblem} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecommendedProblem;
