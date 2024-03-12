import React from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import images from "config/images";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
export default function Register() {
  const { t } = useTranslation();
  return (
    <Box className={classes.container}>
      <Container>
        <Grid container className={classes.loginContainer}>
          <Grid item xs={12} md={6}>
            <img src={images.login} alt='login' className={classes.imageLogin} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.form}>
              <Typography
                variant='h4'
                className={classes.title}
                translation-key='header_register_button'
              >
                {t("header_register_button")}
              </Typography>
              <form className={classes.formControl}>
                <TextField label='Email' margin='normal' name='email' required variant='outlined' />
                <TextField
                  label={t("common_password")}
                  margin='normal'
                  name='password'
                  required
                  type='password'
                  variant='outlined'
                  translation-key='common_password'
                />
                <TextField
                  label={t("common_password_confirm")}
                  margin='normal'
                  name='password'
                  required
                  type='password'
                  variant='outlined'
                  translation-key='common_password_confirm'
                />
                <Button
                  className={classes.submit}
                  color='primary'
                  type='submit'
                  variant='contained'
                  translation-key='header_register_button'
                >
                  {t("header_register_button")}
                </Button>
                <Link
                  component={RouterLink}
                  to={routes.user.login.root}
                  variant='body2'
                  translation-key='register_have_account'
                >
                  {t("register_have_account")}
                </Link>
                <ParagraphBody translation-key='register_login_alternative'>
                  {t("register_login_alternative")}
                </ParagraphBody>
                <Box className={classes.social}>
                  <Button className={`${classes.socialIconGoogle} ${classes.socialIcon}`}>
                    <FontAwesomeIcon icon={faGoogle} />
                  </Button>
                  <Button className={`${classes.socialIconMicrosoft} ${classes.socialIcon}`}>
                    <FontAwesomeIcon icon={faMicrosoft} />
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
