import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import ExportIcon from "@mui/icons-material/SystemUpdateAlt";
const GradeSummary = () => {
  return (
    <Paper className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box className={classes.courseDetail}>
            <Box>
              <Typography variant='h4'>Tên khóa học</Typography>
              <Typography sx={{ color: "var(--gray-20)" }}>mô tả khóa học</Typography>
            </Box>
            <Button startIcon={<ExportIcon />} variant='outlined' className={classes.exportButton}>
              Xuất dữ liệu
            </Button>
          </Box>
        </Grid>

        <Grid item xs={2} sx={{ m: 1 }}>
          <Typography sx={{ color: "var(--gray-30)" }}>Điểm trung bình</Typography>
          <Box component='span' className={classes.textBadge}>
            <Typography variant='h5'>100</Typography>
          </Box>
        </Grid>
        <Grid item xs={2} sx={{ m: 1 }}>
          <Typography sx={{ color: "var(--gray-30)" }}>Số mục đã nộp</Typography>
          <Box component='span' className={classes.textBadge}>
            <Typography variant='h5'>7</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GradeSummary;
