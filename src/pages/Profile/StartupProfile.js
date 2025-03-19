import React, { useEffect, useState } from "react";
import StartupDetailsTab from "src/components/StartupPitch/StartupDetailsTab";
import { useDispatch, useSelector } from "react-redux";
import { getDocuments, getTeamMember, profileOverviewForMandate } from "src/action/seeNewMandate";

const StartupProfile = () => {
  const [value, setValue] = useState(0);
  const profile = "NewProfile";
  const dispatch = useDispatch();

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const startupId = userDetails?.startupId;
  const profileId = userDetails?.id;

  useEffect(() => {
    dispatch(profileOverviewForMandate(profileId));
    dispatch(getTeamMember(startupId));
    dispatch(getDocuments(startupId));
  }, [dispatch, startupId, profileId]);

  let profileOverviewData = useSelector(state => state?.seeNewMandate?.profileOverview);
  const seniorTeamMember = useSelector(state => state?.seeNewMandate?.teamMember);
  const documentList = useSelector(state => state.seeNewMandate?.documents);

  return (
    <>
      <StartupDetailsTab
        newProfile={profile}
        setValue={setValue}
        value={value}
        profileOverviewData={profileOverviewData}
        seniorTeamMember={seniorTeamMember}
        documentList={documentList}
      />
    </>
  );
};

export default StartupProfile;
