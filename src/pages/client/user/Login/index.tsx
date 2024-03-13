import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import images from "config/images";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { useTranslation } from "react-i18next";
import { em } from "@fullcalendar/core/internal-common";
import { useState } from "react";
export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleLogin = () => {
    localStorage.setItem("user", "HIEUTHUHAI");
    if (email === "guest") {
      navigate(routes.user.dashboard.root);
    } else if (email === "lecturer") {
      navigate(routes.lecturer.course.management);
    }
  };
  const [email, setEmail] = useState("");
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
                translation-key='header_login_button'
              >
                {t("header_login_button")}
              </Typography>
              <form className={classes.formControl}>
                <TextField
                  label='Email'
                  margin='normal'
                  name='email'
                  required
                  variant='outlined'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label={t("common_password")}
                  margin='normal'
                  name='password'
                  required
                  type='password'
                  variant='outlined'
                  translation-key='common_password'
                />
                <Button
                  className={classes.submit}
                  color='primary'
                  type='submit'
                  variant='contained'
                  onClick={handleLogin}
                  translation-key='header_login_button'
                >
                  {t("header_login_button")}
                </Button>
                <Box className={classes.option}>
                  <Link
                    component={RouterLink}
                    to={routes.user.register.root}
                    variant='body2'
                    translation-key='login_register_account'
                  >
                    {t("login_register_account")}
                  </Link>
                  <Link
                    component={RouterLink}
                    to={routes.user.forgot_password.root}
                    variant='body2'
                    translation-key='common_forget_password'
                  >
                    {t("common_forget_password")}
                  </Link>
                </Box>
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
