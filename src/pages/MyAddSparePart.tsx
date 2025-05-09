import React, { useState } from "react";
import {
  UploadCloud,
  X,
  ArrowLeft,
  Package,
  Factory,
  Tag,
  Hash,
  Info,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "Services/apiService";
import axios from "axios";

interface FormData {
  partName: string;
  description: string;
  manufacturer: string;
  price: string;
  partNumber: string;
  sGST: string;
  cGST: string;
  totalGST: string;
  buyingPrice: string;
}

interface ApiError {
  isAxiosError?: boolean;
  response?: {
    data?: {
      message?: string;
      exception?: string;
    };
  };
  message?: string;
}

function MyAddSparePart() {
  const [formData, setFormData] = useState<FormData>({
    partName: "",
    description: "",
    manufacturer: "",
    price: "",
    partNumber: "",
    sGST: "",
    cGST: "",
    totalGST: "",
    buyingPrice: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(false);

    if (photos.length === 0) {
      setUploadError(true);
      toast.error("Please upload at least one photo of the spare part.");
      return;
    }

    if (!Object.values(formData).every((field) => field.trim())) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      photos.forEach((photo) => formPayload.append("photos", photo));

      await apiClient.post("/sparePartManagement/addPart", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Spare part added successfully!");
      setFormData({
        partName: "",
        description: "",
        manufacturer: "",
        price: "",
        partNumber: "",
        sGST: "",
        cGST: "",
        totalGST: "",
        buyingPrice: "",
      });
      setPhotos([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Submission error:", error);
      let errorMessage = "Failed to add spare part. Please try again.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.exception ||
          error.response?.data?.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setUploadError(false);
    }
    setPhotos((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <ToastContainer />

      <header className="p-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </header>

      <div className="flex-grow flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-5xl border border-gray-100">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center flex items-center justify-center gap-2">
            <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600" />
            Add New Spare Part
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                  <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Part Name
                </label>
                <input
                  type="text"
                  name="partName"
                  value={formData.partName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Brake Pad Set"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                  <Factory className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Bosch"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                  <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Selling Price (INR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter selling price"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                  <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Part Number
                </label>
                <input
                  type="text"
                  name="partNumber"
                  value={formData.partNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., BP-2023-XL"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  SGST (%)
                </label>
                <input
                  type="number"
                  name="sGST"
                  value={formData.sGST}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 9"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  CGST (%)
                </label>
                <input
                  type="number"
                  name="cGST"
                  value={formData.cGST}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 9"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Total GST (%)
                </label>
                <input
                  type="number"
                  name="totalGST"
                  value={formData.totalGST}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 18"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                  <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Buying Price (INR)
                </label>
                <input
                  type="number"
                  name="buyingPrice"
                  value={formData.buyingPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter buying price"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Detailed description of the spare part..."
                required
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="flex items-center text-gray-700 text-sm sm:text-base font-medium gap-2">
                <UploadCloud className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Product Photos
                <span className="text-xs sm:text-sm text-gray-500">(Required)</span>
              </label>

              <div
                className={`border-2 border-dashed ${
                  uploadError
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-blue-400"
                } rounded-xl p-4 sm:p-6 text-center transition-all cursor-pointer group`}
                onClick={() => document.getElementById("fileUpload")?.click()}
              >
                <UploadCloud
                  className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-2 sm:mb-4 ${
                    uploadError
                      ? "text-red-500"
                      : "text-gray-400 group-hover:text-blue-500"
                  }`}
                />
                <p
                  className={`${
                    uploadError ? "text-red-600" : "text-gray-600"
                  } mb-1 sm:mb-2 text-sm sm:text-base`}
                >
                  {uploadError
                    ? "Please upload at least one photo"
                    : "Click or drag to upload images"}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Supported formats: JPG, PNG (max 5MB each)
                </p>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  id="fileUpload"
                  multiple
                  accept="image/jpeg, image/png"
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-white/90 p-1 sm:p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3.5 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Part...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  Add Spare Part
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyAddSparePart;
