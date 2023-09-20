import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewCarReducer as reducer } from "../../reducers/carReducer";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import EditCarModel from "./EditCar";

const ViewCar = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // product/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, car }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    car: [],
  });
  const [arrModalShow, setArrModalShow] = useState(false);
  const showModelHandler = () => {
    setArrModalShow(true);
  };

  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });

      const { data } = await axiosInstance.get(`/api/admin/findCar/${id}`, {
        headers: { Authorization: token },
      });

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

  useEffect(() => {
    fetchData();
    return () => {};
  }, [id]);

  const getDateTime = (dt) => {
    if (!dt) return;
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
                  {loading ? <Skeleton /> : car?.name + " Car Details"}
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={4}>
                    {loading ? (
                      <Skeleton height={200} />
                    ) : (
                      <img
                        src={car?.images[0]}
                        alt=""
                        className="img-fluid"
                        width={"200px"}
                        // height={"200px"}
                      />
                    )}
                  </Col>

                  <Col md={8}>
                    <Row>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Name</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.name}</p>
                      </Col>

                      <Col md={8}>
                        <p className="mb-0">
                          <strong>Description</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.details}</p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Brand</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.brand}</p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Model</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.model}</p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Price</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : "$" + car?.price + "/day"}
                        </p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>GPS</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.gps}</p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Automatic</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.automatic}</p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>No of seat(s)</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.noOfSeat}</p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Speed</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.speed}</p>
                      </Col>

                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : getDateTime(car?.createdAt)}
                        </p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Last Update</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : getDateTime(car?.updatedAt)}
                        </p>
                      </Col>
                    </Row>
                  </Col>

                  <Col className="my-3">
                    {loading ? (
                      <Skeleton height={200} />
                    ) : (
                      car?.features?.length > 0 && (
                        <>
                          <p>
                            <strong>Added features</strong>
                          </p>
                          <Table responsive striped bordered hover>
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Feature Name</th>
                                <th>Feature Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {car?.features &&
                                car?.features?.map((feature, i) => (
                                  <tr key={i} className="odd">
                                    <td className="text-center">{i + 1}</td>
                                    <td className="text-center">
                                      {feature?.name}
                                    </td>
                                    <td className="">
                                      <>{feature?.description}</>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </>
                      )
                    )}
                  </Col>

                  <Col className="my-3">
                    {loading ? (
                      <Skeleton height={200} />
                    ) : (
                      car?.benefits?.length > 0 && (
                        <>
                          <p>
                            <strong>Added benefits</strong>
                          </p>
                          <Table responsive striped bordered hover>
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Benefit Name</th>
                                <th>Benefit Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {car?.benefits &&
                                car?.benefits?.map((benefit, i) => (
                                  <tr key={i} className="odd">
                                    <td className="text-center">{i + 1}</td>
                                    <td className="text-center">
                                      {benefit?.name}
                                    </td>
                                    <td className="">
                                      <>{benefit?.description}</>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </>
                      )
                    )}
                  </Col>
                </Row>

                {/* add review */}
              </Card.Body>
            </Card>
            <EditCarModel
              show={modalShow}
              fetchData={fetchData}
              onHide={() => setModalShow(false)}
            />

            {!modalShow && <ToastContainer />}
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewCar;
