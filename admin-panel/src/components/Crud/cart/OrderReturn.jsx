import React, { useEffect, useState } from 'react';
import {
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell, // Corrected from CTableDataCell for head
  CTableRow,
  CFormSelect,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../CartSlice'; // Assuming this slice is in your Redux store
import { toast } from 'react-toastify'; // Import toast for notifications

const OrderReturn = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders); // Also get error state
  const [returnOrders, setReturnOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    // Filter orders with "Return Requested" status whenever 'orders' changes
    if (orders && orders.length > 0) {
      const filtered = orders.filter(order => order.status === "Return Requested");
      setReturnOrders(filtered);
    } else {
      setReturnOrders([]); // Clear if no orders or orders array is empty
    }
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap(); // .unwrap() to handle promises
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
      // Re-fetch all orders to ensure the list is up-to-date
      dispatch(fetchAllOrders());
    } catch (err) {
      console.error("Failed to update order status:", err);
      toast.error(`Failed to update order status: ${err.message || 'Server error'}`);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>↩️ Return Requested Orders</h2>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <p>Loading return requests...</p>
            ) : error ? (
              <p className="text-danger">Error: {error}</p>
            ) : returnOrders.length === 0 ? (
              <p>No return requests found.</p>
            ) : (
              <CTable responsive striped hover className="mt-3">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Order ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">User</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Items</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Requested On</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Current Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {returnOrders.map((order, index) => (
                    <CTableRow key={order._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{order._id}</CTableDataCell>
                      <CTableDataCell>{order.user?.name || "Unknown"}</CTableDataCell>
                      <CTableDataCell>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="mb-1">
                            {item.productId?.productName || 'N/A'} (x{item.quantity}) - ₹{item.price}
                            {item.size && ` | Size: ${item.size}`}
                            {item.material && ` | Material: ${item.material}`}
                          </div>
                        ))}
                      </CTableDataCell>
                      <CTableDataCell>₹{order.totalPrice.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{new Date(order.createdAt).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold
                          ${order.status === 'Return Requested' ? 'bg-yellow-100 text-yellow-700' : ''}
                        `}>
                          {order.status}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormSelect
                          value={order.status} // Display current status
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          {/* Only allow relevant status changes for a return request */}
                          <option value="Return Requested">Return Requested</option> {/* Current status, often disabled or not selectable in real apps */}
                          <option value="Return Approved">Approve Return</option>
                          <option value="Return Rejected">Reject Return</option>
                          {/* Optionally, you might allow setting back to 'Processing' or 'Delivered'
                              if there was an error in initial request, but typically not for returns.
                              For simplicity, we only allow 'Approved' or 'Rejected'
                          */}
                        </CFormSelect>
                        {/* Optionally, add a button to confirm the change if you don't want auto-change on select */}
                        {/* <CButton
                            color="primary"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleUpdateStatusClick(order._id, someNewStatus)}
                        >Update</CButton> */}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default OrderReturn;