import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/BusinessHome/Home";
import WatchHome from "./pages/WatchHome/WatchHome";
import LiveList from "./pages/LiveList/LiveList";
import ChannelList from "./pages/ChannelList/ChannelList";
import WatchLive from "./pages/WatchLive/WatchLive";
import AllFeaturedVideo from "./pages/featuredVideo/AllFeaturedVideo";
import PlayFeaturedVideo from "./pages/featuredVideo/PlayFeaturedVideo";
import UserProfile from "./pages/UserProfile/UserProfile";
import PageLayout from "./components/layout/PageLayout";
import SchoolChannelStudio from "./pages/school-channel/SchoolChannelStudio";
import StudioPost from "./components/schooltv-studio/functions/StudioPost";
import StudioVideo from "./components/schooltv-studio/functions/StudioVideo";
import StudioLiveStream from "./components/schooltv-studio/functions/StudioLiveStream";
import UpComing from "./pages/upcoming/upcoming";
import ForgottenPassword from "./pages/forgottenPassword/forgottenPassword";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <ThemeProvider>
          <Login />
        </ThemeProvider>
      ),
    },
    {
      path: "/register",
      element: (
        <ThemeProvider>
          <Register />
        </ThemeProvider>
      ),
    },     
    {
      path: "/forgottenPassword",
      element: (
        <ThemeProvider>
          <ForgottenPassword />
        </ThemeProvider>
      ),
    },        
    {
      path: "school-studio",
      element: (
        <ThemeProvider>
          <SchoolChannelStudio />
        </ThemeProvider>
      ),
      children: [
        {
          path: "post",
          element: <StudioPost />
        },
        {
          path: "video",
          element: <StudioVideo />
        },
        {
          path: "live-stream",
          element: <StudioLiveStream />
        }
      ]
    },
    {
      path: "",
      element: (
        <ThemeProvider>
          <PageLayout />
        </ThemeProvider>
      ),
      children: [
        {
          path: "featured-video",
          element: <AllFeaturedVideo />,
        },
        {
          path: "play-featured-video",
          element: <PlayFeaturedVideo />,
        },
        {
          path: "/watchLive",
          element: <WatchLive />,
        },
        {
          path: "/",
          element: <WatchHome />,
        },
        {
          path: "/watchHome",
          element: <WatchHome />,
        },
        {
          path: "/liveList",
          element: <LiveList />,
        },
        {
          path: "/channelList",
          element: <ChannelList />,
        },
        {
          path: "/businessHome",
          element: <Home />,
        },
        {
          path: "/upComing",
          element: <UpComing />,
        },
        {
          path: "/userProfile",
          element: <UserProfile />,
        }
      ],
    },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;