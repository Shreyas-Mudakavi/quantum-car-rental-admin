import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewTransactionReducer as reducer } from "../../reducers/transactionReducer";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row, Table, Button } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import CustomSkeleton from "../layout/CustomSkeleton";
import { FaEye } from "react-icons/fa";

const ViewTransaction = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // category/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, transaction }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-transaction/${id}`,
          {
            headers: { Authorization: token },
          }
        );

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err,
        });
        toast.error("Server error. Please try again later.", {
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
                  {loading ? (
                    <Skeleton />
                  ) : (
                    transaction?.user?.name + " Transaction Details"
                  )}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col>
                    <Row>
                      <Col md={5}>
                        <p className="mb-0">
                          <strong>Transaction Id</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction?.transactionId}
                        </p>
                      </Col>
                      <Col md={5}>
                        <p className="mb-0">
                          <strong>Amount</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            "$" + transaction?.amount?.toFixed(2)
                          )}
                        </p>
                      </Col>
                      <Col md={5}>
                        <p className="mb-0">
                          <strong>Status</strong>
                        </p>
                        <p
                          style={{
                            fontWeight: 700,
                            color:
                              transaction?.status === "COMPLETED"
                                ? "green"
                                : "red",
                          }}
                        >
                          {loading ? <Skeleton /> : transaction?.status}
                        </p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(transaction?.createdAt)
                          )}
                        </p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Last Update</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(transaction?.updatedAt)
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {transaction?.user && (
                  <>
                    <h4 className="my-3 mt-2">User Details</h4>
                    <Row className="mb-3">
                      <Table responsive striped bordered hover>
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <CustomSkeleton resultPerPage={1} column={6} />
                          ) : (
                            <tr className="odd">
                              <td className="text-center">{1}</td>
                              <td>{transaction?.user?.name}</td>
                              <td>{transaction?.user?.email}</td>
                              <td>{transaction?.user?.phone}</td>
                              <td>{transaction?.user?.role}</td>
                              <td>
                                <Button
                                  onClick={() => {
                                    navigate(
                                      `/admin/view/user/${transaction?.user?._id}`
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

                {transaction?.booking && (
                  <>
                    <h4 className="my-3 mt-3">Booking Details</h4>
                    <Row className="mb-3">
                      <Table responsive striped bordered hover>
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Status</th>
                            <th>Hire Agreement</th>
                            <th>Total Amount</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Pick-up Location</th>
                            <th>Drop-off Location</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <CustomSkeleton resultPerPage={1} column={9} />
                          ) : (
                            <tr className="odd">
                              <td className="text-center">{1}</td>
                              <td
                                style={{
                                  color:
                                    transaction?.booking?.status === "COMPLETED"
                                      ? "green"
                                      : "red",
                                  fontWeight:
                                    transaction?.booking?.status === "COMPLETED"
                                      ? 600
                                      : 500,
                                }}
                              >
                                {transaction?.booking?.status}
                              </td>
                              <td
                                style={{
                                  color:
                                    transaction?.booking?.hireAgreement ===
                                    "Agreed"
                                      ? "green"
                                      : "red",
                                  fontWeight:
                                    transaction?.booking?.hireAgreement ===
                                    "Agreed"
                                      ? 600
                                      : 500,
                                }}
                              >
                                {transaction?.booking?.hireAgreement}
                              </td>
                              <td>
                                {"$" +
                                  transaction?.booking?.totalPrice?.toFixed(2)}
                              </td>
                              <td>
                                {getDateTime(transaction?.booking?.startDate)}
                              </td>
                              <td>
                                {getDateTime(transaction?.booking?.endDate)}
                              </td>
                              <td>{transaction?.booking?.pickupLocation}</td>
                              <td>{transaction?.booking?.dropofLocation}</td>
                              <td>
                                <Button
                                  onClick={() => {
                                    navigate(
                                      `/admin/view/booking/${transaction?.booking?._id}`
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

export default ViewTransaction;
