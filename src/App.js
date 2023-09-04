import { Store } from "./Store";
import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import AdminProtectedRoute from "./components/protectedRoute/AdminProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/layout/SideNavBar";
import NotFound from "./components/layout/NotFound";

import ViewProfile from "./components/profile/ViewProfile";

import Users from "./components/user/Users";
import ViewUser from "./components/user/ViewUser";

import AdminLoginScreen from "./components/AdminLoginScreen";
import Dashboard from "./components/layout/Dashboard";
import UnprotectedRoute from "./components/protectedRoute/UnprotectedRoute";

import AddLocation from "./components/Location/AddLocation";

import Bookings from "./components/bookings/Bookings";
import ViewBooking from "./components/bookings/ViewBooking";

import Transactions from "./components/transactions/Transactions";
import ViewTransaction from "./components/transactions/ViewTransaction";

import Cars from "./components/car/Cars";
import AddCar from "./components/car/AddCar";
import ViewCar from "./components/car/ViewCar";
import Queries from "./components/queries/Queries";
import ViewQuery from "./components/queries/ViewQuery";

function App() {
  const { state } = useContext(Store);
  const { token } = state;

  const pageLocation = useLocation();

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);

  const routeList = [
    { path: "/admin/dashboard", element: <Dashboard /> },
    { path: "/view-profile", element: <ViewProfile /> },
    { path: "/admin/users", element: <Users /> },
    { path: "/admin/queries", element: <Queries /> },
    { path: "/admin/view/query/:id", element: <ViewQuery /> },
    { path: "/admin/view/user/:id", element: <ViewUser /> },
    { path: "/admin/transactions", element: <Transactions /> },
    { path: "/admin/view/transaction/:id", element: <ViewTransaction /> },
    { path: "/admin/cars", element: <Cars /> },
    { path: "/admin/car/add", element: <AddCar /> },
    { path: "/admin/view/car/:id", element: <ViewCar /> },
    { path: "/admin/bookings", element: <Bookings /> },
    { path: "/admin/view/booking/:id", element: <ViewBooking /> },
    { path: "/admin/locations", element: <AddLocation /> },
  ];

  return (
    <div className="main-wrapper">
      {isExpanded && token && (
        <div className="sidebar-overlay" onClick={sidebarHandler}></div>
      )}
      <div className="sidebar-wrapper">
        {/* <Menu/> */}
        <SideNavbar isExpanded={isExpanded} />
      </div>
      <div
        className={`body-wrapper ${isExpanded ? "mini-body" : "full-body"} ${
          token ? "" : "m-0"
        } d-flex flex-column`}
      >
        <Header sidebarHandler={sidebarHandler} />
        <Routes location={pageLocation} key={pageLocation.pathname}>
          <Route
            path="/"
            element={
              <UnprotectedRoute>
                <AdminLoginScreen />
              </UnprotectedRoute>
            }
          />
          {routeList.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<AdminProtectedRoute>{element}</AdminProtectedRoute>}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
