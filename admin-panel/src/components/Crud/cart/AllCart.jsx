import React, { useEffect } from 'react';
import {
  CButton,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCarts, deleteCartItem } from '../CartSlice';
import Swal from 'sweetalert2';

const CartList = () => {
  const dispatch = useDispatch();
  const { cartItems, loading } = useSelector((state) => state.cartItems);

  useEffect(() => {
    dispatch(fetchAllCarts());
  }, [dispatch]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this item from cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCartItem(id));
        Swal.fire('Deleted!', 'Cart item has been deleted.', 'success');
      }
    });
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1>All Cart Items</h1>
          <CTable className="table table-bordered mt-3">
            <CTableHead>
              <CTableRow>
                <CTableDataCell>S.No</CTableDataCell>
                <CTableDataCell>User</CTableDataCell>
                <CTableDataCell>Product</CTableDataCell>
                <CTableDataCell>Image</CTableDataCell>
                <CTableDataCell>Quantity</CTableDataCell>
                <CTableDataCell>Price</CTableDataCell>
                <CTableDataCell>Action</CTableDataCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={7}>Loading...</CTableDataCell>
                </CTableRow>
              ) : cartItems?.length > 0 ? (
                cartItems?.map((item, index) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{item?.user?.name || "Unknown"}</CTableDataCell>
                    <CTableDataCell>{item?.product?.productName}</CTableDataCell>
                    <CTableDataCell>
                      <img
                        src={item?.product?.productImage}
                        alt={item?.product?.productName}
                        width={80}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{item.quantity}</CTableDataCell>
                    <CTableDataCell>${item?.product?.productPrice}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={7}>No cart items found.</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </>
  );
};

export default CartList;
