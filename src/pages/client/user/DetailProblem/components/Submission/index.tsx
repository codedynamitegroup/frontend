import { CircularProgress, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import UserTableTemplate from "components/common/table/UserTableTemplate";
import ParagraphBody from "components/text/ParagraphBody";
import { useAppDispatch, useAppSelector } from "hooks";
import cloneDeep from "lodash/cloneDeep";
import { CodeSubmissionDetailEntity } from "models/codeAssessmentService/entity/CodeSubmissionDetailEntity";
import { CodeSubmissionPaginationList } from "models/codeAssessmentService/entity/CodeSubmissionPaginationList";
import { ProgrammingLanguageEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageEntity";
import { ChapterResourceEntity } from "models/coreService/entity/ChapterResourceEntity";
import { ResourceTypeEnum } from "models/coreService/enum/ResourceTypeEnum";
import { lazy, memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { setLoading } from "reduxes/Loading";
import { markChapterResourceAsViewed } from "reduxes/coreService/Chapter";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { useIsMounted } from "utils/isMounted";
import { kiloByteToMegaByte, roundedNumber } from "utils/number";
import classes from "./styles.module.scss";

const DetailSolution = lazy(() => import("./components/DetailSubmission"));

interface ProblemDetailSubmissionProps {
  submissionLoading: boolean;
  maxHeight?: number;
  cerCourseInfo?: {
    cerCourseId: string;
    lesson: ChapterResourceEntity | null;
  };
  contestInfo?: {
    contestId: string;
    problemId: string;
  };
  isShareSolutionDisabled?: boolean;
}

const ProblemDetailSubmission = memo(
  ({
    submissionLoading,
    maxHeight,
    cerCourseInfo,
    contestInfo,
    isShareSolutionDisabled
  }: ProblemDetailSubmissionProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const pageSize = 100;
    const pageNum = 0;

    const [codeSubmissions, setCodeSubmissions] = useState<CodeSubmissionDetailEntity[]>();
    const [codeSubmissionLoading, setCodeSubmissionLoading] = useState(false);

    const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);

    const mapLanguages = new Map<string, { pLanguage: ProgrammingLanguageEntity; index: number }>();

    let languageList = cloneDeep(codeQuestion?.languages);

    languageList?.forEach((value, index) => {
      mapLanguages.set(value.id, { pLanguage: value, index });
    });
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const isMounted = useIsMounted();

    const handleMarkViewedChapterResourceById = useCallback(async () => {
      if (
        cerCourseInfo !== undefined &&
        cerCourseInfo.lesson &&
        cerCourseInfo.lesson.resourceType === ResourceTypeEnum.CODE &&
        !cerCourseInfo.lesson.isCompleted
      ) {
        try {
          dispatch(markChapterResourceAsViewed(cerCourseInfo.lesson.chapterResourceId));
        } catch (error: any) {
          //do nothing
        }
      }
    }, [cerCourseInfo, dispatch]);

    useEffect(() => {
      if (codeQuestion !== null && codeQuestion.id !== undefined) {
        setCodeSubmissionLoading(true);
        if (cerCourseInfo !== undefined) {
          CodeSubmissionService.getCodeSubmissionList(
            cerCourseInfo.lesson?.question?.codeQuestionId || "",
            pageNum,
            pageSize,
            undefined,
            cerCourseInfo.cerCourseId
          )
            .then((data: CodeSubmissionPaginationList) => {
              setCodeSubmissions(data.codeSubmissions);
            })
            .catch((err) => console.log(err))
            .finally(() => setCodeSubmissionLoading(false));
        } else if (contestInfo !== undefined) {
          CodeSubmissionService.getCodeSubmissionList(
            contestInfo.problemId,
            pageNum,
            pageSize,
            contestInfo.contestId,
            undefined
          )
            .then((data: CodeSubmissionPaginationList) => {
              setCodeSubmissions(data.codeSubmissions);
            })
            .catch((err) => console.log(err))
            .finally(() => setCodeSubmissionLoading(false));
        } else {
          CodeSubmissionService.getCodeSubmissionList(codeQuestion.id, pageNum, pageSize)
            .then((data: CodeSubmissionPaginationList) => {
              // console.log("data", data);
              setCodeSubmissions(data.codeSubmissions);
            })
            .catch((err) => console.log(err))
            .finally(() => setCodeSubmissionLoading(false));
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeQuestion, submissionLoading]);

    const customHeading = t("detail_problem_submission_customHeading", {
      returnObjects: true
    }) as Array<string>;
    const customColumns = ["status", "language", "runtime", "memory"];
    const data: Array<{ [key: string]: any; notClickAble?: boolean }> =
      codeSubmissions === undefined
        ? []
        : codeSubmissions.map((value, index) => {
            const language = mapLanguages.get(value.programmingLanguageId);
            return {
              id: index,
              codeSubmissionId: value.id,
              gradingStatus: value.gradingStatus,
              description: value.description,
              notClickAble: value.gradingStatus === "GRADED" ? false : true,
              status: (
                <ParagraphBody
                  fontWeight={"700"}
                  colorname={
                    value.gradingStatus === "GRADING"
                      ? "--orange-4"
                      : value.description !== "Accepted"
                        ? "--red-error"
                        : "--green-600"
                  }
                >
                  {value.gradingStatus === "GRADING"
                    ? value.gradingStatus
                    : value.description ??
                      (value.gradingStatus === "GRADING_SYSTEM_UNAVAILABLE"
                        ? "GRADING SYSTEM UNAVAILABLE"
                        : "")}
                </ParagraphBody>
              ),
              language: language === undefined ? "N/A" : language.pLanguage.name,
              runtime:
                value.avgRuntime === undefined || value.gradingStatus === "GRADING"
                  ? "N/A"
                  : `${roundedNumber(value.avgRuntime, 3)}s`,
              memory:
                value.avgMemory === undefined || value.gradingStatus === "GRADING"
                  ? "N/A"
                  : `${roundedNumber(kiloByteToMegaByte(value.avgMemory), 3)}MB`
            };
          });
    // [
    //   {
    //     id: 1,
    //     status: (
    //       <ParagraphBody
    //         fontWeight={"700"}
    //         colorname={"--green-600"}
    //         translation-key='detail_problem_submission_accepted'
    //       >
    //         {t("detail_problem_submission_accepted")}
    //       </ParagraphBody>
    //     ),
    //     language: "C++",
    //     runtime: 10,
    //     memory: 12
    //   },
    //   {
    //     id: 2,
    //     status: (
    //       <ParagraphBody
    //         fontWeight={"700"}
    //         colorname={"--red-error"}
    //         translation-key='detail_problem_submission_wrong_answer'
    //       >
    //         {t("detail_problem_submission_wrong_answer")}
    //       </ParagraphBody>
    //     ),
    //     language: "Java",
    //     runtime: "N/A",
    //     memory: "N/A"
    //   },
    //   {
    //     id: 3,
    //     status: (
    //       <ParagraphBody
    //         fontWeight={"700"}
    //         colorname={"--green-600"}
    //         translation-key='detail_problem_submission_accepted'
    //       >
    //         {t("detail_problem_submission_accepted")}
    //       </ParagraphBody>
    //     ),
    //     language: "Javascript",
    //     runtime: 12,
    //     memory: 12
    //   },
    //   {
    //     id: 4,
    //     status: (
    //       <ParagraphBody
    //         fontWeight={"700"}
    //         colorname={"--red-error"}
    //         translation-key='detail_problem_submission_wrong_answer'
    //       >
    //         {t("detail_problem_submission_wrong_answer")}
    //       </ParagraphBody>
    //     ),
    //     language: "C++",
    //     runtime: "N/A",
    //     memory: "N/A"
    //   }
    // ];
    const [detail, setDetail] = useState<CodeSubmissionDetailEntity | null>(null);
    const [languageName, setLanguageName] = useState<string | undefined>();

    const [submissionDetail, setsubmissionDetail] = useState(false);
    const handlesubmissionDetail = (rowId: number) => {
      const codeSubmisison = data[rowId];
      const codeSubmissionId = codeSubmisison.codeSubmissionId;
      dispatch(setLoading(true));
      CodeSubmissionService.getDetailCodeSubmission(codeSubmissionId)
        .then((data: CodeSubmissionDetailEntity) => {
          const langName = mapLanguages.get(data.programmingLanguageId ?? "")?.pLanguage.name;
          setLanguageName(langName);
          if (langName !== undefined && codeQuestion !== null) {
            data.gradingStatus = codeSubmisison.gradingStatus;
            data.description = codeSubmisison.description;
            setDetail(data);
            setsubmissionDetail((value) => !value);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => dispatch(setLoading(false)));
    };
    const checkGrading = useCallback((): boolean => {
      const data = codeSubmissions;
      // console.log(data);
      if (data === undefined || data.length < 1) return false;
      for (let i = 0; i < data.length; ++i) if (data[i].gradingStatus === "GRADING") return true;
      return false;
    }, [codeSubmissions]);

    useEffect(() => {
      const isGrading = checkGrading();
      if (isGrading) {
        // console.log("polling");
        const intervalId = window.setInterval(function () {
          if (codeQuestion !== null && codeQuestion.id !== undefined) {
            if (cerCourseInfo !== undefined) {
              CodeSubmissionService.getCodeSubmissionList(
                cerCourseInfo.lesson?.question?.codeQuestionId || "",
                pageNum,
                pageSize,
                undefined,
                cerCourseInfo.cerCourseId
              )
                .then((data: CodeSubmissionPaginationList) => {
                  setCodeSubmissions(data.codeSubmissions);
                })
                .catch((err) => console.log(err))
                .finally(() => setCodeSubmissionLoading(false));
            } else if (contestInfo !== undefined) {
              CodeSubmissionService.getCodeSubmissionList(
                contestInfo.problemId,
                pageNum,
                pageSize,
                contestInfo.contestId,
                undefined
              )
                .then((data: CodeSubmissionPaginationList) => {
                  setCodeSubmissions(data.codeSubmissions);
                })
                .catch((err) => console.log(err))
                .finally(() => setCodeSubmissionLoading(false));
            } else {
              CodeSubmissionService.getCodeSubmissionList(codeQuestion.id, pageNum, pageSize)
                .then((data: CodeSubmissionPaginationList) => {
                  setCodeSubmissions(data.codeSubmissions);
                  window.clearInterval(intervalId);
                })
                .catch((err) => console.log(err));
            }
          }
        }, 3000); // Poll every 3 seconds

        return () => window.clearInterval(intervalId);
      } // Cleanup interval on unmount
      else {
        // console.log("not polling");
        if (
          cerCourseInfo &&
          cerCourseInfo.lesson?.isCompleted !== true &&
          codeSubmissions !== undefined
        ) {
          const codeSubmissionIndex = codeSubmissions.findIndex(
            (value: CodeSubmissionDetailEntity) =>
              value.gradingStatus === "GRADED" && value.description === "Accepted"
          );
          if (codeSubmissionIndex !== -1) {
            handleMarkViewedChapterResourceById();
          }
        }
      }
    }, [
      codeSubmissions,
      cerCourseInfo,
      checkGrading,
      codeQuestion,
      handleMarkViewedChapterResourceById,
      contestInfo
    ]);

    return (
      <Box className={classes.container}>
        {codeSubmissionLoading && (
          <Stack marginTop={3} alignItems={"center"}>
            <CircularProgress />
          </Stack>
        )}
        {!codeSubmissionLoading &&
          (submissionDetail === false ? (
            <Box
              className={classes.submissionTable}
              sx={{
                height: maxHeight ? maxHeight : "auto",
                overflow: "auto"
              }}
            >
              <UserTableTemplate
                translation-key='detail_problem_submission_customHeading'
                customHeading={customHeading}
                customColumns={customColumns}
                data={data}
                isActionColumn={false}
                onViewDetailsClick={handlesubmissionDetail}
              />
            </Box>
          ) : languageName !== undefined && codeQuestion !== null ? (
            <Box className={classes.detailSubmission}>
              <DetailSolution
                codeSubmissionDetail={detail}
                languageName={languageName}
                codeQuestion={codeQuestion}
                handleSubmissionDetail={() => {
                  setsubmissionDetail(!submissionDetail);
                }}
                isShareSolutionDisabled={isShareSolutionDisabled}
              />
            </Box>
          ) : (
            <></>
          ))}
      </Box>
    );
  }
);

export default ProblemDetailSubmission;
