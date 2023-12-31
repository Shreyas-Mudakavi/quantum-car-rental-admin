import React from "react";
import { Modal, Button, Container, Table } from "react-bootstrap";

export default function ArrayView(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Car Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container
          className="small-container"
          style={{ backgroundColor: "#f4f6f9" }}
        >
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Model</th>
                <th>Price</th>
                <th>Speed</th>
                <th>Brand</th>
                <th>GPS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td className="text-center">{props?.arr?.name}</td>
                <td>{props?.arr?.model}</td>
                <td>{"$" + props?.arr?.price + " /Day"}</td>
                <td>{props?.arr?.speed}</td>
                <td>{props?.arr?.brand}</td>
                <td>{props?.arr?.gps}</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
