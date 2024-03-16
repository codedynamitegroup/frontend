import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

export default function ExamAttemptSummaryTable({
  rows,
  headers
}: {
  rows: any[];
  headers: string[];
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.no}</td>
              <td>
                <ParagraphBody>{row.state}</ParagraphBody>
                <ParagraphSmall translation-key='course_management_exam_submmit_on'>{`${t("course_management_exam_submmit_on")} ${row.submitted_at}`}</ParagraphSmall>
              </td>
              <td>{row.grade}</td>
              <td>
                <Button
                  btnType={BtnType.Text}
                  onClick={() => {
                    navigate(routes.lecturer.exam.review);
                  }}
                  translation-key='common_see_evaluating'
                >
                  {t("common_see_evaluating")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
