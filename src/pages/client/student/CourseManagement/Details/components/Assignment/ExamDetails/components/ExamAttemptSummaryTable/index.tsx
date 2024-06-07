import Table from "@mui/joy/Table";
import ParagraphBody from "components/text/ParagraphBody";
import { Link as RouteLink } from "react-router-dom";
import { routes } from "routes/routes";
import { Link } from "@mui/joy";
import { useTranslation } from "react-i18next";

export default function StudentExamAttemptSummaryTable({
  rows,
  headers,
  examId,
  courseId
}: {
  rows: any[];
  headers: string[];
  examId: string;
  courseId: string;
}) {
  const { t } = useTranslation();

  return (
    <Table
      variant='soft'
      size='lg'
      hoverRow
      sx={{
        backgroundColor: "white",
        "& tbody tr:hover": {
          backgroundColor: "#f3f3f3" // Change this to your desired color
        }
      }}
    >
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              style={{
                backgroundColor: "white",
                borderBottom: "2px solid rgb(128,128,128)"
              }}
            >
              <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
                {header}
              </ParagraphBody>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td>{row.no}</td>
            <td>
              <ParagraphBody fontSize={".875rem"} color={"#212121"} fontWeight={"600"}>
                {row.state}
              </ParagraphBody>
              <ParagraphBody
                fontSize={".75rem"}
                color={"#212121"}
                sx={{
                  opacity: 0.7
                }}
              >{`Nộp lúc ${row.submitted_at}`}</ParagraphBody>
            </td>
            <td>{row.grade}</td>
            <td>
              <RouteLink
                to={`${routes.student.exam.review
                  .replace(":courseId", courseId)
                  .replace(":examId", examId)
                  .replace(":submissionId", "f1fd9a68-9269-4cc6-bc45-c6928cc8f6e5")}`}
              >
                <Link
                  translation-key='exam_detail_summary_open_review'
                  href=''
                  underline='hover'
                  variant='plain'
                  level='body-sm'
                >
                  {t("exam_detail_summary_open_review")}
                </Link>
              </RouteLink>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
