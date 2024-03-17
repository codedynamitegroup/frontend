import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { Box } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import { useNavigate, useSearchParams } from "react-router-dom";
import CircularProgressWithLabel from "./components/CircularProgressWithLabel";
import { routes } from "routes/routes";
import { DolosCustomFile } from "../..";
import { useTranslation } from "react-i18next";

export default function FilePairsTable({
  rows,
  headers
}: {
  rows: {
    id: string;
    leftFile: DolosCustomFile;
    rightFile: DolosCustomFile;
    leftCovered: number;
    rightCovered: number;
    leftTotal: number;
    rightTotal: number;
    longestFragment: number;
    highestSimilarity: number;
    totalOverlap: number;
    buildFragments: {
      left: {
        startRow: number;
        startCol: number;
        endRow: number;
        endCol: number;
      };
      right: {
        startRow: number;
        startCol: number;
        endRow: number;
        endCol: number;
      };
    }[];
  }[];
  headers: string[];
}) {
  const { t } = useTranslation();
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
                    `?questionId=${questionId}`,
                  {
                    state: { data: row }
                  }
                );
              }}
            >
              <td>
                <ParagraphBody wordWrap='break-word'>{row.leftFile.extra.filename}</ParagraphBody>
              </td>
              <td>
                <ParagraphBody wordWrap='break-word'>{row.rightFile.extra.filename}</ParagraphBody>
              </td>
              <td>
                <CircularProgressWithLabel value={Number(row.highestSimilarity * 100) || 0} />
              </td>
              <td>
                <ParagraphBody>{row.longestFragment}</ParagraphBody>
              </td>
              <td>
                <ParagraphBody>{row.totalOverlap}</ParagraphBody>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3}>
                <ParagraphBody align='center' translation-key='no_submissions_message'>
                  {t("no_submissions_message")}
                </ParagraphBody>
              </td>
            </tr>
          )}
          <tr>
            <td
              colSpan={5}
              style={{
                cursor: "pointer"
              }}
              onClick={() => {
                navigate(
                  routes.lecturer.exam.code_plagiarism_detection_file_pairs +
                    `?questionId=${questionId}`,
                  {
                    state: { pairs: rows }
                  }
                );
              }}
            >
              <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <ParagraphBody
                  colorname='--primary'
                  margin={"0 10px"}
                  translation-key='code_plagiarism_view_all_code_plagiarism_file_pairs'
                >
                  {t("code_plagiarism_view_all_code_plagiarism_file_pairs", {
                    count: rows.length || 0
                  })}
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
