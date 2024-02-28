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
export default function Forgotpassword() {
  return (
    <Grid className={classes.root}>
      <Header />
      <Box className={classes.container}>
        <Container>
          <Grid container spacing={2} className={classes.loginContainer}>
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
                  <TextField
                    label='Email'
                    margin='normal'
                    name='email'
                    required
                    variant='outlined'
                  />
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
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Grid>
  );
}
