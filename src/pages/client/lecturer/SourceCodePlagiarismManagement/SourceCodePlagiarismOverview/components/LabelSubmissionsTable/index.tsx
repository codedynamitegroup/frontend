import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import CustomControlledSwitch from "components/common/switch/CustomControlledSwitch";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";

export default function LabelSubmissionsTable({
  rows,
  headers,
  handleLabelChange
}: {
  rows: {
    label: string;
    submissions: number;
    isActive: boolean;
  }[];
  headers: string[];
  handleLabelChange: (label: string, value: boolean) => void;
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
              <td>
                <CustomControlledSwitch
                  checked={row.isActive}
                  handleChange={(label: string, event: React.ChangeEvent<HTMLInputElement>) =>
                    handleLabelChange(label, event.target.checked)
                  }
                  inputProps={{ "aria-label": row.label }}
                />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length}>
                <ParagraphBody align='center'>Không có nhãn</ParagraphBody>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Sheet>
  );
}
