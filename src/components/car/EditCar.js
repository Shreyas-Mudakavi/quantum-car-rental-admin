import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { uploadImage, uploadMultiImage } from "../../utils/uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Modal,
  Form,
  Button,
  Container,
  ProgressBar,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

function getAllSubCategory(subCategories, categoryId) {
  if (!categoryId) return [];

  const subCategoryList = subCategories.filter((subCat) => {
    if (subCat.category) return subCat.category === categoryId;
  });
  return subCategoryList;
}

export default function EditCarModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // product/:id

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const [preview, setPreview] = useState("");
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
  const [featureVariant, setFeatureVariant] = useState([
    // {
    //   name: "",
    //   description: "",
    // },
  ]);
  const [benefitVariant, setBenefitVariant] = useState([
    {
      name: "",
      description: "",
    },
  ]);
  const [editCarValues, setEditCarValues] = useState({
    featureName: "",
    featureDesc: "",
    benefitsName: "",
    benefitsDesc: "",
  });

  const handleAddFeatures = () => {
    if (
      editCarValues?.featureName?.length <= 0 ||
      editCarValues?.featureDesc?.length <= 0
    ) {
      toast.error("Please add feature name and description!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      return;
    }
    setFeatureVariant([
      ...featureVariant,
      {
        name: editCarValues?.featureName,
        description: editCarValues?.featureDesc,
      },
    ]);

    setEditCarValues({
      featureName: "",
      featureDesc: "",
      benefitsName: editCarValues?.benefitsName,
      benefitsDesc: editCarValues?.benefitsDesc,
    });
  };

  const handleAddBenefits = () => {
    if (
      editCarValues?.benefitsName?.length <= 0 ||
      editCarValues?.benefitsDesc?.length <= 0
    ) {
      toast.error("Please add benefit name and description!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      return;
    }
    setBenefitVariant([
      ...benefitVariant,
      {
        name: editCarValues?.benefitsName,
        description: editCarValues?.benefitsDesc,
      },
    ]);

    setEditCarValues({
      featureName: editCarValues?.featureName,
      featureDesc: editCarValues?.featureDesc,
      benefitsName: "",
      benefitsDesc: "",
    });
  };

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

        setProductImage([...location, ...product_images]);
        // setProductImage([...location, product_images]);
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

  const carInitialize = (data) => {
    setValues({
      name: data?.car?.name,
      price: parseInt(data?.car?.price),
      details: data?.car?.details,
      noOfSeat: parseInt(data?.car?.noOfSeat),
      model: data?.car?.model,
      speed: parseInt(data?.car?.speed),
      gps: data?.car?.gps,
      automatic: data?.car?.automatic,
      brand: data?.car?.brand,
      features: data?.car?.features,
      benefits: data?.car?.benefits,
    });
  };

  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axiosInstance.get(`/api/admin/findCar/${id}`, {
        headers: { Authorization: token },
      });
      carInitialize(data);
      setProductImage(data.car?.images);
      setPreview(data.car?.images[0]);
      setFeatureVariant(data.car?.features);
      setBenefitVariant(data.car?.benefits);

      dispatch({ type: "FETCH_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err),
      });
      toast.error("Server error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!product_images) {
      toast.warning("Please choose a file.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

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

    const images = product_images;

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.patch(
        `/api/admin/updateCar/${id}`,
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
          images,
          features: featureVariant,
          benefits: benefitVariant,
        },
        {
          headers: { Authorization: token },
        }
      );
      // carInitialize(data);

      if (data.car) {
        toast.success("Car details Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // resetForm();
        setTimeout(() => {
          // navigate("/admin/cars");
          props.onHide();
          props.fetchData();
          dispatch({ type: "UPDATE_SUCCESS" });
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error("An error occured while updating the car.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleEditCarValuesChange = (e) => {
    setEditCarValues({ ...editCarValues, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Edit Car</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler} style={{ padding: "10px" }}>
        <img
          src={preview}
          alt=""
          width={""}
          height={"200px"}
          className="mb-3"
        />
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={values.name}
                onChange={handleChange}
                type="text"
                placeholder="Honda"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                value={values.price}
                onChange={handleChange}
                type="number"
                placeholder="10000"
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
                onChange={handleChange}
                type="text"
                placeholder="model"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>No of seat</Form.Label>
              <Form.Control
                name="noOfSeat"
                value={values?.noOfSeat}
                onChange={handleChange}
                type="number"
                placeholder="2"
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
                onChange={handleChange}
                type="number"
                placeholder="speed"
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
                value={values?.brand}
                onChange={handleChange}
                type="text"
                // placeholder="brand"
              />
            </Form.Group>
          </Col>
        </Row>

        <h4>Features</h4>
        <Row className="align-items-center">
          <Col lg={3} md={3}>
            <Form.Group className="mb-3" controlId="newFeature">
              <Form.Label>Feature Name</Form.Label>
              <Form.Control
                value={editCarValues?.featureName}
                type="text"
                name="featureName"
                onChange={handleEditCarValuesChange}
              />
            </Form.Group>
          </Col>
          <Col lg={5} md={5}>
            <Form.Group className="mb-3" controlId="newFeature">
              <Form.Label>Feature Description</Form.Label>
              <Form.Control
                value={editCarValues?.featureDesc}
                type="text"
                name="featureDesc"
                onChange={handleEditCarValuesChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Button className="mt-4" onClick={handleAddFeatures}>
              Add new feature
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          {featureVariant?.length > 0 && (
            <div className="table-responsive">
              <Table responsive striped bordered hover id="example1">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Feature Name</th>
                    <th>Feature Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {featureVariant.map((feature, i) => (
                    <tr key={featureVariant.findIndex((f) => f === feature)}>
                      <td className="text-center">{i + 1}</td>
                      <td>{feature?.name}</td>
                      <td>{feature?.description}</td>
                      <td>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            const index = featureVariant.findIndex(
                              (f) => f === feature
                            );
                            // console.log({ index });
                            if (index > -1) {
                              // only splice array when item is found

                              setFeatureVariant([
                                ...featureVariant.slice(0, index),

                                // part of the array after the given item
                                ...featureVariant.slice(index + 1),
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
            </div>
          )}
        </Row>

        <h4>Benefits</h4>
        <Row className="align-items-center">
          <Col lg={3} md={3}>
            <Form.Group className="mb-3" controlId="newFeature">
              <Form.Label>Benefit Name</Form.Label>
              <Form.Control
                value={editCarValues?.benefitsName}
                type="text"
                name="benefitsName"
                onChange={handleEditCarValuesChange}
              />
            </Form.Group>
          </Col>
          <Col lg={5} md={5}>
            <Form.Group className="mb-3" controlId="newFeature">
              <Form.Label>Benefit Description</Form.Label>
              <Form.Control
                value={editCarValues?.benefitsDesc}
                type="text"
                name="benefitsDesc"
                onChange={handleEditCarValuesChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Button className="mt-4" onClick={handleAddBenefits}>
              Add new benefit
            </Button>
          </Col>
        </Row>
        <Row>
          {benefitVariant?.length > 0 && (
            <div className="table-responsive">
              <Table id="example1" responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Benefit Name</th>
                    <th>Benefit Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {benefitVariant.map((bene, i) => (
                    <tr key={benefitVariant.findIndex((f) => f === bene)}>
                      <td className="text-center">{i + 1}</td>
                      <td>{bene?.name}</td>
                      <td>{bene?.description}</td>
                      <td>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            const index = benefitVariant.findIndex(
                              (f) => f === bene
                            );
                            // console.log({ index });
                            if (index > -1) {
                              // only splice array when item is found

                              setFeatureVariant([
                                ...benefitVariant.slice(0, index),

                                // part of the array after the given item
                                ...benefitVariant.slice(index + 1),
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
            </div>
          )}
        </Row>

        <Row>
          <Form.Group className="my-3" controlId="product_image">
            <Form.Label>Upload Images</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                uploadFileHandler(e);
              }}
              multiple
            />
            {uploadPercentage > 0 && (
              <ProgressBar
                now={uploadPercentage}
                active
                label={`${uploadPercentage}%`}
              />
            )}
          </Form.Group>
        </Row>

        <Row>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="details"
              value={values?.details}
              onChange={handleChange}
              as="textarea"
              rows={3}
            />
          </Form.Group>
        </Row>

        <ToastContainer />
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>

          <Button
            variant="success"
            type="submit"
            disabled={loadingUpdate ? true : false}
          >
            Submit
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
