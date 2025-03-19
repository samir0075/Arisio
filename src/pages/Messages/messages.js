import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Fab,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, getStartupChat, postChat } from "src/action/messages";
import styles from "./messages.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { FormattedMessage, useIntl } from "react-intl";
import NoDataMsg from "src/components/NoDataMsg";
import MessageIcon from "@mui/icons-material/Message";
import SendIcon from "@mui/icons-material/Send";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";

const Messages = () => {
  const dispatch = useDispatch();
  const [chat, setChat] = useState("");
  const intl = useIntl();
  const [startupID, setStartupID] = useState("");
  const [investorID, setInvestorID] = useState("");
  const [hiddenChat, setHiddenChat] = useState(true);
  const [messageSearch, setMessageSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [messageToggle, setMessageToggle] = useState(false);

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;

  const role = userDetails?.role;
  const userId = userDetails?.id;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(messageSearch);
    }, 500); // Delay in milliseconds

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or query change
    };
  }, [messageSearch]);

  useEffect(() => {
    dispatch(getMessages(userId, role, debouncedQuery));
  }, [debouncedQuery, dispatch, role, userId]);

  const messageList = useSelector((state) => state.messages.messagesList);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  }

  function formatDateAndTime(dateString) {
    const date = new Date(dateString);

    // Get month abbreviation
    const monthAbbrev = date.toLocaleString("default", { month: "short" });

    // Get day of the month
    const day = date.getDate();

    // Get hours (in 12-hour format)
    let hours = date.getHours();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    // Get minutes
    const minutes = date.getMinutes();

    // Form the formatted date string
    const formattedDate = `${monthAbbrev} ${day},${hours}:${
      (minutes < 10 ? "0" : "") + minutes
    } ${amPm}`;

    return formattedDate;
  }

  const handleStartupChat = (messages) => {
    console.log(messages);
    setMessageToggle(false);
    if (role === "ENTREPRENEUR") {
      setStartupID(userId);
      setInvestorID(messages?.inv_userid);
      dispatch(getStartupChat(messages?.inv_userid, userId, role)).then((res) =>
        res ? setHiddenChat(false) : setHiddenChat(true)
      );
    } else {
      setStartupID(messages?.startup_userid);
      setInvestorID(userId);
      dispatch(getStartupChat(userDetails?.id, messages?.startup_userid, role)).then((res) =>
        res ? setHiddenChat(false) : setHiddenChat(true)
      );
    }
  };

  const messagesStore = useSelector((state) => state.messages);
  const startupFullChat = useSelector((state) => state.messages.fullChat);
  const startupUserName =
    role === "ENTREPRENEUR"
      ? startupFullChat?.investor_list?.map((startup) => startup.inv_user_name)
      : `- ${startupFullChat?.startup_list?.map((startup) => startup.startup_user_name)}`;

  const startupOrgName =
    role === "ENTREPRENEUR"
      ? ""
      : startupFullChat?.startup_list?.map((startup) => startup.startup_org_name);

  const handleChatSubmit = () => {
    role === "ENTREPRENEUR"
      ? dispatch(postChat(investorID, startupID, chat, role))
      : dispatch(postChat(investorID, startupID, chat));
    setChat("");
  };

  return (
    <>
      <ExternalContainer>
        <Grid sx={{ display: "flex", justifyContent: "space-between", padding: "5px" }}>
          <Typography className={styles.header}>
            {" "}
            <FormattedMessage id="Messages.card.heading" defaultMessage="Messaging" />
          </Typography>

          {/* <TextField
            size="small"
            id="outlined-basic"
            variant="outlined"
            sx={{ width: "40%", backgroundColor: "#FFFFFF", borderRadius: "8px" }}
            onChange={e => {
              setMessageSearch(e.target.value);
            }}
            placeholder={intl.formatMessage({
              id: "Messages.card.heading.placeholder",
              defaultMessage: "Find Messages"
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          /> */}
        </Grid>
        {/* {messagesStore?.loading === true ? (
          <Box className={styles.spinner}>
            <CircularProgress color="secondary" />
          </Box>
        ) : messageList?.investor_list?.length > 0 || messageList?.startup_list?.length > 0 ? ( */}
        <Grid sx={{ background: "#FFFFFF", p: 2, borderRadius: "10px" }}>
          <Grid container gap={1}>
            <Grid item xs={12} sm={12} md={4} xl={4}>
              <Grid>
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-basic"
                  variant="outlined"
                  sx={{ borderRadius: "8px" }}
                  onChange={(e) => {
                    setMessageSearch(e.target.value);
                  }}
                  placeholder={intl.formatMessage({
                    id: "Messages.card.heading.placeholder",
                    defaultMessage: "Find organization name",
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid sx={{ my: 2 }}>
                {messagesStore?.loading === true ? (
                  <Box className={styles.spinner}>
                    <CircularProgress color="secondary" />
                  </Box>
                ) : messageList?.investor_list?.length > 0 ||
                  messageList?.startup_list?.length > 0 ? (
                  <>
                    {role !== "ENTREPRENEUR" ? (
                      <Grid
                        sx={{
                          height: "60vh",
                          overflowY: "auto",
                        }}
                      >
                        {messageList?.startup_list?.map((messages, index) => (
                          <Grid
                            onClick={() => {
                              handleStartupChat(messages);
                            }}
                            key={index}
                            className={styles.messagesOuter}
                            sx={{ my: 2, mx: 1, cursor: "pointer" }}
                          >
                            <Grid container justifyContent="space-between">
                              <Grid item container xs={12} sm={8} md={8} xl={8}>
                                <img
                                  src={
                                    messages?.startup_logo !== null
                                      ? messages?.startup_logo
                                      : "/Images/default_member_icon.png"
                                  }
                                  height="20px"
                                  width="20px"
                                  style={{ marginRight: "10px" }}
                                />
                                <Typography className={styles.messageHeader}>
                                  {messages?.startup_org_name}
                                </Typography>
                              </Grid>
                              <Grid item container xs={12} sm={4} md={4} xl={4}>
                                <Typography className={styles.dateColor}>
                                  {formatDate(messages?.date)}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Typography
                              sx={{
                                my: 1,
                                whiteSpace: "nowrap",
                                width: "90%",
                                textOverflow: "ellipsis",

                                overflow: "hidden",
                              }}
                              className={styles.dateColor}
                            >
                              {messages?.last_message}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Grid
                        sx={{
                          height: "60vh",
                          overflowY: "auto",
                        }}
                      >
                        {messageList?.investor_list?.map((messages, index) => (
                          <Grid
                            onClick={() => {
                              handleStartupChat(messages);
                            }}
                            key={index}
                            className={styles.messagesOuter}
                            sx={{ my: 2, mx: 1, cursor: "pointer" }}
                          >
                            <Grid container justifyContent="space-between">
                              <Grid item container xs={12} sm={8} md={8} xl={8}>
                                <img
                                  src={
                                    messages?.investor_logo !== null
                                      ? messages?.investor_logo
                                      : "/Images/default_member_icon.png"
                                  }
                                  height="25px"
                                  width="25px"
                                  style={{ marginRight: "10px" }}
                                />
                                <Typography className={styles.messageHeader}>
                                  {messages?.inv_user_name}
                                </Typography>
                              </Grid>
                              <Grid item container xs={12} sm={4} md={4} xl={4}>
                                <Typography className={styles.dateColor}>
                                  {formatDate(messages?.date)}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Typography
                              sx={{
                                my: 1,
                                whiteSpace: "normal",
                                width: "90%",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                              className={styles.dateColor}
                            >
                              {messages?.last_message}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid
                    container
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{ height: "60vh", fontSize: "14px" }}
                  >
                    {" "}
                    There are no Result
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Divider orientation="vertical" sx={{ border: "2px solid #F5F5F5", height: "auto" }} />
            {!hiddenChat ? (
              <Grid
                item
                xs={12}
                sm={12}
                md={7.7}
                xl={7.7}
                sx={{
                  position: "relative",
                  left: "10px",
                  // borderLeft: "2px solid #F5F5F5"
                }}
              >
                <Grid sx={{ marginLeft: "10px" }}>
                  <Typography className={styles.header}>
                    {startupOrgName} <span className={styles.username}>{startupUserName}</span>
                  </Typography>
                  <Divider sx={{ border: "2px solid #F5F5F5", marginTop: "5px" }} />
                  <Grid
                    sx={{
                      m: 2,
                      backgroundColor: "rgba(65, 148, 179,0.1)",
                      height: messageToggle ? "45vh" : "60vh",
                      overflowY: "auto",
                      position: "relative",
                    }}
                  >
                    {startupFullChat?.latest_meassage?.map((data, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: userId === data.from_userid ? "flex-end" : "flex-start",
                        }}
                      >
                        <Box sx={{ maxWidth: "60%", mx: 1, my: 1 }}>
                          <Typography
                            sx={{
                              padding: "10px",
                              border: "2px solid #FFFFFF",
                              borderRadius: "10px",
                              background: "#FFFFFF",
                              fontWeight: "500",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              wordBreak: "break-word",
                              fontSize: "14px",
                            }}
                          >
                            {data?.message}
                          </Typography>
                          <Typography className={styles.dateColor}>
                            {formatDateAndTime(data?.time)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Grid>

                  {messageToggle ? (
                    <Grid
                      sx={{
                        m: 2,
                      }}
                    >
                      <TextField
                        value={chat}
                        fullWidth
                        multiline
                        id="outlined-basic"
                        variant="outlined"
                        placeholder={intl.formatMessage({
                          id: "Messages.card.heading2.placeholder",
                          defaultMessage: "write your message",
                        })}
                        rows={2}
                        onChange={(e) => {
                          setChat(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={handleChatSubmit}
                                type="submit"
                                sx={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  padding: "1px",
                                  minWidth: "0",
                                  display: "flex",
                                  marginTop: "15px",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  color: "rgba(108, 25, 62, 1)",
                                  background: "rgba(138, 21, 56, 0.15)",
                                }}
                                disabled={!chat}
                              >
                                {messagesStore?.status === true ? (
                                  <ScheduleSendIcon sx={{ fontSize: "18px" }} />
                                ) : (
                                  <SendIcon sx={{ fontSize: "18px" }} />
                                )}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {/* <Grid container justifyContent="flex-end">
                        <Button
                          onClick={handleChatSubmit}
                          type="submit"
                          className={styles.mandatesButton}
                          disabled={!chat}
                        >
                          {messagesStore?.status === true ? (
                            <FormattedMessage
                              id="Messages.card.button.text1"
                              defaultMessage="Sending"
                            />
                          ) : (
                            <FormattedMessage
                              id="Messages.card.button.text2"
                              defaultMessage="Send"
                            />
                          )}
                        </Button>
                      </Grid> */}
                    </Grid>
                  ) : (
                    <Fab
                      aria-label="add"
                      size="medium"
                      sx={{
                        position: "absolute",
                        right: 1.2,
                        bottom: "5px",
                        background:
                          "linear-gradient(161deg, rgba(35,33,86,1) 0%, rgba(101,37,72,1) 100%)",
                        color: "white",
                        "&:hover": {
                          background:
                            "linear-gradient(161deg, rgba(35,33,86,1) 0%, rgba(101,37,72,1) 100%)",
                          color: "white",
                        },
                      }}
                      onClick={() => {
                        setMessageToggle(true);
                      }}
                    >
                      <MessageIcon
                        sx={{
                          fontSize: "18px",
                        }}
                      />
                    </Fab>
                  )}
                </Grid>
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                sm={12}
                md={7.7}
                xl={7.7}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography fontSize={"14px"}>
                  <FormattedMessage
                    id="Messages.card.NoopenMessage"
                    defaultMessage="There is no open message"
                  />
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </ExternalContainer>
    </>
  );
};

Messages.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Messages;
