import React from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";

const availability = () => {
  return <div>availability</div>;
};
availability.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default availability;
