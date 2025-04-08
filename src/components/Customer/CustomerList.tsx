import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "Services/apiService";

interface Customer {
  email: string;
  firstName: string;
  lastName?: string;
  mobileNumber: number;
  address: string;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await apiClient.get("/user/getAllUsers");
      setCustomers(response.data.list); // Use 'list' from response
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleDelete = async (email: string) => {
    try {
      await apiClient.delete(`/customers/${email}`);
      setCustomers((prev) => prev.filter((c) => c.email !== email));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const Button: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
  > = ({ children, className, ...props }) => (
    <button
      className={`px-3 py-1 rounded text-white shadow ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full p-6">
      <div className="flex justify-center mb-2">
        <h2 className="text-2xl font-semibold">Customer List</h2>
      </div>

      <div className="mb-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          onClick={() => navigate("/admin/AddCustomer")}
        >
          <Plus size={16} /> Add New Customer
        </Button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4 border">Sr.No</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">Mobile</th>
              <th className="py-2 px-4 border">Aadhar No.</th>
              <th className="py-2 px-4 border">GSTIN</th>
              <th className="py-2 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <tr key={index} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">
                    {customer.firstName} {customer.lastName || ""}
                  </td>
                  <td className="py-2 px-4 border">{customer.address}</td>
                  <td className="py-2 px-4 border">{customer.mobileNumber}</td>
                  <td className="py-2 px-4 border">-</td>
                  <td className="py-2 px-4 border">-</td>
                  <td className="py-2 px-4 border flex justify-center gap-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => console.log("Edit", customer.email)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleDelete(customer.email)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
