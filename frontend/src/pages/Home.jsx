import React, { useEffect, useState } from 'react';
import  './css/home.css'; // Import CSS file for styling
import { BACKEND_URL } from '../config.jsX';

const CRMPage = () => {
    const [customers, setCustomers] = useState([
        { id: 1, name: 'John Doe', company: 'ABC Company', email: 'john.doe@example.com', phone: '123-456-7890', interaction: 'Meeting on 2024-02-28', status: 'Hot', isEditing: false },
        { id: 2, name: 'Jane Smith', company: 'XYZ Corporation', email: 'jane.smith@example.com', phone: '987-654-3210', interaction: 'Email exchange on 2024-02-27', status: 'Cold', isEditing: false },
        // Add more customer data as needed
    ]);

    useEffect(()=>{
      function fetchData(){
        fetch(`${BACKEND_URL}/fetch`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          setCustomers(data)
          // Process the data as needed
          console.log(customers)
      })
      .catch(error => {
          console.error('Error fetching data:', error);
          // Handle errors gracefully
      });
      }

      fetchData();
    },[])

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
    };
    const handleDelete = (id) => {
        const updatedCustomers = customers.filter(e=>e.id!=id)
        setCustomers(updatedCustomers);
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
            <h2 style={{
              textAlign:'center',
            }}>CRM Page</h2>
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
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td>
                                {customer.isEditing ? (
                                    <input
                                        type="text"
                                        value={customer.name}
                                        onChange={(e) => handleChange(customer.id, 'name', e.target.value)}
                                    />
                                ) : (
                                    customer.name
                                )}
                            </td>
                            <td>
                                {customer.isEditing ? (
                                    <input
                                        type="text"
                                        value={customer.company}
                                        onChange={(e) => handleChange(customer.id, 'company', e.target.value)}
                                    />
                                ) : (
                                    customer.company
                                )}
                            </td>
                            <td>
                                {customer.isEditing ? (
                                    <input
                                        type="text"
                                        value={customer.email}
                                        onChange={(e) => handleChange(customer.id, 'email', e.target.value)}
                                    />
                                ) : (
                                    customer.email
                                )}
                            </td>
                            <td>
                                {customer.isEditing ? (
                                    <input
                                        type="text"
                                        value={customer.phone}
                                        onChange={(e) => handleChange(customer.id, 'phone', e.target.value)}
                                    />
                                ) : (
                                    customer.phone
                                )}
                            </td>
                            <td>
                                {customer.isEditing ? (
                                    <input
                                        type="text"
                                        value={customer.interaction}
                                        onChange={(e) => handleChange(customer.id, 'interaction', e.target.value)}
                                    />
                                ) : (
                                    customer.interaction
                                )}
                            </td>
                            <td>
                                {customer.isEditing ? (
                                    <input
                                        type="text"
                                        value={customer.status}
                                        onChange={(e) => handleChange(customer.id, 'status', e.target.value)}
                                    />
                                ) : (
                                    customer.status
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CRMPage;
