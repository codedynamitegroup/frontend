import { yupResolver } from "@hookform/resolvers/yup";
import JoyButton from "@mui/joy/Button";
import {
  Collapse,
  DialogActions,
  DialogProps,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup
} from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import BasicSelect from "components/common/select/BasicSelect";
import TextEditor from "components/editor/TextEditor";
import ErrorMessage from "components/text/ErrorMessage";
import TextTitle from "components/text/TextTitle";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import useAuth from "hooks/useAuth";
import { NotificationComponentTypeEnum } from "models/courseService/enum/NotificationComponentTypeEnum";
import { NotificationEventTypeEnum } from "models/courseService/enum/NotificationEventTypeEnum";
import moment from "moment";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { UpdateEventCalendarEvent } from "services/courseService/EventCalendarService";
import * as yup from "yup";
import { ICalendarEventCourse } from "../..";
import { IEditEventFormData } from "../AddEventDialog";

interface EditEventDialogProps extends DialogProps {
  allMyCoursesData: {
    data: ICalendarEventCourse[];
    isLoading: boolean;
  };
  eventId: string;
  defaultValues: IEditEventFormData;
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: (id: string, body: UpdateEventCalendarEvent) => void;
}

const EditEventDialog = ({
  eventId,
  defaultValues,
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  allMyCoursesData,
  ...props
}: EditEventDialogProps) => {
  const { t } = useTranslation();
  const { loggedUser } = useAuth();
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const selectCourseItems = useMemo(() => {
    return allMyCoursesData.data.map((value) => {
      return {
        value: value.id,
        label: value.name
      };
    });
  }, [allMyCoursesData.data]);

  const schema = useMemo(() => {
    return yup.object().shape({
      durationRadioIndex: yup.string().required(),
      durationInMinute: yup.number().required(),
      eventTitle: yup.string().required(t("calendar_event_name_required")),
      eventDescription: yup.string().default(""),
      start: yup.string().required(t("calendar_event_start_required")),
      end: yup
        .string()
        .test("end", t("contest_end_time_greater_than_start_time"), function (value) {
          if (this.parent.durationRadioIndex === "0") {
            return true;
          }
          return moment(value).isAfter(this.parent.start);
        }),
      allDay: yup.boolean().required(),
      eventType: yup.string().required(t("calendar_event_type_required")),
      courseId: yup
        .string()
        .test("courseId", t("calendar_event_course_required"), function (value) {
          if (this.parent.eventType === NotificationEventTypeEnum.COURSE) {
            return value !== "";
          }
          return true;
        })
    });
  }, [t]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<IEditEventFormData>({
    resolver: yupResolver(schema),
    defaultValues
  });

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      minWidth='800px'
      actionsDisabled={true}
      customActions={
        <DialogActions>
          <JoyButton
            onClick={onHandleCancel ? onHandleCancel : handleClose}
            variant='outlined'
            translation-key='common_cancel'
          >
            {cancelText || t("common_cancel")}
          </JoyButton>
          <JoyButton
            loading={isConfirmLoading}
            autoFocus
            type='submit'
            translation-key='common_confirm'
          >
            {confirmText || t("common_confirm")}
          </JoyButton>
        </DialogActions>
      }
      onHandleSubmit={handleSubmit((data) => {
        setIsConfirmLoading(true);
        const newEvent: UpdateEventCalendarEvent = {
          name: data.eventTitle,
          description: data.eventDescription,
          startTime: data.start,
          endTime:
            data.end && data.end.length > 0 && moment(data.end).isValid() ? data.end : undefined,
          eventType: data.eventType as NotificationEventTypeEnum,
          courseId: data.courseId === "" ? undefined : data.courseId,
          userId: data.eventType === NotificationEventTypeEnum.USER ? loggedUser.userId : undefined,
          component: NotificationComponentTypeEnum.REMINDER
        };
        onHanldeConfirm && onHanldeConfirm(eventId, newEvent);
        setIsConfirmLoading(false);
        handleClose();
      })}
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <Controller
          control={control}
          name='eventTitle'
          rules={{ required: true }}
          render={({ field: { ref, ...field } }) => (
            <>
              <InputTextField
                error={Boolean(errors?.eventTitle)}
                errorMessage={errors.eventTitle?.message}
                title={`${t("calendar_event_name")}`}
                type='text'
                placeholder={t("calendar_event_name")}
                titleRequired={true}
                translation-key='calendar_event_name'
                inputRef={ref}
                width='350px'
                fullWidth
                {...field}
              />
            </>
          )}
        />

        <Grid container spacing={2} columns={12}>
          <Controller
            control={control}
            name='start'
            rules={{ required: true }}
            render={({ field: { ref, ...field } }) => (
              <>
                <Grid item xs={12} md={4}>
                  <TitleWithInfoTip
                    translate-key='calendar_event_date'
                    title={t("calendar_event_date")}
                    titleRequired={true}
                    // tooltipDescription={t("contest_start_time_tooltip")}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomDateTimePicker
                    value={moment(field.value)}
                    onHandleValueChange={(newValue) => {
                      if (newValue) {
                        setValue("start", newValue.toISOString());
                      }
                    }}
                    width='350px'
                  />
                  {/* Show error */}
                  {errors.start && (
                    <Grid item xs={12}>
                      {errors.start.message && (
                        <ErrorMessage>{errors.start.message || ""}</ErrorMessage>
                      )}
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          />
        </Grid>

        <Grid container spacing={2} columns={12}>
          <Controller
            control={control}
            name='eventType'
            rules={{ required: true }}
            render={({ field: { ref, ...field } }) => (
              <>
                <Grid item xs={12} md={4}>
                  <TitleWithInfoTip
                    translate-key='calendar_event_type'
                    title={t("calendar_event_type")}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <BasicSelect
                    labelId='select-assignment-section-label'
                    value={field.value}
                    onHandleChange={(value) => {
                      setValue("eventType", value);
                    }}
                    sx={{ maxWidth: "200px" }}
                    items={[
                      {
                        value: NotificationEventTypeEnum.USER,
                        label: t("calendar_event_type_user")
                      },
                      {
                        value: NotificationEventTypeEnum.COURSE,
                        label: t("calendar_event_type_course")
                      }
                    ]}
                    translation-key={["calendar_event_type_course", "calendar_event_type_user"]}
                  />
                  {/* Show error */}
                  {errors.eventType && (
                    <Grid item xs={12}>
                      {errors.eventType.message && (
                        <ErrorMessage>{errors.eventType.message || ""}</ErrorMessage>
                      )}
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          />
        </Grid>

        {watch("eventType") === NotificationEventTypeEnum.COURSE && (
          <Grid container spacing={2} columns={12}>
            <Controller
              control={control}
              name='courseId'
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <>
                  <Grid item xs={12} md={4}>
                    <TitleWithInfoTip translate-key='common_course' title={t("common_course")} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <BasicSelect
                      labelId='select-assignment-section-label'
                      value={field.value || ""}
                      onHandleChange={(value) => {
                        setValue("courseId", value);
                      }}
                      sx={{ maxWidth: "300px" }}
                      items={selectCourseItems}
                      translation-key={["calendar_event_type_course", "calendar_event_type_user"]}
                    />
                    {/* Show error */}
                    {errors.courseId && (
                      <Grid item xs={12}>
                        {errors.courseId.message && (
                          <ErrorMessage>{errors.courseId.message || ""}</ErrorMessage>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            />
          </Grid>
        )}

        <Button
          btnType={BtnType.Text}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          width='fit-content'
          padding='0px'
          translation-key={["calendar_event_collapse", "calendar_event_expand"]}
        >
          {isExpanded ? `${t("calendar_event_collapse")}...` : `${t("calendar_event_expand")}...`}
        </Button>
        <Collapse in={isExpanded}>
          <Grid container spacing={2} columns={12}>
            <Controller
              control={control}
              name='eventDescription'
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <>
                  <Grid item xs={12} md={4}>
                    <TitleWithInfoTip
                      translate-key='detail_problem_description'
                      title={t("detail_problem_description")}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextEditor
                      value={field.value}
                      onChange={(newValue) => {
                        setValue("eventDescription", newValue);
                      }}
                      maxLines={5}
                    />
                    {/* Show error */}
                    {errors.eventDescription && (
                      <Grid item xs={12}>
                        {errors.eventDescription.message && (
                          <ErrorMessage>{errors.eventDescription.message || ""}</ErrorMessage>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            />
          </Grid>
          <Grid
            container
            spacing={1}
            columns={12}
            sx={{
              marginTop: "30px"
            }}
          >
            <Grid
              item
              xs={4}
              sx={{
                marginTop: "10px"
              }}
            >
              <TextTitle translation-key='calendar_event_time_range'>
                {t("calendar_event_time_range")}
              </TextTitle>
            </Grid>
            <Grid item xs={8}>
              <RadioGroup
                aria-label={"duration"}
                name={"duration"}
                value={watch("durationRadioIndex")}
                onChange={(e) => {
                  setValue("durationRadioIndex", e.target.value);
                  if (e.target.value === "0") {
                    setValue("end", undefined);
                  } else if (e.target.value === "1") {
                    setValue("end", moment(watch("end")).toISOString());
                  } else if (e.target.value === "2") {
                    setValue(
                      "end",
                      moment(watch("start")).add(watch("durationInMinute"), "minute").toISOString()
                    );
                  }
                }}
              >
                <FormControlLabel
                  key={0}
                  value={"0"}
                  control={<Radio />}
                  label={t("calendar_event_name_time_no_range")}
                  translation-key='calendar_event_name_time_no_range'
                />
                <FormControlLabel
                  key={1}
                  value={"1"}
                  control={<Radio />}
                  label={t("calendar_event_name_time_till")}
                  translation-key='calendar_event_name_time_till'
                />
                <CustomDateTimePicker
                  value={moment(watch("end"))}
                  onHandleValueChange={(newValue) => {
                    if (!newValue) return;
                    setValue("end", newValue.toISOString());
                  }}
                  disabled={watch("durationRadioIndex") !== "1"}
                />
                <FormControlLabel
                  key={2}
                  value={"2"}
                  control={<Radio />}
                  label={t("calendar_event_name_time_minute")}
                  translation-key='calendar_event_name_time_minute'
                />
                <InputTextField
                  type='number'
                  value={watch("durationInMinute")}
                  onChange={(e) => {
                    const endTime = moment(watch("start"))
                      .add(Number(e.target.value), "minute")
                      .toISOString();
                    setValue("end", endTime);
                    setValue("durationInMinute", Number(e.target.value));
                  }}
                  disabled={watch("durationRadioIndex") !== "2"}
                  maxWith='200px'
                />
              </RadioGroup>
              {errors.end && (
                <Grid item xs={12}>
                  {errors.end.message && <ErrorMessage>{errors.end.message || ""}</ErrorMessage>}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Collapse>
      </Box>
    </CustomDialog>
  );
};

export default EditEventDialog;
