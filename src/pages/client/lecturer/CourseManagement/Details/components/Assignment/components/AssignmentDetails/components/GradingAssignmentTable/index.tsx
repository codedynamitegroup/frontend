import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import classes from "./styles.module.scss";

export default function TableRowHead({ rows }: { rows: { header: string; data: string }[] }) {
  return (
    <Sheet variant='outlined'>
      <Table variant='soft' borderAxis='bothBetween' hoverRow className={classes.robotoFont}>
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
