import { Box, Divider, Grid } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { ELevelProblem, IRecommendedProblem } from "../..";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import images from "config/images";
import Heading4 from "components/text/Heading4";
import { useTranslation } from "react-i18next";

type Props = {
  recommendProblem: IRecommendedProblem;
};

const RecommendProblemCard = ({ recommendProblem }: Props) => {
  const { t } = useTranslation();
  const renderTextLevel = (level: number) => {
    if (level === ELevelProblem.Easy) {
      return t("list_problem_difficult_level_easy");
    } else if (level === ELevelProblem.Medium) {
      return t("list_problem_difficult_level_medium");
    }
    return t("list_problem_difficult_level_hard");
  };

  return (
    <Box className={classes.recommendProblemCardWrapper}>
      <Grid container direction={"column"} margin={0} gap={2}>
        <Grid item container xs={6} className={classes.titleRecommendProblem}>
          <Grid item xs={12} className={classes.nameRecommendProblem}>
            <Heading4>{recommendProblem.title}</Heading4>
          </Grid>
        </Grid>
        <Divider />
        <Grid item xs={6}>
          <Box className={classes.iconRecommendProblem}>
            <PeopleAltIcon className={classes.iconPeople} />
            <ParagraphBody>{recommendProblem.numberStudiedPeople} Người đã làm bài</ParagraphBody>
          </Box>
          <Box className={classes.iconRecommendProblem}>
            <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
            <ParagraphBody
              translation-key={[
                "list_problem_difficult_level_easy",
                "list_problem_difficult_level_medium",
                "list_problem_difficult_level_hard"
              ]}
            >
              {renderTextLevel(recommendProblem.level)}
            </ParagraphBody>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecommendProblemCard;
