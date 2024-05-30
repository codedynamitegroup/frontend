import { Card, Checkbox, FormControlLabel, Grid, Stack } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import moment, { Moment } from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CreateContest = () => {
  const { t } = useTranslation();
  const [contestName, setContestName] = useState("");
  const [contestStartTime, setContestStartTime] = useState<Moment>(moment().utc());
  const [contestEndTime, setContestEndTime] = useState<Moment>(moment().utc());
  const [isNoEndTime, setIsNoEndTime] = useState<boolean>(false);

  return (
    <Card
      sx={{
        margin: "20px",
        padding: "20px",
        "& .MuiDataGrid-root": {
          border: "1px solid #e0e0e0",
          borderRadius: "4px"
        }
      }}
    >
      <Heading1>Create Contest</Heading1>
      <Stack
        direction='column'
        gap={2}
        sx={{
          marginTop: "20px"
        }}
      >
        <ParagraphBody fontStyle='italic'>
          Host your own coding contest on CodeDynamite. You can practice and compete with friends
          from your organization or school. Create your own contest and invite your friends to join.
        </ParagraphBody>
        <ParagraphBody fontStyle={"italic"}>
          Get started by providing the initial details for your contest.
        </ParagraphBody>
      </Stack>
      <Grid
        container
        gap={2}
        sx={{
          marginTop: "40px"
        }}
      >
        <InputTextField
          type='text'
          title='Contest Name'
          value={contestName}
          onChange={(e) => setContestName(e.target.value)}
          placeholder={"Enter contest name"}
          fullWidth
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Contest Start Time</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <CustomDateTimePicker
              value={moment(contestStartTime.toString())}
              onHandleValueChange={(newValue) => {
                setContestStartTime(
                  moment(newValue?.format("YYYY-MM-DDTHH:mm:ssZ") || moment().utc())
                );
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Contest End Time</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <CustomDateTimePicker
              value={moment(contestEndTime.toString())}
              disabled={isNoEndTime}
              onHandleValueChange={(newValue) => {
                setContestEndTime(
                  moment(newValue?.format("YYYY-MM-DDTHH:mm:ssZ") || moment().utc())
                );
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={isNoEndTime}
                  onChange={(e) => setIsNoEndTime(e.target.checked)}
                />
              }
              sx={{
                marginTop: "5px"
              }}
              label='This contest has no end time.'
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            btnType={BtnType.Primary}
            translation-key='common_get_started'
            sx={{
              minWidth: "200px"
            }}
          >
            {t("common_get_started")}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CreateContest;
