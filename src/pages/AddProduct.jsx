import React, { useEffect, useState } from 'react';
import { PuplicRequest } from '../utils/requestMethod.js';

function AddProduct() {
  const [activeForm, setActiveForm] = useState("product");

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');


  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await PuplicRequest.get('/category');
        setCategories(res.data.categories || res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    getCategories();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('price', price);
      formData.append('category', categoryId);
      if (imageFile) formData.append('image', imageFile);
      formData.append('description', description);

      const res = await PuplicRequest.post('/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Product added:', res.data);

      setProductName('');
      setPrice('');
      setCategoryId('');
      setImageFile(null);
      setDescription('');

    } catch (error) {
      console.error("Error adding product:", error);
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await PuplicRequest.post('/category', { name });
      console.log('Category added:', res.data);
      setName('');

      setCategories(prev => [...prev, res.data]);
      setCategoryId(res.data._id || res.data.id); 

      setActiveForm("product");

       window.location.reload();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  }


  const handleDeleteCategory = async (id) => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO DELETE THIS CATEGORY")) return;

    try {
      await PuplicRequest.delete(`/category/${id}`);
      setCategories(prev => prev.filter(cat => (cat._id || cat.id) !== id));

      if ((categoryId === id)) setCategoryId('');
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  return (
    <div className="container my-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">➕ Add Product / ADD Category</h2>

      <div className="d-flex justify-content-center mb-4 gap-3">
        <button
          className={`btn ${activeForm === "product" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveForm("product")}
        >
          Add Product
        </button>
        <button
          className={`btn ${activeForm === "category" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveForm("category")}
        >
          ADD Category
        </button>
      </div>

      {activeForm === "product" && (
        <form onSubmit={handleAddProduct}>
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">price (EGP)</label>
            <input
              type="number"
              className="form-control"
              placeholder="PRICE"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              required
            >
              <option value="">SELECT CATEGORY</option>
              {categories.map(cat => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">PRODUCT IMAGE</label>
            <input
              type="file"
              className="form-control"
              onChange={e => setImageFile(e.target.files[0])}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">DESCRIPTION</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">ADD PRODUCT</button>
        </form>
      )}

      {activeForm === "category" && (
        <>
          <form onSubmit={handleAddCategory}>
            <div className="mb-3">
              <label className="form-label">New Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Category"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              ADD Category
            </button>
          </form>

          <div className="mt-4">
            <h5>CATEGORY LIST</h5>
            <table className="text-light text-center table table-bordered">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center text-light">لا توجد فئات</td>
                  </tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat._id || cat.id}>
                      <td className='text-center text-light'>{cat.name}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCategory(cat._id || cat.id)}
                        >
                          DELETED
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AddProduct;
