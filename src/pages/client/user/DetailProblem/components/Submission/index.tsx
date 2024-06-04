import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import ParagraphBody from "components/text/ParagraphBody";
import { useEffect, useRef, useState } from "react";
import DetailSolution from "./components/DetailSubmission";
import { useNavigate } from "react-router";
import UserTableTemplate from "components/common/table/UserTableTemplate";
import { useTranslation } from "react-i18next";
import { ProgrammingLanguageEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageEntity";
import cloneDeep from "lodash/cloneDeep";
import { useAppSelector } from "hooks";
import { CodeSubmissionDetailEntity } from "models/codeAssessmentService/entity/CodeSubmissionDetailEntity";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { CodeSubmissionPaginationList } from "models/codeAssessmentService/entity/CodeSubmissionPaginationList";
import { useIsMounted } from "utils/isMounted";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { roundedNumber } from "utils/number";

export default function ProblemDetailSubmission() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const pageSize = 100;
  const pageNum = 0;

  const [codeSubmissions, setCodeSubmissions] = useState<CodeSubmissionDetailEntity[]>();

  const codeQuestion = useAppSelector((state) => state.detailCodeQuestion.codeQuestion);

  const mapLanguages = new Map<string, { pLanguage: ProgrammingLanguageEntity; index: number }>();

  let languageList = cloneDeep(codeQuestion?.languages);

  languageList?.forEach((value, index) => {
    mapLanguages.set(value.id, { pLanguage: value, index });
  });
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const isMounted = useIsMounted();
  const cronGrading = async () => {
    let isGrading = false;
    if (codeSubmissions !== undefined)
      for (let i = 0; i < codeSubmissions.length; ++i) {
        console.log("looping");
        if (codeSubmissions[i].gradingStatus === "GRADING") isGrading = true;
      }

    if (isGrading === true) {
      await sleep(2500);
      if (codeQuestion !== null && codeQuestion.id !== undefined)
        CodeSubmissionService.getCodeSubmissionList(codeQuestion.id, pageNum, pageSize)
          .then((data: CodeSubmissionPaginationList) => {
            if (!isMounted) setCodeSubmissions(undefined);
            // console.log("data", data);
            else setCodeSubmissions(data.codeSubmissions);
          })
          .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    cronGrading();
  }, [codeSubmissions]);

  useEffect(() => {
    if (codeQuestion !== null && codeQuestion.id !== undefined)
      CodeSubmissionService.getCodeSubmissionList(codeQuestion.id, pageNum, pageSize)
        .then((data: CodeSubmissionPaginationList) => {
          // console.log("data", data);
          setCodeSubmissions(data.codeSubmissions);
        })
        .catch((err) => console.log(err));
  }, []);

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
                {value.gradingStatus === "GRADING" ? value.gradingStatus : value.description}
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
                : `${value.avgMemory}kB`
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

  const [submissionDetail, setsubmissionDetail] = useState(true);
  const handlesubmissionDetail = (rowId: number) => {
    const codeSubmisison = data[rowId];
    const codeSubmissionId = codeSubmisison.codeSubmissionId;
    if (codeSubmisison.gradingStatus === "GRADED")
      CodeSubmissionService.getDetailCodeSubmission(codeSubmissionId)
        .then((data: CodeSubmissionDetailEntity) => {
          setLanguageName(mapLanguages.get(data.programmingLanguageId ?? "")?.pLanguage.name);
          if (languageName !== undefined && codeQuestion !== null) {
            setDetail(data);
            setsubmissionDetail(!submissionDetail);
          }
        })
        .catch((err) => console.error(err));
  };

  return (
    <Box className={classes.container}>
      {submissionDetail === true ? (
        <Box className={classes.submissionTable}>
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
          />
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}
