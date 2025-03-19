import React from "react";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";
import NewsCard from "src/pages/News/news";

const PendingNews = () => {
  const flow = "Admin";
  const section = "PendingNews";

  return (
    <>
      <NewsCard flow={flow} section={section} />/
    </>
  );
};
PendingNews.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PendingNews;
