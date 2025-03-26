import React, { useState, useEffect } from "react";
import apiClient from "Services/apiService"; // Custom axios instance with baseURL
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePrinter } from "react-icons/ai";

interface InvoiceItem {
  id: number;
  quantity: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  invDate: string;
  totalAmount: number;
  items: InvoiceItem[];
}

function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    apiClient
      .get("/api/invoices/getAll")
      .then((response) => {
        setInvoices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  }, []);

  const filteredInvoices = invoices.filter((invoice) =>
    searchTerm
      ? invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="container my-4">
      {/* Card-like container for the content */}
      <div className="p-3 bg-body-tertiary rounded shadow">
        {/* Header & Search Row */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">List Counter Sale</h2>
          <div style={{ maxWidth: "250px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Invoice No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped align-middle">
            {/* Table Head (dark theme-friendly) */}
            <thead className="table-dark">
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "20%" }}>Invoice No.</th>
                <th style={{ width: "20%" }}>Date</th>
                <th style={{ width: "20%" }}>Quantity</th>
                <th style={{ width: "20%" }}>Total</th>
                <th style={{ width: "15%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice, index) => {
                  // Calculate total quantity
                  const totalQuantity = invoice.items.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  );

                  return (
                    <tr key={invoice.id}>
                      <td>{index + 1}</td>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.invDate || "—"}</td>
                      <td>{totalQuantity}</td>
                      <td>{invoice.totalAmount.toFixed(2)}</td>
                      <td>
                        <button className="btn btn-outline-primary btn-sm me-2">
                          <AiOutlineEdit size={18} />
                        </button>
                        <button className="btn btn-outline-danger btn-sm me-2">
                          <AiOutlineDelete size={18} />
                        </button>
                        <button className="btn btn-outline-secondary btn-sm">
                          <AiOutlinePrinter size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InvoiceList;
