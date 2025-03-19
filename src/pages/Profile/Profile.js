import React from "react";
import ExternalContainer from "src/components/ExternalContainer";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import StartupProfile from "./StartupProfile";
import InvestorProfile from "./InvestorProfile/InvestorProfile";
import MentorProfile from "./MentorProfile";

const Profile = () => {
  const userData = typeof window !== "undefined" ? localStorage.getItem("userDetails") : null;
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  return (
    <>
      <ExternalContainer>
        {role === "ENTREPRENEUR" ? (
          <StartupProfile />
        ) : role === "INVESTOR" ? (
          <InvestorProfile />
        ) : role === "MENTOR" ? (
          <MentorProfile />
        ) : (
          ""
        )}
      </ExternalContainer>
    </>
  );
};
Profile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Profile;
