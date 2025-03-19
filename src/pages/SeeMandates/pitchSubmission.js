import React from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import PitchSuccess from "src/components/StartupPitch/PitchSuccess";

const PitchSubmission = () => {
  return (
    <>
      <PitchSuccess />
    </>
  );
};
PitchSubmission.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PitchSubmission;
