import React from "react";
import PitchOverview from "../SeeMandates/PitchOverview";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useSelector } from "react-redux";

const PitchesOverview = () => {
  const pitchId = localStorage.getItem("pitchId");
  console.log(pitchId);
  return (
    <>
      <PitchOverview pitchIdFromPitches={pitchId} />
    </>
  );
};
PitchesOverview.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PitchesOverview;
