import React, { useEffect } from 'react';
import {
  CButton,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../OrderSlice';
import { toast } from 'react-toastify';

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, updateStatusLoading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
      // Re-fetch all orders to ensure the list is up-to-date
      dispatch(fetchAllOrders());
    } catch (err) {
      console.error("Failed to update order status:", err);
      toast.error(`Failed to update order status: ${err.message || 'Server error'}`);
    }
  };

  // --- START MODIFICATION ---
  // Filter out orders that are 'Delivered'
  const currentOrders = orders.filter(order => order.status !== 'Delivered');
  // --- END MODIFICATION ---

  return (
    <CRow>
      <CCol xs={12}>
        <h2>📦 Current Orders</h2> {/* Changed title to reflect the filtered view */}
        <CTable className="table table-bordered mt-3" responsive striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Order ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">User</CTableHeaderCell>
              <CTableHeaderCell scope="col">Items</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Change Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan={7}>Loading...</CTableDataCell>
              </CTableRow>
            ) : error ? (
                <CTableRow>
                    <CTableDataCell colSpan={7} className="text-danger">Error: {error}</CTableDataCell>
                </CTableRow>
            ) : currentOrders.length > 0 ? (
              currentOrders.map((order, index) => ( 
                <CTableRow key={order._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{order._id}</CTableDataCell>
                  <CTableDataCell>{order.user?.name || "Unknown"}</CTableDataCell>
                  <CTableDataCell>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="mb-1">
                        {item.productId?.productName || 'N/A'} (x{item.quantity})<br />
                      </div>
                    ))}
                  </CTableDataCell>
                  <CTableDataCell>₹{order.totalPrice.toFixed(2)}</CTableDataCell>
                  <CTableDataCell>
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        order.status === 'Return Requested' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'Return Approved' ? 'bg-indigo-100 text-indigo-700' :
                        order.status === 'Return Rejected' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'}
                    `}>
                      {order.status}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updateStatusLoading}
                    >
                      {/* Note: 'Delivered' option can still be here as a target status if an order transitions to it */}
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Return Requested">Return Requested</option>
                      <option value="Return Approved">Return Approved</option>
                      <option value="Return Rejected">Return Rejected</option>
                    </CFormSelect>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={7}>No current orders found.</CTableDataCell> {/* Updated message */}
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  );
};

export default OrderList;