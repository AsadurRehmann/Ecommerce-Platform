
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Add missing import
import { fetchProductDetails } from "@/redux/slices/productsSlice";
import { updateProduct } from "@/redux/slices/adminSlice"; // Use adminSlice for admin operations

function EditProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Fix: Use the correct state structure
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const { loading: adminLoading, error: adminError } = useSelector(
    (state) => state.admin
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      // Fix: Pass the id to fetchProductDetails
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct && selectedProduct._id === id) {
      setProductData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        countInStock: selectedProduct.countInStock || "",
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        sizes: selectedProduct.sizes || [],
        colors: selectedProduct.colors || [],
        collections: selectedProduct.collections || "",
        material: selectedProduct.material || "",
        gender: selectedProduct.gender || "",
        images: selectedProduct.images || [],
      });
    }
  }, [selectedProduct, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData(); 
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error("Image upload error:", error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fix: Use admin updateProduct and ensure productData is properly formatted
    dispatch(updateProduct({ productId: id, productData }))
      .unwrap()
      .then(() => {
        navigate("/admin/products");
      })
      .catch((error) => {
        console.error("Update failed:", error);
      });
  };

  // Fix: Show loading state properly
  if (loading) return <div className="p-6 text-center">Loading product details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (adminError) return <div className="p-6 text-red-500">Update Error: {adminError}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(",")}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
          />
        </div>

        {/* Add missing fields */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Material</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            className="w-full rounded-md border p-2 border-gray-300"
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="bg-gray-500"
            disabled={uploading}
          />
          {uploading && <p className="text-blue-500 mt-2">Uploading image...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className={`w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-colors ${
            adminLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={adminLoading}
        >
          {adminLoading ? "Updating Product..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}

export default EditProductPage;
