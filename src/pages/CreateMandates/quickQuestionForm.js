/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import styles from "./createMandate.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography, Card, TextField, Grid, Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

const QuickQuestionForm = ({ question, setQuestion, storeQuestion, setStoreQuestion }) => {
  const [editButtonClicked, setEditButtonClicked] = useState(false);
  const intl = useIntl();
  const [selectedQuestionId, setSelectedQuestionID] = useState(null);
  const [helperText, setHelperText] = useState(false);
  const handleClick = () => {
    if (storeQuestion?.length !== 0 && selectedQuestionId !== null) {
      storeQuestion.splice(selectedQuestionId, 1, question);
      setQuestion("");
      setEditButtonClicked(false);
      setSelectedQuestionID(null);
    } else {
      if (storeQuestion?.length > 4) {
        setHelperText(true);
        setQuestion("");
      } else {
        setStoreQuestion([...storeQuestion, question]);
        setQuestion("");
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setHelperText(false);
    }, 10000);
  }, []);

  const handleEdit = (index, item) => {
    setEditButtonClicked(true);
    setSelectedQuestionID(index);
    setQuestion(item);
    setHelperText(false);
  };

  const handleDelete = (item) => {
    const deletedQuestionId = storeQuestion.indexOf(item);
    if (deletedQuestionId !== -1) {
      storeQuestion.splice(deletedQuestionId, 1);
      setStoreQuestion([...storeQuestion]);
    }
    setHelperText(false);
    setQuestion("");
  };

  const getBtnText = () => {
    if (editButtonClicked === false || question === "") {
      return (
        <FormattedMessage
          id="quickQuestionsForm.step3.card.submit.button.add"
          defaultMessage="Add"
        />
      );
    } else {
      return (
        <FormattedMessage
          id="quickQuestionsForm.step3.card.submit.button.update"
          defaultMessage="Update"
        />
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "60vw",
          height: "auto",
          p: 4,
        }}
      >
        <Typography className={styles.formTextWOBold}>
          <FormattedMessage
            id="quickQuestionsForm.step3.card.heading"
            defaultMessage="Don't bother asking the name, or the location, or the description of the startup; or
            contact details or the profile of the team. We get them anyway."
          />
        </Typography>
        <Card
          sx={{
            backgroundColor: "#f2f2f2",
            height: 300,
            width: "100%",
            marginTop: "15px",
            overflowY: "auto",
          }}
        >
          <TextField
            id="filled-multiline-static"
            placeholder={intl.formatMessage({
              id: "quickQuestionsForm.step3.form.textField.placeholder",
              defaultMessage: "Create your question",
            })}
            multiline
            rows={4}
            variant="filled"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            inputProps={{ minLength: 4, maxLength: 150 }} // Define min and max length for the input
            error={
              ((question.length <= 4 || question.length >= 150) && question !== "") ||
              helperText === true
            } // Set error state based on min and max length criteria
            helperText={
              (question.length <= 4 || question.length >= 150) && question !== "" ? (
                <FormattedMessage
                  id="quickQuestionsForm.step3.form.textField.helperText"
                  defaultMessage="Question must be between 4 and 150 characters long"
                />
              ) : helperText === true ? (
                <FormattedMessage
                  id="quickQuestionsForm.step3.form.textField.helperText.maxQuestion"
                  defaultMessage="Max 5 Questions are allowed"
                />
              ) : (
                ""
              )
            }
            sx={{
              marginTop: "10px",
              width: "94%",
              backgroundColor: "#fff",
              margin: 3,
            }}
          />
          <div className={styles.btnStyle}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleClick()}
              disabled={question === "" ? true : false}
            >
              {getBtnText()}
            </Button>
          </div>

          <Grid container spacing={2} className={styles.questionCard} style={{ marginLeft: "3px" }}>
            {storeQuestion?.length !== 0
              ? storeQuestion?.map((item, index) => (
                  <>
                    <Grid item xs={8}>
                      <Typography
                        sx={{
                          fontSize: "17px",
                          overflowWrap: "break-word",
                          width: "100%",
                          marginLeft: "20px",
                        }}
                      >
                        {`${index + 1}.${item}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} className={styles.iconBtn}>
                      <Grid item xs={2} style={{ marginLeft: "15px" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(index, item)}
                        >
                          <EditIcon />
                        </Button>
                      </Grid>
                      <Grid item xs={2} style={{ marginRight: "18px" }}>
                        <Button variant="outlined" size="small" onClick={() => handleDelete(item)}>
                          <DeleteIcon />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ))
              : null}
          </Grid>
        </Card>
      </Card>
    </Box>
  );
};

export default QuickQuestionForm;
