import {
  Box,
  Button,
  Divider,
  FormLabel,
  Grid,
  TextField,
  Typography,
  circularProgressClasses
} from "@mui/material";
import styles from "./StartupPitch.module.css";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { postAnswer, updateAnswer } from "src/action/seeNewMandate";
import { useRouter } from "next/router";
import { FormattedMessage, useIntl } from "react-intl";

const schema = yup
  .object({
    answer: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.questionTabInfo.answerError.message"
          defaultMessage="Enter your answer"
        />
      )
  })
  .required();

const Question = ({ switchToPreviousTab, questionsList }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    setValue("answer", questionsList[0]?.eventAnswer?.answer);
  }, [questionsList, setValue]);

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const startupId = userDetails?.startupId;
  const intl = useIntl();
  const onSubmit = data => {
    const questionId = questionsList?.map(data => data?.eventQuestion?.id);
    const answerId = questionsList?.map(data => data?.eventAnswer?.id);

    answerId[0] !== undefined
      ? dispatch(updateAnswer(startupId, data, answerId, intl)).then(res => {
          router.push("./PitchOverview");
        })
      : dispatch(postAnswer(startupId, data, questionId, intl)).then(res => {
          router.push("./PitchOverview");
        });
  };

  const handleNavigation = () => {
    router.push("./PitchOverview");
  };

  return (
    <>
      <Box>
        <Grid>
          <Typography className={styles.heading}>
            <FormattedMessage
              id="startupPitch.questionTabInfo.header"
              defaultMessage="Quick Questions"
            />
          </Typography>
          <Typography className={`${styles.inputField} ${styles.normalText}`}>
            <FormattedMessage
              id="startupPitch.questionTabInfo.title"
              defaultMessage="Please answer these additional questions"
            />
          </Typography>
          <Divider sx={{ border: "2px solid #F5F5F5", marginTop: "10px" }} />
          {questionsList && questionsList.length > 0 ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {questionsList?.map(data => (
                <Grid key={data?.eventQuestion?.id} sx={{ my: 2 }}>
                  <Box className={styles.inputExternal}>
                    <FormLabel className={styles.inputField}>
                      {data?.eventQuestion?.question} <span className={styles.error}>*</span>
                    </FormLabel>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder=""
                      {...register("answer")}
                    />
                  </Box>
                  {errors.answer && <span className={styles.error}>{errors.answer?.message}</span>}
                </Grid>
              ))}
              <Grid container justifyContent="space-between">
                <Button className={styles.nextButton} onClick={switchToPreviousTab}>
                  <FormattedMessage
                    id="startupPitch.questionTabInfo.backButton.title"
                    defaultMessage="Back"
                  />
                </Button>
                <Button type="submit" className={styles.nextButton}>
                  <FormattedMessage
                    id="startupPitch.questionTabInfo.nextButton.title"
                    defaultMessage="Next"
                  />
                </Button>
              </Grid>
            </form>
          ) : (
            <Grid container justifyContent="space-between">
              <Button className={styles.nextButton} onClick={switchToPreviousTab}>
                <FormattedMessage
                  id="startupPitch.questionTabInfo.backButton.title"
                  defaultMessage="Back"
                />
              </Button>
              <Button type="submit" onClick={handleNavigation} className={styles.nextButton}>
                <FormattedMessage
                  id="startupPitch.questionTabInfo.nextButton.title"
                  defaultMessage="Next"
                />
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default Question;
