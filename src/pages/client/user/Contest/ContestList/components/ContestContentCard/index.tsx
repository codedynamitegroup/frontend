import React from "react";
import classes from "./styles.module.scss";
import { Box, Chip, Grid, Paper, Stack } from "@mui/material";
import Heading4 from "components/text/Heading4";
import Heading6 from "components/text/Heading6";

const ContestContentCard = () => {
  const IMG_URL = "https://picsum.photos/400/300";
  const chipClickHandle = () => {};
  return (
    <Paper className={classes.container}>
      <Grid container alignItems='center' spacing={2}>
        <Grid item xs={2}>
          <img src={IMG_URL} alt='Contest' className={classes.contestImage} />
        </Grid>
        <Grid item xs={10}>
          <Box className={classes.contestInfo}>
            <Grid container>
              <Grid item xs={12}>
                <Stack className={classes.contestTypeContainer} direction='row' spacing={0.5}>
                  <Chip size='small' label='Loại' variant='outlined' onClick={chipClickHandle} />
                  <Chip
                    size='small'
                    label='Chip Outlined'
                    variant='outlined'
                    onClick={chipClickHandle}
                  />
                  <Chip
                    size='small'
                    label='Chip Outlined'
                    variant='outlined'
                    onClick={chipClickHandle}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Heading4>Tên cuộc thi</Heading4>
              </Grid>
              <Grid item xs={12}>
                <Heading6 colorName={"--gray-80"} fontWeight={40}>
                  Chủ nhật 27/02/2024 9:30 AM GMT+7
                </Heading6>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContestContentCard;
