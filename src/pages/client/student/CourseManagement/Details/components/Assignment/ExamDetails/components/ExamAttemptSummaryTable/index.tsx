import Table from "@mui/joy/Table";
import ParagraphBody from "components/text/ParagraphBody";
import { Link as RouteLink } from "react-router-dom";
import { routes } from "routes/routes";
import { Link } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { ExamSubmissionDetail } from "models/courseService/entity/ExamEntity";

export default function StudentExamAttemptSummaryTable({
  rows,
  headers,
  examId,
  courseId,
  examMark,
  examGrade
}: {
  rows: ExamSubmissionDetail[];
  headers: string[];
  examId: string;
  courseId: string;
  examMark: number;
  examGrade: number;
}) {
  const { t } = useTranslation();

  const monthNames = [
    t("common_january"),
    t("common_february"),
    t("common_march"),
    t("common_april"),
    t("common_may"),
    t("common_june"),
    t("common_july"),
    t("common_august"),
    t("common_september"),
    t("common_october"),
    t("common_november"),
    t("common_december")
  ];

  const weekdayNames = [
    t("common_sunday"),
    t("common_monday"),
    t("common_tuesday"),
    t("common_wednesday"),
    t("common_thursday"),
    t("common_friday"),
    t("common_saturday")
  ];

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
        {rows.length !== 0 &&
          rows.map((row, index) => {
            const submitTime = new Date(row.submitTime);
            const status =
              row.status === "SUBMITTED"
                ? t("course_lecturer_assignment_submitted")
                : t("exam_detail_graded");
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <ParagraphBody
                    translation-key={["exam_detail_graded", "course_lecturer_assignment_submitted"]}
                    fontSize={".875rem"}
                    color={"#212121"}
                    fontWeight={"600"}
                  >
                    {status}
                  </ParagraphBody>
                  <ParagraphBody
                    fontSize={".75rem"}
                    color={"#212121"}
                    sx={{
                      opacity: 0.7
                    }}
                    translation-key='course_management_exam_submmit_on'
                  >{`${t("course_management_exam_submmit_on")} ${t("common_show_time", {
                    weekDay: weekdayNames[submitTime.getDay()],
                    day: submitTime.getDate(),
                    month: monthNames[submitTime.getMonth()], // getMonth returns 0-11, so add 1 to get 1-12
                    year: submitTime.getFullYear(),
                    time: `${submitTime.getHours() < 10 ? `0${submitTime.getHours()}` : submitTime.getHours()}:${submitTime.getMinutes() < 10 ? `0${submitTime.getMinutes()}` : submitTime.getMinutes()}`
                  })}`}</ParagraphBody>
                </td>
                <td>{row.mark}</td>
                <td>{row.grade}</td>
                <td>
                  <RouteLink
                    to={`${routes.student.exam.review
                      .replace(":courseId", courseId)
                      .replace(":examId", examId)
                      .replace(":submissionId", row.examSubmissionId)}`}
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
            );
          })}
        {rows.length === 0 && (
          <>
            <tr>
              <td colSpan={headers.length} style={{ textAlign: "center", verticalAlign: "middle" }}>
                <ParagraphBody
                  translation-key='exam_detail_summary_no_attempt'
                  fontSize={".875rem"}
                  color={"#212121"}
                  fontWeight={"600"}
                >
                  {t("exam_detail_summary_no_attempt")}
                </ParagraphBody>
              </td>
            </tr>
          </>
        )}
      </tbody>
    </Table>
  );
}
