import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
// import { categoryReducer as reducer } from "../../reducers/category";
import { transactionReducer as reducer } from "../../reducers/transactionReducer";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";

export default function Transactions() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [
    {
      loading,
      error,
      transactions,
      transactionCount,
      filteredTransactionCount,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const deleteCategory = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this transaction?") ===
      true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(
          `/api/admin/delete-transaction/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        setDel(false);
      } catch (error) {
        toast.error("Transaction could not be deleted.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get(
          `/api/admin/all-transaction/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          {
            headers: { Authorization: token },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error,
        });
        toast.error("Server error. Please try again later.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, del, curPage, resultPerPage, query]);

  const numOfPages = Math.ceil(filteredTransactionCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h3>Transactions</h3>
                <div className="search-box float-end">
                  <InputGroup>
                    <Form.Control
                      aria-label="Search Input"
                      placeholder="Search using Transaction Id"
                      type="search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <InputGroup.Text
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setQuery(searchInput);
                        setCurPage(1);
                      }}
                    >
                      <FaSearch />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User's Name</th>
                    <th>Transaction Status</th>
                    <th>Transaction Id</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={resultPerPage} column={6} />
                  ) : (
                    transactions &&
                    transactions?.map((transaction, i) => (
                      <tr key={transaction?._id} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>{transaction?.user?.name}</td>
                        <td
                          style={{
                            color:
                              transaction?.status === "COMPLETED"
                                ? "green"
                                : "red",
                            fontWeight:
                              transaction?.status === "COMPLETED" ? 600 : 500,
                          }}
                        >
                          {transaction?.status}
                        </td>
                        <td>{transaction?.transactionId}</td>
                        <td>{"$" + transaction?.amount?.toFixed(2)}</td>
                        <td>
                          <Button
                            onClick={() => {
                              navigate(
                                `/admin/view/transaction/${transaction?._id}`
                              );
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteCategory(transaction?._id);
                            }}
                            type="danger"
                            className="btn btn-danger ms-2"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <div className="float-start d-flex align-items-center mt-3">
                <p className="p-bold m-0 me-3">Number of rows displayed: </p>
                <Form.Group controlId="resultPerPage">
                  <Form.Select
                    value={resultPerPage}
                    onChange={(e) => {
                      setResultPerPage(e.target.value);
                      setCurPage(1);
                    }}
                    aria-label="Default select example"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {resultPerPage < filteredTransactionCount && (
                <CustomPagination
                  pages={numOfPages}
                  pageHandler={curPageHandler}
                  curPage={curPage}
                />
              )}
            </Card.Footer>
          </Card>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
