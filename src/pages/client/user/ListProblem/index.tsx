import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Box, Chip, CircularProgress, Container, Grid, Stack } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import BasicSelect from "components/common/select/BasicSelect";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import { useAppDispatch, useAppSelector } from "hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  setAlgorithmTagList,
  setLoading as setLoadingAlgorithm
} from "reduxes/CodeAssessmentService/CodeQuestion/Filter/Algorithm";
import classes from "./styles.module.scss";

import cloneDeep from "lodash.clonedeep";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import {
  setDifficulty,
  setSearchKey,
  setSolved
} from "reduxes/CodeAssessmentService/CodeQuestion/Filter/SearchAndDifficultyAndSolved";
import { TagService } from "services/codeAssessmentService/TagService";
import ProblemTable from "./components/ProblemTable";
import RecommendedProblem from "./components/RecommendedProblem";
import useAuth from "hooks/useAuth";
import Heading2 from "components/text/Heading2";

const ListProblem = () => {
  const auth = useAuth();
  const [levelProblem, setlevelProblem] = useState("0");
  const [statusProblem, setstatusProblem] = useState("0");
  const { t } = useTranslation();

  const algorithmTag = useAppSelector((state) => state.algorithmnTag);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoadingAlgorithm(true));
    TagService.getAllTag(true)
      .then((data: TagEntity[]) => {
        dispatch(setAlgorithmTagList(data));
      })
      .catch((reason) => console.log(reason))
      .finally(() => dispatch(setLoadingAlgorithm(false)));
  }, [dispatch]);

  const [timer, setTimer] = useState<number | undefined>(undefined);

  const searchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (/\S/.test(e.target.value)) {
      //not blank
      clearTimeout(timer);

      const newTimer = window.setTimeout(() => {
        dispatch(setSearchKey(e.target.value));
      }, 1000);

      setTimer(newTimer);
    }
  };

  const handleFilterAlgorithm = (index: number) => {
    let newList = cloneDeep(algorithmTag.tagList);
    newList[index].isChoosen = !newList[index].isChoosen;
    dispatch(setAlgorithmTagList(newList));
  };

  const handleChangeSolved = (value: string) => {
    setstatusProblem(value);
    let newValue: boolean | null = null;
    if (value === "1") newValue = true;
    if (value === "2") newValue = false;
    dispatch(setSolved(newValue));
  };
  const handleChangeDifficulty = (value: string) => {
    setlevelProblem(value);
    let newValue: QuestionDifficultyEnum | null = null;
    if (value === "1") newValue = QuestionDifficultyEnum.EASY;
    if (value === "2") newValue = QuestionDifficultyEnum.MEDIUM;
    if (value === "3") newValue = QuestionDifficultyEnum.HARD;
    dispatch(setDifficulty(newValue));
  };

  // const algorithmTag = t("list_problem_algorithms", { returnObjects: true }) as Array<string>;
  return (
    <Box id={classes.listProblemRoot}>
      {/* <Box
        id={classes.banner}
        sx={{
          backgroundImage: `url(${images.background.homePageBackground})`
        }}
      >
        <Container id={classes.bannerContainer} className={classes.container}>
          <Heading1 translation-key='common_practice'>{t("common_practice")}</Heading1>
          <Heading3 translation-key='list_problem_call_to_action'>
            {t("list_problem_call_to_action")}
          </Heading3>
        </Container>
      </Box> */}
      <Box>
        <Container className={classes.container}>
          <Box className={classes.boxContent}>
            <Grid container>
              <Grid item xs={2.5}>
                <Box className={classes.algorithmContainer}>
                  <Heading3 translation-key='common_topic'>{t("common_topic")}:</Heading3>

                  <Box className={classes.algorithm} translation-key='list_problem_algorithms'>
                    {algorithmTag.isLoading && (
                      <Stack alignItems={"center"}>
                        <CircularProgress />
                      </Stack>
                    )}
                    {!algorithmTag.isLoading && (
                      <>
                        {algorithmTag.tagList.map(
                          (algorithm: any, index) =>
                            algorithm.isChoosen && (
                              <Chip
                                key={index}
                                id={algorithm.id}
                                onClick={() => {
                                  if (algorithm.id != null) handleFilterAlgorithm(index);
                                }}
                                sx={{
                                  border: 1,
                                  padding: "15px 8px",
                                  backgroundColor: "var(--gray-3)",
                                  fontFamily: "Montserrat"
                                }}
                                // label={algorithm.numOfCodeQuestion}
                                label={algorithm.name}
                                avatar={
                                  <Avatar
                                    sx={{
                                      bgcolor: "transparent",
                                      border: 1
                                    }}
                                  >
                                    {algorithm.numOfCodeQuestion}
                                  </Avatar>
                                }
                                size='small'
                              />
                            )
                        )}
                        {algorithmTag.tagList.map(
                          (algorithm, index) =>
                            !algorithm.isChoosen && (
                              <Chip
                                key={index}
                                id={algorithm.id}
                                onClick={() => {
                                  if (algorithm.id != null) handleFilterAlgorithm(index);
                                }}
                                sx={{
                                  padding: "15px 8px",
                                  backgroundColor: "var(--gray-2)",
                                  fontFamily: "Montserrat"
                                }}
                                // label={algorithm.numOfCodeQuestion}
                                label={algorithm.name}
                                avatar={
                                  <Avatar
                                    sx={{
                                      bgcolor: "transparent",
                                      border: 1
                                    }}
                                  >
                                    {algorithm.numOfCodeQuestion}
                                  </Avatar>
                                }
                                size='small'
                              />
                            )
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid container xs={0.5}></Grid>
              <Grid item xs={9}>
                <Box className={classes.topic}>
                  <Box
                    sx={{
                      backgroundImage:
                        "linear-gradient(180deg, rgb(255, 204, 128) 48%, rgb(255, 235, 204) 100%)"
                    }}
                    borderRadius={2}
                    paddingX={5}
                    paddingY={3.125}
                  >
                    <RecommendedProblem />
                  </Box>
                  <Heading1 translation-key='list_problem'>{t("list_problem")}</Heading1>

                  <Stack direction={"row"} spacing={2}>
                    <OutlinedInput
                      size='small'
                      fullWidth
                      translation-key='common_search'
                      placeholder={t("common_search")}
                      startAdornment={
                        <InputAdornment position='start'>
                          <SearchIcon className={classes.icon} />
                        </InputAdornment>
                      }
                      onChange={searchChange}
                      className={classes.searchInput}
                    />
                    {auth.isLoggedIn && (
                      <BasicSelect
                        labelId='select-assignment-section-label'
                        label={t("common_status")}
                        value={statusProblem}
                        onHandleChange={(value) => handleChangeSolved(value)}
                        sx={{ maxWidth: "200px" }}
                        translation-key={[
                          "common_status",
                          "common_all",
                          "list_problem_solved_done",
                          "list_problem_solved_not_done"
                        ]}
                        items={[
                          {
                            value: "0",
                            label: t("common_all")
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
                    )}
                    <BasicSelect
                      labelId='select-assignment-section-label'
                      value={levelProblem}
                      label={t("common_difficult_level")}
                      onHandleChange={(value) => handleChangeDifficulty(value)}
                      sx={{ maxWidth: "200px" }}
                      translation-key={[
                        "common_difficult_level",
                        "common_all",
                        "common_easy",
                        "common_medium",
                        "common_hard"
                      ]}
                      items={[
                        {
                          value: "0",
                          label: t("common_all")
                        },
                        {
                          value: "1",
                          label: t("common_easy")
                        },
                        {
                          value: "2",
                          label: t("common_medium")
                        },
                        {
                          value: "3",
                          label: t("common_hard")
                        }
                      ]}
                      backgroundColor='#FFFFFF'
                    />
                  </Stack>
                  <ProblemTable />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ListProblem;
