import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";

export default function LabelSubmissionsTable({
  rows,
  headers
}: {
  rows: any[];
  headers: string[];
}) {
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
              <td>
                <ParagraphBody>{row.label}</ParagraphBody>
              </td>
              <td>
                <ParagraphSmall>{row.submissions}</ParagraphSmall>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
