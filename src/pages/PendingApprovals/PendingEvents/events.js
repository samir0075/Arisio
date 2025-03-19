import React from "react";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";
import Events from "src/pages/Events";

const PendingEvents = () => {
  const flow = "Admin";
  const section = "PendingEvents";

  return (
    <div>
      <Events flow={flow} section={section} />
    </div>
  );
};
PendingEvents.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PendingEvents;
