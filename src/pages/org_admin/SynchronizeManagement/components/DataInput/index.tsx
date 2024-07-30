import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Typography } from "@mui/material";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import images from "config/images";
import classes from "./styles.module.scss";
import { useFormContext, Controller } from "react-hook-form";
import { routes } from "routes/routes";
import { OrganizationEntity } from "models/courseService/entity/OrganizationEntity";
import useAuth from "hooks/useAuth";
import { OrganizationService } from "services/courseService/OrganizationService";

const DataInput = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const [organization, setOrganization] = useState<OrganizationEntity | null>(null);
  const { loggedUser } = useAuth();

  const getOrganization = async (id: string) => {
    try {
      const response = await OrganizationService.getOrganization(id);
      return response;
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loggedUser) {
      getOrganization(loggedUser.organization.organizationId).then((res) => {
        if (res) {
          setOrganization(res);
        }
      });
    }
  }, [loggedUser]);

  useEffect(() => {
    if (organization) {
      setValue("moodleUrl", organization.moodleUrl || "");
      setValue("apiKey", organization.apiKey || "");
    }
  }, [organization, setValue]);

  return (
    <Grid container className={classes.dataInputContainer} spacing={3}>
      <Grid item xs={6} className={classes.inputContainer}>
        <Controller
          name='moodleUrl'
          control={control}
          defaultValue=''
          render={({ field, fieldState: { error } }) => (
            <Box>
              <InputTextFieldColumn
                {...field}
                label={t("Moodle URL")}
                title={t("Moodle URL")}
                placeholder={t("Enter URL...")}
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
                label={t("API KEY")}
                title={t("API KEY")}
                placeholder='Enter API KEY...'
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
          To read the instructions please
          <a href={`#${routes.org_admin.guide.root}`} target='_blank' rel='noopener noreferrer'>
            {" click here "}
          </a>
          to read
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
