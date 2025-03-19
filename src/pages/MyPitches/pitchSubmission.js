import React from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import PitchSuccess from "src/components/StartupPitch/PitchSuccess";

const PitchSubmission = () => {
  const pitchId = localStorage.getItem("pitchId");
  return (
    <>
      <PitchSuccess pitchIdFromPitches={pitchId} />
    </>
  );
};
PitchSubmission.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PitchSubmission;
