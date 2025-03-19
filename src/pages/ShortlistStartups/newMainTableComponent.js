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
  Collapse,
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
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
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
import { formattedDate, getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import { useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import SkeletonTableNew from "src/components/SkeletonTable/SkeltonTableNew";
import { NoDataComponent } from "src/components/NotFound/notfound";

const NewTableMainComponent = ({
  columns,
  data,
  expanded,
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
  const [openCollapse, setOpenCollapse] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(0);
  const intl = useIntl();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("organizationName");
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const userId = userDetails?.id;
  const [messageDialog, setMessageDialog] = useState(false);
  const [startupProfile, setStartupProfile] = useState("");
  let shortListStartUps = useSelector((state) => state?.shortListStartUps);

  const lang = localStorage.getItem("lang");
  const rtl = lang === "ar";

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
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / 9) - 1));
    };

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
          disabled={(page + 1) * 9 >= count}
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

  console.log(data);
  const sortedData = data?.length
    ? [...data].sort((a, b) => {
        const nameA = a.startup?.organizationName?.toUpperCase(); // Convert organization names to uppercase for case-insensitive comparison
        const nameB = b.startup?.organizationName?.toUpperCase();
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

  const tableBodyCellStyles2 = {
    textAlign: "left",
    padding: "0px",
    borderBottom: "2px",
    borderBlockEnd: "0.5px solid #e1e1e1",
    cursor: "pointer",
  };

  const tableBodyCellStyles = {
    width: 110,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "10px",
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <>
      {shortListStartUps?.loading === true ? (
        <SkeletonTableNew columns={columns} />
      ) : data.length !== 0 ? (
        <>
          <TableContainer
            style={{
              height: "100%",
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
                        background: "rgba(65, 148, 179,0.1) !important",
                        textAlign: "left",
                        width: "200px",
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
                  <TableCell
                    key={-1}
                    style={{
                      textTransform: "none",
                      fontSize: "14px",
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
                    <FormattedMessage id="filterModal.heading.action" defaultMessage="Action" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                style={{
                  background: "rgba(65, 148, 179,0.1) !important",
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
                          sx={{
                            "&.MuiTableRow-root": { height: "8vh" },
                            // height: "46px",
                          }}
                        >
                          <TableCell
                            key={row.startup.organizationName}
                            style={tableBodyCellStyles2}
                          >
                            <Grid style={{ display: "flex", alignItems: "center" }}>
                              {row.startup.organizationName && (
                                <CardMedia
                                  component="img"
                                  height="auto"
                                  src={
                                    deStructuredRow?.logUrl !== undefined
                                      ? `data:image/PNG;base64,${deStructuredRow?.logUrl}`
                                      : "/Images/company_default.png"
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
                              <Typography sx={tableBodyCellStyles}>
                                <Tooltip
                                  title={row !== null ? row.startup.organizationName : "-"}
                                  arrow
                                  PopperProps={{
                                    disablePortal: true, // Ensures tooltip stays within its context
                                  }}
                                  sx={{
                                    zIndex: 0, // Set a lower z-index to prevent overlapping
                                  }}
                                >
                                  {/* Always make sure the column value key should be equal to row keys */}
                                  {row.startup.organizationName !== null
                                    ? row.startup.organizationName
                                    : "-"}{" "}
                                </Tooltip>
                              </Typography>
                            </Grid>
                          </TableCell>
                          <TableCell style={tableBodyCellStyles2}>
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={row.eventName !== null ? row.eventName : "-"}
                                arrow
                                PopperProps={{
                                  disablePortal: true, // Ensures tooltip stays within its context
                                }}
                                sx={{
                                  zIndex: 0, // Set a lower z-index to prevent overlapping
                                }}
                              >
                                {/* Always make sure the column value key should be equal to row keys */}
                                {row.eventName !== null ? row.eventName : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell style={tableBodyCellStyles2}>
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={row.startup.country !== null ? row.startup.country : "-"}
                                arrow
                                PopperProps={{
                                  disablePortal: true, // Ensures tooltip stays within its context
                                }}
                                sx={{
                                  zIndex: 0, // Set a lower z-index to prevent overlapping
                                }}
                              >
                                {/* Always make sure the column value key should be equal to row keys */}
                                {row.startup.country !== null ? row.startup.country : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell style={tableBodyCellStyles2}>
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={row.startup.city !== null ? row.startup.city : "-"}
                                arrow
                                PopperProps={{
                                  disablePortal: true, // Ensures tooltip stays within its context
                                }}
                                sx={{
                                  zIndex: 0, // Set a lower z-index to prevent overlapping
                                }}
                              >
                                {/* Always make sure the column value key should be equal to row keys */}
                                {row.startup.city ? row.startup.city : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell style={tableBodyCellStyles2}>
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={
                                  row.startup.employeeCount !== null
                                    ? row.startup.employeeCount
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
                                {row.startup.employeeCount ? row.startup.employeeCount : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell style={tableBodyCellStyles2}>
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={
                                  row.startup.pastFunding !== null
                                    ? formattedDate(row.startup.pastFunding)
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
                                {row.startup.pastFunding
                                  ? formattedDate(row.startup.pastFunding)
                                  : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell style={tableBodyCellStyles2}>
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={row.startup.domain !== null ? row.startup.domain : "-"}
                                arrow
                                PopperProps={{
                                  disablePortal: true, // Ensures tooltip stays within its context
                                }}
                                sx={{
                                  zIndex: 0, // Set a lower z-index to prevent overlapping
                                }}
                              >
                                {/* Always make sure the column value key should be equal to row keys */}
                                {row.startup.domain ? row.startup.domain : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell style={tableBodyCellStyles2}>
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={
                                  row.startup.technologyName !== null
                                    ? row.startup.technologyName
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
                                {row.startup.technologyName ? row.startup.technologyName : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell style={tableBodyCellStyles2}>
                            <Typography sx={tableBodyCellStyles}>
                              <Tooltip
                                title={
                                  row.startup.startupStageName !== null
                                    ? row.startup.startupStageName
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
                                {row?.startup?.startupStageName
                                  ? row?.startup?.startupStageName
                                  : "-"}{" "}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell key={row?.id} style={tableBodyCellStyles2}>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                              <Typography
                                sx={{
                                  width: "30px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  marginRight: "7px",
                                }}
                              >
                                <Tooltip
                                  title={
                                    <FormattedMessage
                                      id="tableMainComponent.card.button.text2"
                                      defaultMessage="Invite to pitch"
                                    />
                                  }
                                  arrow
                                  placement="top"
                                >
                                  <IconButton
                                    disabled={
                                      !isPermitted(
                                        permissions.INVESTOR_SHORTLIST_STARTUP_INVITETOPITCH
                                      )
                                    }
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => {
                                      setOpenCollapse(!openCollapse);
                                      handelInvitePitch(row?.id);
                                      setSelectedCardId(row?.id);
                                    }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                              <Typography
                                sx={{
                                  width: "30px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  marginRight: "7px",
                                }}
                              >
                                <Tooltip
                                  title={
                                    <FormattedMessage
                                      id="newTableMainComponentShortList.table.button2.text"
                                      defaultMessage="Message"
                                    />
                                  }
                                  arrow
                                  placement="top"
                                >
                                  <IconButton
                                    disabled={
                                      !isPermitted(permissions.INVESTOR_SHORTLIST_STARTUP_MESSAGE)
                                    }
                                    size="small"
                                    onClick={() => {
                                      handleMessaging(row);
                                    }}
                                  >
                                    <EmailIcon />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                              <Typography
                                sx={{
                                  width: "30px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  marginRight: "7px",
                                }}
                              >
                                <Tooltip
                                  title={
                                    <FormattedMessage
                                      id="newTableMainComponentShortList.table.button3.text"
                                      defaultMessage="Schedule Meeting"
                                    />
                                  }
                                  arrow
                                  placement="top"
                                >
                                  <IconButton
                                    disabled={
                                      !isPermitted(
                                        permissions.INVESTOR_SHORTLIST_STARTUP_SCHEDULE_MEETING
                                      )
                                    }
                                    size="small"
                                    onClick={() => {
                                      handelScheduleMeeting(row);
                                    }}
                                  >
                                    <EventIcon />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        {open === true && selectedCardId === row?.id && (
                          <TableRow>
                            <TableCell style={{ padding: "0px 0px 0px 0px" }} colSpan={9}>
                              <Collapse
                                in={openCollapse === true && selectedCardId === row?.id}
                                timeout="auto"
                                unmountOnExit
                                style={{ width: "108%" }}
                              >
                                <CardContent
                                  style={{
                                    backgroundColor: "#fff",
                                    overflowX: "auto",
                                    // paddingBottom: "2px",
                                    padding: "0px",
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
                                          id="newTableMainComponentShortList.table.noActiveData.text1"
                                          defaultMessage="No active mandate found, please"
                                        />{" "}
                                        <Link href="/MandateCreation">
                                          <FormattedMessage
                                            id="newTableMainComponentShortList.table.noActiveData.text2"
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
                                  <CardActions
                                    style={{
                                      justifyContent: "flex-end",
                                      padding: "0px",
                                      gap: "10px",
                                    }}
                                  >
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
                                        id="newTableMainComponentShortList.table.button.text2"
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
                                        id="newTableMainComponentShortList.table.button.text3"
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
                              id="newTableMainComponentShortList.table.noMatch.text3"
                              defaultMessage="There are no matching startups."
                            />
                          </Typography>
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
              {/* {data?.length > 0 && (
              // <TableFooter
              //   style={{
              //     position: "fixed",
              //     bottom: "0",
              //     left: expanded === true ? "60%" : "50%",
              //     // marginBottom: "5px",
              //   }}
              // >

            
              // </TableFooter>
            )} */}
            </Table>
          </TableContainer>
          <TablePagination
            colSpan={6}
            count={count}
            rowsPerPageOptions={[]}
            rowsPerPage={9}
            page={page}
            labelDisplayedRows={({ from, to }) => {
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
        </>
      ) : (
        <NoDataComponent />
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
NewTableMainComponent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default NewTableMainComponent;
