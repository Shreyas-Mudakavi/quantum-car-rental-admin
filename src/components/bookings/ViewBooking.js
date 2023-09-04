import React, { useEffect, useReducer, useContext } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewBookingReducer as reducer } from "../../reducers/bookingReducer";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row, Table, Button } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import { FaEye } from "react-icons/fa";

const ViewBooking = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();
  const navigate = useNavigate();

  const [{ loading, error, booking }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-booking/${id}`,
          {
            headers: { Authorization: token },
          }
        );
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
  }, [id]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : "Booking "} Details
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>User Name</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : booking?.user?.name}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>startDate</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(booking?.startDate)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>endDate</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(booking?.endDate)}
                    </p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Amount</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        "$" + booking?.totalPrice?.toFixed(2)
                      )}
                    </p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>pickup Location</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : booking?.pickupLocation}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>dropof Location</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : booking?.dropofLocation}</p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>person</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : booking?.person}</p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>luggage</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : booking?.luggage}</p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>status</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : booking?.status}</p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(booking?.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(booking?.updatedAt)}
                    </p>
                  </Col>
                </Row>

                {booking?.car && (
                  <>
                    <h4 className="my-3">Booked Car Details</h4>
                    <Row className="mb-3">
                      <Table responsive striped bordered hover>
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <CustomSkeleton resultPerPage={1} column={5} />
                          ) : (
                            <tr className="odd">
                              <td className="text-center">{1}</td>
                              <td>{booking?.car?.name}</td>
                              <td>{booking?.car?.brand}</td>
                              <td>{booking?.car?.model}</td>
                              <td>
                                <Button
                                  onClick={() => {
                                    navigate(
                                      `/admin/view/car/${booking?.car?._id}`
                                    );
                                  }}
                                  type="success"
                                  className="btn btn-primary"
                                >
                                  <FaEye />
                                </Button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>

            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewBooking;
