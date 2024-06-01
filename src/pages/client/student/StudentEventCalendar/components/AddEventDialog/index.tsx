import { Collapse, DialogProps, FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import TextTitle from "components/text/TextTitle";
import dayjs from "dayjs";
import { useCallback } from "react";
import classes from "./styles.module.scss";
import useWindowDimensions from "hooks/useWindowDimensions";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface AddEventDialogProps extends DialogProps {
  data: {
    isExpanded: boolean;
    durationRadioIndex: string;
    durationInMinute: number;
    eventTitle: string;
    eventDescription: string;
    start: string;
    end: string;
    allDay: boolean;
  };
  handleChangData: (newData: {
    isExpanded: boolean;
    durationRadioIndex: string;
    durationInMinute: number;
    eventTitle: string;
    eventDescription: string;
    start: string;
    end: string;
    allDay: boolean;
  }) => void;
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
}

const AddEventDialog = ({
  data,
  handleChangData,
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  ...props
}: AddEventDialogProps) => {
  const handleToggle = useCallback(() => {
    handleChangData({
      isExpanded: !data.isExpanded,
      durationRadioIndex: data.durationRadioIndex,
      durationInMinute: data.durationInMinute,
      eventTitle: data.eventTitle,
      eventDescription: data.eventDescription,
      start: data.start,
      end: data.end,
      allDay: data.allDay
    });
  }, [data, handleChangData]);
  const { height } = useWindowDimensions();
  const { t } = useTranslation();

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='800px'
      maxHeight={`${0.6 * height}px`}
      {...props}
    >
      <Box component='form' className={classes.formBody} autoComplete='off'>
        <InputTextField
          type='text'
          title={t("calendar_event_name")}
          translation-key='calendar_event_name'
          value={data.eventTitle}
          onChange={(e) => {
            handleChangData({
              isExpanded: data.isExpanded,
              durationRadioIndex: data.durationRadioIndex,
              durationInMinute: data.durationInMinute,
              eventTitle: e.target.value,
              start: data.start,
              end: data.end,
              allDay: data.allDay,
              eventDescription: data.eventDescription
            });
          }}
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='calendar_event_date'>{t("calendar_event_date")}</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <CustomDateTimePicker
              value={moment(data.start)}
              onHandleValueChange={(newValue) => {
                handleChangData({
                  isExpanded: data.isExpanded,
                  durationRadioIndex: data.durationRadioIndex,
                  durationInMinute: data.durationInMinute,
                  eventTitle: data.eventTitle,
                  start: newValue?.toString() || "",
                  end: data.end,
                  allDay: data.allDay,
                  eventDescription: data.eventDescription
                });
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='calendar_event_type'>{t("calendar_event_type")}</TextTitle>
          </Grid>
          <Grid item xs={9} translation-key='calendar_event_type_user'>
            {t("calendar_event_type_user")}
          </Grid>
        </Grid>
        <Button
          translation-key={["calendar_event_collapse", "calendar_event_expand"]}
          btnType={BtnType.Text}
          onClick={handleToggle}
          width='fit-content'
          padding='0px'
        >
          {data.isExpanded
            ? `${t("calendar_event_collapse")}...`
            : `${t("calendar_event_expand")}...`}
        </Button>
        <Collapse in={data.isExpanded}>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle translation-key='detail_problem_description'>
                {t("detail_problem_description")}
              </TextTitle>
            </Grid>
            <Grid item xs={9} className={classes.textEditor}>
              <TextEditor
                value={data.eventDescription}
                onChange={(newValue) => {
                  handleChangData({
                    isExpanded: data.isExpanded,
                    durationRadioIndex: data.durationRadioIndex,
                    durationInMinute: data.durationInMinute,
                    eventTitle: data.eventTitle,
                    start: data.start,
                    end: data.end,
                    allDay: data.allDay,
                    eventDescription: newValue
                  });
                }}
              />
            </Grid>
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
              xs={3}
              sx={{
                marginTop: "10px"
              }}
            >
              <TextTitle translation-key='calendar_event_time_range'>
                {t("calendar_event_time_range")}
              </TextTitle>
            </Grid>
            <Grid item xs={9}>
              <RadioGroup
                aria-label={"duration"}
                name={"duration"}
                value={data.durationRadioIndex}
                onChange={(e) => {
                  handleChangData({
                    isExpanded: data.isExpanded,
                    durationRadioIndex: e.target.value,
                    durationInMinute: data.durationInMinute,
                    eventTitle: data.eventTitle,
                    start: data.start,
                    end: data.end,
                    allDay: data.allDay,
                    eventDescription: data.eventDescription
                  });
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
                  value={moment(data.end)}
                  onHandleValueChange={(newValue) => {
                    handleChangData({
                      isExpanded: data.isExpanded,
                      durationRadioIndex: data.durationRadioIndex,
                      durationInMinute: data.durationInMinute,
                      eventTitle: data.eventTitle,
                      start: data.start,
                      end: newValue?.toString() || "",
                      allDay: data.allDay,
                      eventDescription: data.eventDescription
                    });
                  }}
                  disabled={data.durationRadioIndex !== "1"}
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
                  value={data.durationInMinute}
                  onChange={(e) => {
                    const endTime = dayjs(data.start)
                      .add(Number(e.target.value), "minute")
                      .toString();
                    handleChangData({
                      isExpanded: data.isExpanded,
                      durationRadioIndex: data.durationRadioIndex,
                      durationInMinute: Number(e.target.value),
                      eventTitle: data.eventTitle,
                      start: data.start,
                      end: endTime,
                      allDay: data.allDay,
                      eventDescription: data.eventDescription
                    });
                  }}
                  disabled={data.durationRadioIndex !== "2"}
                  maxWith='200px'
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Collapse>
      </Box>
    </CustomDialog>
  );
};

export default AddEventDialog;
