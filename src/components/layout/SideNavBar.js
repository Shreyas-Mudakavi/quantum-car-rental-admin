import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../Store";
import "./SideNavBar.css";
import { RiDashboard2Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { AiFillCar } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import {
  FaSignOutAlt,
  FaFileInvoiceDollar,
  FaCalendarCheck,
} from "react-icons/fa";

const linkList = [
  {
    icon: <RiDashboard2Fill className="icon-md" />,
    text: "Dashboard",
    url: "/admin/dashboard",
  },
  {
    icon: <FaFileInvoiceDollar className="icon-md" />,
    text: "Transactions",
    url: "/admin/transactions",
  },
  {
    icon: <AiFillCar className="icon-md" />,
    text: "Cars",
    url: "/admin/cars",
  },
  {
    icon: <FaCalendarCheck className="icon-md" />,
    text: "Bookings",
    url: "/admin/bookings",
  },
  { icon: <HiUsers className="icon-md" />, text: "Users", url: "/admin/users" },
  {
    icon: <FaLocationDot className="icon-md" />,
    text: "Location",
    url: "/admin/locations",
  },
  {
    icon: <BsFillPatchQuestionFill className="icon-md" />,
    text: "Queries",
    url: "/admin/queries",
  },
];

const active_text = {
  Dashboard: "dashboard",
  Users: "user",
  Bookings: "bookings",
  Cars: "cars",
  Transactions: "transactions",
  Location: "locations",
  Queries: "queries",
};

export default function SideNavbar({ isExpanded }) {
  const pathname = window.location.pathname;
  const [activeLink, setActiveLink] = useState("Dashboard");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  const activeLinkHandler = (text) => {
    // console.log("text", text,  active_text[text], activeLink);
    // // console.log(pathname.includes(active_text[text]));
    return pathname.includes(active_text[text]);
  };

  return (
    <>
      {userInfo ? (
        <div
          className={
            isExpanded
              ? "side-nav-container"
              : "side-nav-container side-nav-container-NX"
          }
        >
          <div className="brand-link">
            {/* <img src="/LogoWhite.png" alt="" width={"50px"} height="auto" /> */}
            <span
              onClick={() => navigate("/admin/dashboard")}
              style={{ cursor: "pointer", fontSize: "0.98rem" }}
              className="brand-text ms-2 font-weight-light"
            >
              Palmerston North Car Rentals
            </span>
          </div>

          <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <Link to="/view-profile" className="d-block">
                  <span className="info-text">
                    {`Welcome back ${userInfo?.name}`}
                  </span>
                </Link>
              </div>
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul
                className="nav-pills nav-sidebar px-0 d-flex flex-column flex-wrap"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {linkList.map(({ icon, text, url }) => (
                  <li
                    key={url}
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    } ${activeLinkHandler(text) && "active-item"}`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))}

                {/* <li
                  className={`nav-item has-treeview ${isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                >
                  <Link className="dropdown-nav-link">
                    <TbDiscount2 className="icon-md" />
                    <p className="ms-2">Sale
                      <FaAngleDown className="right icon-md" />
                    </p>
                  </Link>
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    {SaleLinkList.map(({ url, text }) =>
                      <li key={url} className={`nav-item ${activeLinkHandler(text) && "active-item"}`}
                      onClick={() => setActiveLink(text)}>
                        <Link to={url} className="nav-link sub-nav-link">                        <BiCircle className="icon-md" />
                          <p className="ms-2">{text}</p>
                        </Link>
                      </li>)}

                  </ul>
                </li> */}
                <li
                  className={`nav-item has-treeview ${
                    isExpanded ? "menu-item" : "menu-item menu-item-NX"
                  }`}
                >
                  <Link onClick={signoutHandler} to="/" className="nav-link">
                    {/* <i className="fas fa-sign-out-alt"></i> */}
                    <FaSignOutAlt className="icon-md" />
                    <p className="ms-2">Log Out</p>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
