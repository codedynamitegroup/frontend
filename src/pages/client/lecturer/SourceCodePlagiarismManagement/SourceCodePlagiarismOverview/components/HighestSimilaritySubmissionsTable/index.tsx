import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { Box } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import { useNavigate, useSearchParams } from "react-router-dom";
import CircularProgressWithLabel from "./components/CircularProgressWithLabel";
import { routes } from "routes/routes";

export default function HighestSimilaritySubmissionsTable({
  rows,
  headers
}: {
  rows: any[];
  headers: string[];
}) {
  const navigate = useNavigate();
  const size = rows.length > 5 ? 5 : rows.length;
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";

  return (
    <Sheet variant='outlined'>
      <Table variant='soft' borderAxis='bothBetween' hoverRow>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, size).map((row, index) => (
            <tr
              key={index}
              style={{
                cursor: "pointer"
              }}
              onClick={() => {
                navigate(
                  routes.lecturer.exam.code_submissions +
                    `?questionId=${questionId}&submissionId=${row.submissionId}`
                );
              }}
            >
              <td>
                <ParagraphBody>{row.submissionFilename}</ParagraphBody>
              </td>
              <td>
                <ParagraphBody>{row.submissionLabel}</ParagraphBody>
              </td>
              <td>
                <CircularProgressWithLabel value={row.submissionHighestSimilarity || 0} />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3}>
                <ParagraphBody align='center'>Không có bài nộp nào</ParagraphBody>
              </td>
            </tr>
          )}
          {size < rows.length && (
            <tr>
              <td
                colSpan={3}
                style={{
                  cursor: "pointer"
                }}
              >
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                  <ParagraphBody
                    display={"flex"}
                    justifyContent={"center"}
                    colorName='--primary'
                    margin={"0 10px"}
                    onClick={() =>
                      navigate(routes.lecturer.exam.code_submissions + `?questionId=${questionId}`)
                    }
                  >
                    Xem tất cả ({rows.length}) bài nộp
                  </ParagraphBody>
                  <FontAwesomeIcon icon={faGreaterThan} color='#737373' />
                </Box>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Sheet>
  );
}
