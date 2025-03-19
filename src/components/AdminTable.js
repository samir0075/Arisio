import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { createTheme } from "@mui/material/styles";
import { Grid, Pagination } from "@mui/material";

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
const AdminTable = props => {
  const { rows, columns, page, pageCount, handlePagination } = props;

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
          rows={rows}
          columns={columns}
          disableColumnMenu
          pagination={false}
          rowHeight={43}
          sx={{
            // "& .MuiDataGrid-cell": {
            //   border: "1px solid #f5f5f5",
            // },
            "& .MuiDataGrid-row": {
              border: "1px solid #f5f5f5"
            },

            "& .MuiDataGrid-footerContainer": {
              display: "none"
            },
            "& .MuiDataGrid-cell": {
              fontSize: "12.7px" // Adjust cell font size
            },
            "& .MuiDataGrid-columnHeader": {
              fontSize: "14px" // Adjust column header font size
            },
            "& .MuiDataGrid-footerCell": {
              fontSize: "12px" // Adjust footer font size
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
          <Pagination
            count={pageCount}
            showFirstButton
            showLastButton
            page={page}
            onChange={handlePagination}
          />
        </Grid>
      </div>
    </>
  );
};

export default AdminTable;
