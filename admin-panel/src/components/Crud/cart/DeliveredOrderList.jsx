import React, { useEffect, useState } from 'react';
import {
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../OrderSlice'; // Only need fetchAllOrders here

const DeliveredOrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    // Filter for 'Delivered' orders whenever 'orders' changes
    if (orders && orders.length > 0) {
      const filtered = orders.filter(order => order.status === 'Delivered');
      setDeliveredOrders(filtered);
    } else {
      setDeliveredOrders([]);
    }
  }, [orders]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>✅ Delivered Orders</h2>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <p>Loading delivered orders...</p>
            ) : error ? (
              <p className="text-danger">Error: {error}</p>
            ) : deliveredOrders.length === 0 ? (
              <p>No delivered orders found.</p>
            ) : (
              <CTable responsive striped hover className="mt-3">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Order ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">User</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Items</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Delivered On</CTableHeaderCell> {/* New column */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {deliveredOrders.map((order, index) => (
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
                        <span className="px-2 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                          {order.status}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(order.createdAt).toLocaleDateString()} {/* Assuming createdAt is sufficient for 'delivered on' or you have a dedicated deliveredDate field */}
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

export default DeliveredOrderList;