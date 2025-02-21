import React from "react";
import "./SchoolChannelStudio.scss";
import StudioHeader from "../../components/schooltv-studio/StudioHeader";
import { Outlet } from "react-router-dom";
import StudioNavbar from "../../components/schooltv-studio/StudioNavbar";

function SchoolChannelStudio() {
  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <StudioHeader />
      <div className="studio-function-container">
        <StudioNavbar />
        <main style={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SchoolChannelStudio;