import { yupResolver } from "@hookform/resolvers/yup";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Card, Divider, Tab, Tabs } from "@mui/material";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import ContestEditDetails from "./ContestEditDetails";
import ContestEditProblems from "./ContestEditProblems";
import ContestEditSignUps from "./ContestEditSignUps";
import ContestEditStatistics from "./ContestEditStatictics";
import classes from "./styles.module.scss";
import JoyButton from "@mui/joy/Button";
import moment from "moment";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { ContestService } from "services/coreService/ContestService";
import { UpdateContestCommand } from "models/coreService/update/UpdateContestCommand";
import ContestEditAdvancedSettings from "./ContestEditAdvancedSettings";
import NotFoundPage from "pages/common/NotFoundPage";
import { ContestQuestionEntity } from "models/coreService/entity/ContestQuestionEntity";
import { motion } from "framer-motion";

export interface IFormDataType {
  isNoEndTime: boolean;
  name: string;
  startTime: string;
  endTime?: string | null;
  thumbnailUrl?: string;
  description?: string;
  prizes?: string;
  rules?: string;
  scoring?: string;
  isPublic: boolean;
  isRestrictedForum: boolean;
  isDisabledForum: boolean;
  // problems: {
  //   questionId: string;
  //   codeQuestionId: string;
  //   difficulty: string;
  //   name: string;
  //   questionText: string;
  //   defaultMark: number;
  //   maxGrade: number;
  // }[];
}

