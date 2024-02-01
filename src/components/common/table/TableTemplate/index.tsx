import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";

interface TableTemplateProps {
  data: Array<{ [key: string]: any }>;
  customHeading: string[];
  customColumns: string[];
  isActionColumn: boolean;
  onViewDetailsClick?: (idDetails: number) => void;
  onEditClick?: (idEdit: number) => void;
  onDeleteClick?: (idDelete: number) => void;
}

function TableTemplate({
  data,
  customHeading,
  customColumns,
  isActionColumn,
  onViewDetailsClick,
  onEditClick,
  onDeleteClick
}: TableTemplateProps) {
  const handleViewDetailsClick = (rowId: number) => {
    if (onViewDetailsClick) {
      onViewDetailsClick(rowId);
    }
  };

  const handleEditClick = (rowId: number) => {
    if (onEditClick) {
      onEditClick(rowId);
    }
  };

  const handleDeleteClick = (rowId: number) => {
    if (onDeleteClick) {
      onDeleteClick(rowId);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='custom table'>
        <TableHead className={classes["table-head"]}>
          <TableRow>
            {/* Custom heading */}
            {customHeading.map((heading, index) => (
              <TableCell
                key={index}
                align='left'
                className={`${classes["table-cell"]} ${
                  heading === "STT" ? classes["small-heading"] : ""
                }`}
              >
                <ParagraphBody fontWeight={700}>{heading}</ParagraphBody>
              </TableCell>
            ))}
            {/* Action column heading */}
            {isActionColumn && (
              <TableCell align='left' className={classes["table-cell"]}>
                <ParagraphBody fontWeight={700}>Hành động</ParagraphBody>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.length > 0 &&
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {customColumns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align='left'
                    className={`${classes["col-table-body"]}                           
										`}
                  >
                    <ParagraphBody>{row[column]}</ParagraphBody>
                  </TableCell>
                ))}

                {/* Action column */}
                {isActionColumn && (
                  <TableCell align='left' className={classes["cell-actions"]}>
                    {onViewDetailsClick && (
                      <Tooltip title='Chi tiết'>
                        <IconButton
                          aria-label='view-detail'
                          size='medium'
                          onClick={() => handleViewDetailsClick(row.id)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onEditClick && (
                      <Tooltip title='Chỉnh sửa'>
                        <IconButton
                          aria-label='edit'
                          size='medium'
                          onClick={() => {
                            handleEditClick(row.id);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDeleteClick && (
                      <Tooltip title='Xóa'>
                        <IconButton size='medium' onClick={() => handleDeleteClick(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          {(!data || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={isActionColumn ? customHeading.length + 1 : customHeading.length}>
                <ParagraphBody className={classes.noList}>Không tìm thấy thông tin</ParagraphBody>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableTemplate;
