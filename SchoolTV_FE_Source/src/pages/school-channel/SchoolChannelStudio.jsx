import React from "react";
import "./SchoolChannelStudio.scss";
import StudioHeader from "../../components/schooltv-studio/StudioHeader";
import { Outlet } from "react-router-dom";
import StudioNavbar from "../../components/schooltv-studio/StudioNavbar";

function SchoolChannelStudio() {
  return (
    <>
      <StudioHeader />
      <div className="studio-function-container">
        <StudioNavbar />
        <Outlet />
      </div>
    </>
  );
}

export default SchoolChannelStudio;
