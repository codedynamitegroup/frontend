import classes from "./styles.module.scss";
import React from "react";
import Box from "@mui/material/Box";
import ParagraphBody from "components/text/ParagraphBody";
import { useState } from "react";
import DetailSolution from "./components/DetailSubmission";
import { useNavigate } from "react-router";
import UserTableTemplate from "components/common/table/UserTableTemplate";
import { useTranslation } from "react-i18next";

export default function ProblemDetailSubmission() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const customHeading = t("detail_problem_submission_customHeading", {
    returnObjects: true
  }) as Array<string>;
  const customColumns = ["status", "language", "runtime", "memory"];
  const data = [
    {
      id: 1,
      status: (
        <ParagraphBody
          fontWeight={"700"}
          colorname={"--green-600"}
          translation-key='detail_problem_submission_accepted'
        >
          {t("detail_problem_submission_accepted")}
        </ParagraphBody>
      ),
      language: "C++",
      runtime: 10,
      memory: 12
    },
    {
      id: 2,
      status: (
        <ParagraphBody
          fontWeight={"700"}
          colorname={"--red-error"}
          translation-key='detail_problem_submission_wrong_answer'
        >
          {t("detail_problem_submission_wrong_answer")}
        </ParagraphBody>
      ),
      language: "Java",
      runtime: "N/A",
      memory: "N/A"
    },
    {
      id: 3,
      status: (
        <ParagraphBody
          fontWeight={"700"}
          colorname={"--green-600"}
          translation-key='detail_problem_submission_accepted'
        >
          {t("detail_problem_submission_accepted")}
        </ParagraphBody>
      ),
      language: "Javascript",
      runtime: 12,
      memory: 12
    },
    {
      id: 4,
      status: (
        <ParagraphBody
          fontWeight={"700"}
          colorname={"--red-error"}
          translation-key='detail_problem_submission_wrong_answer'
        >
          {t("detail_problem_submission_wrong_answer")}
        </ParagraphBody>
      ),
      language: "C++",
      runtime: "N/A",
      memory: "N/A"
    }
  ];

  const [submissionDetail, setsubmissionDetail] = useState(true);
  const handlesubmissionDetail = () => {
    setsubmissionDetail(!submissionDetail);
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
      ) : (
        <Box className={classes.detailSubmission}>
          <DetailSolution handleSubmissionDetail={handlesubmissionDetail} />
        </Box>
      )}
    </Box>
  );
}
