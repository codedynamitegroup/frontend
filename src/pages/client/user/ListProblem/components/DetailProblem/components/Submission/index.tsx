import classes from "./styles.module.scss";
import React from "react";
import Box from "@mui/material/Box";
import ParagraphBody from "components/text/ParagraphBody";
import { useState } from "react";
import DetailSolution from "./components/DetailSubmission";
import { useNavigate } from "react-router";
import UserTableTemplate from "components/common/table/UserTableTemplate";

export default function ProblemDetailSubmission() {
  const navigate = useNavigate();
  const customHeading = ["Trạng thái", "Ngôn ngữ", "Thời gian thực thi", "Bộ nhớ"];
  const customColumns = ["status", "language", "runtime", "memory"];
  const data = [
    {
      id: 1,
      status: (
        <ParagraphBody fontWeight={"700"} colorName={"--green-600"}>
          Thành công
        </ParagraphBody>
      ),
      language: "C++",
      runtime: 10,
      memory: 12
    },
    {
      id: 2,
      status: (
        <ParagraphBody fontWeight={"700"} colorName={"--red-error"}>
          Thất bại
        </ParagraphBody>
      ),
      language: "Java",
      runtime: "N/A",
      memory: "N/A"
    },
    {
      id: 3,
      status: (
        <ParagraphBody fontWeight={"700"} colorName={"--green-600"}>
          Thành công
        </ParagraphBody>
      ),
      language: "Javascript",
      runtime: 12,
      memory: 12
    },
    {
      id: 4,
      status: (
        <ParagraphBody fontWeight={"700"} colorName={"--red-error"}>
          Thất bại
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
