import React, { useEffect, useReducer, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { locationReducer as reducer } from "../../reducers/locationiReducer";
import Col from "react-bootstrap/Col";
import { toast, ToastContainer } from "react-toastify";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Stack } from "react-bootstrap";
import Table from "react-bootstrap/Table";
// import Button from 'react-bootstrap/Button';
import "./AddLocation.css";
import axiosInstance from "../../utils/axiosUtil";
import { getError } from "../../utils/error";
import CustomSkeleton from "../layout/CustomSkeleton";
import { FaTrashAlt } from "react-icons/fa";
import { useContext } from "react";
import { Store } from "../../Store";

function AddLocation() {
  const { state } = useContext(Store);
  const { token } = state;
  const [{ loading, error, pickupLocations, dropOffLocations }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const [del, setDel] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropofLocation, setDropOfLocation] = useState("");

  const deleteLocation = async (name, type) => {
    if (
      window.confirm("Are you sure you want to delete this location?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(
          `/api/admin/delete-location/${name}?type=${type}`,
          {
            headers: { Authorization: token },
          }
        );
        setDel(false);
      } catch (error) {
        toast.error("Location could not be deleted.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  const fetchData = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axiosInstance.get("/api/admin/all-location", {
        headers: { Authorization: token },
      });

      dispatch({
        type: "FETCH_SUCCESS",
        pickupLocations: data.pickupLocations,
        dropOffLocations: data.dropOffLocations,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_FAIL",
        payload: "Something went wrong!",
      });
      toast.error("Server error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, del]);

  const pickUpSubmit = async () => {
    if (pickupLocation === "") {
      toast.error("Please enter Pick up location", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    try {
      const location = pickupLocation;
      const { data } = await axiosInstance.post(
        "/api/admin/add-location?type=pickup",
        { location },
        {
          headers: { Authorization: token },
        }
      );
      // setAdd(data);
      setPickupLocation("");
      await fetchData();
    } catch (error) {
      toast.error("Server error. Pick-up location could not be added.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const dropofSubmit = async () => {
    if (dropofLocation === "") {
      toast.error("Please enter Drop of location", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    try {
      const location = dropofLocation;
      const { data } = await axiosInstance.post(
        "/api/admin/add-location?type=dropoff",
        { location },
        {
          headers: { Authorization: token },
        }
      );
      setDropOfLocation("");
      await fetchData();
    } catch (error) {
      toast.error("Server error. Drop-off location could not be added.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <>
      <div className="location">
        {/* pick=up location */}
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h3>Pick-up Locations</h3>{" "}
              <div className="pickup-form">
                <span className="inp-bar">
                  <Form.Control
                    onChange={(e) => setPickupLocation(e.target.value)}
                    type="text"
                    value={pickupLocation}
                    placeholder="Enter pick-up location"
                  />
                </span>
                <span>
                  {" "}
                  <Button
                    className="add-btn"
                    variant="primary"
                    onClick={pickUpSubmit}
                  >
                    Add
                  </Button>
                </span>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="pickup-field">
              <div className="d-flex pd-20">
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th className="text-cnt">S.No</th>
                      <th className="text-cnt">Pickup Location</th>
                      <th className="text-cnt">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <CustomSkeleton resultPerPage={10} column={3} />
                    ) : (
                      pickupLocations?.map((element, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-cnt">{index + 1}</td>
                            <td className="text-cnt">{element}</td>
                            <td className="text-cnt">
                              <Button
                                onClick={() => {
                                  deleteLocation(element, "pickup");
                                }}
                                type="danger"
                                className="btn btn-danger ms-2"
                              >
                                <FaTrashAlt />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h3>Drop-off Locations</h3>{" "}
              <div className="pickup-form">
                <span className="inp-bar">
                  <Form.Control
                    type="text"
                    value={dropofLocation}
                    onChange={(e) => setDropOfLocation(e.target.value)}
                    placeholder="Enter drop-off location"
                  />
                </span>
                <span>
                  {" "}
                  <Button
                    className="add-btn"
                    onClick={dropofSubmit}
                    variant="primary"
                  >
                    Add
                  </Button>
                </span>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="dropof-field">
              <div className="d-flex pd-20">
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th className="text-cnt">S.No</th>
                      <th className="text-cnt">Dropof Location</th>
                      <th className="text-cnt">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <CustomSkeleton resultPerPage={10} column={3} />
                    ) : (
                      dropOffLocations?.map((element, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-cnt">{index + 1}</td>
                            <td className="text-cnt">{element}</td>
                            <td className="text-cnt">
                              <Button
                                onClick={() => {
                                  deleteLocation(element, "dropof");
                                }}
                                type="danger"
                                className="btn btn-danger ms-2"
                              >
                                <FaTrashAlt />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* drop-off location */}
      </div>

      <ToastContainer />
    </>
  );
}

export default AddLocation;
