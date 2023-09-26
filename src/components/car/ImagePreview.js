import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import ImageUploading from "react-images-uploading";

const ImagePreview = ({
  product_images,
  maxNumber,
  uploadFileHandler,
  onRemoveAllImages,
  onRemoveSingleImage,
}) => {
  return (
    <>
      <ImageUploading
        multiple
        value={product_images}
        onChange={uploadFileHandler}
        // onChange={onChange}
        maxNumber={maxNumber}
        // dataURLKey="data_url"
        acceptType={["jpg", "png", "jpeg"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <Button
              variant="success"
              className="mb-4 mx-2"
              style={isDragging ? { color: "red" } : undefined}
              onClick={(e) => {
                e.preventDefault();
                onImageUpload();
              }}
              {...dragProps}
            >
              Choose files
            </Button>
            &nbsp;
            <Button
              className="mb-4"
              variant="danger"
              onClick={(e) => {
                e.preventDefault();
                // onImageRemoveAll();
                onRemoveAllImages();
              }}
            >
              Remove all images
            </Button>
            <Row className="align-items-end">
              {imageList?.map((image, index) => (
                <Col lg={"4"} md={"6"} key={index} className="image-item my-3">
                  <img src={image} alt="" width="200" className="mb-3" />
                  {/* <img src={image["data_url"]} alt="" width="100" /> */}
                  <div className="image-item__btn-wrapper">
                    <Button
                      variant="success"
                      className="mx-2"
                      onClick={(e) => {
                        e.preventDefault();
                        onImageUpdate(index);
                        // console.log(index);
                        // uploadUpdateFileHandler(imageList, index);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      className="mx-2"
                      onClick={(e) => {
                        e.preventDefault();
                        // onImageRemove(index);
                        onRemoveSingleImage(index);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </ImageUploading>
    </>
  );
};

export default ImagePreview;
