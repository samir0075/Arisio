/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useDispatch, useSelector } from "react-redux";
import {
  getFullDescriptionOfStartUp,
  getSelectedStartUpsMandatesData,
} from "src/action/searchStartups";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { useRouter } from "next/router";
import { visuallyHidden } from "@mui/utils";
import { FormattedMessage, useIntl } from "react-intl";

const TableMainComponent = ({
  columns,
  data,
  open,
  setOpen,
  handelSubmit,
  page,
  setPage,
  setCheckedMandates,
  checkedMandates,
}) => {
  let searchStartUpsData = useSelector((state) => state?.searchStartUps);
  const router = useRouter();
  const intl = useIntl();
  const dispatch = useDispatch();
  const [selectedCardId, setSelectedCardId] = useState(0);
  const startsUPDataByFilters = useSelector((state) => state?.searchStartUps?.companiesByFilter);
  const [rowsPerPage, setRowsPerPage] = useState(startsUPDataByFilters === undefined ? 5 : 10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("companyName");
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const userId = userDetails?.id;
  const userRole = userDetails?.role;

  const handleChange = (event, mandateId) => {
    if (event?.target?.checked) {
      /** If checkbox is checked, add mandateId to checkedMandates */
      setCheckedMandates((prevState) => [...prevState, mandateId]);
    } else {
      /** If checkbox is unchecked, remove mandateId from checkedMandates */
      setCheckedMandates((prevState) => prevState.filter((id) => id !== mandateId));
    }
  };

  const handelInvitePitch = (startUpId) => {
    setOpen(true);
    setCheckedMandates([]);
    dispatch(getSelectedStartUpsMandatesData(startUpId, userId));
  };

  const OpenOverviewStartUp = (rowId) => {
    if (rowId) {
      router.push("./SearchStartups/overViewStartup");
      dispatch(getFullDescriptionOfStartUp(rowId, userId));
      localStorage.setItem("startUpId", JSON.stringify(rowId));
    }
  };

  const listOfMandates = useSelector(
    (state) => state?.searchStartUps?.listOfSelectedStartUpMandates?.mandates
  )?.filter((r) => r?.isExpired === 0);

  /**Function with loop to make the list into arrays of 8 mandates per row*/
  const defaultArray = (array, size) => {
    const newArray = [];
    for (let i = 0; i < array?.length; i += size) {
      newArray?.push(array?.slice(i, i + size));
    }
    return newArray;
  };

  /**  Chunk the list of mandates into arrays of 6 mandates per row */
  const rowsOfMandates = defaultArray(listOfMandates, 7);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /** Handling all keys of Pagination */
  const TablePaginationActions = (props) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
      setPage(0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
      setPage(page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
      setPage(page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
      setPage(Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  };

  const response = useSelector((state) => state?.searchStartUps?.emailData);

  useEffect(() => {
    if (response?.status === true) {
      setCheckedMandates([]);
    }
  }, [response]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const sortedData = data?.length
    ? [...data].sort((a, b) => {
        const nameA =
          a.companyName.toUpperCase(); /** Convert organization names to uppercase for case-insensitive comparison */
        const nameB = b.companyName.toUpperCase();
        if (order === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      })
    : null;

  return (
    <>
      {searchStartUpsData?.loading === true ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <TableContainer style={{ maxHeight: 500 }}>
          <Table
            sx={{
              minWidth: 1150,
              minHeight: 370,
              borderRadius: "5px",
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                {columns?.map((column, index) => (
                  <TableCell
                    key={column?.id}
                    style={{
                      borderRadius:
                        index === 0
                          ? "5px 0px 0px 5px"
                          : index === columns?.length - 1
                          ? "0px 5px 5px 0px"
                          : "0px 0px 0px 0px",
                      textTransform: "none",
                      fontSize: "17px",
                      fontWeight: 500,
                      letterSpacing: "0px",
                      padding: "12px",
                      color: "rgba(138, 21, 56, 1)",
                      background: "rgba(65, 148, 179,0.1) !important",
                      textAlign: "center",
                      width: "185px",
                      position: "sticky",
                      top: 0,
                      zIndex: 1, // Sticks the header to the top
                    }}
                  >
                    <TableSortLabel
                      active={column?.value === "companyName"}
                      direction={order}
                      hideSortIcon={column?.value !== "companyName"}
                      onClick={
                        column?.value === "companyName"
                          ? () => handleRequestSort("companyName")
                          : undefined
                      }
                      style={{
                        color: "rgba(138, 21, 56, 1)",
                        background: "rgba(65, 148, 179,0.1) !important",
                        cursor: column?.value === "companyName" ? "pointer" : "default",
                      }}
                    >
                      {column.name}
                      {orderBy === column?.value ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody
              style={{
                background: "rgba(65, 148, 179,0.1) !important",
                height: open === true && data?.length === 1 ? "355px" : "0px",
              }}
            >
              {sortedData?.length ? (
                (rowsPerPage > 0 && startsUPDataByFilters === undefined
                  ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : sortedData
                )?.map((row) => {
                  const { id, categoryList, companyLogo, ...rest } = row;
                  console.log(companyLogo);
                  return (
                    <>
                      <TableRow
                        key={row?.id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell colSpan={columns?.length} style={{ padding: "0px" }}>
                          <Card
                            style={{
                              borderRadius:
                                open === true ? "10px 10px 0px 0px" : "10px 10px 10px 10px",
                              marginTop: sortedData?.length === 1 ? "-35px" : "20px",
                            }}
                          >
                            {columns?.map((column) => (
                              <TableCell
                                key={column.id}
                                style={{
                                  width: "205px",
                                  borderBottom: "2px",
                                  borderBlockEnd: "0.5px solid #e1e1e1",
                                  cursor: "pointer",
                                }}
                                onClick={() => OpenOverviewStartUp(row?.id)}
                              >
                                <Grid style={{ display: "flex", alignItems: "baseline" }}>
                                  {column?.id === 1 && (
                                    <CardMedia
                                      component="img"
                                      height="auto"
                                      src={
                                        companyLogo !== null
                                          ? `data:image/png;base64,${companyLogo}`
                                          : `/Images/company_default.png`
                                      }
                                      alt="No image"
                                      style={{
                                        width: "30px",
                                        marginLeft: "5px",
                                        border: "0.5px solid #e1e1e1",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  )}
                                  <Typography
                                    gutterBottom
                                    component="div"
                                    style={{
                                      fontFamily: "Calibri",
                                      fontWeight: 700,
                                      fontSize: "18px",
                                      color: "#393939",
                                      marginLeft: "15px",
                                      cursor: "pointer",
                                    }}
                                    sx={{
                                      width: 110,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    <Tooltip
                                      title={row[column.value] !== null ? row[column.value] : "-"}
                                      arrow
                                      PopperProps={{
                                        disablePortal: true, // Ensures tooltip stays within its context
                                      }}
                                      sx={{
                                        zIndex: 0, // Set a lower z-index to prevent overlapping
                                      }}
                                    >
                                      {/* Always make sure the column value key should be equal to row keys */}
                                      {row[column.value] !== null ? row[column.value] : "-"}{" "}
                                    </Tooltip>
                                  </Typography>
                                </Grid>
                              </TableCell>
                            ))}
                            <Button
                              component="div"
                              key={row?.id}
                              style={{
                                width: "-webkit-fill-available",
                                borderRadius:
                                  open === true ? "0px 0px 0px 0px" : "0px 0px 10px 10px",
                                fontWeight: 600,
                                height: "35px",
                                fontSize: "17px",
                                backgroundColor:
                                  open === true && row?.id === selectedCardId && "#8a1538",
                                color: open === true && row?.id === selectedCardId && "#fff",
                              }}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#8a1538", // Change background color on hover
                                  color: "#fff", // Change text color on hover
                                },
                              }}
                              onClick={() => {
                                handelInvitePitch(row?.id), setSelectedCardId(row?.id);
                              }}
                            >
                              {userRole === "ADMINISTRATOR" ? (
                                <FormattedMessage
                                  id="tableMainComponent.card.button.text1"
                                  defaultMessage="Recommend For?"
                                />
                              ) : (
                                <FormattedMessage
                                  id="tableMainComponent.card.button.text2"
                                  defaultMessage="Invite to pitch"
                                />
                              )}
                              <ArrowDropDownIcon />
                            </Button>
                          </Card>
                          {open === true && selectedCardId === row?.id && (
                            <CardContent
                              style={{
                                backgroundColor: "#fff",
                                padding: "20px",
                                marginTop: "-13px",
                                borderRadius: "0px 0px 10px 10px",
                                height: "auto",
                                overflowX: "auto",
                              }}
                            >
                              {listOfMandates?.length === 0 ? (
                                <>
                                  <CardMedia
                                    component="img"
                                    height="auto"
                                    image="/Images/no-application-recieved.png"
                                    alt="green iguana"
                                    style={{ width: "75px", marginLeft: "35rem" }}
                                  />
                                  <Typography
                                    gutterBottom
                                    style={{
                                      fontFamily: "Calibri",
                                      fontWeight: 600,
                                      fontSize: "18px",
                                      color: "#b2acac",
                                      marginLeft:
                                        userDetails?.role === "INVESTOR" ? "25rem" : "31rem",
                                    }}
                                    component="div"
                                  >
                                    <FormattedMessage
                                      id="tableMainComponent.card.noData.text1"
                                      defaultMessage="No active mandate found"
                                    />{" "}
                                    {userDetails?.role === "INVESTOR" && (
                                      <Link href="/MandateCreation">
                                        <FormattedMessage
                                          id="tableMainComponent.card.noData.text2"
                                          defaultMessage=",please Create New Mandate"
                                        />
                                      </Link>
                                    )}
                                    .
                                  </Typography>
                                </>
                              ) : (
                                rowsOfMandates?.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    {row?.map((mandate, cellIndex) => (
                                      <TableCell key={cellIndex}>
                                        <FormControl component="fieldset">
                                          <FormGroup>
                                            <FormControlLabel
                                              value={mandate?.id}
                                              control={
                                                <Checkbox
                                                  checked={checkedMandates?.includes(mandate.id)}
                                                  onChange={(e) => handleChange(e, mandate.id)}
                                                  inputProps={{ "aria-label": "controlled" }}
                                                />
                                              }
                                              label={
                                                <Typography
                                                  style={{
                                                    fontFamily: "Arial", // Change font family
                                                    fontWeight: 600,
                                                    fontSize: "14px",
                                                    color: "#393939",
                                                  }}
                                                >
                                                  {mandate.title}
                                                </Typography>
                                              }
                                              labelPlacement="end"
                                            />
                                          </FormGroup>
                                        </FormControl>
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              )}
                              <CardActions style={{ justifyContent: "flex-end" }}>
                                <Button
                                  component="div"
                                  style={{
                                    color: "#ffffff",
                                    backgroundColor: "#808080",
                                    fontSize: "15px",
                                    fontFamily: "Calibri",
                                    fontWeight: "bold",
                                    width: "70px",
                                    verticalAlign: "middle",
                                    height: "39px",
                                    borderRadius: "25px",
                                    outline: "none !important",
                                    cursor: "pointer",
                                    float: "inline-end",
                                    textTransform: "uppercase",
                                  }}
                                  onClick={() => setOpen(false)}
                                >
                                  <FormattedMessage
                                    id="tableMainComponent.card2.invitePitch.close.button.text"
                                    defaultMessage="Close"
                                  />
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  style={{
                                    fontSize: "15px",
                                    fontFamily: "Calibri",
                                    fontWeight: "bold",
                                    width: "84px",
                                    verticalAlign: "middle",
                                    height: "39px",
                                    borderRadius: "25px",
                                    outline: "none !important",
                                    cursor: "pointer",
                                    textTransform: "uppercase",
                                    backgroundColor: open === true && "#8a1538",
                                    color: open === true && "#fff",
                                  }}
                                  onClick={() => handelSubmit(checkedMandates, selectedCardId)}
                                >
                                  <FormattedMessage
                                    id="tableMainComponent.card2.invitePitch.submit.button.text"
                                    defaultMessage="Submit"
                                  />
                                </Button>
                              </CardActions>
                            </CardContent>
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })
              ) : sortedData?.length === 0 && searchStartUpsData?.loading === false ? (
                <TableRow>
                  <TableCell colSpan={columns?.length} style={{ padding: "0px" }}>
                    <Card style={{ marginTop: "-79px", padding: 25 }}>
                      <CardMedia
                        component="img"
                        height="auto"
                        image="/Images/no-application-recieved.png"
                        alt="green iguana"
                        style={{ width: "87px", marginLeft: "32rem" }}
                      />
                      <CardContent style={{ padding: 0 }}>
                        <Typography
                          gutterBottom
                          style={{
                            fontFamily: "Calibri",
                            fontWeight: 600,
                            fontSize: "18px",
                            color: "#b2acac",
                            marginLeft: "27rem",
                          }}
                          component="div"
                        ></Typography>
                      </CardContent>
                    </Card>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
            {sortedData?.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={startsUPDataByFilters === undefined ? [5, 10, 25] : []}
                    colSpan={5}
                    count={
                      startsUPDataByFilters === undefined
                        ? sortedData.length
                        : startsUPDataByFilters?.count?.count
                    }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    slotProps={{
                      select: {
                        inputProps: {
                          Calibri: (
                            <FormattedMessage
                              id="tableMainComponent.table.pagination.rowsPerPage"
                              defaultMessage="Rows per page"
                            />
                          ),
                        },
                        native: true,
                      },
                    }}
                    labelDisplayedRows={({ from, to, count }) => {
                      return `${intl.formatMessage({
                        id: "tableMainComponent.table.pagination.labelDisplay",
                        defaultMessage: "Showing",
                      })} ${from}-${to} ${intl.formatMessage({
                        id: "tableMainComponent.table.pagination.labelDisplay2",
                        defaultMessage: "of",
                      })}  ${count} ${intl.formatMessage({
                        id: "tableMainComponent.table.pagination.labelDisplay3",
                        defaultMessage: "results",
                      })} `; /** Customizing the display of "6-11 of 11" */
                    }}
                    /** Customizing the Font of the Pagination */
                    sx={{
                      "& .MuiTablePagination-displayedRows": {
                        fontFamily: "Calibri",
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "#8a1538",
                      },
                      "& .MuiTablePagination-selectLabel": {
                        fontFamily: "Calibri",
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "#8a1538",
                      },
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      )}
    </>
  );
};
TableMainComponent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default TableMainComponent;
