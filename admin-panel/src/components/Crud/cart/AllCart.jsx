import React, { useEffect } from 'react';
import {
  CButton,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CFormSelect
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../OrderSlice';

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };
console.log(orders)

  return (
    <CRow>
      <CCol xs={12}>
        <h2>📦 All Orders</h2>
        <CTable className="table table-bordered mt-3">
          <CTableHead>
            <CTableRow>
              <CTableDataCell>#</CTableDataCell>
              <CTableDataCell>User</CTableDataCell>
              <CTableDataCell>Items</CTableDataCell>
              <CTableDataCell>Total</CTableDataCell>
              <CTableDataCell>Status</CTableDataCell>
              <CTableDataCell>Change Status</CTableDataCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan={6}>Loading...</CTableDataCell>
              </CTableRow>
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <CTableRow key={order._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{order.user?.name || "Unknown"}</CTableDataCell>
                  <CTableDataCell>
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.productId?.productName} (x{item.quantity})<br />
                      </div>
                    ))}
                  </CTableDataCell>
                  <CTableDataCell>₹{order.totalPrice}</CTableDataCell>
                  <CTableDataCell>{order.status}</CTableDataCell>
                  <CTableDataCell>
                  <CFormSelect
  value={order.status}
  onChange={(e) => handleStatusChange(order._id, e.target.value)}
>
  <option value="Processing">Processing</option>
  <option value="Shipped">Shipped</option>
  <option value="Out for delivery">Out for delivery</option> {/* ✅ added */}
  <option value="Delivered">Delivered</option>
</CFormSelect>

                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={6}>No orders found.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  );
};

export default OrderList;
