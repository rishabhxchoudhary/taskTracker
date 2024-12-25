import { Outlet } from "react-router-dom";
import Layout from "./Layout";
// import React from "react";

export function LayoutWrapper() {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }