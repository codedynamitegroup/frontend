import { yupResolver } from "@hookform/resolvers/yup";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import JoyButton from "@mui/joy/Button";
import { Box, Card, Divider, Tab, Tabs } from "@mui/material";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import { UpdateContestCommand } from "models/coreService/update/UpdateContestCommand";
import moment from "moment";
import NotFoundPage from "pages/common/NotFoundPage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { ContestService } from "services/coreService/ContestService";
import * as yup from "yup";
import ContestEditAdvancedSettings from "./ContestEditAdvancedSettings";
import ContestEditDetails from "./ContestEditDetails";
import ContestEditProblems from "./ContestEditProblems";
import ContestEditSignUps from "./ContestEditSignUps";
import ContestEditStatistics from "./ContestEditStatictics";
import classes from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { ContestEntity } from "models/coreService/entity/ContestEntity";

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
  problems: {
    questionId: string;
    codeQuestionId: string;
    difficulty: string;
    name: string;
    questionText: string;
    defaultMark: number;
    maxGrade: number;
  }[];
}

const EditContestDetails = ({ isDrawerOpen }: any) => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [statistics, setStatistics] = useState<{
    numOfSignUps: number;
    numOfParticipantsHavingSubmissions: number;
    contestQuestions: any[];
  } | null>(null);

  const { contestId } = useParams<{ contestId: string }>();
  const [submitLoading, setSubmitLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

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
      isDisabledForum: yup.boolean().required(t("contest_is_disabled_forum_required")),
      problems: yup
        .array()
        .of(
          yup.object().shape({
            questionId: yup.string().required(t("contest_question_id_required")),
            codeQuestionId: yup.string().required(t("contest_code_question_id_required")),
            difficulty: yup.string().required(t("contest_difficulty_required")),
            name: yup.string().required(t("contest_name_required")),
            questionText: yup.string().required(t("contest_question_text_required")),
            defaultMark: yup.number().required(t("contest_default_mark_required")),
            maxGrade: yup.number().required(t("contest_max_grade_required"))
          })
        )
        .required(t("contest_problems_required"))
    });
  }, [t]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset
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
      isDisabledForum: false,
      problems: []
    }
  });

  const handleGetContestById = useCallback(
    async (id: string) => {
      try {
        const contest: ContestEntity = await ContestService.getContestById(id);
        if (contest) {
          const description = contest.description
            ? contest.description
            : `Please provide a short description of your contest here!`;
          const prizes =
            contest.prizes && contest.prizes !== ""
              ? contest.prizes
              : `- Prizes are optional. You may add any prizes that you would like to offer here.`;
          const rules =
            contest.rules && contest.rules !== ""
              ? contest.rules
              : `- Please provide any rules for your contest here.`;
          const scoring =
            contest.scoring && contest.scoring !== ""
              ? contest.scoring
              : `- Each challenge has a pre-determined score.<br/>
              - A participant’s score depends on the number of test cases a participant’s code submission successfully passes.<br/>
              - If a participant submits more than one solution per challenge, then the participant’s score will reflect the highest score achieved.<br/>
              - Participants are ranked by score. If two or more participants achieve the same score, then the tie is broken by the total time taken to submit the last solution resulting in a higher score`;
          reset({
            name: contest.name,
            startTime: contest.startTime,
            endTime: !contest.endTime ? null : contest.endTime,
            isNoEndTime: !contest.endTime ? true : false,
            thumbnailUrl: contest.thumbnailUrl,
            description: description,
            prizes: prizes,
            rules: rules,
            scoring: scoring,
            isPublic: contest.isPublic,
            isRestrictedForum: contest.isRestrictedForum,
            isDisabledForum: contest.isDisabledForum,
            problems: contest.questions.map((question) => {
              return {
                questionId: question.questionId,
                codeQuestionId: question.codeQuestionId,
                difficulty: question.difficulty,
                name: question.name,
                questionText: question.questionText,
                defaultMark: question.defaultMark,
                maxGrade: question.maxGrade
              };
            })
          });
          setDefaultContestName(contest.name);
        }
        const statistics = await ContestService.getAdminContestDetailsStatistics(id);
        if (statistics) {
          setStatistics(statistics);
        }
      } catch (error: any) {
        console.error("error", error);
      }
    },
    [reset]
  );

  const handleUpdateContest = useCallback(
    async (id: string, data: IFormDataType) => {
      setSubmitLoading(true);
      try {
        const updateContestResponse = await ContestService.updateContest(id, {
          name: data.name,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl,
          prizes: data.prizes,
          rules: data.rules,
          scoring: data.scoring,
          isPublic: data.isPublic,
          startTime: data.startTime,
          endTime: data.isNoEndTime ? null : data.endTime,
          isRestrictedForum: data.isRestrictedForum,
          isDisabledForum: data.isDisabledForum,
          questionIds: data.problems.map((problem) => problem.questionId)
        });
        if (updateContestResponse) {
          dispatch(setSuccessMess("Contest updated successfully"));
        } else {
          dispatch(setErrorMess("Failed to update contest"));
        }
        setSubmitLoading(false);
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess("You are not authorized to update this contest"));
        }
        setSubmitLoading(false);
      }
    },
    [dispatch]
  );

  const submitHandler = async (data: IFormDataType) => {
    if (contestId) {
      handleUpdateContest(contestId, data);
    }
  };

  useEffect(() => {
    if (contestId) handleGetContestById(contestId);
  }, [contestId, handleGetContestById]);

  if (!contestId) return null;

  return (
    <>
      <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
        <Card
          sx={{
            "& .MuiDataGrid-root": {
              border: "1px solid #e0e0e0",
              borderRadius: "4px"
            },
            margin: "20px 20px 90px 20px",
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
              <Route
                path={"problems"}
                element={
                  <ContestEditProblems
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                }
              />
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
              <Route path={"statistics"} element={<ContestEditStatistics data={statistics} />} />
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
