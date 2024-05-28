import React from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import images from "config/images";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation();
  return (
    <Box id={classes.forgotPasswordRoot}>
      <Container>
        <Grid container className={classes.forgotPasswordContainer}>
          <Grid item xs={12} md={6}>
            <img src={images.forgotpassword} alt='forgot' className={classes.imageLogin} />
          </Grid>
          <Grid item xs={12} md={6} className={classes.centerForm}>
            <Box className={classes.form}>
              <Typography
                variant='h4'
                className={classes.title}
                translation-key='common_forget_password'
              >
                {t("common_forget_password")}
              </Typography>
              <Box className={classes.formContent}>
                <Box
                  className={classes.formContentTitle}
                  translation-key='forget_password_description'
                >
                  {t("forget_password_description")}
                </Box>
              </Box>
              <form className={classes.formControl}>
                <TextField label='Email' margin='normal' name='email' required variant='outlined' />
                <Button
                  className={classes.submit}
                  color='primary'
                  type='submit'
                  variant='contained'
                  translation-key='common_send'
                >
                  {t("common_send")}
                </Button>
              </form>
            </Box>
            <Box className={classes.back}>
              <Link
                component={RouterLink}
                to={routes.user.login.root}
                translation-key='forget_password_back_link'
                className={classes.textLink}
              >{`< ${t("forget_password_back_link")}`}</Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
