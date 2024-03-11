import React from "react";
import classes from "./styles.module.scss";
import { Container, Grid } from "@mui/material";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import images from "config/images";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";

export default function ForgotPassword() {
  return (
    <Box className={classes.container}>
      <Container>
        <Grid container className={classes.loginContainer}>
          <Grid item xs={12} md={6}>
            <img src={images.forgotpassword} alt='forgot' className={classes.imageLogin} />
          </Grid>
          <Grid item xs={12} md={6} className={classes.centerForm}>
            <Box className={classes.form}>
              <Typography variant='h4' className={classes.title}>
                Quên mật khẩu
              </Typography>
              <Box className={classes.formContent}>
                <Box className={classes.formContentTitle}>
                  Nhập địa chỉ email chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu
                </Box>
              </Box>
              <form className={classes.formControl}>
                <TextField label='Email' margin='normal' name='email' required variant='outlined' />
                <Button
                  className={classes.submit}
                  color='primary'
                  type='submit'
                  variant='contained'
                >
                  Gửi
                </Button>
              </form>
            </Box>
            <Box className={classes.back}>
              <Link
                component={RouterLink}
                to={routes.user.login.root}
              >{`< Quay lại trang đăng nhập`}</Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
