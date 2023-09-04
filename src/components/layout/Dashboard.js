import React, { useContext, useEffect, useReducer, useState } from "react";
import Chart from "react-google-charts";
import axiosInstance from "../../utils/axiosUtil";
import { Store } from "../../Store";
import { getError } from "../../utils/error";

import MessageBox from "./MessageBox";
import Skeleton from "react-loading-skeleton";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { IoIosPerson, IoIosPersonAdd, IoMdPie } from "react-icons/io";
import { GiNetworkBars } from "react-icons/gi";
import { FaArrowCircleRight } from "react-icons/fa";
import { motion } from "framer-motion";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });
  const { state } = useContext(Store);
  const { token } = state;
  const [time, setTime] = useState("weekly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axiosInstance.get(
          `/api/admin/statistics/${time}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, time]);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid>
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Row
              className="my-3 pb-2"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
            >
              <Col md={6}>
                <h3>Dashboard</h3>
              </Col>
              <Col md={6}>
                <div className="float-md-end d-flex align-items-center">
                  <p className="p-bold m-0 me-3">Statistics For</p>
                  <Form.Group controlId="time">
                    <Form.Select
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                      aria-label="Default select example"
                    >
                      <option key="blankChoice" hidden value>
                        Select Time
                      </option>
                      <option value="all">All Time Statistics</option>
                      <option value="daily">Daily Statistics</option>
                      <option value="weekly">Weekly Statistics</option>
                      <option value="monthly">Monthly Statistics</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>
                        {summary?.users && summary?.users[0]
                          ? summary?.users[0].total
                          : 0}
                      </h3>
                      <p>Users</p>
                    </div>
                    <div className="icon">
                      <IoIosPersonAdd />
                    </div>
                    <Link to="/admin/users" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>
              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>
                        {summary?.bookings && summary?.bookings[0]
                          ? summary?.bookings[0].total
                          : 0}
                        <sup style={{ fontSize: 20 }}></sup>
                      </h3>
                      <p>Bookings</p>
                    </div>
                    <div className="icon">
                      <IoIosPerson />
                    </div>
                    <Link to="/admin/bookings" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>
              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>
                        {summary?.payments && summary?.payments[0]
                          ? summary?.payments[0].total?.toFixed(2)
                          : 0}
                      </h3>
                      <p>Total Payment</p>
                    </div>
                    <div className="icon">
                      <GiNetworkBars />
                    </div>
                    <Link to="/admin/bookings" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>
              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>
                        {summary?.transactions && summary?.transactions[0]
                          ? summary?.transactions[0].total
                          : 0}
                      </h3>
                      <p>Transactions</p>
                    </div>
                    <div className="icon">
                      <IoIosPersonAdd />
                    </div>
                    <Link to="/admin/transactions" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>
            </Row>

            {/* <Row className="my-4">
              <Col sm={6}>
                <Card className="mb-3">
                  <Card.Header className="card-header-primary">
                    User
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <Skeleton count={5} height={30} />
                    ) : summary?.dailyUsers?.length === 0 ? (
                      <MessageBox>No Users Added</MessageBox>
                    ) : (
                      <Chart
                        width="100%"
                        height="400px"
                        chartType="AreaChart"
                        // loader={<div>Loading Users...</div>}
                        options={{
                          vAxis: {
                            title: "Count",
                            titleTextStyle: { color: "#1fd655" },
                          },

                          colors: ["#00ab41"],
                        }}
                        data={[
                          ["Date", "Count"],
                          ...summary?.dailyUsers.map((x) => [x._id, x.total]),
                        ]}
                      ></Chart>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6}>
                <Card className="mb-3">
                  <Card.Header className="card-header-primary">
                    Bookings
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <Skeleton count={5} height={30} />
                    ) : summary?.dailyBookings.length === 0 ? (
                      <MessageBox>No Bookings</MessageBox>
                    ) : (
                      <Chart
                        width="100%"
                        height="400px"
                        chartType="AreaChart"
                        // loader={<div>Loading Orders...</div>}
                        options={{
                          vAxis: {
                            title: "Count",
                            titleTextStyle: { color: "#1fd655" },
                          },

                          colors: ["#00c04b"],
                        }}
                        data={[
                          ["Date", "Count"],
                          ...summary?.dailyBookings?.map((x) => [
                            x._id,
                            x.total,
                          ]),
                        ]}
                      ></Chart>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6}>
                <Card className="mb-3">
                  <Card.Header className="card-header-primary">
                    Total Booking Amount
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <Skeleton count={5} height={30} />
                    ) : summary?.dailyPayments.length === 0 ? (
                      <MessageBox>No Payments Added</MessageBox>
                    ) : (
                      <Chart
                        width="100%"
                        height="400px"
                        chartType="AreaChart"
                        // loader={<div>Loading Payments...</div>}
                        options={{
                          vAxis: {
                            title: "Count",
                            titleTextStyle: { color: "#1fd655" },
                          },

                          colors: ["#90EE90"],
                        }}
                        data={[
                          ["Date", "Count"],
                          ...summary?.dailyPayments?.map((x) => [
                            x._id,
                            x.total,
                          ]),
                        ]}
                      ></Chart>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6}>
                <Card className="mb-3">
                  <Card.Header className="card-header-primary">
                    Total Transactions
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <Skeleton count={5} height={30} />
                    ) : summary?.dailyTransactions.length === 0 ? (
                      <MessageBox>No Transactions</MessageBox>
                    ) : (
                      <Chart
                        width="100%"
                        height="400px"
                        chartType="AreaChart"
                        // loader={<div>Loading Products...</div>}
                        options={{
                          vAxis: {
                            title: "Count",
                            titleTextStyle: { color: "#1fd655" },
                          },

                          colors: ["#90EE90"],
                          // title: "Subscriptions",
                        }}
                        data={[
                          ["Date", "Count"],
                          ...summary?.dailyTransactions?.map((x) => [
                            x._id,
                            x.total,
                          ]),
                        ]}
                      ></Chart>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row> */}

            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
}
