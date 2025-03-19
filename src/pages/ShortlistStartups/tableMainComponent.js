/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
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
import { getSelectedStartUpsMandatesData } from "src/action/searchStartups";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { visuallyHidden } from "@mui/utils";
import { FormattedMessage, useIntl } from "react-intl";
import MessageModal from "src/components/MessageModal";

const TableMainComponent = ({
  columns,
  data,
  count,
  open,
  setOpen,
  handelSubmit,
  page,
  setPage,
  setCheckedMandates,
  handelScheduleMeeting,
  checkedMandates,
}) => {
  let searchStartUpsData = useSelector((state) => state?.searchStartUps);
  const [selectedCardId, setSelectedCardId] = useState(0);
  const intl = useIntl();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("organizationName");
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const userId = userDetails?.id;
  const [messageDialog, setMessageDialog] = useState(false);
  const [startupProfile, setStartupProfile] = useState("");

  const dispatch = useDispatch();

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /** Handling all keys of Pagination */
  const TablePaginationActions = (props) => {
    const theme = useTheme();
    const { count, page, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page === 1 ? page : page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / 8) - 1));
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
          disabled={page >= Math.ceil(count / 8) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / 8) - 1}
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
        const nameA = a.startup.organizationName.toUpperCase(); // Convert organization names to uppercase for case-insensitive comparison
        const nameB = b.startup.organizationName.toUpperCase();
        if (order === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      })
    : null;

  const handleMessaging = (data) => {
    setStartupProfile(data);
    setMessageDialog(true);
  };

  const width = window.innerWidth;

  console.log(width);

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
        <TableContainer style={{ maxHeight: 515 }}>
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
                      zIndex: 1,
                    }}
                  >
                    <TableSortLabel
                      active={column?.value === "organizationName"}
                      direction={order}
                      hideSortIcon={column?.value !== "organizationName"}
                      onClick={
                        column?.value === "organizationName"
                          ? () => handleRequestSort("organizationName")
                          : undefined
                      }
                      style={{
                        color: "rgba(138, 21, 56, 1)",
                        background: "rgba(65, 148, 179,0.1) !important",
                        cursor: column?.value === "organizationName" ? "pointer" : "default",
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
                height: data?.length === 1 ? "390px" : "0px",
              }}
            >
              {sortedData?.length ? (
                (8 === sortedData?.length
                  ? sortedData.slice(page * 8, page * 8 + 8)
                  : sortedData
                )?.map((row) => {
                  const { id, startup, ...rest } = row;
                  const deStructuredRow = { ...startup, ...rest };
                  return (
                    <>
                      <TableRow
                        key={deStructuredRow?.id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell colSpan={columns?.length} style={{ padding: "0px" }}>
                          <Card
                            style={{
                              borderRadius:
                                open === true ? "10px 10px 0px 0px" : "10px 10px 10px 10px",
                              marginTop:
                                data?.length === 1
                                  ? open === true
                                    ? "-90px"
                                    : width > 1524
                                    ? "-165px"
                                    : "-99px"
                                  : "11px",
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
                              >
                                <Grid style={{ display: "flex", alignItems: "baseline" }}>
                                  {column?.id === 1 && (
                                    <CardMedia
                                      component="img"
                                      height="auto"
                                      src={
                                        deStructuredRow?.logUrl !== undefined
                                          ? `data:image/PNG;base64,${deStructuredRow?.logUrl}`
                                          : "/Images/company_default.png"
                                      }
                                      alt="green iguana"
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
                                      title={
                                        deStructuredRow[column.value] !== null
                                          ? deStructuredRow[column.value]
                                          : "-"
                                      }
                                      arrow
                                    >
                                      {/* Always make sure the column value key should be equal to row keys */}
                                      {deStructuredRow[column.value] !== null
                                        ? deStructuredRow[column.value]
                                        : "-"}{" "}
                                    </Tooltip>
                                  </Typography>
                                </Grid>
                              </TableCell>
                            ))}
                            <Button
                              component="div"
                              key={row?.id}
                              style={{
                                width: "33%",
                                borderRadius:
                                  open === true ? "0px 0px 0px 0px" : "0px 0px 0px 10px",
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
                              <FormattedMessage
                                id="tableMainComponentShortList.table.button.text"
                                defaultMessage="Invite to pitch"
                              />
                              <ArrowDropDownIcon />
                            </Button>
                            <Button
                              component="div"
                              key={row?.id}
                              style={{
                                width: "33%",
                                borderRadius: "0px 0px 0px 0px",
                                fontWeight: 600,
                                height: "35px",
                                fontSize: "17px",
                              }}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#8a1538", // Change background color on hover
                                  color: "#fff", // Change text color on hover
                                },
                              }}
                              onClick={() => {
                                handleMessaging(row);
                              }}
                            >
                              <FormattedMessage
                                id="tableMainComponentShortList.table.button2.text"
                                defaultMessage="Message"
                              />
                            </Button>
                            <Button
                              component="div"
                              key={row?.id}
                              style={{
                                width: "34%",
                                borderRadius: "0px 0px 10px 0px",
                                fontWeight: 600,
                                height: "35px",
                                fontSize: "17px",
                              }}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#8a1538", // Change background color on hover
                                  color: "#fff", // Change text color on hover
                                },
                              }}
                              onClick={() => {
                                handelScheduleMeeting(row);
                              }}
                            >
                              <FormattedMessage
                                id="tableMainComponentShortList.table.button3.text"
                                defaultMessage="Schedule Meeting"
                              />
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
                                      marginLeft: "25rem",
                                    }}
                                    component="div"
                                  >
                                    <FormattedMessage
                                      id="tableMainComponentShortList.table.noActiveData.text1"
                                      defaultMessage="No active mandate found, please"
                                    />{" "}
                                    <Link href="/MandateCreation">
                                      <FormattedMessage
                                        id="tableMainComponentShortList.table.noActiveData.text2"
                                        defaultMessage="Create New Mandate"
                                      />
                                    </Link>
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
                                                    fontFamily: "Arial",
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
                                    id="tableMainComponentShortList.table.button.text2"
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
                                    id="tableMainComponentShortList.table.button.text3"
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
              ) : data?.length === 0 && searchStartUpsData?.loading === false ? (
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
                        >
                          <FormattedMessage
                            id="tableMainComponentShortList.table.noMatch.text3"
                            defaultMessage="There are no matching startups."
                          />
                        </Typography>
                      </CardContent>
                    </Card>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
            {data?.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    count={count}
                    rowsPerPageOptions={[]}
                    rowsPerPage={8}
                    page={page}
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
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      )}
      {messageDialog && (
        <MessageModal
          messageDialog={messageDialog}
          setMessageDialog={setMessageDialog}
          startupProfile={startupProfile}
          shortListStartUpMessage={true}
        />
      )}
    </>
  );
};
TableMainComponent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default TableMainComponent;
