import { yupResolver } from "@hookform/resolvers/yup";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import JoyButton from "@mui/joy/Button";
import { Box, Card, Checkbox, Divider, FormControlLabel, Grid, Stack } from "@mui/material";
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import InputTextField from "components/common/inputs/InputTextField";
import ErrorMessage from "components/text/ErrorMessage";
import Heading1 from "components/text/Heading1";
import ParagraphSmall from "components/text/ParagraphSmall";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import useAuth from "hooks/useAuth";
import { CreateContestCommand } from "models/coreService/create/CreateContestCommand";
import moment from "moment";
import { useCallback, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { routes } from "routes/routes";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch } from "store";
import * as yup from "yup";
import classes from "./styles.module.scss";

interface IFormDataType {
  isNoEndTime: boolean;
  name: string;
  startTime: string;
  endTime?: string | null;
}

const OrgAdminCreateContest = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const schema = useMemo(() => {
    return yup.object().shape({
      isNoEndTime: yup.boolean().required(t("contest_is_no_end_time_required")),
      name: yup.string().required(t("contest_name_required")).trim(""),
      startTime: yup
        .string()
        .required(t("contest_start_time_required"))
        .trim("")
        .test("startTime", t("contest_start_time_greater_than_current_time"), function (value) {
          return moment(value).isAfter(moment().utc());
        }),
      endTime: yup
        .string()
        .nullable()
        .test("endTime", t("contest_end_time_required"), function (value) {
          if (this.parent.isNoEndTime) {
            return true;
          }
          return !!value;
        })
        .test("endTime", t("contest_end_time_greater_than_start_time"), function (value) {
          if (this.parent.isNoEndTime) {
            return true;
          }
          return moment(value).isAfter(this.parent.startTime);
        })
    });
  }, [t]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      isNoEndTime: false,
      name: "",
      startTime: moment.utc().add(30, "minute").toISOString(),
      endTime: moment.utc().add(1, "hour").toISOString()
    }
  });

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };
    const { isNoEndTime, name, startTime, endTime } = formSubmittedData;
    await handleCreateContest({
      name,
      description: "",
      thumbnailUrl: "",
      startTime,
      endTime: isNoEndTime ? null : endTime
    });
  };

  const handleCreateContest = useCallback(
    async ({ name, description, thumbnailUrl, startTime, endTime }: CreateContestCommand) => {
      setSubmitLoading(true);
      try {
        if (!loggedUser.organization) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
          setSubmitLoading(false);
          return;
        }
        const createContestResponse = await ContestService.createContest({
          orgId: loggedUser.organization.organizationId,
          name,
          description,
          thumbnailUrl,
          startTime,
          endTime
        });
        if (createContestResponse.name === name) {
          dispatch(setSuccessMess(t("contest_create_success")));
          setSubmitLoading(false);
          navigate(
            routes.org_admin.contest.edit.details.replace(
              ":contestId",
              createContestResponse.contestId
            )
          );
        }
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        setSubmitLoading(false);
      }
    },
    [dispatch, loggedUser.organization, navigate, t]
  );

  return (
    <>
      <Card
        sx={{
          margin: "20px",
          // padding: "20px",
          "& .MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "4px"
          },
          gap: "20px"
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.org_admin.contest.root)}
              translation-key='contest_management_title'
            >
              {t("contest_management_title")}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall colorname='--blue-500' translate-key='contest_create'>
              {t("contest_create")}
            </ParagraphSmall>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            padding: "20px"
          }}
        >
          <Heading1 translate-key='contest_create'>{t("contest_create")}</Heading1>
          <Stack
            direction='column'
            gap={2}
            sx={{
              marginTop: "20px"
            }}
          >
            <ParagraphSmall fontStyle='italic' translate-key='contest_description_message_1'>
              {t("contest_description_message_1")}
            </ParagraphSmall>
            <ParagraphSmall fontStyle={"italic"} translate-key='contest_description_message_2'>
              {t("contest_description_message_2")}
            </ParagraphSmall>
          </Stack>
          <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
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

            <Grid container spacing={1} columns={12}>
              {/* Contest start time */}
              <Controller
                control={control}
                name='startTime'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Grid item xs={4}>
                      <TitleWithInfoTip
                        translate-key='contest_start_time'
                        title={t("contest_start_time")}
                        titleRequired={true}
                        tooltipDescription={t("contest_start_time_tooltip")}
                      />
                    </Grid>
                    <Grid item xs={7}>
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
            <Controller
              // defaultValue={moment().utc().add(1, "hour").toISOString()}
              control={control}
              name='endTime'
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <>
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={4}>
                      <TitleWithInfoTip
                        translate-key='contest_end_time'
                        title={t("contest_end_time")}
                        titleRequired={true}
                        tooltipDescription={t("contest_end_time_tooltip")}
                      />
                    </Grid>
                    <Grid item xs={7}>
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
                              control={<Checkbox color='primary' {...field} />}
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
                  </Grid>
                </>
              )}
            />

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <JoyButton
                loading={submitLoading}
                variant='solid'
                type='submit'
                translation-key='common_get_started'
              >
                {t("common_get_started")}
              </JoyButton>
            </Grid>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default OrgAdminCreateContest;
