import React, { useState, ChangeEvent, FormEvent } from "react";
import apiClient from "Services/apiService";
import {
  FaExchangeAlt,  
  FaUser,         
  FaCar,          
  FaBarcode,      
  FaRegListAlt,   
  FaMoneyBillWave,
} from "react-icons/fa";

interface CreateTransaction {
  transactionType: "CREDIT" | "DEBIT";
  userId?: number;
  vehicleRegId?: number;
  partNumber: string;
  quantity: number;
  billNo?: string;
}

const TransactionAdd: React.FC = () => {
  const [createData, setCreateData] = useState<CreateTransaction>({
    transactionType: "CREDIT",
    userId: undefined,
    vehicleRegId: undefined,
    partNumber: "",
    quantity: 1,
    billNo: "",
  });

  const handleCreateChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCreateData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/sparePartTransactions/add", createData);
      alert(response.data.message || "Transaction created successfully");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create transaction");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Transaction</h1>

      <form onSubmit={handleCreateSubmit} className="space-y-6">
        {/* Transaction Type */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <FaExchangeAlt className="inline-block mr-2 text-blue-600" />
            Transaction Type:
          </label>
          <select
            name="transactionType"
            value={createData.transactionType}
            onChange={handleCreateChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
          >
            <option value="CREDIT">CREDIT</option>
            <option value="DEBIT">DEBIT</option>
          </select>
        </div>

        {/* User ID */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <FaUser className="inline-block mr-2 text-blue-600" />
            User ID:
          </label>
          <input
            type="number"
            name="userId"
            value={createData.userId || ""}
            onChange={handleCreateChange}
            placeholder="Enter User ID"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        {/* Vehicle Reg ID (for DEBIT) */}
        {createData.transactionType === "DEBIT" && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <FaCar className="inline-block mr-2 text-blue-600" />
              Vehicle Reg ID:
            </label>
            <input
              type="number"
              name="vehicleRegId"
              value={createData.vehicleRegId || ""}
              onChange={handleCreateChange}
              placeholder="Enter Vehicle Reg ID"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
            />
          </div>
        )}

        {/* Part Number */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <FaBarcode className="inline-block mr-2 text-blue-600" />
            Part Number:
          </label>
          <input
            type="text"
            name="partNumber"
            value={createData.partNumber}
            onChange={handleCreateChange}
            placeholder="Enter Part Number"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <FaRegListAlt className="inline-block mr-2 text-blue-600" />
            Quantity:
          </label>
          <input
            type="number"
            name="quantity"
            value={createData.quantity}
            onChange={handleCreateChange}
            min="1"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        {/* Bill Number (for CREDIT) */}
        {createData.transactionType === "CREDIT" && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <FaMoneyBillWave className="inline-block mr-2 text-blue-600" />
              Bill Number:
            </label>
            <input
              type="text"
              name="billNo"
              value={createData.billNo}
              onChange={handleCreateChange}
              placeholder="Enter Bill Number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Create Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionAdd;
