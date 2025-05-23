import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PuplicRequest } from '../utils/requestMethod.js';
import { toast } from 'react-toastify';
import AuthService from '../utils/AuthService.js';

function MenuPage() {
    const isAdmin = AuthService.isAdmin();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [order, setOrder] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await PuplicRequest.get("/category");
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) {
          setSelectedCategory(res.data.categories[0].name);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const getItems = async () => {
      try {
        const res = await PuplicRequest.get("/product");
        setItems(res.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    getCategories();
    getItems();
  }, []);

  // ✅ التعديل هنا: حذف منتج باستخدام id
  const handleDeleted = async (id) => {
    try {
      const res = await PuplicRequest.delete(`/product/${id}`);
      console.log(res);
      toast.success("تم حذف المنتج بنجاح");

      // حذف المنتج من الواجهة بدون إعادة تحميل الصفحة
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      toast.error("فشل في حذف المنتج");
      console.error("خطأ أثناء الحذف:", err);
    }
  }

  const selectedItems = items.filter(item => item.category.name === selectedCategory);

  const addToOrder = (item) => {
    setOrder([...order, item]);
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", color: "#343a40" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-4">📜 Menu</h2>
        <Link to="/add-product">
          <button className={`btn btn-success ${isAdmin ? "" : "hide-for-non-admin"}`}>➕ Add Product / ADD Category</button>
        </Link>
      </div>

      <div className="d-flex justify-content-center mb-4 flex-wrap">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`btn mx-2 mb-2 ${selectedCategory === category.name ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="row">
        {selectedItems.length === 0 ? (
          <div className="text-center text-muted w-100">Not Found Product in this category</div>
        ) : (
          selectedItems.map((item) => (
            <div key={item._id} className="col-md-4 mb-4">
              <div className="card shadow-sm" style={{ border: "none" }}>
                <img
                  src={`${item.image}`}
                  alt={item.name}
                  className="card-img-top mx-auto d-block"
                  style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
                />

                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.price} ج.م</p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/product/${item._id}`}>
                      <button className="btn btn-primary btn-sm ">DETAILS</button>
                    </Link>

                    <button onClick={() => handleDeleted(item._id)} className={`${isAdmin ? "" : "hide-for-non-admin"} btn btn-danger btn-sm`}>DELETE</button>

                    <Link to={`/update-product/${item._id}`}>
                      <button className={`${isAdmin ? "" : "hide-for-non-admin"} btn btn-warning btn-sm`} onClick={() => addToOrder(item)}>
                        UPDate PRODUCT
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MenuPage;
