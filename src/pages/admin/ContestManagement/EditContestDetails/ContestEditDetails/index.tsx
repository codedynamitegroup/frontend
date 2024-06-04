import { Box, Checkbox, Divider, FormControlLabel, Grid, Stack } from "@mui/material";
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
import TextEditor from "components/editor/TextEditor";
import AdvancedDropzoneDemo from "components/editor/FileUploader";
import { ExtFile } from "@files-ui/react";
import { useEffect, useState } from "react";

interface ContestEditDetailsProps {
  control: Control<IFormDataType, any>;
  errors: FieldErrors<IFormDataType>;
  setValue: UseFormSetValue<IFormDataType>;
  watch: UseFormWatch<IFormDataType>;
}

const ContestEditDetails = ({ control, errors, setValue, watch }: ContestEditDetailsProps) => {
  const { t } = useTranslation();

  const maxFileSize = 5242880;
  const maxFiles = 1;
  const fileTypeList = ".bmp, .gif, .jpeg, .jpg, .png, .svg, .tif, .tiff";
  const [extFiles, setExtFiles] = useState<ExtFile[]>([]);

  useEffect(() => {
    if (extFiles.length > 0) {
      setValue("thumbnailUrl", extFiles[0]?.downloadUrl || "");
    }
  }, [extFiles, setValue]);

  return (
    <>
      <Grid
        container
        gap={2}
        direction='column'
        className={classes.container}
        sx={{
          margin: "0px 20px 20px 20px",
          width: "calc(100% - 40px)"
        }}
      >
        <Grid item xs={12}>
          <Heading4 translate-key='contest_details'>{t("contest_details")}</Heading4>
          <ParagraphSmall
            fontStyle={"italic"}
            sx={{ marginTop: "10px" }}
            translate-key='contest_details_description'
          >
            {t("contest_details_description")}
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
                    <Grid item xs={12} md={3}>
                      <TitleWithInfoTip
                        translate-key='contest_start_time'
                        title={t("contest_start_time")}
                        titleRequired={true}
                        // tooltipDescription={t("contest_start_time_tooltip")}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
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
                    <Grid item xs={12} md={3}>
                      <TitleWithInfoTip
                        translate-key='contest_end_time'
                        title={t("contest_end_time")}
                        titleRequired={true}
                        tooltipDescription={t("contest_end_time_tooltip")}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
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

            <Grid container spacing={2} columns={12}>
              <Controller
                control={control}
                name='isPublic'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={12} md={3}>
                      <TitleWithInfoTip
                        translate-key='contest_is_public'
                        title={t("contest_is_public")}
                        titleRequired={true}
                        tooltipDescription={t("contest_is_public_tooltip")}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Stack direction='column' gap={1}>
                        <Controller
                          control={control}
                          name='isPublic'
                          render={({ field: { ref, ...field } }) => (
                            <FormControlLabel
                              control={
                                <Checkbox color='primary' {...field} checked={field.value} />
                              }
                              label={""}
                            />
                          )}
                        />

                        {/* Show error */}
                        {errors.isPublic && (
                          <Grid item xs={12}>
                            {errors.isPublic.message && (
                              <ErrorMessage>{errors.isPublic.message || ""}</ErrorMessage>
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
        <Divider />
        <Grid item xs={12}>
          <Heading4 translate-key='contest_metadata_customization'>
            {t("contest_metadata_customization")}
          </Heading4>
          <ParagraphSmall
            fontStyle={"italic"}
            sx={{ marginTop: "10px" }}
            translate-key='contest_metadata_customization_description'
          >
            {t("contest_metadata_customization_description")}
          </ParagraphSmall>
        </Grid>
        <Grid item xs={12}>
          <Grid container gap={2} direction='column'>
            <Grid container spacing={2} columns={12}>
              <Controller
                control={control}
                name='isPublic'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={12} md={3}>
                      <TitleWithInfoTip
                        translate-key='contest_thumbnail'
                        title={t("contest_thumbnail")}
                        titleRequired={true}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Stack direction='column' gap={1}>
                        <Controller
                          control={control}
                          name='thumbnailUrl'
                          rules={{ required: true }}
                          render={({ field: { ref, ...field } }) => (
                            <AdvancedDropzoneDemo
                              extFiles={extFiles}
                              setExtFiles={setExtFiles}
                              maxFileSize={maxFileSize}
                              accept={fileTypeList}
                              maxFiles={maxFiles}
                              // width='950px'
                            />
                          )}
                        />

                        {/* Show error */}
                        {errors.thumbnailUrl && (
                          <Grid item xs={12}>
                            {errors.thumbnailUrl.message && (
                              <ErrorMessage>{errors.thumbnailUrl.message || ""}</ErrorMessage>
                            )}
                          </Grid>
                        )}
                      </Stack>
                    </Grid>
                  </>
                )}
              />
            </Grid>

            <Grid container spacing={2} columns={12}>
              <Controller
                control={control}
                name='isPublic'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={12} md={3}>
                      <TitleWithInfoTip
                        translate-key='common_description'
                        title={t("common_description")}
                        // titleRequired={true}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Stack direction='column' gap={1}>
                        <Controller
                          control={control}
                          name='description'
                          // rules={{ required: true }}
                          render={({ field: { ref, ...field } }) => (
                            <TextEditor
                              value={field.value}
                              onChange={(value) => {
                                setValue("description", value);
                              }}
                              maxLines={10}
                            />
                          )}
                        />

                        {/* Show error */}
                        {errors.description && (
                          <Grid item xs={12}>
                            {errors.description.message && (
                              <ErrorMessage>{errors.description.message || ""}</ErrorMessage>
                            )}
                          </Grid>
                        )}
                      </Stack>
                    </Grid>
                  </>
                )}
              />
            </Grid>

            <Grid container spacing={2} columns={12}>
              <Controller
                control={control}
                name='isPublic'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={12} md={3}>
                      <TitleWithInfoTip
                        translate-key='common_prizes'
                        title={t("common_prizes")}
                        // titleRequired={true}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Stack direction='column' gap={1}>
                        <Controller
                          control={control}
                          name='prizes'
                          rules={{ required: true }}
                          render={({ field: { ref, ...field } }) => (
                            <TextEditor
                              value={field.value}
                              onChange={(value) => {
                                setValue("prizes", value);
                              }}
                              maxLines={10}
                            />
                          )}
                        />

                        {/* Show error */}
                        {errors.prizes && (
                          <Grid item xs={12}>
                            {errors.prizes.message && (
                              <ErrorMessage>{errors.prizes.message || ""}</ErrorMessage>
                            )}
                          </Grid>
                        )}
                      </Stack>
                    </Grid>
                  </>
                )}
              />
            </Grid>

            <Grid container spacing={2} columns={12}>
              <Controller
                control={control}
                name='isPublic'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={12} md={3}>
                      <TitleWithInfoTip
                        translate-key='common_rules'
                        title={t("common_rules")}
                        // titleRequired={true}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Stack direction='column' gap={1}>
                        <Controller
                          control={control}
                          name='rules'
                          rules={{ required: true }}
                          render={({ field: { ref, ...field } }) => (
                            <TextEditor
                              value={field.value}
                              onChange={(value) => {
                                setValue("rules", value);
                              }}
                              maxLines={10}
                            />
                          )}
                        />

                        {/* Show error */}
                        {errors.rules && (
                          <Grid item xs={12}>
                            {errors.rules.message && (
                              <ErrorMessage>{errors.rules.message || ""}</ErrorMessage>
                            )}
                          </Grid>
                        )}
                      </Stack>
                    </Grid>
                  </>
                )}
              />
            </Grid>

            <Grid container spacing={2} columns={12}>
              <Controller
                control={control}
                name='isPublic'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={12} md={3}>
                      <TitleWithInfoTip
                        translate-key='common_scoring'
                        title={t("common_scoring")}
                        // titleRequired={true}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Stack direction='column' gap={1}>
                        <Controller
                          control={control}
                          name='scoring'
                          rules={{ required: true }}
                          render={({ field: { ref, ...field } }) => (
                            <TextEditor
                              value={field.value}
                              onChange={(value) => {
                                setValue("scoring", value);
                              }}
                              maxLines={10}
                            />
                          )}
                        />

                        {/* Show error */}
                        {errors.scoring && (
                          <Grid item xs={12}>
                            {errors.scoring.message && (
                              <ErrorMessage>{errors.scoring.message || ""}</ErrorMessage>
                            )}
                          </Grid>
                        )}
                      </Stack>
                    </Grid>
                  </>
                )}
              />
            </Grid>
            <Grid container spacing={2} columns={12} height={"70px"}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ContestEditDetails;
