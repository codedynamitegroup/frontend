import React from "react";
import { Grid, Typography, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./styles.module.scss";
import images from "config/images";
import Box from "@mui/material/Box";
import {
  faFacebook,
  faTwitter,
  faGoogle,
  faInstagram,
  faLinkedin,
  faGithub
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <Grid container className={classes.root}>
      {/* Social Media Section */}

      {/* Content Section */}
      <Grid container padding={4} className={classes.section}>
        {/* Company Info */}
        <Grid item xs={12} md={5}>
          <Box className={classes.logo}>
            <img className={classes.imageLogo} src={images.logo.logo} alt='logo' />
          </Box>
          <Typography paragraph>
            6BrosT là một trang web giúp người dùng có thể học tập, thi đấu và cải thiện kỹ năng lập
            trình của mình.
          </Typography>
        </Grid>
        <Grid item xs={12} md={1} />

        {/* Products */}
        <Grid item xs={6} md={3}>
          <Typography variant='h6' gutterBottom>
            Tài nguyên học tập
          </Typography>
          <Typography paragraph>
            <a href='#!' className='text-reset'>
              Khóa học
            </a>
          </Typography>
          <Typography paragraph>
            <a href='#!' className='text-reset'>
              Luyện tập
            </a>
          </Typography>
          <Typography paragraph>
            <a href='#!' className='text-reset'>
              Cuộc thi
            </a>
          </Typography>
        </Grid>

        {/* Useful Links */}
        <Grid item xs={6} md={3}>
          <Typography variant='h6' gutterBottom>
            Về 6BrosT
          </Typography>
          <Typography paragraph>
            <a href='#!' className='text-reset'>
              Về chúng tôi
            </a>
          </Typography>
          <Typography paragraph>
            <a href='#!' className='text-reset'>
              Liên hệ
            </a>
          </Typography>
        </Grid>
      </Grid>

      {/* Footer Bottom */}
      <Grid container justifyContent='center' padding={4} style={{ backgroundColor: "white" }}>
        <Typography variant='body1'>© 2021 Copyright: 6BrosT</Typography>
      </Grid>
    </Grid>
  );
}
