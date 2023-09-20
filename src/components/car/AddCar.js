import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { uploadImage, uploadMultiImage } from "../../utils/uploadImage";
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
  Table,
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
    gps: "Yes",
    automatic: "Automatic",
    brand: "",
  });
  const [addCarValues, setAddCarValues] = useState({
    featureName: "",
    featureDesc: "",
    benefitsName: "",
    benefitsDesc: "",
  });
  const [features, setFeatures] = useState([]);
  const [benefits, setBenefits] = useState([]);

  const handleAddFeatures = () => {
    if (
      addCarValues?.featureName?.length <= 0 ||
      addCarValues?.featureDesc?.length <= 0
    ) {
      toast.error("Please add feature name and description!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      return;
    }
    setFeatures([
      ...features,
      {
        name: addCarValues?.featureName,
        description: addCarValues?.featureDesc,
      },
    ]);

    setAddCarValues({
      featureName: "",
      featureDesc: "",
      benefitsName: addCarValues?.benefitsName,
      benefitsDesc: addCarValues?.benefitsDesc,
    });
  };

  const handleAddBenefits = () => {
    if (
      addCarValues?.benefitsName?.length <= 0 ||
      addCarValues?.benefitsDesc?.length <= 0
    ) {
      toast.error("Please add benefit name and description!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      return;
    }
    setBenefits([
      ...benefits,
      {
        name: addCarValues?.benefitsName,
        description: addCarValues?.benefitsDesc,
      },
    ]);

    setAddCarValues({
      featureName: addCarValues?.featureName,
      featureDesc: addCarValues?.featureDesc,
      benefitsName: "",
      benefitsDesc: "",
    });
  };

  const resetForm = () => {
    setProductImage(null);
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
    setFeatures([]);
    setBenefits([]);
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
        const location = await uploadMultiImage(
          e.target.files,
          // e.target.files[0],
          token,
          uploadPercentageHandler
        );
        if (location.error) {
          throw location.error;
        }

        setProductImage([...location]);
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

  const handleAddCarValuesChange = (e) => {
    setAddCarValues({ ...addCarValues, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const {
      automatic,
      brand,
      details,
      gps,
      model,
      name,
      noOfSeat,
      price,
      speed,
    } = values;

    if (features?.length <= 0) {
      toast.warning("Please add atleast one feature(s)!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      return;
    }

    if (benefits?.length <= 0) {
      toast.warning("Please add atleast one benefit(s)!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      return;
    }

    if (!product_images) {
      toast.warning(
        "Please select one at least image for car or wait till image is uploaded.",
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
          features,
          benefits,
          product_images,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data.car) {
        // if (data.car) {
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
                          value={values?.name}
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
                          value={values?.price}
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
                          value={values?.model}
                          required
                          onChange={handleChange}
                          type="text"
                          // placeholder="model"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>No of seat(s)</Form.Label>
                        <Form.Control
                          name="noOfSeat"
                          value={values?.noOfSeat}
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
                          value={values?.gps}
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
                          value={values?.speed}
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
                        value={values?.automatic}
                        required
                        onChange={handleChange}
                        aria-label="Default select example"
                      >
                        <option>Open this select menu</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Non-Automatic">Non-Automatic</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                          name="brand"
                          value={values?.brand}
                          required
                          onChange={handleChange}
                          type="text"
                          // placeholder="brand"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h3>Features</h3>
                  <Row className="align-items-center mb-4">
                    <Col lg={3} md={3}>
                      <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          value={addCarValues?.featureName}
                          name="featureName"
                          onChange={handleAddCarValuesChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={5} md={5}>
                      <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          value={addCarValues?.featureDesc}
                          name="featureDesc"
                          onChange={handleAddCarValuesChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Button onClick={() => handleAddFeatures()}>
                        Add feature
                      </Button>
                    </Col>
                    {features?.length > 0 && (
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
                              <th>Delete Feature</th>
                            </tr>
                          </thead>
                          <tbody>
                            {features &&
                              features?.map((feature, i) => (
                                <tr key={i} className="odd">
                                  <td className="text-center">{i + 1}</td>
                                  <td className="text-center">
                                    {feature?.name}
                                  </td>
                                  <td className="">
                                    <>{feature?.description}</>
                                  </td>
                                  <td>
                                    <Button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const index = features.findIndex(
                                          (f) => f === feature
                                        );
                                        // console.log({ index });
                                        if (index > -1) {
                                          // only splice array when item is found

                                          setFeatures([
                                            ...features.slice(0, index),

                                            // part of the array after the given item
                                            ...features.slice(index + 1),
                                          ]);
                                        }
                                      }}
                                      type="danger"
                                      className="btn btn-danger btn-block"
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </>
                    )}
                  </Row>

                  <h3>Benefits</h3>
                  <Row className="align-items-center">
                    <Col lg={3} md={3}>
                      <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          value={addCarValues?.benefitsName}
                          name="benefitsName"
                          onChange={handleAddCarValuesChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={5} md={5}>
                      <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          value={addCarValues?.benefitsDesc}
                          name="benefitsDesc"
                          onChange={handleAddCarValuesChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Button onClick={() => handleAddBenefits()}>
                        Add Benefit
                      </Button>
                    </Col>
                    {benefits?.length > 0 && (
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
                              <th>Delete Feature</th>
                            </tr>
                          </thead>
                          <tbody>
                            {benefits &&
                              benefits?.map((benefit, i) => (
                                <tr key={i} className="odd">
                                  <td className="text-center">{i + 1}</td>
                                  <td className="">{benefit?.name}</td>
                                  <td className="">{benefit?.description}</td>
                                  <td>
                                    <Button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const index = benefits.findIndex(
                                          (bene) => bene === benefit
                                        );
                                        // console.log({ index });
                                        if (index > -1) {
                                          // only splice array when item is found

                                          setBenefits([
                                            ...benefits.slice(0, index),

                                            // part of the array after the given item
                                            ...benefits.slice(index + 1),
                                          ]);
                                        }
                                      }}
                                      type="danger"
                                      className="btn btn-danger btn-block"
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </>
                    )}
                  </Row>

                  <Row>
                    <Form.Group className="my-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        name="details"
                        value={values?.details}
                        as="textarea"
                        required
                        rows={3}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="my-3">
                      <Form.Label>Upload Images</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          uploadFileHandler(e);
                        }}
                        required
                        multiple
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
