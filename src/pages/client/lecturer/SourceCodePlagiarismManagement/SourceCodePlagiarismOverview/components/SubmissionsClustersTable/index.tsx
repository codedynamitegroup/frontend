import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { Box, Chip, Tooltip } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import { File, Pair } from "models/codePlagiarism";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

export default function SubmissionsClustersTable({
  rows,
  headers
}: {
  rows: {
    id: number;
    submissions: File[];
    size: number;
    similarity: number;
    cluster: Pair[];
  }[];
  headers: string[];
}) {
  const { t } = useTranslation();
  const size = rows.length > 5 ? 5 : rows.length;
  const navigate = useNavigate();

  return (
    <Sheet variant='outlined'>
      <Table variant='soft' borderAxis='bothBetween' hoverRow>
        <thead>
          <tr>
            <th style={{ width: "10%" }}>{headers[0]}</th>
            <th>{headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, size).map((cluster, clusterIndex) => (
            <tr
              key={clusterIndex}
              style={{
                cursor: "pointer"
              }}
              onClick={() => {
                navigate(
                  routes.lecturer.exam.code_plagiarism_detection_clusters_detail.replace(
                    ":clusterId",
                    cluster.id.toString()
                  )
                );
              }}
            >
              <td>
                <ParagraphBody wordWrap='break-word' align='center'>
                  {clusterIndex + 1}
                </ParagraphBody>
              </td>
              <td>
                <Box
                  sx={{
                    maxHeight: "200px",
                    overflowY: "auto"
                  }}
                >
                  {cluster.submissions.map((submission, submissionIndex) => {
                    return (
                      <Tooltip
                        key={submissionIndex}
                        title={`${submission.id} - ${submission.extra.studentId} - ${submission.extra.studentName}`}
                        placement={"top"}
                      >
                        <Chip
                          label={`${submission.extra.studentId}`}
                          sx={{
                            margin: "5px"
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={2}>
                <ParagraphBody align='center' translation-key='no_submissions_message'>
                  {t("no_submissions_message")}
                </ParagraphBody>
              </td>
            </tr>
          )}
          <tr>
            <td
              colSpan={2}
              style={{
                cursor: "pointer"
              }}
              onClick={() => {
                navigate(routes.lecturer.exam.code_plagiarism_detection_clusters);
              }}
            >
              <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <ParagraphBody
                  colorname='--primary'
                  margin={"0 10px"}
                  translation-key='code_plagiarism_view_all_code_plagiarism_file_pairs'
                >
                  Xem tất cả ({rows.length}) nhóm
                </ParagraphBody>
                <FontAwesomeIcon icon={faGreaterThan} color='#737373' />
              </Box>
            </td>
          </tr>
        </tbody>
      </Table>
    </Sheet>
  );
}
