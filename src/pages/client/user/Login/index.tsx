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
export default function Login() {
  const navigate = useNavigate();
  const handleLogin = () => {
    localStorage.setItem("user", "HIEUTHUHAI");
    navigate(routes.user.dashboard.root);
  };
  return (
    <Box className={classes.container}>
      <Container>
        <Grid container className={classes.loginContainer}>
          <Grid item xs={12} md={6}>
            <img src={images.login} alt='login' className={classes.imageLogin} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.form}>
              <Typography variant='h4' className={classes.title}>
                Đăng nhập
              </Typography>
              <form className={classes.formControl}>
                <TextField label='Email' margin='normal' name='email' required variant='outlined' />
                <TextField
                  label='Mật khẩu'
                  margin='normal'
                  name='password'
                  required
                  type='password'
                  variant='outlined'
                />
                <Button
                  className={classes.submit}
                  color='primary'
                  type='submit'
                  variant='contained'
                  onClick={handleLogin}
                >
                  Đăng nhập
                </Button>
                <Box className={classes.option}>
                  <Link component={RouterLink} to={routes.user.register.root} variant='body2'>
                    {"Chưa có tài khoản? Đăng ký"}
                  </Link>
                  <Link
                    component={RouterLink}
                    to={routes.user.forgot_password.root}
                    variant='body2'
                  >
                    {"Quên mật khẩu?"}
                  </Link>
                </Box>
                <ParagraphBody>Hoặc đăng nhập với</ParagraphBody>
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
