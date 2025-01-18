import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import meow from './pages/meow';
import Header from './components/Header';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header /> {/* Include the Header component */}
          <Home />   {/* Include the Home component */}
          <Footer /> {/* Include the Footer component alo alo 1234 test etstte */}
        </>
      ),
    },
    {
      path: "/meow",
      element: (
        <>
          <Header /> {/* Include the Header component */}
          <meow />   {/* Include the Home component */}
          <Footer /> {/* Include the Footer component alo alo 1234 test etstte */}
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
