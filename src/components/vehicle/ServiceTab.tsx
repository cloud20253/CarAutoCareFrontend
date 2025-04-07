import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from 'Services/apiService';

interface Service {
  serviceId: number;
  serviceName: string;
  serviceRate: number | null;
  totalGst: number;
}

interface InvoiceService extends Service {
  quantity: number;
  taxable: number;
  total: number | null;
  vehicleServicesUsedId?: number;
  newService?: boolean;
}

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ServiceTab = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  console.log('Vehicle ID:', vehicleId);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [services, setServices] = useState<InvoiceService[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedSearchQuery) {
      apiClient
        .get(`/services/search?serviceName=${debouncedSearchQuery}`)
        .then((res) => setSearchResults(res.data))
        .catch(console.error);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () =>
      document.removeEventListener('click', handleClickOutside, true);
  }, []);

  useEffect(() => {
    if (vehicleId) {
      apiClient
        .get(`/serviceUsed/getByVehicleId/${vehicleId}`)
        .then((res) => {
          const mapped: InvoiceService[] = res.data.map((item: any) => ({
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            serviceRate: item.rate, // might be null
            totalGst: item.cGST + item.sGST,
            quantity: item.quantity,
            taxable: item.rate * item.quantity,
            total: item.rate * item.quantity,
            newService: false,
            vehicleServicesUsedId: item.vehicleServicesUsedId,
          }));
          setServices((prev) => [
            ...mapped,
            ...prev.filter((s) => s.newService)
          ]);
        })
        .catch(console.error);
    }
  }, [vehicleId]);

  const addService = (service: Service) => {
    if (services.some((s) => s.serviceId === service.serviceId)) {
      setShowModal(true);
      return;
    }
    setServices((prev) => [
      ...prev,
      {
        ...service,
        quantity: 1,
        taxable: service.serviceRate ? service.serviceRate : 0,
        total: service.serviceRate ? service.serviceRate : 0,
        newService: true,
      }
    ]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.serviceId === id
          ? {
              ...service,
              quantity,
              taxable: (service.serviceRate ?? 0) * quantity,
              total: (service.serviceRate ?? 0) * quantity,
            }
          : service
      )
    );
  };

  const removeNewService = (serviceId: number) => {
    setServices((prev) =>
      prev.filter((service) => !(service.newService && service.serviceId === serviceId))
    );
  };

  const deleteUsedService = (vehicleServicesUsedId: number | undefined) => {
    if (!vehicleServicesUsedId) return;
    apiClient
      .delete(`/serviceUsed/delete/${vehicleServicesUsedId}`)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setServices((prev) =>
            prev.filter(
              (s) => s.vehicleServicesUsedId !== vehicleServicesUsedId
            )
          );
        } else {
          console.error('Failed to delete used service with id:', vehicleServicesUsedId);
        }
      })
      .catch(console.error);
  };

  const newServices = services.filter((s) => s.newService);
  const usedServices = services.filter((s) => !s.newService);

  const grandTotal = services.reduce((sum, service) => sum + (service.total ?? 0), 0);

  const saveInvoice = () => {
    if (!vehicleId) {
      console.error('Vehicle ID is missing');
      return;
    }
    Promise.all(
      newServices.map((service) =>
        apiClient.post('/serviceUsed/AddService', {
          serviceName: service.serviceName,
          quantity: service.quantity,
          rate: service.serviceRate,
          cGST: 0,
          sGST: 0,
          vehicleId: parseInt(vehicleId, 10),
          date: new Date().toISOString().slice(0, 10)
        })
      )
    )
      .then((responses) => {
        if (
          responses.every(
            (res) => res.status >= 200 && res.status < 300
          )
        ) {
          setServices((prev) =>
            prev.map((service) =>
              service.newService ? { ...service, newService: false } : service
            )
          );
          setShowSuccessModal(true);
        } else {
          console.error('One or more API calls failed.');
        }
      })
      .catch(console.error);
  };
  
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div
        className="mb-4 lg:mb-6 max-w-4xl mx-auto relative"
        ref={searchContainerRef}
      >
        <input
          type="text"
          placeholder="Search services..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {searchResults.map((service) => (
              <div
                key={service.serviceId}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm lg:text-base border-b last:border-b-0"
                onClick={() => addService(service)}
              >
                <div className="font-medium break-words">
                  {service.serviceName}
                </div>
                <div className="text-gray-500 text-xs">
                  Rate: ₹{(service.serviceRate ?? 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">New Services</h2>
        <div className="mx-auto bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[400px] md:min-w-[800px] lg:min-w-[1200px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-center" colSpan={10}>
                  <span className="text-sm lg:text-base">
                    New Service Invoice
                  </span>
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th className="p-1 lg:p-2 border">#</th>
                <th className="p-1 lg:p-2 border">Svc No</th>
                <th className="p-1 lg:p-2 border">Service Name</th>
                <th className="p-1 lg:p-2 border">Qty</th>
                <th className="p-1 lg:p-2 border">Rate</th>
                <th className="p-1 lg:p-2 border">Disc</th>
                <th className="p-1 lg:p-2 border">Tax</th>
                <th className="p-1 lg:p-2 border">SGST</th>
                <th className="p-1 lg:p-2 border">Total</th>
                <th className="p-1 lg:p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {newServices.length > 0 ? (
                newServices.map((service, index) => (
                  <tr key={`${service.serviceId}-new-${index}`} className="hover:bg-gray-50">
                    <td className="p-1 lg:p-2 border text-center">{index + 1}</td>
                    <td className="p-1 lg:p-2 border text-center">{service.serviceId}</td>
                    <td className="p-1 lg:p-2 border">
                      <span className="line-clamp-1 text-xs sm:text-sm">{service.serviceName}</span>
                    </td>
                    <td className="p-1 lg:p-2 border text-center">
                      <input
                        type="number"
                        min="1"
                        value={service.quantity}
                        onChange={(e) =>
                          updateQuantity(service.serviceId, Number(e.target.value))
                        }
                        className="w-12 text-center border rounded text-xs lg:text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-1 lg:p-2 border text-right whitespace-nowrap">
                      ₹{(service.serviceRate ?? 0).toFixed(2)}
                    </td>
                    <td className="p-1 lg:p-2 border text-right">0</td>
                    <td className="p-1 lg:p-2 border text-right">0.0</td>
                    <td className="p-1 lg:p-2 border text-right">0.00</td>
                    <td className="p-1 lg:p-2 border text-right whitespace-nowrap">
                      ₹{(service.total ?? 0).toFixed(2)}
                    </td>
                    <td className="p-1 lg:p-2 border text-center">
                      <button
                        onClick={() => removeNewService(service.serviceId)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-1 lg:p-2 border text-center" colSpan={10}>
                    No new services added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Used Services</h2>
        <div className="mx-auto bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[400px] md:min-w-[800px] lg:min-w-[1200px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-center" colSpan={10}>
                  <span className="text-sm lg:text-base">Used Service Invoice</span>
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th className="p-1 lg:p-2 border">#</th>
                <th className="p-1 lg:p-2 border">Svc No</th>
                <th className="p-1 lg:p-2 border">Service Name</th>
                <th className="p-1 lg:p-2 border">Qty</th>
                <th className="p-1 lg:p-2 border">Rate</th>
                <th className="p-1 lg:p-2 border">Disc</th>
                <th className="p-1 lg:p-2 border">Tax</th>
                <th className="p-1 lg:p-2 border">SGST</th>
                <th className="p-1 lg:p-2 border">Total</th>
                <th className="p-1 lg:p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {usedServices.length > 0 ? (
                usedServices.map((service, index) => (
                  <tr key={`${service.vehicleServicesUsedId}-used-${index}`} className="hover:bg-gray-50">
                    <td className="p-1 lg:p-2 border text-center">{index + 1}</td>
                    <td className="p-1 lg:p-2 border text-center">
                      {service.vehicleServicesUsedId || service.serviceId}
                    </td>
                    <td className="p-1 lg:p-2 border">
                      <span className="line-clamp-1 text-xs sm:text-sm">{service.serviceName}</span>
                    </td>
                    <td className="p-1 lg:p-2 border text-center">{service.quantity}</td>
                    <td className="p-1 lg:p-2 border text-right whitespace-nowrap">
                      ₹{(service.serviceRate ?? 0).toFixed(2)}
                    </td>
                    <td className="p-1 lg:p-2 border text-right">0</td>
                    <td className="p-1 lg:p-2 border text-right">0.0</td>
                    <td className="p-1 lg:p-2 border text-right">0.00</td>
                    <td className="p-1 lg:p-2 border text-right whitespace-nowrap">
                      ₹{(service.total ?? 0).toFixed(2)}
                    </td>
                    <td className="p-1 lg:p-2 border text-center">
                      <button
                        onClick={() => deleteUsedService(service.vehicleServicesUsedId)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-1 lg:p-2 border text-center" colSpan={10}>
                    No used services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="text-xl font-semibold">Grand Total: ₹{grandTotal.toFixed(2)}</div>
      </div>
      {newServices.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveInvoice}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Save Invoice
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-1/3 text-center">
            <h3 className="font-semibold text-xl">Service Already Added</h3>
            <p className="mt-2 text-sm">This service is already added to the invoice.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-1/3 text-center">
            <h3 className="font-semibold text-xl">Invoice Saved!</h3>
            <p className="mt-2 text-sm">Your invoice has been successfully saved.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTab;
