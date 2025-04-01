import React, { useEffect } from "react";
import "./SchoolChannelStudio.scss";
import StudioHeader from "../../components/schooltv-studio/StudioHeader";
import { Outlet, useNavigate } from "react-router-dom";
import StudioNavbar from "../../components/schooltv-studio/StudioNavbar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { checkExistChannel } from "./check-channel/CheckExistChannel";

function SchoolChannelStudio() {
  const user = useSelector((state) => state.userData.user);
  const navigate = useNavigate();

  const fetchChannel = async () => {
    try {
      const data = await checkExistChannel(user.accountID);

      if(!data) {
        navigate("/create-channel");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  }

  useEffect(() => {
    fetchChannel();
  }, [user.accountID, navigate]);
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
