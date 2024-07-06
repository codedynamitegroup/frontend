import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import images from "config/images";
import classes from "./styles.module.scss";

const DataInput = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Grid container className={classes.dataInputContainer} spacing={3}>
      <Grid item xs={6} className={classes.inputContainer}>
        <InputTextFieldColumn
          label={t("Nhập đường liên kết")}
          title={t("Nhập đường liên kết")}
          value={""}
          onChange={(e) => {}}
          required
          fullWidth
          className={classes.inputField}
        />
        <InputTextFieldColumn
          label={t("Nhập api key")}
          title={t("Nhập api key")}
          value={""}
          onChange={(e) => {}}
          required
          fullWidth
          className={classes.inputField}
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
