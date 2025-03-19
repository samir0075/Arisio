import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { createTheme } from "@mui/material/styles";
import { Grid, Pagination, Skeleton } from "@mui/material";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.5)" // dark gray grid lines
          },
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.5)" // dark gray grid lines
          }
        }
      }
    }
  }
});
const  SkeletonTable = props => {
  const { columns } = props;

  const skeletonRows = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    ...columns.reduce(
      (acc, column) => ({
        ...acc,
        [column.field]: <Skeleton variant="text"  width="100%" height={"90%"} />, // Empty string instead of Skeleton component
      }),
      {}
    ),
  }));
  const modifiedColumns = columns.map((column) => ({
    ...column,
        renderCell: () => (
            <Skeleton variant="text" width="100%" height={'90%'}  />
          ),
  }));

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          border: "2px solid #f5f5f5"
        }}
      >
        <DataGrid
          rows={skeletonRows}
          columns={modifiedColumns}
          disableColumnMenu
          pagination={false}
          sx={{
            // "& .MuiDataGrid-cell": {
            //   border: "1px solid #f5f5f5",
            // },
            "& .MuiDataGrid-row": {
              border: "1px solid #f5f5f5"
            },

            "& .MuiDataGrid-footerContainer": {
              display: "none"
            }
          }}
          // pageSizeOptions={[5, 10, 25]}
          //   checkboxSelection
          //   disableRowSelectionOnClick
        />
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ my: 2, bgcolor: "#FFFFFF", p: 2 }}
        >
          {/* <Pagination
            count={pageCount}
            showFirstButton
            showLastButton
            page={page}
            onChange={handlePagination}
          /> */}
        </Grid>
      </div>
    </>
  );
};

export default SkeletonTable
