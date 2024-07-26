import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Typography } from "@mui/material";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import images from "config/images";
import classes from "./styles.module.scss";
import { useFormContext, Controller } from "react-hook-form";
import { routes } from "routes/routes";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

const DataInput = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const navigate = useNavigate();

  return (
    <Grid container className={classes.dataInputContainer} spacing={3}>
      <Grid item xs={6} className={classes.inputContainer}>
        <Controller
          name='url'
          control={control}
          defaultValue=''
          render={({ field, fieldState: { error } }) => (
            <Box>
              <InputTextFieldColumn
                {...field}
                label={t("Nhập đường liên kết")}
                title={t("Nhập đường liên kết")}
                required
                fullWidth
                className={classes.inputField}
                error={!!error}
              />
              {error && (
                <Typography color='error' variant='body2' className={classes.errorText}>
                  {error.message}
                </Typography>
              )}
            </Box>
          )}
        />
        <Controller
          name='apiKey'
          control={control}
          defaultValue=''
          render={({ field, fieldState: { error } }) => (
            <Box>
              <InputTextFieldColumn
                {...field}
                label={t("Nhập api key")}
                title={t("Nhập api key")}
                required
                fullWidth
                className={classes.inputField}
                error={!!error}
              />
              {error && (
                <Typography color='error' variant='body2' className={classes.errorText}>
                  {error.message}
                </Typography>
              )}
            </Box>
          )}
        />
        <Typography variant='body2' className={classes.guideText}>
          Để đọc hướng dẫn vui lòng
          <a href={`#${routes.org_admin.guide.root}`} target='_blank' rel='noopener noreferrer'>
            {t(" nhấn vào đây ")}
          </a>
          để đọc
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Box className={classes.image}>
          <img
            className={classes.image}
            src={images.org_admin.organizationImageBg}
            alt={t("Organization")}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default DataInput;
