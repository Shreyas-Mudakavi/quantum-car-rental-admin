import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { uploadImage } from "../../utils/uploadImage";
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

export default function EditProductModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // product/:id

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const [product_images, setProductImage] = useState(null);
  const [values, setValues] = useState({
    name: "",
    price: "",
    details: "",
    noOfSeat: "",
    // image : "",
    model: "",
    speed: "",
    gps: "",
    automatic: "",
    brand: "",
  });

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
        toast.warning("Image size is too large. (max size 5MB)", {
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
      toast.error(error, {
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
    });
  };

  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axiosInstance.get(`/api/car/find-car/${id}`);
      carInitialize(data);
      setProductImage(data.car?.image);

      dispatch({ type: "FETCH_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err),
      });
      toast.error(getError(err), {
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

    const image = product_images;

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.patch(`/api/car/update-car/${id}`, {
        name,
        price,
        details,
        speed,
        gps,
        automatic,
        noOfSeat,
        model,
        brand,
        image,
      });
      console.log("updated-car", data);
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
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
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

        <Row>
          <Form.Group className="mb-3" controlId="product_image">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                uploadFileHandler(e);
              }}
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
