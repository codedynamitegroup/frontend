import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

export default function StudentExamAttemptSummaryTable({
  rows,
  headers
}: {
  rows: any[];
  headers: string[];
}) {
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
                <ParagraphSmall>{`Nộp bài vào lúc ${row.submitted_at}`}</ParagraphSmall>
              </td>
              <td>{row.grade}</td>
              <td>
                <Button
                  btnType={BtnType.Text}
                  onClick={() => {
                    navigate(routes.student.exam.review);
                  }}
                >
                  Xem đánh giá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
