import { Box, Container, Stack, Grid } from "@mui/material";
import Heading4 from "components/text/Heading4";
import classes from "./styles.module.scss";
import RecommendedItem from "../RecommendedItem";
const RecommendedProblem = () => {
  return (
    <Container className={classes.container}>
      <Box className={classes.boxContent}>
        <Heading4 marginBottom={1}>Gợi ý bài tập cần làm:</Heading4>
        <Stack spacing={2} direction='row'>
          <RecommendedItem problemName='Tổng 2 số' difficultLevel='Dễ' />
          <RecommendedItem problemName='Phân số tối giản' difficultLevel='Trung bình' />
        </Stack>
      </Box>
    </Container>
  );
};

export default RecommendedProblem;
