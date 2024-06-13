import { Box, Checkbox, FormControlLabel, Grid, Stack } from "@mui/material";
import ErrorMessage from "components/text/ErrorMessage";
import Heading4 from "components/text/Heading4";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IFormDataType } from "..";
import ParagraphSmall from "components/text/ParagraphSmall";

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
        margin: "0px 20px 20px 20px",
        width: "calc(100% - 40px)",
        minHeight: "600px"
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
                <Grid item xs={12} md={4}>
                  <TitleWithInfoTip
                    translate-key='contest_is_restricted_forum'
                    title={t("contest_is_restricted_forum")}
                    // tooltipDescription={t("contest_is_restricted_forum_tooltip")}
                  />
                  <ParagraphSmall
                    sx={{
                      marginTop: "5px"
                    }}
                    fontStyle={"italic"}
                    translate-key='contest_is_restricted_forum_tooltip'
                  >
                    {t("contest_is_restricted_forum_tooltip")}
                  </ParagraphSmall>
                </Grid>
                <Grid item xs={12} md={7}>
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
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{
            marginTop: "10px"
          }}
        >
          <Controller
            control={control}
            name='isDisabledForum'
            rules={{ required: true }}
            render={({ field: { ref, ...field } }) => (
              <>
                <Grid item xs={12} md={4}>
                  <TitleWithInfoTip
                    translate-key='contest_is_disabled_forum'
                    title={t("contest_is_disabled_forum")}
                    // tooltipDescription={t("contest_is_disabled_forum_tooltip")}
                  />
                  <ParagraphSmall
                    sx={{
                      marginTop: "5px"
                    }}
                    fontStyle={"italic"}
                    translate-key='contest_is_disabled_forum_tooltip'
                  >
                    {t("contest_is_disabled_forum_tooltip")}
                  </ParagraphSmall>
                </Grid>
                <Grid item xs={12} md={7}>
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
