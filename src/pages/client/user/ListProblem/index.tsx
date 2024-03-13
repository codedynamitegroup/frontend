import { Box, Chip, Container, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { useState } from "react";
import LabTabs from "./components/TabTopic";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import BasicSelect from "components/common/select/BasicSelect";
import { useTranslation } from "react-i18next";

const ListProblem = () => {
  const [levelProblem, setlevelProblem] = useState("0");
  const [statusProblem, setstatusProblem] = useState("0");
  const { t } = useTranslation();

  const algorithms = t("list_problem_algorithms", { returnObjects: true }) as Array<string>;
  return (
    <>
      <Box
        id={classes.banner}
        sx={{
          backgroundImage: `url(${images.background.homePageBackground})`
        }}
      >
        <Container id={classes.bannerContainer} className={classes.container}>
          <Heading1 colorname={"--white"} translation-key='list_problem_practice'>
            {t("list_problem_practice")}
          </Heading1>
          <Heading3 colorname={"--white"} translation-key='list_problem_call_to_action'>
            {t("list_problem_call_to_action")}
          </Heading3>
          <Box id={classes.bannerSearch}>
            <Box className={classes.filterSearch}>
              <OutlinedInput
                size='small'
                fullWidth
                translation-key='list_problem_search'
                placeholder={t("list_problem_search")}
                startAdornment={
                  <InputAdornment position='start'>
                    <SearchIcon className={classes.icon} />
                  </InputAdornment>
                }
                className={classes.searchInput}
              />
              <BasicSelect
                labelId='select-assignment-section-label'
                value={statusProblem}
                onHandleChange={(value) => setstatusProblem(value)}
                sx={{ maxWidth: "200px" }}
                translation-key={[
                  "list_problem_solved_all",
                  "list_problem_solved_done",
                  "list_problem_solved_not_done"
                ]}
                items={[
                  {
                    value: "0",
                    label: t("list_problem_solved_all")
                  },
                  {
                    value: "1",
                    label: t("list_problem_solved_done")
                  },
                  {
                    value: "2",
                    label: t("list_problem_solved_not_done")
                  }
                ]}
                backgroundColor='#FFFFFF'
              />
              <BasicSelect
                labelId='select-assignment-section-label'
                value={levelProblem}
                onHandleChange={(value) => setlevelProblem(value)}
                sx={{ maxWidth: "200px" }}
                translation-key={[
                  "list_problem_difficult_level_all",
                  "list_problem_difficult_level_easy",
                  "list_problem_difficult_level_medium",
                  "list_problem_difficult_level_hard"
                ]}
                items={[
                  {
                    value: "0",
                    label: t("list_problem_difficult_level_all")
                  },
                  {
                    value: "1",
                    label: t("list_problem_difficult_level_easy")
                  },
                  {
                    value: "2",
                    label: t("list_problem_difficult_level_medium")
                  },
                  {
                    value: "3",
                    label: t("list_problem_difficult_level_hard")
                  }
                ]}
                backgroundColor='#FFFFFF'
              />
            </Box>
          </Box>
        </Container>
      </Box>
      <Box>
        <Container className={classes.container}>
          <Box className={classes.boxContent}>
            <Grid container>
              <Grid item xs={2.5}>
                <Box className={classes.algorithmContainer}>
                  <Heading3 translation-key='list_problem_type_of_algorithm'>
                    {t("list_problem_type_of_algorithm")}
                  </Heading3>
                  <Box className={classes.algorithm} translation-key='list_problem_algorithms'>
                    {algorithms.map((algorithm, index) => (
                      <Box className={classes.algorithmItem} key={index}>
                        <ParagraphBody>{algorithm}</ParagraphBody>
                        <Chip label={index} size='small' className={classes.chip} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={9}>
                <Box className={classes.topic}>
                  <LabTabs />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ListProblem;