const EditContestDetails = ({ isDrawerOpen }: any) => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [content, setContent] = useState("");

  const { contestId } = useParams<{ contestId: string }>();
  const [submitLoading, setSubmitLoading] = useState(false);

  const [defaultContestName, setDefaultContestName] = useState("");

  const tabs: string[] = useMemo(() => {
    return [
      routes.admin.contest.edit.details,
      routes.admin.contest.edit.problems,
      routes.admin.contest.edit.advanced_settings,
      routes.admin.contest.edit.signups,
      routes.admin.contest.edit.statistics
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const activeRoute = (routeName: string) => {
    const match = pathname.startsWith(routeName);
    return !!match;
  };

  const activeTab = useMemo(() => {
    if (contestId) {
      const index = tabs.findIndex((it) => activeRoute(it.replace(":contestId", contestId)));
      if (index === -1) return 0;
      return index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabs]);

  const handleChange = (_: React.SyntheticEvent, newTab: number) => {
    if (contestId) navigate(tabs[newTab].replace(":contestId", contestId));
  };

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
        }),
      thumbnailUrl: yup.string().trim(""),
      description: yup.string().trim(""),
      prizes: yup.string().trim(""),
      rules: yup.string().trim(""),
      scoring: yup.string().trim(""),
      isPublic: yup.boolean().required(t("contest_is_public_required")),
      isRestrictedForum: yup.boolean().required(t("contest_is_restricted_forum_required")),
      isDisabledForum: yup.boolean().required(t("contest_is_disabled_forum_required"))
      // problems: yup.array().of(
      //   yup.object().shape({
      //     questionId: yup.string().required(t("contest_question_id_required")),
      //     codeQuestionId: yup.string().required(t("contest_code_question_id_required")),
      //     difficulty: yup.string().required(t("contest_difficulty_required")),
      //     name: yup.string().required(t("contest_name_required")),
      //     questionText: yup.string().required(t("contest_question_text_required")),
      //     defaultMark: yup.number().required(t("contest_default_mark_required")),
      //     maxGrade: yup.number().required(t("contest_max_grade_required"))
      //   })
      // )
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
      endTime: moment.utc().add(1, "hour").toISOString(),
      thumbnailUrl: "",
      description: "",
      prizes: "",
      rules: "",
      scoring: "",
      isPublic: false,
      isRestrictedForum: false,
      isDisabledForum: false
    }
  });

  const handleGetContestById = useCallback(
    async (id: string) => {
      try {
        const contest = await ContestService.getContestById(id);
        if (contest) {
          setValue("name", contest.name);
          setDefaultContestName(contest.name);
          setValue("startTime", contest.startTime);
          if (!contest.endTime) {
            setValue("isNoEndTime", true);
            setValue("endTime", null);
          } else {
            setValue("isNoEndTime", false);
            setValue("endTime", contest.endTime);
          }
          setValue("thumbnailUrl", contest.thumbnailUrl);
          const description = contest.description
            ? contest.description
            : `Please provide a short description of your contest here!`;
          setValue("description", description);
          const prizes =
            contest.prizes && contest.prizes !== ""
              ? contest.prizes
              : `- Prizes are optional. You may add any prizes that you would like to offer here.`;
          setValue("prizes", prizes);
          const rules =
            contest.rules && contest.rules !== ""
              ? contest.rules
              : `- Please provide any rules for your contest here.`;
          setValue("rules", rules);
          const scoring =
            contest.scoring && contest.scoring !== ""
              ? contest.scoring
              : `- Each challenge has a pre-determined score.
          - A participant’s score depends on the number of test cases a participant’s code submission successfully passes.
          - If a participant submits more than one solution per challenge, then the participant’s score will reflect the highest score achieved.
          - Participants are ranked by score. If two or more participants achieve the same score, then the tie is broken by the total time taken to submit the last solution resulting in a higher score`;
          setValue("scoring", scoring);
          setValue("isPublic", contest.isPublic);
        }
      } catch (error: any) {
        console.error("error", error);
      }
    },
    [setValue]
  );

  const handleUpdateContest = useCallback(async (id: string, data: UpdateContestCommand) => {
    try {
      const updateContestResponse = await ContestService.updateContest(id, data);
      if (updateContestResponse) {
        setOpenSnackbarAlert(true);
        setType(AlertType.Success);
        setContent("Contest updated successfully");
      } else {
        setOpenSnackbarAlert(true);
        setType(AlertType.Error);
        setContent("Failed to update contest");
      }
    } catch (error: any) {
      console.error("error", error);
      if (error.code === 401 || error.code === 403) {
      }
      // Show snackbar here
    }
  }, []);

  const submitHandler = async (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (contestId) handleGetContestById(contestId);
  }, [contestId, handleGetContestById]);

  if (!contestId) return null;

  return (
    <>
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={type}
        content={content}
      />
      <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
        <Card
          sx={{
            "& .MuiDataGrid-root": {
              border: "1px solid #e0e0e0",
              borderRadius: "4px"
            },
            margin: "20px",
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
              <ParagraphSmall colorname='--blue-500'>{defaultContestName}</ParagraphSmall>
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              margin: "20px"
            }}
          >
            <Heading1>{defaultContestName}</Heading1>
          </Box>
          <Box
            sx={{
              margin: "20px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0"
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label='basic tabs example'
              className={classes.tabs}
              variant='fullWidth'
            >
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translate-key='common_details'>
                    {t("common_details")}
                  </ParagraphBody>
                }
                value={0}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translate-key='common_problems'>
                    {t("common_problems")}
                  </ParagraphBody>
                }
                value={1}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translate-key='common_advanced_settings'>
                    {t("common_advanced_settings")}
                  </ParagraphBody>
                }
                value={2}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translate-key='common_signups'>
                    {t("common_signups")}
                  </ParagraphBody>
                }
                value={3}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={
                  <ParagraphBody translate-key='common_statistics'>
                    {t("common_statistics")}
                  </ParagraphBody>
                }
                value={4}
              />
            </Tabs>
          </Box>
          <Box>
            <Routes>
              <Route
                path={"details"}
                element={
                  <ContestEditDetails
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                }
              />
              <Route path={"problems"} element={<ContestEditProblems />} />
              <Route
                path={"advanced-settings"}
                element={
                  <ContestEditAdvancedSettings
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                }
              />
              <Route path={"signups"} element={<ContestEditSignUps />} />
              <Route path={"statistics"} element={<ContestEditStatistics />} />
              <Route path={"*"} element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Card>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "fixed",
            bottom: "0px",
            padding: "20px",
            marginLeft: "-25px",
            backgroundColor: "white",
            borderTop: "1px solid #E0E0E0",
            width: isDrawerOpen ? "calc(100% - 300px)" : "100%"
          }}
        >
          <JoyButton
            variant='outlined'
            translation-key='contest_preview_contest_details_page'
            onClick={() =>
              navigate(routes.user.contest.detail.information.replace(":contestId", contestId))
            }
          >
            {t("contest_preview_contest_details_page")}
          </JoyButton>
          <JoyButton
            loading={submitLoading}
            variant='solid'
            type='submit'
            translation-key='common_save_changes'
            onClick={handleSubmit(submitHandler)}
          >
            {t("common_save_changes")}
          </JoyButton>
        </Box>
      </Box>
    </>
  );
};

export default EditContestDetails;
