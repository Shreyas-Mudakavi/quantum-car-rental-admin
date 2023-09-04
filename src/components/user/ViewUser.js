import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewUserReducer as reducer } from "../../reducers/user";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import EditUserModel from "./EditUser.js";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/user/${id}`, {
          headers: { Authorization: token },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: "Server error!",
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
                  {loading ? <Skeleton /> : `${user.name}`} Details
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Firstname</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.name}</p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Email</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.email}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Phone</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.phone}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Address</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.address}</p>
                  </Col>
                  {user?.age && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Age</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : user?.age}</p>
                    </Col>
                  )}
                  {user?.city && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>City</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : user?.city}</p>
                    </Col>
                  )}
                  {user?.state && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>State</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : user?.state}</p>
                    </Col>
                  )}
                  {/* <Col md={4}>
                    <p className="mb-0">
                      <strong>Fax</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.fax}</p>
                  </Col> */}
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Role</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.role}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(user.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(user.updatedAt)}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <EditUserModel
              show={modalShow}
              onHide={() => setModalShow(false)}
            />

            {!modalShow && <ToastContainer />}
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewUser;
