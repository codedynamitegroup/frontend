import { Checkbox, FormControlLabel, Grid, Stack } from "@mui/material";
import ErrorMessage from "components/text/ErrorMessage";
import Heading4 from "components/text/Heading4";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IFormDataType } from "..";

interface ContestEditDetailsProps {
  control: Control<IFormDataType, any>;
  errors: FieldErrors<IFormDataType>;
  setValue: UseFormSetValue<IFormDataType>;
  watch: UseFormWatch<IFormDataType>;
}

const ContestEditAdvancedSettings = ({
  control,
  errors,
  setValue,
  watch
}: ContestEditDetailsProps) => {
  const { t } = useTranslation();
  return (
    <Grid
      container
      gap={2}
      direction='column'
      sx={{
        margin: "0px 20px -80px 20px",
        width: "calc(100% - 40px)",
        height: "100%"
      }}
    >
      <Grid item xs={12}>
        <Heading4 translate-key='contest_forum'>{t("contest_forum")}</Heading4>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "10px"
        }}
      >
        {/* IsRestrictedForum */}
        <Grid container spacing={2} columns={12}>
          <Controller
            control={control}
            name='isRestrictedForum'
            rules={{ required: true }}
            render={({ field: { ref, ...field } }) => (
              <>
                <Grid item xs={12} md={3}>
                  <TitleWithInfoTip
                    translate-key='contest_is_restricted_forum'
                    title={t("contest_is_restricted_forum")}
                    tooltipDescription={t("contest_is_restricted_forum_tooltip")}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack direction='column' gap={1}>
                    <Controller
                      control={control}
                      name='isRestrictedForum'
                      render={({ field: { ref, ...field } }) => (
                        <FormControlLabel
                          control={<Checkbox color='primary' {...field} checked={field.value} />}
                          label={""}
                        />
                      )}
                    />

                    {/* Show error */}
                    {errors.isRestrictedForum && (
                      <Grid item xs={12}>
                        {errors.isRestrictedForum.message && (
                          <ErrorMessage>{errors.isRestrictedForum.message || ""}</ErrorMessage>
                        )}
                      </Grid>
                    )}
                  </Stack>
                </Grid>
              </>
            )}
          />
        </Grid>

        {/* IsDisabledForum */}
        <Grid container spacing={2} columns={12}>
          <Controller
            control={control}
            name='isDisabledForum'
            rules={{ required: true }}
            render={({ field: { ref, ...field } }) => (
              <>
                <Grid item xs={12} md={3}>
                  <TitleWithInfoTip
                    translate-key='contest_is_disabled_forum'
                    title={t("contest_is_disabled_forum")}
                    tooltipDescription={t("contest_is_disabled_forum_tooltip")}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack direction='column' gap={1}>
                    <Controller
                      control={control}
                      name='isDisabledForum'
                      render={({ field: { ref, ...field } }) => (
                        <FormControlLabel
                          control={<Checkbox color='primary' {...field} checked={field.value} />}
                          label={""}
                        />
                      )}
                    />

                    {/* Show error */}
                    {errors.isDisabledForum && (
                      <Grid item xs={12}>
                        {errors.isDisabledForum.message && (
                          <ErrorMessage>{errors.isDisabledForum.message || ""}</ErrorMessage>
                        )}
                      </Grid>
                    )}
                  </Stack>
                </Grid>
              </>
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContestEditAdvancedSettings;
