import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";

export default function TableRowHead({ rows }: { rows: { header: string; data: string }[] }) {
  return (
    <Sheet variant='outlined'>
      <Table variant='soft' borderAxis='bothBetween' hoverRow>
        <tbody>
          {rows.map((row) => (
            <tr key={row.header}>
              <th scope='row' style={{ width: "30%" }}>
                {row.header}
              </th>
              <td>{row.data}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
