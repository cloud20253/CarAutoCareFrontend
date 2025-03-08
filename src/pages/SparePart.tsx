import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "Services/apiService";

interface SparePartType {
  sparePartId: string;
  partName: string;
  manufacturer: string;
  price: number;
  photo?: string[];
}

function SparePart() {
  const [spareParts, setSpareParts] = useState<SparePartType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  let userRole: string = "";
  const storedDecodedToken = localStorage.getItem("userData");
  if (storedDecodedToken) {
    const parsedToken = JSON.parse(storedDecodedToken);
    userRole = parsedToken.authorities[0];
  }

  // Fetch all spare parts or filtered results based on searchQuery
  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = "";

      if (searchQuery.trim() !== "") {
        url = `/Filter/searchBarFilter?searchBarInput=${encodeURIComponent(searchQuery)}`;
      } else {
        url = "/sparePartManagement/getAll";
      }

      const response = await apiClient.get(url);
      console.log("API Response:", response.data);

      if (searchQuery.trim() !== "") {
        if (response.data && Array.isArray(response.data.list)) {
          setSpareParts(response.data.list);
        } else {
          setError("Invalid data format from API");
          setSpareParts([]);
        }
      } else {
        if (Array.isArray(response.data)) {
          setSpareParts(response.data);
        } else {
          setError("Invalid data format from API");
          setSpareParts([]);
        }
      }
    } catch (err) {
      console.error("Error fetching spare parts:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchSpareParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatically reset the page when search box is cleared
  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchSpareParts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handle search button click
  const handleSearch = () => {
    fetchSpareParts();
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Spare Parts
      </h1>

      {/* Filter Input Section with wider input, highlighting effect, and Enter key trigger */}
      <div className="flex justify-center mb-8">
        <div className="flex focus-within:ring-2 focus-within:ring-red-300 rounded-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              console.log("Key pressed:", e.key, e.keyCode);
              if (e.key === "Enter" || e.keyCode === 13) {
                handleSearch();
              }
            }}
            placeholder="Search spare parts..."
            className="w-80 border border-gray-300 p-2 rounded-l-lg focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-red-500 to-black text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition"
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchSpareParts}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {spareParts.length > 0 ? (
            spareParts.map((sparePart, index) => (
              <div
                key={sparePart.sparePartId || `spare-part-${index}`}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  if (sparePart.sparePartId && userRole) {
                    console.log("Navigating to:", sparePart.sparePartId);
                    navigate(`/spare-part/${sparePart.sparePartId}`);
                  } else {
                    navigate("/signIn");
                  }
                }}
              >
                <div className="h-48 bg-gray-100 flex justify-center items-center relative">
                  {sparePart.photo && sparePart.photo.length > 0 ? (
                    <img
                      src={`data:image/jpeg;base64,${sparePart.photo[0]}`}
                      alt={sparePart.partName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image Load Error:", e);
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                  ) : (
                    <img
                      src="/placeholder.jpg"
                      alt="Placeholder"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {sparePart.partName}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Manufacturer: {sparePart.manufacturer}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Price: ₹{sparePart.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No spare parts available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SparePart;
