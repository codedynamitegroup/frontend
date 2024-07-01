import React from "react";
import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import Heading5 from "components/text/Heading5";
import { routes } from "routes/routes";
import images from "config/images";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer>
      <Grid container id={classes.footerTop}>
        <Grid item xs={12} md={5} className={classes.footerListItem}>
          <Box className={classes.logo}>
            <img src={images.logo.appLogo} alt='logo' />
          </Box>
          <ParagraphBody paragraph translation-key='footer_description' colorname='--gray-5'>
            {t("footer_description")}
          </ParagraphBody>
        </Grid>
        <Grid item xs={12} md={1} />

        <Grid item xs={6} md={3} className={classes.footerListItem}>
          <Heading5 translation-key='footer_resource_link_title' colorname='--gray-20'>
            {t("footer_resource_link_title")}
          </Heading5>
          <ParagraphBody colorname='--gray-20'>
            <Link
              to={routes.user.course_certificate.root}
              className={classes.textLink}
              translation-key='header_explore_course'
            >
              {t("header_explore_course")}
            </Link>
          </ParagraphBody>
          <ParagraphBody colorname='--gray-20'>
            <Link
              to={routes.user.problem.root}
              className={classes.textLink}
              translation-key='common_practice'
            >
              {t("common_practice")}
            </Link>
          </ParagraphBody>
          <ParagraphBody colorname='--gray-20'>
            <Link
              to={routes.user.contest.root}
              className={classes.textLink}
              translation-key='footer_link_contest'
            >
              {t("footer_link_contest")}
            </Link>
          </ParagraphBody>
        </Grid>

        <Grid item xs={6} md={3} className={classes.footerListItem}>
          <Heading5 colorname='--gray-20' translation-key='footer_about_title'>
            {t("footer_about_title")}
          </Heading5>
          <ParagraphBody colorname='--gray-20'>
            <Link
              to={routes.user.organization.root}
              className={classes.textLink}
              translation-key='header_create_organization'
            >
              {t("header_create_organization")}
            </Link>
          </ParagraphBody>
        </Grid>
      </Grid>

      <Grid container id={classes.footerBottom}>
        <Heading5 translation-key='footer_copyright'>
          © 2024 {t("footer_copyright")}: CodeDynamite
        </Heading5>
      </Grid>
    </footer>
  );
}
