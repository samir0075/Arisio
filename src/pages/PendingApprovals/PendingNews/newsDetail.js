import React from "react";
import NewsDetail from "src/pages/News/detailsNews";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";

const NewsDetailed = () => {
  return (
    <>
      <NewsDetail />
    </>
  );
};
NewsDetailed.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NewsDetailed;
