import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MemoryIcon from "@mui/icons-material/Memory";
import { Avatar, Box, Container, Grid, TextField } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import CustomBreadCrumb from "components/common/Breadcrumb";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import ParagraphSmall from "components/text/ParagraphSmall";
import i18next from "i18next";
import { CodeSubmissionDetailEntity } from "models/codeAssessmentService/entity/CodeSubmissionDetailEntity";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { ISourceCodeSubmission } from "services/AIService/FeedbackCodeByAI";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch } from "store";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import { kiloByteToMegaByte, roundedNumber } from "utils/number";
import classes from "./styles.module.scss";

const AdminContestSubmissionDetails = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { contestId } = useParams<{ contestId: string }>();
  const { submissionId } = useParams<{ submissionId: string }>();

  const [contestDetails, setContestDetails] = useState<ContestEntity | null>(null);

  const [codeSubmissionDetail, setCodeSubmissionDetail] =
    useState<CodeSubmissionDetailEntity | null>(null);

  const handleGetContestById = useCallback(async (id: string) => {
    try {
      const getContestDetailsResponse = await ContestService.getContestById(id);
      if (getContestDetailsResponse) {
        setContestDetails(getContestDetailsResponse);
      }
    } catch (error: any) {
      console.log("error", error);
    }
  }, []);

  const handleGetCodeSubmissionDetail = useCallback((codeSubmissionId: string) => {
    CodeSubmissionService.getDetailCodeSubmission(codeSubmissionId)
      .then((data: CodeSubmissionDetailEntity) => {
        console.log("data", data);
        setCodeSubmissionDetail(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {});
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (contestId && submissionId) {
        dispatch(setLoading(true));
        await handleGetContestById(contestId);
        await handleGetCodeSubmissionDetail(submissionId);
        dispatch(setLoading(false));
      }
    };
    fetchData();
  }, [contestId, dispatch, handleGetCodeSubmissionDetail, handleGetContestById, submissionId]);

  const toDateFormate = (str: string | undefined, format: string) => {
    try {
      if (str === undefined) return str;

      return standardlizeUTCStringToLocaleString(str, format);
    } catch (err) {
      console.error(err);
      return str;
    }
  };

  const sourceCodeSubmission: ISourceCodeSubmission = useMemo(() => {
    return {
      source_code: codeSubmissionDetail?.sourceCode ?? "",
      language: codeSubmissionDetail?.programmingLanguageName ?? ""
    };
  }, [codeSubmissionDetail]);

  if (!contestId || !contestDetails || !codeSubmissionDetail || !submissionId) {
    return null;
  }
  return (
    <>
      <Box>
        <Box className={classes.breadcump}>
          <Box id={classes.breadcumpWrapper}>
            <CustomBreadCrumb
              breadCrumbData={[
                { navLink: routes.admin.contest.root, label: t("contest_management_title") },
                {
                  navLink: routes.admin.contest.edit.details.replace(":contestId", contestId),
                  label: contestDetails.name
                },
                {
                  navLink: routes.admin.contest.submissions.replace(":contestId", contestId),
                  label: t("detail_problem_submission")
                }
              ]}
              lastBreadCrumbLabel={t("detail_problem_submission_details")}
            />
          </Box>
        </Box>
        <Box
          sx={{
            margin: "0 20px",
            minHeight: "700px"
          }}
        >
          <Heading1>{t("detail_problem_submission_details")}</Heading1>
          <Box
            sx={{
              margin: "0"
            }}
          >
            <Box className={classes.submissionContainer}>
              <Box className={classes.submissionInfo}>
                <Box className={classes.submissionTitle}>
                  {codeSubmissionDetail && (
                    <ParagraphBody
                      fontWeight={"700"}
                      colorname={
                        codeSubmissionDetail.gradingStatus === "GRADING"
                          ? "--orange-4"
                          : codeSubmissionDetail.description !== "Accepted"
                            ? "--red-error"
                            : "--green-600"
                      }
                    >
                      {codeSubmissionDetail.gradingStatus === "GRADING" ||
                      codeSubmissionDetail.description === undefined
                        ? codeSubmissionDetail.gradingStatus.replace("_", " ")
                        : codeSubmissionDetail.description}
                    </ParagraphBody>
                  )}
                  <Box className={classes.submissionAuthor}>
                    <Avatar
                      sx={{
                        bgcolor: `${generateHSLColorByRandomText(`${codeSubmissionDetail?.user?.firstName} ${codeSubmissionDetail?.user?.lastName}`)}`
                      }}
                      alt={codeSubmissionDetail?.user?.email}
                      src={codeSubmissionDetail?.user?.avatarUrl}
                    >
                      {codeSubmissionDetail?.user?.firstName.charAt(0)}
                    </Avatar>

                    <ParagraphExtraSmall fontWeight={"700"}>
                      {i18next.language === "vi"
                        ? `${codeSubmissionDetail?.user?.lastName ?? ""} ${codeSubmissionDetail?.user?.firstName ?? ""}`
                        : `${codeSubmissionDetail?.user?.firstName ?? ""} ${codeSubmissionDetail?.user?.lastName ?? ""}`}
                    </ParagraphExtraSmall>
                    <ParagraphExtraSmall translation-key='detail_problem_submission_detail_user_submission_time'>
                      {t("detail_problem_submission_detail_user_submission_time", {
                        time:
                          toDateFormate(codeSubmissionDetail?.createdAt, i18next.language) ?? "N/A",
                        interpolation: { escapeValue: false }
                      })}
                    </ParagraphExtraSmall>
                  </Box>
                </Box>
              </Box>
              {codeSubmissionDetail?.firstFailTestCase?.message &&
                codeSubmissionDetail.firstFailTestCase.message.length > 0 && (
                  <Box className={classes.result} sx={styles.errorBox}>
                    <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                      Message
                    </ParagraphBody>
                    <TextField
                      multiline
                      InputProps={{
                        readOnly: true,
                        disableUnderline: true
                      }}
                      fullWidth
                      size='small'
                      className={classes.input}
                      value={codeSubmissionDetail.firstFailTestCase.message ?? ""}
                      variant='standard'
                      inputProps={{ style: { color: "var(--red-text)" } }}
                    />
                  </Box>
                )}
              {codeSubmissionDetail?.firstFailTestCase?.stderr &&
                codeSubmissionDetail.firstFailTestCase.stderr.length > 0 && (
                  <Box className={classes.result} sx={styles.errorBox}>
                    <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                      Stderr
                    </ParagraphBody>
                    <TextField
                      multiline
                      InputProps={{
                        readOnly: true,
                        disableUnderline: true
                      }}
                      fullWidth
                      size='small'
                      className={classes.input}
                      value={codeSubmissionDetail.firstFailTestCase.stderr.length}
                      variant='standard'
                      inputProps={{ style: { color: "var(--red-text)" } }}
                    />
                  </Box>
                )}
              {codeSubmissionDetail?.firstFailTestCase?.compileOutput &&
                codeSubmissionDetail.firstFailTestCase.compileOutput.length > 0 && (
                  <Box className={classes.result} sx={styles.errorBox}>
                    <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                      Complie output
                    </ParagraphBody>
                    <TextField
                      multiline
                      InputProps={{
                        readOnly: true,
                        disableUnderline: true
                      }}
                      fullWidth
                      size='small'
                      className={classes.input}
                      value={codeSubmissionDetail.firstFailTestCase.compileOutput}
                      variant='standard'
                      inputProps={{ style: { color: "var(--red-text)" } }}
                    />
                  </Box>
                )}
              {codeSubmissionDetail?.firstFailTestCase &&
                codeSubmissionDetail.description !== "Compilation Error" && (
                  <Box sx={{ marginY: 1 }}>
                    <ParagraphBody
                      fontWeight={700}
                      translation-key='detail_problem_submission_failed_test_case'
                    >
                      {t("detail_problem_submission_failed_test_case")}
                    </ParagraphBody>
                  </Box>
                )}

              {codeSubmissionDetail?.firstFailTestCase?.input &&
                codeSubmissionDetail.description !== "Compilation Error" && (
                  <Box className={classes.result}>
                    <ParagraphExtraSmall translation-key='detail_problem_input'>
                      {t("detail_problem_input")}
                      {": "}
                    </ParagraphExtraSmall>
                    <TextField
                      multiline
                      InputProps={{ readOnly: true }}
                      fullWidth
                      id='outlined-basic'
                      variant='outlined'
                      size='small'
                      className={classes.input}
                      value={codeSubmissionDetail.firstFailTestCase.input}
                    />
                  </Box>
                )}
              {codeSubmissionDetail?.firstFailTestCase?.output &&
                codeSubmissionDetail.description !== "Compilation Error" && (
                  <Box className={classes.result}>
                    <ParagraphExtraSmall translation-key='detail_problem_output'>
                      {t("detail_problem_output")}
                      {": "}
                    </ParagraphExtraSmall>
                    <TextField
                      multiline
                      fullWidth
                      InputProps={{ readOnly: true }}
                      id='outlined-basic'
                      variant='outlined'
                      size='small'
                      className={classes.input}
                      value={codeSubmissionDetail.firstFailTestCase.output}
                    />
                  </Box>
                )}
              {codeSubmissionDetail?.firstFailTestCase?.actualOutput &&
                codeSubmissionDetail.description !== "Compilation Error" && (
                  <Box className={classes.result}>
                    <ParagraphExtraSmall translation-key='detail_problem_actual_result'>
                      {t("detail_problem_actual_result")}
                      {": "}
                    </ParagraphExtraSmall>
                    <TextField
                      multiline
                      InputProps={{ readOnly: true }}
                      fullWidth
                      id='outlined-basic'
                      variant='outlined'
                      size='small'
                      className={classes.input}
                      value={codeSubmissionDetail.firstFailTestCase.actualOutput}
                    />
                  </Box>
                )}
              <Grid container className={classes.submissionStatistical}>
                <Grid item xs={5.75} className={classes.statisticalTime}>
                  <Container className={classes.title}>
                    <AccessTimeIcon />
                    <ParagraphSmall
                      colorname={"--white"}
                      translation-key='detail_problem_submission_detail_runtime'
                    >
                      {t("detail_problem_submission_detail_runtime")}
                    </ParagraphSmall>
                  </Container>
                  <Container className={classes.data}>
                    <ParagraphBody colorname={"--white"} fontSize={"20px"} fontWeight={"700"}>
                      {roundedNumber(codeSubmissionDetail?.avgRuntime, 3) ?? "N/A"}
                      {codeSubmissionDetail?.avgRuntime !== undefined ? "ms" : ""}
                    </ParagraphBody>
                  </Container>
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={5.75} className={classes.statisticalMemory}>
                  <Container className={classes.title}>
                    <MemoryIcon />
                    <ParagraphSmall
                      colorname={"--white"}
                      translation-key='detail_problem_submission_detail_memory'
                    >
                      {t("detail_problem_submission_detail_memory")}
                    </ParagraphSmall>
                  </Container>
                  <Container className={classes.data}>
                    <ParagraphBody colorname={"--white"} fontSize={"20px"} fontWeight={"700"}>
                      {roundedNumber(kiloByteToMegaByte(codeSubmissionDetail?.avgMemory), 3) ??
                        "N/A"}{" "}
                      {codeSubmissionDetail?.avgMemory !== undefined ? "MB" : ""}
                    </ParagraphBody>
                  </Container>
                </Grid>
              </Grid>
              <Box className={classes.submissionText}>
                <Box className={classes.feedbackTitle}>
                  <ParagraphBody
                    fontWeight={700}
                    translation-key='detail_admin_problem_submission_detail_solution'
                  >
                    {t("detail_admin_problem_submission_detail_solution")}
                  </ParagraphBody>
                </Box>
                <Box data-color-mode='light'>
                  <MDEditor.Markdown source={"```java\n" + sourceCodeSubmission.source_code} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdminContestSubmissionDetails;
const styles = {
  errorBox: {
    backgroundColor: "var(--red-background)",
    borderRadius: 1,
    paddingX: 1
  }
};
