import React from "react";
import classes from "./styles.module.scss";
import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import Heading6 from "components/text/Heading6";
import Heading3 from "components/text/Heading3";
import DateRangeIcon from "@mui/icons-material/DateRange";

interface PropsData {
  name: string;
  description: string;
  avtImage: any;
}
const ContestContentCard = (props: PropsData) => {
  const { name, description, avtImage } = props;

  const chipClickHandle = () => {};
  return (
    <Paper className={classes.container}>
      <Grid container alignItems='center' spacing={2}>
        <Grid item xs={10}>
          <Box className={classes.contestInfo}>
            <Grid container>
              <Grid item xs={12}>
                <Stack className={classes.contestTypeContainer} direction='row' spacing={0.5}>
                  <Chip size='small' label='DSA' variant='outlined' onClick={chipClickHandle} />
                  <Chip size='small' label='OOP' variant='outlined' onClick={chipClickHandle} />
                  <Chip size='small' label='Java' variant='outlined' onClick={chipClickHandle} />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Heading3 color={"#2a2a2a"}>{name}</Heading3>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  fontFamily='Roboto,Helvetica,Arial,sans-serif'
                  fontWeight={400}
                  fontSize='16px'
                  color='#2a2a2a'
                >
                  {description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction={"row"} alignItems={"center"}>
                  <DateRangeIcon fontSize='small' />
                  <Heading6 colorName={"--gray-80"} fontWeight={40} margin='10px 0 10px 5px'>
                    Chủ nhật 27/02/2024 9:30 AM GMT+7
                  </Heading6>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <img src={avtImage} alt='Contest' className={classes.contestImage} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContestContentCard;
