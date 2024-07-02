import { Grid, Skeleton, Stack } from "@mui/material";

const PreviewQuestionSkeleton = ({ showSkeleton }: { showSkeleton: Boolean }) => {
  return (
    showSkeleton && (
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Skeleton variant='text' height={30} width={360} />

            <Skeleton variant='rounded' width={120} height={40} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={12}>
          <Stack direction={"row"} spacing={2}>
            <Skeleton variant='rounded' width={115} height={30} />
            <Skeleton variant='rounded' width={115} height={30} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={12}>
          <Skeleton variant='rounded' width={"100%"} height={200} />
        </Grid>
      </Grid>
    )
  );
};

export default PreviewQuestionSkeleton;
