import { api, readImage } from '../../lib/api';
import React, { useState } from "react";
import NavigationBar from "../../components/ui/NavigationBar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ImageUpload from "./components/ImageUpload";

const PropertyUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    totalTokens: "",
    propertyType: null,
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    yearBuilt: "",
    images: [],
    lat: null,
    lng: null,
  });
  const [accessToken, setAccessToken] = useState('');
  const [uploadKey, setUploadKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const propertyTypes = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "land", label: "Land" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For Select component (propertyType)
  const handlePropertyTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, propertyType: value }));
  };

  const validateForm = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.price ||
      !formData.totalTokens ||
      !formData.propertyType
    ) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (formData.images.length === 0) {
      setError("Please upload at least one property image.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setSuccess(false);
    try {
      const images = await Promise.all(formData.images.map(readImage));
      await api('/properties', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + accessToken }, body: JSON.stringify({ ...formData, images }) });
      setSuccess(true);
      setFormData({ title: '', description: '', location: '', price: '', totalTokens: '', propertyType: '', bedrooms: '', bathrooms: '', squareFootage: '', yearBuilt: '', images: [], lat: null, lng: null });
      setUploadKey(k => k + 1);
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col py-4">
        <div className="w-full px-8">
          <div className="flex flex-row items-center justify-between mt-4 mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm text-left ml-8">
                List Your Property
              </h1>
              <p className="text-lg text-muted-foreground mb-2 text-left ml-8">
                Submit your property to tokenize and offer it for investment
              </p>
            </div>
            <div className="flex flex-row items-center space-x-8 mr-8">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-primary">3</span>
                <span className="text-sm text-muted-foreground">Listed</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-600">
                  ₹{(1.2 * 1000000 * 83).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  Total Value
                </span>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200 mb-8 w-full ml-8" />
        </div>
        <div className="w-full max-w-7xl mx-auto px-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-center font-semibold">
              Property saved successfully and awaiting review. It is now visible in the asset browser.
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-center font-semibold">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Listing access token" type="password" value={accessToken} onChange={e => setAccessToken(e.target.value)} required description="Use the access token configured by the local server administrator." />
            <div>
              <label className="block text-sm font-medium mb-2">
                Property Title
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter property title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                rows="4"
                placeholder="Describe your property"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Property Type
              </label>
              <Select
                name="propertyType"
                value={formData.propertyType}
                onChange={handlePropertyTypeChange}
                options={propertyTypes}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (INR)
                </label>
                <Input
                  type="number"
                  name="price"
                  min="0.01" step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price in INR"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Tokens
                </label>
                <Input
                  type="number"
                  name="totalTokens"
                  min="1" step="1"
                  value={formData.totalTokens}
                  onChange={handleInputChange}
                  placeholder="Number of tokens"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Property location (address or area)"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bedrooms
                </label>
                <Input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="Number of bedrooms"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bathrooms
                </label>
                <Input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="Number of bathrooms"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Square Footage
                </label>
                <Input
                  type="number"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  placeholder="Total square footage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Year Built
                </label>
                <Input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  placeholder="Year built"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Property Images <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                key={uploadKey}
                onImagesSelected={(files) =>
                  setFormData((prev) => ({ ...prev, images: files }))
                }
              />
              <p className="text-xs text-gray-400 mt-1">
                You can upload multiple images. First image will be used as the
                cover.
              </p>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                className="px-8 py-3 text-base font-semibold shadow-md bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white rounded-lg transition-all duration-200"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Property"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PropertyUpload;
