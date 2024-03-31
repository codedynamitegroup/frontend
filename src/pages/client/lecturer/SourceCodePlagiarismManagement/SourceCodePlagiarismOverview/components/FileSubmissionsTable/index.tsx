import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { Box, TableCell } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import { File } from "models/codePlagiarism";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CircularProgressWithLabel from "../FilePairsTable/components/CircularProgressWithLabel";
import { routes } from "routes/routes";

export default function FileSubmissionsTable({
  rows,
  headers
}: {
  rows: File[];
  headers: string[];
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const size = rows.length > 5 ? 5 : rows.length;
  return (
    <Sheet variant='outlined'>
      <Table variant='soft' borderAxis='bothBetween' hoverRow>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                component='th'
                scope='row'
                width={index === headers.length - 1 ? "130px" : undefined}
                style={{
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  alignContent: "center"
                }}
              >
                {header}
              </TableCell>
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
                  routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
                    ":submissionId",
                    row.id.toString()
                  )
                );
              }}
            >
              <TableCell component='td' scope='row'>
                <ParagraphBody wordWrap='break-word'>{row.extra.orgUserId}</ParagraphBody>
              </TableCell>
              <TableCell component='td' scope='row'>
                <ParagraphBody wordWrap='break-word'>{row.extra.userFullName}</ParagraphBody>
              </TableCell>
              <TableCell component='td' scope='row'>
                <ParagraphBody wordWrap='break-word'>{row.extra.examName}</ParagraphBody>
              </TableCell>
              <TableCell component='td' scope='row'>
                <ParagraphBody wordWrap='break-word'>
                  {new Date(row.extra.createdAt).toLocaleString()}
                </ParagraphBody>
              </TableCell>
              <TableCell component='td' scope='row'>
                <CircularProgressWithLabel
                  value={Number((row?.fileScoring?.similarityScore?.similarity || 0) * 100) || 0}
                />
              </TableCell>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5}>
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
                navigate(routes.lecturer.exam.code_plagiarism_detection_submissions);
              }}
            >
              <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <ParagraphBody
                  colorname='--primary'
                  margin={"0 10px"}
                  translation-key='code_plagiarism_view_all_code_plagiarism_file_pairs'
                >
                  Xem tất cả ({rows.length}) bài nộp
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
