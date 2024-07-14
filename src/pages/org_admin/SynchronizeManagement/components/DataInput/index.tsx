import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Typography } from "@mui/material";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import images from "config/images";
import classes from "./styles.module.scss";
import { useFormContext, Controller } from "react-hook-form";

const DataInput = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

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
