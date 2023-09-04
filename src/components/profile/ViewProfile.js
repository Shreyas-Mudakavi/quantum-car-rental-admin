import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
// import { getError } from "../../utils/error";
import { viewUserReducer as reducer } from "../../reducers/user";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import UpdateProfileModel from "./UpdateProfile";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

const ViewProfile = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const id = state.userInfo._id;
  console.log(id);
  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });

      const { data } = await axiosInstance.get(
        `/api/admin/user-profile/${id}`,
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
  useEffect(() => {
    fetchData();
  }, [token]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <Container fluid className="py-3">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Card>
            <Card.Header>
              <Card.Title>
                {loading ? <Skeleton /> : `${user.name} Profile`}
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
                    <strong>Name</strong>
                  </p>
                  <p>{user?.name}</p>
                </Col>

                <Col md={4}>
                  <p className="mb-0">
                    <strong>Email</strong>
                  </p>
                  <p>{user?.email}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Phone</strong>
                  </p>
                  <p>{user?.phone}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Address</strong>
                  </p>
                  <p>{user?.address}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Role</strong>
                  </p>
                  <p>{user?.role}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>{getDateTime(user?.createdAt)}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>{getDateTime(user?.updatedAt)}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <UpdateProfileModel
            show={modalShow}
            fetchData={fetchData}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </Container>
  );
};

export default ViewProfile;
