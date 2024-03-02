import React, { useState, useEffect } from 'react';
import './css/home.css'; // Import CSS file for styling
import { BACKEND_URL } from '../config.jsX';

// Form component for adding entries
const AddEntryForm = ({ handleAddEntry }) => {
    const [formData, setFormData] = useState({
        Customer_Name: '',
        Company: '',
        Email: '',
        Phone_Number: '',
        Interaction_History: '',
        Lead_Status: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddEntry(formData);
        setFormData({
            Customer_Name: '',
            Company: '',
            Email: '',
            Phone_Number: '',
            Interaction_History: '',
            Lead_Status: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display:'flex'
        }}>
            <input type="text" name="Customer_Name" value={formData.Customer_Name} onChange={handleChange} placeholder="Customer Name" />
            <input type="text" name="Company" value={formData.Company} onChange={handleChange} placeholder="Company" />
            <input type="text" name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" />
            <input type="text" name="Phone_Number" value={formData.Phone_Number} onChange={handleChange} placeholder="Phone Number" />
            <input type="text" name="Interaction_History" value={formData.Interaction_History} onChange={handleChange} placeholder="Interaction History" />
            <input type="text" name="Lead_Status" value={formData.Lead_Status} onChange={handleChange} placeholder="Lead Status" />
            <button className='save-btn' type="submit">Add Entry</button>
        </form>
    );
};

const AdminHome = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch(`${BACKEND_URL}/fetch`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => {
            if (res.status==201) {
                return []
            }else if(res.status==200){
                return res.json();
            }
        })
        .then(data => {
            setCustomers(data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle errors gracefully
        });
    };

    const handleAddEntry = (formData) => {
        fetch(`${BACKEND_URL}/insert`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add entry');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response
            console.log(data);
            alert('Entry added successfully!');
            // Fetch data again to refresh the table
            fetchData();
        })
        .catch(error => {
            console.error('Error adding entry:', error);
            // Handle errors gracefully
            alert('Failed to add entry!');
        });
    };

    const handleEdit = (id) => {
        const updatedCustomers = customers.map(customer => {
            if (customer.id === id) {
                return { ...customer, isEditing: true };
            }
            return customer;
        });
        setCustomers(updatedCustomers);
    };

    const handleSave = (id) => {
        const updatedCustomers = customers.map(customer => {
            if (customer.id === id) {
                return { ...customer, isEditing: false };
            }
            return customer;
        });
        setCustomers(updatedCustomers);
    
        // Make fetch request to save changes
        const data = updatedCustomers.find(customer => customer.id === id);
        delete data.isEditing;
        fetch(`${BACKEND_URL}/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return 
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response
            console.log(data);
            alert('Changes saved successfully!');
        })
        .catch(error => {
            console.error('Error saving changes:', error);
            // Handle errors gracefully
            alert('Failed to save changes!');
        });
    };
    
    const handleDelete = (id) => {
        const updatedCustomers = customers.filter(e => e.id !== id);
        setCustomers(updatedCustomers);
    
        // Make fetch request to delete
        fetch(`${BACKEND_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response
            console.log(data);
            alert('Customer deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting customer:', error);
            // Handle errors gracefully
            alert('Failed to delete customer!');
        });
    };
    

    const handleChange = (id, field, value) => {
        const updatedCustomers = customers.map(customer => {
            if (customer.id === id) {
                return { ...customer, [field]: value };
            }
            return customer;
        });
        setCustomers(updatedCustomers);
    };

    return (
        <div className="crm-container">
            <h2 style={{ textAlign: 'center' }}>CRM Page</h2>
            <AddEntryForm handleAddEntry={handleAddEntry} />
            <table className="crm-table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Interaction History</th>
                        <th>Lead Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !customers
                        ?
                        <></>
                        :
                        customers.map(customer => (
                            <tr key={customer.id}>
                                <td>
                                    {customer.isEditing ? (
                                        <input
                                            type="text"
                                            value={customer.Customer_Name}
                                            onChange={(e) => handleChange(customer.id, 'Customer_Name', e.target.value)}
                                        />
                                    ) : (
                                        customer.Customer_Name
                                    )}
                                </td>
                                <td>
                                    {customer.isEditing ? (
                                        <input
                                            type="text"
                                            value={customer.Company}
                                            onChange={(e) => handleChange(customer.id, 'Company', e.target.value)}
                                        />
                                    ) : (
                                        customer.Company
                                    )}
                                </td>
                                <td>
                                    {customer.isEditing ? (
                                        <input
                                            type="text"
                                            value={customer.Email}
                                            onChange={(e) => handleChange(customer.id, 'Email', e.target.value)}
                                        />
                                    ) : (
                                        customer.Email
                                    )}
                                </td>
                                <td>
                                    {customer.isEditing ? (
                                        <input
                                            type="text"
                                            value={customer.Phone_Number}
                                            onChange={(e) => handleChange(customer.id, 'Phone_Number', e.target.value)}
                                        />
                                    ) : (
                                        customer.Phone_Number
                                    )}
                                </td>
                                <td>
                                    {customer.isEditing ? (
                                        <input
                                            type="text"
                                            value={customer.Interaction_History}
                                            onChange={(e) => handleChange(customer.id, 'Interaction_History', e.target.value)}
                                        />
                                    ) : (
                                        customer.Interaction_History
                                    )}
                                </td>
                                <td>
                                    {customer.isEditing ? (
                                        <input
                                            type="text"
                                            value={customer.Lead_Status}
                                            onChange={(e) => handleChange(customer.id, 'Lead_Status', e.target.value)}
                                        />
                                    ) : (
                                        customer.Lead_Status
                                    )}
                                </td>
                                <td>
                                        <>
                                            {customer.isEditing ? (
                                                <button className="save-btn" onClick={() => handleSave(customer.id)}>Save</button>
                                            ) : (
                                                <button className="edit-btn" onClick={() => handleEdit(customer.id)}>Edit</button>
                                            )}
                                            <button className="delete-btn" onClick={() => handleDelete(customer.id)}>Delete</button>
                                        </>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AdminHome;
