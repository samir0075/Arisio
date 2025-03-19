import { Box, Button, Divider, Grid, Link, Tooltip, Typography } from "@mui/material";
import styles from "./StartupPitch.module.css";
import { useEffect, useState } from "react";
import FounderModal from "./FounderModal";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteModal";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import { display } from "@mui/system";

const Team = ({ seniorTeamMember, switchToNextTab, switchToPreviousTab, pitchingDisable }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberType, setMemberType] = useState("");
  const [deleteId, setDeleteID] = useState();
  const [disableDelete, setDisableDelete] = useState(false);
  const router = useRouter();

  const handleFounderDialog = memberType => {
    setDialogOpen(true);
    setMemberType(memberType);
  };
  const handleDeleteDialog = data => {
    setDeleteID(data?.id);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (seniorTeamMember?.length === 1) {
      setDisableDelete(true);
    } else {
      setDisableDelete(false);
    }
  }, [seniorTeamMember]);

  return (
    <>
      <Box>
        <Grid>
          <Typography className={styles.heading}>
            {" "}
            <FormattedMessage
              id="startupPitch.teamTabInfo.header"
              defaultMessage="Startup Founders"
            />
          </Typography>
          <Typography className={`${styles.inputField} ${styles.normalText}`}>
            <FormattedMessage
              id="startupPitch.teamTabInfo.subHeader"
              defaultMessage="Add startup founders and co-founders"
            />
          </Typography>

          <Divider sx={{ border: "2px solid #F5F5F5", marginTop: "10px" }} />

          <Grid container>
            {" "}
            {seniorTeamMember
              ?.filter(data =>
                ["Founder", "Co-Founder", "C-Suite (CTO , CEO or etc)"].includes(data.designation)
              )
              ?.map(data => (
                <Grid
                  container
                  item
                  xs={12}
                  sm={5.5}
                  md={3.5}
                  xl={3.5}
                  sx={{
                    padding: "4px",
                    margin: "10px",
                    border: "2px solid #F5F5F5",
                    borderRadius: "8px",
                    position: "relative",
                    minWidth: "200px"
                  }}
                  key={data?.id}
                >
                  <Grid item container justifyContent="center" style={{ height: "100px" }}>
                    <img src="/Images/default_member_icon.png" alt="Founder Image" />
                    {/* <Typography className={styles.verifyLabel}>
                      {data.verified === 0 ? "Not Verified" : "Verified"}
                    </Typography> */}
                  </Grid>
                  <Grid
                    item
                    container
                    justifyContent="center"
                    textAlign="center"
                    xs={12}
                    style={{
                      height: "calc(100% - 130px)"
                    }}
                  >
                    <Grid sx={{ margin: "10px" }} xs={11}>
                      <Tooltip title={data?.memberName} placement="top">
                        <Typography
                          className={styles.heading}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}
                        >
                          {data?.memberName}
                        </Typography>
                      </Tooltip>
                      <Typography className={styles.inputField}>{data?.designation}</Typography>
                      <Tooltip title={data?.memberEmail} placement="top">
                        <Typography
                          className={styles.inputField}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}
                        >
                          {data?.memberEmail}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={data?.linkedin_profile_url} placement="top">
                        <Typography
                          className={styles.inputField}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}
                        >
                          {data?.linkedin_profile_url}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={data?.port_folio_link} placement="top">
                        <Typography
                          className={styles.inputField}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}
                        >
                          {data?.port_folio_link}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    style={{
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                  >
                    {" "}
                    {disableDelete === false && !pitchingDisable ? (
                      <DeleteIcon
                        sx={{
                          cursor: "pointer",
                          position: "absolute",
                          bottom: 5
                        }}
                        onClick={() => {
                          handleDeleteDialog(data);
                        }}
                      />
                    ) : null}
                  </Grid>
                </Grid>
              ))}
            {!pitchingDisable && (
              <Grid
                item
                sx={{ marginTop: "10px", margin: "10px" }}
                xs={12}
                sm={5.5}
                md={3.5}
                xl={3.5}
              >
                <img
                  src="/Images/add-button.png"
                  alt="Add Button"
                  onClick={() => {
                    handleFounderDialog("Senior");
                  }}
                  style={{ cursor: "pointer" }}
                />
                <Typography sx={{ color: "#6d6d6d", fontSize: "14px" }}>
                  <FormattedMessage
                    id="startupPitch.teamTabInfo.addMore.button.title"
                    defaultMessage="Add more"
                  />
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ border: "2px solid #F5F5F5", marginTop: "10px" }} />

        <Grid sx={{ m: 1 }}>
          <Typography className={styles.heading}>
            <FormattedMessage
              id="startupPitch.teamTabInfo.keyTeamMember.header"
              defaultMessage="Key Team Members"
            />
          </Typography>
          <Typography className={`${styles.inputField} ${styles.normalText}`}>
            <FormattedMessage
              id="startupPitch.teamTabInfo.keyTeamMember.subHeader"
              defaultMessage="Add key team members and advisors"
            />
          </Typography>

          <Divider sx={{ border: "2px solid #F5F5F5", marginTop: "10px" }} />

          <Grid container>
            {" "}
            {seniorTeamMember
              ?.filter(data =>
                [
                  "Software Team Member",
                  "Sales Team Member",
                  "Marketing Team Members",
                  "Operations Team Members",
                  "Advisor",
                  "Other"
                ].includes(data.designation)
              )
              ?.map(data => (
                <Grid
                  container
                  item
                  xs={12}
                  sm={5.5}
                  md={3.5}
                  xl={3.5}
                  sx={{
                    padding: "4px",
                    margin: "10px",
                    border: "2px solid #F5F5F5",
                    borderRadius: "8px",
                    position: "relative",
                    minWidth: "200px"
                  }}
                  key={data?.id}
                >
                  <Grid item container justifyContent="center" style={{ height: "100px" }}>
                    <img src="/Images/default_member_icon.png" alt="Founder Image" />
                    {/* <Typography className={styles.verifyLabel}>
                      {data.verified === 0 ? "Not Verified" : "Verified"}
                    </Typography> */}
                  </Grid>
                  <Grid
                    item
                    container
                    justifyContent="center"
                    textAlign="center"
                    xs={12}
                    style={{
                      height: "calc(100% - 130px)"
                    }}
                  >
                    <Grid sx={{ margin: "10px" }} xs={11}>
                      <Tooltip title={data?.memberName} placement="top">
                        <Typography
                          className={styles.heading}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}
                        >
                          {data?.memberName}
                        </Typography>
                      </Tooltip>
                      <Typography className={styles.inputField}>{data?.designation}</Typography>
                      <Tooltip title={data?.memberEmail} placement="top">
                        <Typography
                          className={styles.inputField}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}
                        >
                          {data?.memberEmail}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={data?.linkedin_profile_url} placement="top">
                        <Typography
                          className={styles.inputField}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}
                        >
                          {data?.linkedin_profile_url}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={data?.port_folio_link} placement="top">
                        <Typography
                          className={styles.inputField}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}
                        >
                          {data?.port_folio_link}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    style={{
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                  >
                    {!pitchingDisable && (
                      <DeleteIcon
                        sx={{ cursor: "pointer", position: "absolute", bottom: 5 }}
                        onClick={() => {
                          handleDeleteDialog(data);
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              ))}
            {!pitchingDisable && (
              <Grid
                item
                sx={{ marginTop: "10px", margin: "10px" }}
                xs={12}
                sm={5.5}
                md={3.5}
                xl={3.5}
              >
                <img
                  src="/Images/add-button.png"
                  alt="Add Button"
                  onClick={() => {
                    handleFounderDialog("Junior");
                  }}
                  style={{ cursor: "pointer" }}
                />

                <Typography sx={{ color: "#6d6d6d" }}>
                  <FormattedMessage
                    id="startupPitch.teamTabInfo.addMore.button.title"
                    defaultMessage="Add more"
                  />
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
      <Grid container justifyContent="space-between">
        <Button className={styles.nextButton} onClick={switchToPreviousTab}>
          <FormattedMessage id="startupPitch.teamTabInfo.back.button.title" defaultMessage="Back" />
        </Button>
        <Button className={styles.nextButton} onClick={switchToNextTab}>
          <FormattedMessage id="startupPitch.teamTabInfo.next.button.title" defaultMessage="Next" />
        </Button>
      </Grid>
      {dialogOpen && (
        <FounderModal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          memberType={memberType}
        />
      )}
      {deleteDialogOpen && (
        <DeleteModal
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          deleteId={deleteId}
        />
      )}
    </>
  );
};

export default Team;
