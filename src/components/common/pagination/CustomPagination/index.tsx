import { Pagination } from "@mui/material";
import * as React from "react";

interface CustomPaginationProps {
  count: number;
  page: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  size?: "small" | "medium" | "large";
}

const CustomPagination = ({
  count,
  page,
  handlePageChange,
  showFirstButton = false,
  showLastButton = false,
  size = "small"
}: CustomPaginationProps) => {
  return (
    <Pagination
      page={page}
      count={count}
      showFirstButton={showFirstButton}
      showLastButton={showLastButton}
      size={size}
      onChange={handlePageChange}
    />
  );
};

export default CustomPagination;
