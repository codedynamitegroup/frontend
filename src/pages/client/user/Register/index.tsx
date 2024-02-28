import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import classes from "./styles.module.scss";
import { Container, Grid, Icon, IconButton } from "@mui/material";
import Header from "components/Header";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import images from "config/images";
import ParagraphBody from "components/text/ParagraphBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
export default function Register() {
  return (
    <Grid className={classes.root}>
      <Header />
      <Box className={classes.container}>
        <Container>
          <Grid container spacing={2} className={classes.loginContainer}>
            <Grid item xs={12} md={6}>
              <img src={images.login} alt='login' className={classes.imageLogin} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={classes.form}>
                <Typography variant='h4' className={classes.title}>
                  Đăng ký
                </Typography>
                <form className={classes.formControl}>
                  <TextField
                    label='Email'
                    margin='normal'
                    name='email'
                    required
                    variant='outlined'
                  />
                  <TextField
                    label='Mật khẩu'
                    margin='normal'
                    name='password'
                    required
                    type='password'
                    variant='outlined'
                  />
                  <TextField
                    label='Xác nhận mật khẩu'
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
                  >
                    Đăng ký
                  </Button>
                  <Link href='/login' variant='body2'>
                    {"Đã có tài khoản? Đăng nhập"}
                  </Link>
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
    </Grid>
  );
}
