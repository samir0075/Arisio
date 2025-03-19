/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Card,
  Collapse,
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
  Backdrop,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getFullDescriptionOfStartUp,
  getSelectedStartUpsMandatesData,
} from "src/action/searchStartups";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { useRouter } from "next/router";
import { visuallyHidden } from "@mui/utils";
import { display, fontSize, styled } from "@mui/system";
import { FormattedMessage, useIntl } from "react-intl";
import { useMediaQuery } from "@mui/material";
import millify from "millify";
import dayjs from "dayjs";
import { formattedDate } from "src/utils/util";

const NewTableMainComponent = ({
  columns,
  data,
  open,
  setOpen,
  expanded,
  handelSubmit,
  page,
  setPage,
  setCheckedMandates,
  checkedMandates,
  setBackdropLoading,
}) => {
  let searchStartUpsData = useSelector((state) => state?.searchStartUps);
  const router = useRouter();
  const intl = useIntl();
  const dispatch = useDispatch();
  const [openCollapse, setOpenCollapse] = useState(false);
  const startsUPDataByFilters = useSelector((state) => state?.searchStartUps?.companiesByFilter);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("companyName");
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [backDropLoader, setBackDropLoader] = useState(false);
  const userId = userDetails?.id;
  const userRole = userDetails?.role;

  const lang = localStorage.getItem("lang");
  const rtl = lang === "ar";

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

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
      setBackdropLoading(true);
      dispatch(getFullDescriptionOfStartUp(rowId, userId)).then((res) => {
        if (res !== undefined) {
          setBackdropLoading(false);
          router.push("/SearchStartups/overViewStartup");
          localStorage.setItem("startUpId", JSON.stringify(rowId));
          setBackDropLoader(false);
        }
      });
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

  /** Handling all keys of Pagination */
  const TablePaginationActions = (props) => {
    const theme = useTheme();
    const { count, page, onPageChange } = props;

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
      onPageChange(event, Math.max(0, Math.ceil(count / 9) - 1));
      setPage(Math.max(0, Math.ceil(count / 9) - 1));
    };

    // console.log(data);

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {rtl ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {rtl ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / 9) - 1}
          aria-label="next page"
        >
          {rtl ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / 9) - 1}
          aria-label="last page"
        >
          {rtl ? <FirstPageIcon /> : <LastPageIcon />}
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

  const tableBodyCellStyles = {
    // width: 130,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "6px",
  };

  const tableBodyCellStyles2 = {
    textAlign: "left",
    padding: "0px",
    borderBottom: "2px",
    borderBlockEnd: "0.5px solid #e1e1e1",
    cursor: "pointer",
  };

  return (
    <>
      {searchStartUpsData?.loading === true ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <>
          <TableContainer
            style={{
              height: "64vh",
              // overflow: "hidden",
              width: "100%",
            }}
          >
            <Table
              sx={{
                minWidth: 1150,
                borderRadius: "5px",
              }}
              aria-label="simple table"
            >
              <TableHead
                style={{
                  height: "46px",
                  justifyContent: "center",
                  marginRight: "10px",
                  marginLeft: "-10px",
                }}
              >
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
                        fontSize: "15px",
                        fontWeight: 500,
                        letterSpacing: "0px",
                        padding: index !== 0 ? "10px 6px" : "10px 6px 10px 10px",
                        color: "rgba(138, 21, 56, 1)",
                        // background: "rgba(65, 148, 179,0.1) !important",

                        textAlign: "left",
                        width: "200px",
                        position: "sticky",
                        top: 0, // Stick all headers to the top
                        left: index === 0 ? 0 : "auto", // Stick the "company name" header to the left
                        zIndex: index === 0 ? 3 : 1,
                        background: "rgba(65, 148, 179,0.1) !important", // Set background color for stickiness
                        borderRight: "1px solid #d3cacd",
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
                  {/* <TableCell
                  key={-1}
                  style={{
                    textTransform: "none",
                    fontSize: "15px",
                    fontWeight: 500,
                    letterSpacing: "0px",
                    padding: "10px 6px",
                    color: "rgba(138, 21, 56, 1)",
                    background: "rgba(65, 148, 179,0.1) !important",
                    textAlign: "left",
                    width: "80px",
                    position: "sticky",
                    top: 0,
                    zIndex: 1, // Sticks the header to the top
                  }}
                >
                  Action
                </TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody
                style={{
                  background: "rgba(65, 148, 179,0.1) !important",
                }}
              >
                {sortedData?.length ? (
                  (startsUPDataByFilters === undefined ||
                  Object.keys(startsUPDataByFilters).length === 0
                    ? sortedData.slice(page * 9, page * 9 + 9)
                    : sortedData
                  )?.map((row, index) => {
                    const { id, categoryList, companyLogo, ...rest } = row;
                    return (
                      <>
                        <TableRow
                          key={row?.id}
                          sx={{
                            "&.MuiTableRow-root": { height: "8vh" },
                            "&:hover": {
                              border: "1px solid #d3cacd", // Add border on hover
                              boxShadow: "0px 4px 8px rgba(2, 2, 2, 0.1)", // Optional: add shadow for a more pronounced effect
                            },
                            // background: index % 2 === 0 ? "#f5f5f5" : "white",

                            // height: "46px",
                          }}
                        >
                          <TableCell
                            key={row?.companyName}
                            style={{
                              ...tableBodyCellStyles2,
                              position: "sticky", // Make the cell sticky
                              left: 0, // Stick to the left of the table
                              zIndex: 2, // Ensure it stays on top of other elements
                              background: "#fff",
                              borderRight: "1px solid #d3cacd",
                            }}
                            onClick={() => OpenOverviewStartUp(row?.id)}
                          >
                            <Grid style={{ display: "flex", alignItems: "center" }}>
                              {row.companyName && (
                                <CardMedia
                                  component="img"
                                  height="auto"
                                  src={
                                    companyLogo !== null && companyLogo !== undefined
                                      ? `data:image/png;base64,${companyLogo}`
                                      : `/Images/company_default.png`
                                  }
                                  alt="No image"
                                  style={{
                                    width: "30px",
                                    marginLeft: "5px",
                                    marginRight: "10px",
                                    border: "0.5px solid #e1e1e1",
                                    borderRadius: "50%",
                                  }}
                                />
                              )}
                              <Typography
                                sx={{
                                  ...tableBodyCellStyles,
                                  color: "#8A1538",
                                  width: "110px",
                                }}
                              >
                                <Tooltip
                                  placement="right"
                                  title={row !== null ? row?.companyName : "-"}
                                  arrow
                                  PopperProps={{
                                    disablePortal: true, // Ensures tooltip stays within its context
                                  }}
                                  sx={{
                                    zIndex: 0, // Set a lower z-index to prevent overlapping
                                  }}
                                >
                                  {/* Always make sure the column value key should be equal to row keys */}
                                  {row?.companyName !== null ? row?.companyName : "-"}{" "}
                                </Tooltip>
                              </Typography>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={tableBodyCellStyles2}
                            onClick={() => OpenOverviewStartUp(row?.id)}
                          >
                            <Typography sx={{ ...tableBodyCellStyles, width: "180px" }}>
                              <Tooltip
                                title={row?.description !== null ? row?.description : "-"}
                                arrow
                                PopperProps={{
                                  disablePortal: true,
                                }}
                                sx={{
                                  zIndex: 0,
                                }}
                              >
                                {row?.description !== null ? row?.description : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={tableBodyCellStyles2}
                            onClick={() => OpenOverviewStartUp(row?.id)}
                          >
                            <Typography sx={{ ...tableBodyCellStyles, width: "120px" }}>
                              <Tooltip
                                title={row?.categoryList !== null ? row?.categoryList : "-"}
                                arrow
                                PopperProps={{
                                  disablePortal: true, // Ensures tooltip stays within its context
                                }}
                                sx={{
                                  zIndex: 0, // Set a lower z-index to prevent overlapping
                                }}
                              >
                                {/* Always make sure the column value key should be equal to row keys */}
                                {row.categoryList ? row?.categoryList : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          {/* <TableCell
                          style={tableBodyCellStyles2}
                          onClick={() => OpenOverviewStartUp(row?.id)}
                        >
                          <Typography sx={tableBodyCellStyles}>
                            <Tooltip
                              title={row?.foundedOn !== null ? row?.foundedOn : "-"}
                              arrow
                              PopperProps={{
                                disablePortal: true, // Ensures tooltip stays within its context
                              }}
                              sx={{
                                zIndex: 0, // Set a lower z-index to prevent overlapping
                              }}
                            >
                              {row?.last_funding_on ? row?.last_funding_on : "-"}{" "}
                            </Tooltip>
                          </Typography>
                        </TableCell> */}
                          <TableCell
                            style={tableBodyCellStyles2}
                            onClick={() => OpenOverviewStartUp(row?.id)}
                          >
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={
                                  row?.foundedOn !== null ? formattedDate(row?.foundedOn) : "-"
                                }
                                arrow
                                PopperProps={{
                                  disablePortal: true, // Ensures tooltip stays within its context
                                }}
                                sx={{
                                  zIndex: 0, // Set a lower z-index to prevent overlapping
                                }}
                              >
                                {/* Always make sure the column value key should be equal to row keys */}
                                {row?.foundedOn ? formattedDate(row?.foundedOn) : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={tableBodyCellStyles2}
                            onClick={() => OpenOverviewStartUp(row?.id)}
                          >
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={
                                  row?.totalFundingRounds !== null ? row?.totalFundingRounds : "-"
                                }
                                arrow
                                PopperProps={{
                                  disablePortal: true, // Ensures tooltip stays within its context
                                }}
                                sx={{
                                  zIndex: 0, // Set a lower z-index to prevent overlapping
                                }}
                              >
                                {/* Always make sure the column value key should be equal to row keys */}
                                {row?.totalFundingRounds
                                  ? row?.totalFundingRounds
                                  : row?.totalFundingRounds == null && row?.totalFundingUsd > 0
                                  ? "1"
                                  : "-"}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={tableBodyCellStyles2}
                            onClick={() => OpenOverviewStartUp(row?.id)}
                          >
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={
                                  row?.totalFundingUsd !== null
                                    ? millify(row?.totalFundingUsd)
                                    : "-"
                                }
                                arrow
                                PopperProps={{
                                  disablePortal: true, // Ensures tooltip stays within its context
                                }}
                                sx={{
                                  zIndex: 0, // Set a lower z-index to prevent overlapping
                                }}
                              >
                                {/* Always make sure the column value key should be equal to row keys */}
                                {row.totalFundingUsd ? millify(row?.totalFundingUsd) : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          {/* <TableCell
                          style={tableBodyCellStyles2}
                          onClick={() => OpenOverviewStartUp(row?.id)}
                        >
                          <Typography sx={tableBodyCellStyles}>
                            <Tooltip
                              title={row?.funding_total_usd !== null ? row?.funding_total_usd : "-"}
                              arrow
                              PopperProps={{
                                disablePortal: true, // Ensures tooltip stays within its context
                              }}
                              sx={{
                                zIndex: 0, // Set a lower z-index to prevent overlapping
                              }}
                            >
                              {/* Always make sure the column value key should be equal to row keys */}
                          {/* {row?.funding_total_usd ? row?.funding_total_usd : "-"}{" "}
                            </Tooltip>
                          </Typography>
                        </TableCell>  */}
                          {/* <TableCell key={row?.id} style={tableBodyCellStyles2}>
                          <Typography sx={tableBodyCellStyles}>
                            <Button
                              style={{
                                margin: "10px 0px",
                                padding: "4px 10px",
                                background: "rgba(138, 21, 56, 0.15)",
                                fontSize: "0.7rem",
                                borderRadius: "3px",
                              }}
                              aria-label="expand row"
                              size="small"
                              onClick={() => {
                                setOpenCollapse(!openCollapse);
                                handelInvitePitch(row?.id);
                                setSelectedCardId(row?.id);
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
                            </Button>
                          </Typography>
                        </TableCell> */}
                          <TableCell
                            style={tableBodyCellStyles2}
                            onClick={() => OpenOverviewStartUp(row?.id)}
                          >
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={row?.countryName !== null ? row?.countryName : "-"}
                                arrow
                                PopperProps={{
                                  disablePortal: true,
                                }}
                                sx={{
                                  zIndex: 0,
                                }}
                              >
                                {row?.countryName !== null ? row?.countryName : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={tableBodyCellStyles2}
                            onClick={() => OpenOverviewStartUp(row?.id)}
                          >
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={row?.countryName !== null ? row?.countryName : "-"}
                                arrow
                                PopperProps={{
                                  disablePortal: true,
                                }}
                                sx={{
                                  zIndex: 0,
                                }}
                              >
                                {/* {row.countryName !== null ? row.countryName : "-"}{" "} */}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {openCollapse === true && selectedCardId === row?.id && (
                          <TableRow>
                            <TableCell style={{ padding: "0px 0px 0px 0px" }} colSpan={9}>
                              <Collapse
                                in={openCollapse === true && selectedCardId === row?.id}
                                timeout="auto"
                                unmountOnExit
                              >
                                <CardContent
                                  style={{
                                    backgroundColor: "#fff",
                                    overflowX: "auto",
                                    paddingBottom: "2px",
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
                                                      checked={checkedMandates?.includes(
                                                        mandate.id
                                                      )}
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
                                        width: "35px",
                                        verticalAlign: "middle",
                                        height: "25px",
                                        borderRadius: "25px",
                                        outline: "none !important",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => setOpenCollapse(false)}
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
                                        width: "35px",
                                        verticalAlign: "middle",
                                        height: "25px",
                                        borderRadius: "25px",
                                        outline: "none !important",
                                        cursor: "pointer",
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
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
                ) : sortedData === null && searchStartUpsData?.loading === false ? (
                  <TableRow>
                    <TableCell colSpan={columns?.length} sx={{ padding: "0px" }}>
                      <Box
                        sx={{
                          // marginTop: "-79px",
                          py: 10,
                          px: 10,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: { sm: "left", md: "center" },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="auto"
                          image="/Images/no-application-recieved.png"
                          alt="green iguana"
                          style={{ width: "60px" }}
                        />
                        <CardContent style={{ padding: 0 }}>
                          <Typography
                            gutterBottom
                            style={{
                              fontFamily: "Calibri",
                              fontWeight: 600,
                              fontSize: "16px",
                              color: "#b2acac",
                              // marginLeft: "27rem"
                            }}
                            component="div"
                          >
                            No Data found !
                          </Typography>
                        </CardContent>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
          {sortedData?.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={5}
              count={
                sortedData?.length === 1 && startsUPDataByFilters !== undefined
                  ? sortedData?.length
                  : startsUPDataByFilters === undefined ||
                    Object.keys(startsUPDataByFilters).length === 0
                  ? sortedData.length
                  : startsUPDataByFilters?.count?.count
              }
              rowsPerPage={9}
              page={page}
              labelDisplayedRows={({ from, to, count }) => {
                if (isMobile) {
                  return `${from}-${to}`; // Only show the range on mobile
                }
                return `${intl.formatMessage({
                  id: "newTableMainComponent.table.pagination.labelDisplay",
                  defaultMessage: "Showing",
                })} ${from}-${to} ${intl.formatMessage({
                  id: "newTableMainComponent.table.pagination.labelDisplay2",
                  defaultMessage: "of",
                })}  ${count} ${intl.formatMessage({
                  id: "newTableMainComponent.table.pagination.labelDisplay3",
                  defaultMessage: "results",
                })} `; /** Customizing the display of "6-11 of 11" */
              }}
              /** Customizing the Font of the Pagination */
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // overflow: "hidden",

                // left:
                //   expanded === true
                //     ? { xs: "", sm: "50%", md: "60%", lg: "60%" }
                //     : { xs: "", sm: "10%", md: "50%", lg: "50%" },
                // marginBottom: "0px",

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
          )}
        </>
      )}
      <Backdrop
        sx={(theme) => ({
          color: "rgba(138, 21, 56, 1)", // Set the color of the loader
          zIndex: theme.zIndex.drawer + 1,
          display: "flex", // Ensure the content inside Backdrop is flex
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
        })}
        open={backDropLoader}
      >
        <CircularProgress sx={{ color: "rgba(138, 21, 56, 1)" }} /> {/* Loader color */}
      </Backdrop>
    </>
  );
};
NewTableMainComponent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default NewTableMainComponent;
