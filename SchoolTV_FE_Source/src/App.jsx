import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import WatchHome from './pages/WatchHome';
import LiveList from './pages/LiveList';
import ChannelList from './pages/ChannelList';
import WatchLive from './pages/WatchLive';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/login/login';
import Register from './pages/register/register';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header /> {/* Include the Header component */}
          <WatchHome />   {/* Include the Home component */}
          <Footer /> {/* Include the Footer component */}
        </>
      ),
    },{
      path: "/watchHome",
      element: (
        <>
          <Header /> {/* Include the Header component */}
          <WatchHome />   {/* Include the Home component */}
          <Footer /> {/* Include the Footer component */}
        </>
      ),
    },
    {
      path: "/businessHome",
      element: (
        <>
          <Header /> {/* Include the Header component */}
          <Home />   {/* Include the Home component */}
          <Footer /> {/* Include the Footer component */}
        </>
      ),
    },
    {
      path: "/liveList",
      element: (
        <>
          <Header /> {/* Include the Header component */}
          <LiveList />   {/* Include the Home component */}
          <Footer /> {/* Include the Footer component */}
        </>
      ),
    },
    {
      path: "/channelList",
      element: (
        <>
          <Header /> {/* Include the Header component */}
          <ChannelList />   {/* Include the Home component */}
          <Footer /> {/* Include the Footer component */}
        </>
      ),
    },
    {
      path: "/watchLive",
      element: (
        <>
          <Header /> {/* Include the Header component */}
          <WatchLive />   {/* Include the Home component */}
          <Footer /> {/* Include the Footer component */}
        </>
      ),
    },
    {
      path: "/login", 
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/register", 
      element: (
        <>
          <Register />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
