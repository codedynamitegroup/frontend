import { Checkbox, FormControlLabel, Grid, Stack } from "@mui/material";
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import InputTextField from "components/common/inputs/InputTextField";
import ErrorMessage from "components/text/ErrorMessage";
import Heading4 from "components/text/Heading4";
import ParagraphSmall from "components/text/ParagraphSmall";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import moment from "moment";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IFormDataType } from "..";
import classes from "./styles.module.scss";

interface ContestEditDetailsProps {
  control: Control<IFormDataType, any>;
  errors: FieldErrors<IFormDataType>;
  setValue: UseFormSetValue<IFormDataType>;
  watch: UseFormWatch<IFormDataType>;
}

const ContestEditDetails = ({ control, errors, setValue, watch }: ContestEditDetailsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Grid
        container
        gap={2}
        direction='column'
        className={classes.container}
        sx={{
          margin: "0px 20px 20px 20px"
        }}
      >
        <Grid item xs={12}>
          <Heading4 translate-key='contest_details'>{t("contest_details")}</Heading4>
          <ParagraphSmall fontStyle={"italic"} sx={{ marginTop: "10px" }}>
            Customize your contest by providing more information needed to create your contest
            details page.
          </ParagraphSmall>
        </Grid>
        <Grid item xs={12}>
          <Grid container gap={2} direction='column'>
            {/* Contest name */}
            <Controller
              // defaultValue=''
              control={control}
              name='name'
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <InputTextField
                  error={Boolean(errors?.name)}
                  errorMessage={errors.name?.message}
                  title={`${t("contest_name")}`}
                  type='text'
                  placeholder={t("contest_enter_contest_name")}
                  titleRequired={true}
                  translation-key='contest_enter_contest_name'
                  inputRef={ref}
                  width='350px'
                  fullWidth
                  {...field}
                />
              )}
            />

            {/* Contest start time */}
            <Grid container spacing={2} columns={12}>
              <Controller
                control={control}
                name='startTime'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={3}>
                      <TitleWithInfoTip
                        translate-key='contest_start_time'
                        title={t("contest_start_time")}
                        titleRequired={true}
                        tooltipDescription={t("contest_start_time_tooltip")}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <CustomDateTimePicker
                        value={moment(field.value)}
                        onHandleValueChange={(newValue) => {
                          if (newValue) {
                            setValue("startTime", newValue.toISOString());
                          }
                        }}
                        width='350px'
                      />
                      {/* Show error */}
                      {errors.startTime && (
                        <Grid item xs={12}>
                          {errors.startTime.message && (
                            <ErrorMessage>{errors.startTime.message || ""}</ErrorMessage>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}
              />
            </Grid>

            {/*  Contest end time */}
            <Grid container spacing={2} columns={12}>
              <Controller
                // defaultValue={moment().utc().add(1, "hour").toISOString()}
                control={control}
                name='endTime'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={3}>
                      <TitleWithInfoTip
                        translate-key='contest_end_time'
                        title={t("contest_end_time")}
                        titleRequired={true}
                        tooltipDescription={t("contest_end_time_tooltip")}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Stack direction='column' gap={1}>
                        <CustomDateTimePicker
                          value={moment(field.value)}
                          disabled={watch("isNoEndTime")}
                          onHandleValueChange={(newValue) => {
                            if (newValue) {
                              setValue("endTime", newValue.toISOString());
                            }
                          }}
                          width='350px'
                        />

                        {/* Is no end time */}
                        <Controller
                          control={control}
                          name='isNoEndTime'
                          render={({ field: { ref, ...field } }) => (
                            <FormControlLabel
                              control={
                                <Checkbox color='primary' {...field} checked={field.value} />
                              }
                              label={t("this_contest_has_no_end_time")}
                            />
                          )}
                        />

                        {/* Show error */}
                        {errors.endTime && (
                          <Grid item xs={12}>
                            {errors.endTime.message && (
                              <ErrorMessage>{errors.endTime.message || ""}</ErrorMessage>
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
      </Grid>
    </>
  );
};

export default ContestEditDetails;
