import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { transactionReducer as reducer } from "../../reducers/transactionReducer";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

const ViewTransaction = () => {
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
        console.log(data);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err,
        });
        toast.error("Internal server error!", {
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

                {/* <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div> */}
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={8}>
                    <Row>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>amount</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : transaction.amount}</p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>status</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : transaction.status}</p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Transaction Id</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.transactionId}
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
                            getDateTime(transaction.createdAt)
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
                            getDateTime(transaction.updatedAt)
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
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
