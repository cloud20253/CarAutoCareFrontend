const InvoiceForm = () => {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        {/* Search Bar */}
        <div className="mb-6 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Invoice Table */}
        <div className="mx-auto bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[1200px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border text-center" colSpan={14}>
                  Service Invoice
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th className="p-2 border">#</th>
                <th className="p-2 border">SxNo</th>
                <th className="p-2 border">Service No</th>
                <th className="p-2 border" colSpan={2}>Service Name</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Rate</th>
                <th className="p-2 border">Discount</th>
                <th className="p-2 border" colSpan={2}>Taxable</th>
                <th className="p-2 border" colSpan={2}>COST</th>
                <th className="p-2 border" colSpan={2}>SGST</th>
                <th className="p-2 border">Total</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="p-2 border"></th>
                <th className="p-2 border"></th>
                <th className="p-2 border"></th>
                <th className="p-2 border" colSpan={2}></th>
                <th className="p-2 border"></th>
                <th className="p-2 border"></th>
                <th className="p-2 border"></th>
                <th className="p-2 border">%</th>
                <th className="p-2 border">Amt</th>
                <th className="p-2 border">%</th>
                <th className="p-2 border">Amt</th>
                <th className="p-2 border">%</th>
                <th className="p-2 border">Amt</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
  
            {/* Empty Table Body */}
            <tbody>
              {/* Empty Row 1 */}
              <tr>
                <td className="p-2 border text-center">
                  <input type="checkbox" className="form-checkbox" />
                </td>
                {[...Array(13)].map((_, i) => (
                  <td key={i} className="p-2 border text-center">-</td>
                ))}
              </tr>
  
              {/* Empty Row 2 */}
              <tr>
                <td className="p-2 border text-center">
                  <input type="checkbox" className="form-checkbox" />
                </td>
                {[...Array(13)].map((_, i) => (
                  <td key={i} className="p-2 border text-center">-</td>
                ))}
              </tr>
            </tbody>
  
            {/* Grand Total */}
            <tfoot>
              <tr>
                <td className="p-2 border text-right" colSpan={13}>
                  Grand Total:
                </td>
                <td className="p-2 border text-right font-semibold">0.00</td>
              </tr>
              <tr>
                <td className="p-4 text-right" colSpan={14}>
                  <button className="px-6 py-2 mr-2 text-white bg-red-500 rounded hover:bg-red-600">
                    Remove
                  </button>
                  <button className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Save
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };
  
  export default InvoiceForm;