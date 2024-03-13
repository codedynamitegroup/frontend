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
          <Heading1 colorname={"--white"}>{t("list_problem_practice")}</Heading1>
          <Heading3 colorname={"--white"}>
            Bạn muốn rèn luyện khả năng lập trình của bạn ? Hãy thử luyện tập ngay
          </Heading3>
          <Box id={classes.bannerSearch}>
            <Box className={classes.filterSearch}>
              <OutlinedInput
                size='small'
                fullWidth
                placeholder='Tìm kiếm'
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
                items={[
                  {
                    value: "0",
                    label: "Tất cả"
                  },
                  {
                    value: "1",
                    label: "Đã giải"
                  },
                  {
                    value: "2",
                    label: "Chưa giải"
                  }
                ]}
                backgroundColor='#FFFFFF'
              />
              <BasicSelect
                labelId='select-assignment-section-label'
                value={levelProblem}
                onHandleChange={(value) => setlevelProblem(value)}
                sx={{ maxWidth: "200px" }}
                items={[
                  {
                    value: "0",
                    label: "Tất cả"
                  },
                  {
                    value: "1",
                    label: "Dễ"
                  },
                  {
                    value: "2",
                    label: "Trung bình"
                  },
                  {
                    value: "3",
                    label: "Khó"
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
                  <Heading3>Các loại giải thuật:</Heading3>
                  <Box className={classes.algorithm}>
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
