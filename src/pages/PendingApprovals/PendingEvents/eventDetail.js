import React from "react";
import DetailEvent from "src/pages/Events/detailEvents";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";

const EventDetails = () => {
  return (
    <>
      <DetailEvent />
    </>
  );
};
EventDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EventDetails;
