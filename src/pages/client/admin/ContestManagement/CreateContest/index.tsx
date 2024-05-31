import { Box, Card, Checkbox, FormControlLabel, Grid, Stack } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import moment, { Moment } from "moment";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ContestService } from "services/coreService/ContestService";
import { CreateContestCommand } from "models/coreService/create/CreateContestCommand";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { convertLocalMomentToUTCMoment } from "utils/moment";

const CreateContest = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [content, setContent] = useState("");

  const [contestName, setContestName] = useState("");
  const [contestStartTime, setContestStartTime] = useState<Moment>(moment().utc());
  const [contestEndTime, setContestEndTime] = useState<Moment>(moment().utc().add(1, "hour"));
  const [isNoEndTime, setIsNoEndTime] = useState<boolean>(false);

  const handleCreateContest = useCallback(
    async ({ name, description, thumbnailUrl, startTime, endTime }: CreateContestCommand) => {
      try {
        const getContestResponse = await ContestService.createContest({
          name,
          description,
          thumbnailUrl,
          startTime,
          endTime
        });
        console.log("Contest created successfully", getContestResponse);
        setOpenSnackbarAlert(true);
        setType(AlertType.Success);
        setContent("Contest created successfully");
      } catch (error: any) {
        console.error("Failed to create contest", {
          code: error.code || 503,
          status: error.status || "Service Unavailable",
          message: error.message
        });
        if (error.code === 401 || error.code === 403) {
          setOpenSnackbarAlert(true);
          setType(AlertType.Error);
          setContent("Please authenticate");
        }
      }
    },
    []
  );

  return (
    <>
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={type}
        content={content}
      />
      <Card
        sx={{
          margin: "20px",
          padding: "20px",
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
              onClick={() => navigate(routes.admin.contest.root)}
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
        <Box
          sx={{
            marginTop: "20px"
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
            <ParagraphBody fontStyle='italic' translate-key='contest_description_message_1'>
              {t("contest_description_message_1")}
            </ParagraphBody>
            <ParagraphBody fontStyle={"italic"} translate-key='contest_description_message_2'>
              {t("contest_description_message_2")}
            </ParagraphBody>
          </Stack>
          <Box component='form' className={classes.formBody}>
            <InputTextField
              type='text'
              title={t("contest_name")}
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
              translate-key={["contest_enter_contest_name", "contest_enter_contest_name"]}
              placeholder={t("contest_enter_contest_name")}
              fullWidth
            />
            <Grid container spacing={1} columns={12}>
              <Grid item xs={3}>
                <TextTitle translate-key='contest_start_time'>{t("contest_start_time")}</TextTitle>
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
                <TextTitle translate-key='contest_end_time'>{t("contest_end_time")}</TextTitle>
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
                  translate-key='this_contest_has_no_end_time'
                  label={t("this_contest_has_no_end_time")}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onSubmit={() =>
                  handleCreateContest({
                    name: contestName,
                    description: "",
                    thumbnailUrl: "",
                    startTime: convertLocalMomentToUTCMoment(contestStartTime).toString(),
                    endTime: isNoEndTime
                      ? null
                      : convertLocalMomentToUTCMoment(contestEndTime).toString()
                  })
                }
                btnType={BtnType.Primary}
                translation-key='common_get_started'
                sx={{
                  minWidth: "200px"
                }}
              >
                {t("common_get_started")}
              </Button>
            </Grid>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default CreateContest;
