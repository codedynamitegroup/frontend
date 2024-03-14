import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { Box } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import { useNavigate, useSearchParams } from "react-router-dom";
import CircularProgressWithLabel from "./components/CircularProgressWithLabel";
import { routes } from "routes/routes";

export default function FilePairsTable({ rows, headers }: { rows: any[]; headers: string[] }) {
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
                  routes.lecturer.exam.code_plagiarism_detection_file_pairs_detail +
                    `?questionId=${questionId}`
                );
              }}
            >
              <td>
                <ParagraphBody>{row.left_file}</ParagraphBody>
              </td>
              <td>
                <ParagraphBody>{row.right_file}</ParagraphBody>
              </td>
              <td>
                <CircularProgressWithLabel value={Number(row.highest_similarity) || 0} />
              </td>
              <td>
                <ParagraphBody>{row.longest_fragment}</ParagraphBody>
              </td>
              <td>
                <ParagraphBody>{row.total_overlap}</ParagraphBody>
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
                colSpan={5}
                style={{
                  cursor: "pointer"
                }}
                onClick={() => {
                  console.log("rows", rows);
                  navigate(
                    routes.lecturer.exam.code_plagiarism_detection_file_pairs +
                      `?questionId=${questionId}`,
                    {
                      state: { filePairList: rows }
                    }
                  );
                }}
              >
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                  <ParagraphBody colorname='--primary' margin={"0 10px"}>
                    Xem tất cả ({rows.length}) cặp tệp bài nộp
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
