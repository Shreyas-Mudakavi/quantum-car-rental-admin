import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { uploadImage } from "../../utils/uploadImage";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ProgressBar,
  Row,
  Spinner,
} from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";
import { motion } from "framer-motion";

export default function AddCar() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [product_images, setProductImage] = useState(null);
  const [values, setValues] = useState({
    name: "",
    price: "",
    details: "",
    noOfSeat: "",
    model: "",
    speed: "",
    gps: "",
    automatic: "",
    brand: "",
  });

  const resetForm = () => {
    setProductImage("");
    setValues({
      name: "",
      price: "",
      details: "",
      noOfSeat: "",
      model: "",
      speed: "",
      gps: "",
      automatic: "",
      brand: "",
    });
  };

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const uploadFileHandler = async (e, type) => {
    if (!e.target.files[0]) {
      setProductImage(null);
      return;
    }

    for (let k in e.target.files) {
      if (e.target.files[k].size > 5000000) {
        toast.warning("One of the image size is too large. (max size 5MB)", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setProductImage(null);
        return;
      }
    }
    try {
      if (e.target.files[0]) {
        const location = await uploadImage(
          e.target.files[0],
          token,
          uploadPercentageHandler
        );
        if (location.error) {
          throw location.error;
        }

        setProductImage(location);
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);
      }
    } catch (error) {
      toast.error("File could not be uploaded.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const {
      name,
      price,
      details,
      speed,
      gps,
      automatic,
      noOfSeat,
      model,
      brand,
    } = values;

    if (!product_images) {
      toast.warning(
        "Please select one image for car or wait till image is uploaded.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
      return;
    }

    try {
      setLoadingUpdate(true);

      const { data } = await axiosInstance.post(
        "/api/admin/car/add-car",
        {
          name,
          price,
          details,
          speed,
          gps,
          automatic,
          noOfSeat,
          model,
          brand,
          product_images,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data.car) {
        toast.success("Car Added Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/cars");
          setLoadingUpdate(false);
        }, 3000);
      } else {
        toast.error(data?.error?.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setLoadingUpdate(false);
      }
    } catch (err) {
      setLoadingUpdate(false);
      toast.error("Server error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        exit={{ x: "100%" }}
      >
        <Container fluid>
          <Row
            className="mt-2 mb-3"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
          >
            <Col>
              <span style={{ fontSize: "xx-large" }}>Add Car</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Header as={"h4"}>Add Details</Card.Header>
                <Form onSubmit={submitHandler} className="p-3">
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          name="name"
                          required
                          onChange={handleChange}
                          type="text"
                          // placeholder="Honda"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          name="price"
                          required
                          onChange={handleChange}
                          type="number"
                          // placeholder="10000"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Model</Form.Label>
                        <Form.Control
                          name="model"
                          required
                          onChange={handleChange}
                          type="text"
                          // placeholder="model"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>No of seat</Form.Label>
                        <Form.Control
                          name="noOfSeat"
                          required
                          onChange={handleChange}
                          type="number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>GPS</Form.Label>
                        <Form.Select
                          name="gps"
                          required
                          onChange={handleChange}
                        >
                          <option value="">Open this select menu</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Speed</Form.Label>
                        <Form.Control
                          name="speed"
                          required
                          onChange={handleChange}
                          type="number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Label>Automatic</Form.Label>
                      <Form.Select
                        name="automatic"
                        required
                        onChange={handleChange}
                        aria-label="Default select example"
                      >
                        <option>Open this select menu</option>
                        <option value="automatic">automatic</option>
                        <option value="non-automatic">non-automatic</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                          name="brand"
                          required
                          onChange={handleChange}
                          type="text"
                          // placeholder="brand"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        name="details"
                        onChange={handleChange}
                        as="textarea"
                        required
                        rows={3}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Upload Images</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          uploadFileHandler(e);
                        }}
                        required
                      />
                      {uploadPercentage > 0 && (
                        <ProgressBar
                          now={uploadPercentage}
                          active="true"
                          label={`${uploadPercentage}%`}
                        />
                      )}
                    </Form.Group>
                  </Row>

                  <Row>
                    <Col style={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        type="submit"
                        disabled={loadingUpdate ? true : false}
                      >
                        {loadingUpdate ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </motion.div>

      <ToastContainer />
    </>
  );
}
