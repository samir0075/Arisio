import React from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";

const appointments = () => {
  return <div>appointments</div>;
};
appointments.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default appointments;
