import { Box, createTheme, Theme, Stack, Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { blue, grey } from "@mui/material/colors";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const CreateEssayExercises = () => {
  const theme: Theme = createTheme();
  return (<Box className="create-essay"
    sx={{ flexGrow: 1, height: "100vh", minWidth: "236px" }}>

    <Grid container sx={{ height: 1 }}>

      <Grid container xs={12} md={8} sx={{ height: "100%", background: blue }}>
        <Grid xs={12} height={48} container alignItems={"center"} borderBottom={1}>
          <Grid sx={{ padding: theme.spacing(1), textAlign: "center" }}><ArrowBackIcon /></Grid>
          <Grid sx={{ padding: theme.spacing(1), textAlign: "center" }}>Bài tập tự luận</Grid>
        </Grid>

        <Grid xs={12} height={`calc(100% - 48px)`} sx={{ background: grey[100] }} container>
          <Box border={1} marginX={"5%"} width={1} marginY={"3%"} borderRadius={"10px"} sx={{ background: "white" }} >
            <Stack direction={"column"} spacing={"23px"} margin={"25px"}>
              <Grid container height={"44px"} borderRadius={"5px"} sx={{ background: blue[100] }} alignItems={"center"}>
                <Stack direction={"column"} spacing={"5px"} marginX={"35px"}>
                  <Grid xs={12}>Tên bài tập</Grid>
                  <Grid xs={12} border={1}></Grid>
                </Stack>

              </Grid>
              <Divider></Divider>
              <Box>Tên bài tập</Box>
              <Box>Tên bài tập</Box>
              <Box>Tên bài tập</Box>
              <Box>Tên bài tập</Box>
            </Stack>
          </Box>

        </Grid>
      </Grid>
      <Grid xs={12} md={4} borderLeft={1}>
        <div>hi</div>
      </Grid>
    </Grid>
  </Box>);
}

export default CreateEssayExercises;