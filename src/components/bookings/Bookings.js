import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { bookReducer as reducer } from "../../reducers/bookingReducer";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import { IoMdOpen } from "react-icons/io";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import ArrayView from "../listView/ArrayView";

export default function Bookings() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [status, setStatus] = useState("all");
  const [hireAgreement, setHireAgreement] = useState("all");
  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [productList, setProductList] = useState({});
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [
    { loading, error, bookings, bookingCount, filteredBookingCount },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const showModelHandler = (ls) => {
    console.log("product_list", ls);
    setProductList(ls);
    setModalShow(true);
  };

  const deleteBooking = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this booking?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(
          `/api/admin/delete-booking/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        setDel(false);
      } catch (error) {
        console.log(error);
        // toast.error(getError(error), {
        //   position: toast.POSITION.BOTTOM_CENTER,
        // });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get(
          `/api/admin/all-booking/?status=${status}&hireAgreement=${hireAgreement}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          {
            headers: { Authorization: token },
          }
        );
        // console.log("bookings", res.data);
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error,
        });
        toast.error(error, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, del, curPage, resultPerPage, status, hireAgreement]);

  const numOfPages = Math.ceil(filteredBookingCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);

  const getDateTime = (dt) => {
    if (!dt) return;
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {/* {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? ( */}
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <h3>Bookings</h3>
              <div className="bookings-header-root">
                <div className="float-end d-flex align-items-center">
                  <p className="p-bold m-0 me-3 filter-title">
                    Filter by Status
                  </p>
                  <Form.Group controlId="status">
                    <Form.Select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setCurPage(1);
                      }}
                      aria-label="Default select example"
                    >
                      <option value="all">All</option>
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="float-end d-flex align-items-center">
                  <p className="p-bold m-0 me-3 filter-title">
                    Filter by Hire Agreement Status
                  </p>
                  <Form.Group controlId="status">
                    <Form.Select
                      value={hireAgreement}
                      onChange={(e) => {
                        setHireAgreement(e.target.value);
                        setCurPage(1);
                      }}
                      aria-label="Default select example"
                    >
                      <option value="all">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Agreed">Agreed</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
              {/* <div className="search-box float-end">
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search by Booking Id"
                    type="search"
                    maxLength="6"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setQuery(searchInput);
                      setCurPage(1);
                    }}
                  >
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </div> */}
            </Card.Header>
            <Card.Body>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Hire Agreement</th>
                    <th>Car</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Pick-up Location</th>
                    <th>Drop-off Location</th>
                    <th>Person</th>
                    <th>Luggage</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={resultPerPage} column={13} />
                  ) : (
                    bookings &&
                    bookings.map((booking, i) => (
                      <tr key={booking?._id} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>{booking?.user?.name}</td>
                        <td
                          style={{
                            color:
                              booking?.status === "COMPLETED" ? "green" : "red",
                            fontWeight:
                              booking?.status === "COMPLETED" ? 600 : 500,
                          }}
                        >
                          {booking?.status}
                        </td>
                        <td
                          style={{
                            color:
                              booking?.hireAgreement === "Agreed"
                                ? "green"
                                : "red",
                            fontWeight:
                              booking?.hireAgreement === "Agreed" ? 600 : 500,
                          }}
                        >
                          {booking?.hireAgreement}
                        </td>

                        <td className="text-center">
                          <IoMdOpen
                            className="open-model"
                            onClick={() => showModelHandler(booking?.car)}
                          />
                        </td>
                        <td>{getDateTime(booking?.startDate)}</td>
                        <td>{getDateTime(booking?.endDate)}</td>
                        <td>{booking?.pickupLocation}</td>
                        <td>{booking?.dropofLocation}</td>
                        <td>{booking?.person}</td>
                        <td>{booking?.luggage}</td>
                        <td>{"$" + booking?.totalPrice?.toFixed(2)}</td>

                        <td>
                          <Button
                            onClick={() => {
                              navigate(`/admin/view/booking/${booking?._id}`);
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteBooking(booking?._id);
                            }}
                            type="danger"
                            className="btn btn-danger ms-2"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <div className="float-start d-flex align-items-center mt-3">
                <p className="p-bold m-0 me-3">Row No.</p>
                <Form.Group controlId="resultPerPage">
                  <Form.Select
                    value={resultPerPage}
                    onChange={(e) => {
                      setResultPerPage(e.target.value);
                      setCurPage(1);
                    }}
                    aria-label="Default select example"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {resultPerPage < filteredBookingCount && (
                <CustomPagination
                  pages={numOfPages}
                  pageHandler={curPageHandler}
                  curPage={curPage}
                />
              )}
            </Card.Footer>
          </Card>
        )}

        {productList && modalShow ? (
          <ArrayView
            show={modalShow}
            onHide={() => setModalShow(false)}
            arr={productList}
          />
        ) : (
          <></>
        )}

        <ToastContainer />
      </Container>
    </motion.div>
  );
}
