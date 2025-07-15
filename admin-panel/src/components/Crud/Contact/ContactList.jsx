import React, { useEffect } from 'react';
import {
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CButton,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, deleteContact } from '../ContactSlice';
import { Trash2 } from 'lucide-react';

const ContactList = () => {
  const dispatch = useDispatch();
  const { contacts, loading } = useSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this message?');
    if (confirm) {
      dispatch(deleteContact(id));
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <h2>📨 Contact Messages</h2>
        <CTable className="table table-bordered mt-3">
          <CTableHead>
            <CTableRow>
              <CTableDataCell>#</CTableDataCell>
              <CTableDataCell>Name</CTableDataCell>
              <CTableDataCell>Email</CTableDataCell>
              <CTableDataCell>Message</CTableDataCell>
              <CTableDataCell>Date</CTableDataCell>
              <CTableDataCell>Action</CTableDataCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan={6}>Loading...</CTableDataCell>
              </CTableRow>
            ) : contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <CTableRow key={contact._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{contact.name}</CTableDataCell>
                  <CTableDataCell>{contact.email}</CTableDataCell>
                  <CTableDataCell>{contact.message}</CTableDataCell>
                  <CTableDataCell>{new Date(contact.createdAt).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="danger" size="sm" onClick={() => handleDelete(contact._id)}>
                      <Trash2 size={16} /> Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={6}>No contact messages found.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  );
};

export default ContactList;
