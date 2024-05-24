import SearchIcon from "@mui/icons-material/Search";
import { Button, Chip, Divider, Grid, InputAdornment, Paper, Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import * as React from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface PropsData {
  value: string;
  setValue: any;
  options: CertificateCourseEntity[];
  onHandleChange: any;
  placeHolder?: string;
  maxWidth?: string;
  size?: "small" | "medium";
}

export default function CustomAutocomplete({
  value,
  setValue,
  options,
  onHandleChange,
  placeHolder,
  maxWidth,
  size = "small"
}: PropsData) {
  const certificateCourseState = useSelector((state: RootState) => state.certifcateCourse);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isLoading = React.useMemo(() => certificateCourseState.isLoading, [certificateCourseState]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };

  console.log("options", options);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onHandleChange(value);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [onHandleChange, value]);

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12} md={12} sm={12} lg={12}>
        <Paper
          className={classes.container}
          style={{
            width: "100%"
          }}
        >
          <Autocomplete
            id='free-solo-demo'
            freeSolo
            sx={{
              width: "100%"
            }}
            size={size}
            loading={isLoading}
            options={options}
            getOptionLabel={(option: string | CertificateCourseEntity) => {
              return typeof option === "string" ? option : option.name;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                value={value}
                onChange={handleOnChange}
                placeholder={placeHolder ? placeHolder : t("common_search")}
                autoComplete='off'
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                      <Divider className={classes.searchDivider} orientation='vertical' />
                    </InputAdornment>
                  )
                }}
              />
            )}
            renderOption={(props, option: CertificateCourseEntity, { inputValue }) => {
              return (
                <li
                  {...props}
                  key={option.certificateCourseId}
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px"
                  }}
                >
                  <Button
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-start",
                      textTransform: "capitalize"
                    }}
                    onClick={() => {
                      navigate(
                        `${routes.user.course_certificate.detail.lesson.root.replace(":courseId", option.certificateCourseId)}`
                      );
                    }}
                  >
                    <Stack
                      direction='row'
                      alignItems='space-between'
                      justifyContent='space-between'
                      gap={1}
                      width={"100%"}
                    >
                      <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='flex-start'
                        textAlign={"left"}
                        gap={1}
                      >
                        <img
                          style={{ width: "20px", height: "20px" }}
                          src={option.topic.thumbnailUrl}
                          alt={option.name}
                        />
                        {option.name}
                        <Chip
                          size='small'
                          label={
                            option.skillLevel === SkillLevelEnum.BASIC
                              ? t("common_easy")
                              : option?.skillLevel === SkillLevelEnum.INTERMEDIATE
                                ? t("common_medium")
                                : option?.skillLevel === SkillLevelEnum.ADVANCED
                                  ? t("common_hard")
                                  : ""
                          }
                          variant='outlined'
                        />
                      </Stack>
                      <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='flex-end'
                        gap={1}
                        translate-key='common_view_details'
                      >
                        {t("common_view_details")}
                        <ArrowForwardIosIcon />
                      </Stack>
                    </Stack>
                  </Button>
                </li>
              );
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
