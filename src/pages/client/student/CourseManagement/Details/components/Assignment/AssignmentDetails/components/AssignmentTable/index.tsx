import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { ReactNode } from "react";
import classes from "./styles.module.scss";

interface TableRowHeadProps {
  rows: { header: string; data: ReactNode; status?: number }[];
}

export default function TableRowHead({ rows }: TableRowHeadProps) {
  return (
    <Sheet variant='outlined'>
      <Table variant='soft' borderAxis='bothBetween' hoverRow>
        <tbody>
          {rows.map((row) => (
            <tr key={row.header}>
              <th scope='row' style={{ width: "30%" }}>
                {row.header}
              </th>
              <td
                className={
                  row.status === 1
                    ? classes.successColor
                    : row.status === 2
                      ? classes.errorColor
                      : ""
                }
              >
                {row.data}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
