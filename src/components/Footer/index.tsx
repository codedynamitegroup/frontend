import React from "react";
import { Grid, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import images from "config/images";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Grid container className={classes.root}>
      <Grid container padding={4} className={classes.section}>
        {/* Company Info */}
        <Grid item xs={12} md={5}>
          <Box className={classes.logo}>
            <img className={classes.imageLogo} src={images.logo.logo} alt='logo' />
          </Box>
          <Typography paragraph translation-key='footer_description'>
            {t("footer_description")}
          </Typography>
        </Grid>
        <Grid item xs={12} md={1} />

        {/* Products */}
        <Grid item xs={6} md={3}>
          <Typography variant='h6' gutterBottom translation-key='footer_resource_link_title'>
            {t("footer_resource_link_title")}
          </Typography>
          <Typography paragraph>
            <Link to='#!' className='text-reset' translation-key='footer_link_course'>
              {t("footer_link_course")}
            </Link>
          </Typography>
          <Typography paragraph>
            <Link to='#!' className='text-reset' translation-key='footer_link_practice'>
              {t("footer_link_practice")}
            </Link>
          </Typography>
          <Typography paragraph>
            <Link to='#!' className='text-reset' translation-key='footer_link_contest'>
              {t("footer_link_contest")}
            </Link>
          </Typography>
        </Grid>

        {/* Useful Links */}
        <Grid item xs={6} md={3}>
          <Typography variant='h6' gutterBottom translation-key='footer_about_title'>
            {t("footer_about_title")}
          </Typography>
          <Typography paragraph>
            <Link to='#!' className='text-reset' translation-key='footer_link_about_us'>
              {t("footer_link_about_us")}
            </Link>
          </Typography>
          <Typography paragraph>
            <Link to='#!' className='text-reset' translation-key='footer_link_contact'>
              {t("footer_link_contact")}
            </Link>
          </Typography>
        </Grid>
      </Grid>

      {/* Footer Bottom */}
      <Grid container justifyContent='center' padding={4} style={{ backgroundColor: "white" }}>
        <Typography variant='body1' translation-key='footer_copyright'>
          © 2024 {t("footer_copyright")}: 6BrosT
        </Typography>
      </Grid>
    </Grid>
  );
}
