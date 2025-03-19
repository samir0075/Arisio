import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Grid, Skeleton } from "@mui/material";

const SkeletonTableNew = (props) => {
  const { columns } = props;

  // Generate skeleton rows
  const skeletonRows = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    ...columns.reduce(
      (acc, column) => ({
        ...acc,
        [column.value]: <Skeleton variant="text" width="100%" height="90%" />,
      }),
      {}
    ),
  }));

  // Map columns for DataGrid
  const modifiedColumns = columns.map((column, index) => ({
    field: column.value, // Use 'value' for the field
    headerName: column.name, // Use 'name' for the header
    flex: 1,
    width: 350, // Default width
    headerClassName: "custom-header",
    renderCell: () => (
      <Skeleton variant="text" width="100%" height="90%" />
    ),
  }));

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        border: "2px solid #f5f5f5",
      }}
    >
      <DataGrid
        rows={skeletonRows}
        columns={modifiedColumns}
        disableColumnMenu
        hideFooter // Hides pagination and footer completely
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(65, 148, 179, 0.1)", // Header background color
            color: "rgba(138, 21, 56, 1)", // Header text color
            fontSize: "15px",
            fontWeight: 500,
            letterSpacing: "0px",
            textTransform: "none",
          },
          "& .MuiDataGrid-columnHeader:first-of-type": {
            borderRadius: "5px 0 0 5px", // Left corner radius
          },
          "& .MuiDataGrid-columnHeader:last-of-type": {
            borderRadius: "0 5px 5px 0", // Right corner radius
          },
          "& .MuiDataGrid-row": {
            border: "1px solid #f5f5f5",
          },
        }}
      />
    </div>
  );
};

export default SkeletonTableNew;
