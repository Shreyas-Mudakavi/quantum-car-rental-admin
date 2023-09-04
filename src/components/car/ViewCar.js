import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewCarReducer as reducer } from "../../reducers/carReducer";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import EditProductModel from "./EditCar.js";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

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

      const { data } = await axiosInstance.get(`/api/car/find-car/${id}`);

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: err,
      });
      toast.error(err, {
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
                        src={car.image}
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
                          {loading ? <Skeleton /> : "$" + car?.price + " / Day"}
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
                          <strong>No of seat</strong>
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
                </Row>

                {/* add review */}
              </Card.Body>
            </Card>
            <EditProductModel
              show={modalShow}
              fetchData={fetchData}
              onHide={() => setModalShow(false)}
            />
            {/*arrModalShow ? (
              <QuantityArray
                show={arrModalShow}
                onHide={() => setArrModalShow(false)}
                arr={product.subProducts}
                column={{"Quantity Type": "qname","Amount": "amount"}}
                title="Price List"
              />
            ) : (
              <></>
            )*/}
            {!modalShow && <ToastContainer />}
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewCar;
