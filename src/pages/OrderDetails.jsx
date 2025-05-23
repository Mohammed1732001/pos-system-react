
import React, { useEffect, useState } from "react";
import { PuplicRequest } from "../utils/requestMethod.js";
import { Link, useParams } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [tableId, setTableId] = useState([]);
  const [invoiceID, setInvoiceID] = useState();


  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await PuplicRequest.get(`/order/${id}`);


        setTableId(res.data.order.tableId._id)
        setOrder(res.data.order);
        if (res.data.order && Array.isArray(res.data.order.items)) {
          setOrderItems(res.data.order.items);
        }

      } catch (err) {
        console.error("خطأ أثناء جلب الطلب:", err);
      }
    };
    getOrder();
  }, [id]);

  useEffect(() => {
    const getInvoiceIDbyorder = async () => {
      try {
        const res = await PuplicRequest.get(`/invoice/order/${id}`);
        if (res.data && res.data.invoice && res.data.invoice._id) {
          setInvoiceID(res.data.invoice._id);
        } else {
          // لو ما فيش فاتورة
          setInvoiceID(null); // أو أي قيمة افتراضية تناسب حالتك
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setInvoiceID(null);
      }
    };

    if (id) {
      getInvoiceIDbyorder();
    }
  }, [id]);

  const handleDeleteCompletly = async (productId) => {
    try {
      await PuplicRequest.patch(`/order/${id}/remove-item-completely`, { productId });

      setOrderItems((prev) =>
        prev.filter(
          (item) =>
            item._id !== productId &&
            !(item.product && item.product._id === productId)
        )
      );
    } catch (err) {
      console.error("❌ خطأ أثناء حذف العنصر:", err);
      if (err.response?.data?.message === "Item not found in order") {
        setOrderItems((prev) =>
          prev.filter(
            (item) =>
              item._id !== productId &&
              !(item.product && item.product._id === productId)
          )
        );
      } else {
        alert("حدث خطأ أثناء حذف العنصر");
      }
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await PuplicRequest.get(`/category`);
        if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
          if (res.data.categories.length > 0 && !selectedCategory) {
            setSelectedCategory(res.data.categories[0].name || res.data.categories[0]);
          }
        }
      } catch (err) {
        console.error("خطأ أثناء جلب التصنيفات:", err);
      }
    };
    getCategories();
  }, [selectedCategory]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await PuplicRequest.get(`/product`);
        if (Array.isArray(res.data.products)) {
          setItems(res.data.products);
        }
      } catch (err) {
        console.error("خطأ أثناء جلب الأصناف:", err);
      }
    };
    getItems();
  }, []);

  const productsInCategory = selectedCategory
    ? items.filter(
      (item) =>
        item.category &&
        (item.category.name === selectedCategory || item.category === selectedCategory)
    )
    : [];

  const handleAddItem = (product) => {
    setOrderItems((prev) => {
      const exist = prev.find((item) => {
        return (
          item._id === product._id ||
          (item.product && item.product._id === product._id)
        );
      });

      if (exist) {
        return prev.map((item) =>
          item._id === product._id || (item.product && item.product._id === product._id)
            ? {
              ...item,
              quantity: (item.quantity || 0) + 1,
              total:
                ((item.quantity || 0) + 1) *
                (item.price || (item.product && item.product.price)),
            }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1, total: product.price }];
      }
    });
  };

  const handleQuantityChange = (id, delta) => {
    setOrderItems((prev) =>
      prev.map((item) => {
        const itemId = item._id || (item.product && item.product._id);
        if (itemId === id) {
          const currentQuantity = typeof item.quantity === "number" ? item.quantity : 1;
          const newQuantity = Math.max(1, currentQuantity + delta);
          const price = item.price ?? item.product?.price ?? 0;
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * price,
          };
        }
        return item;
      })
    );
  };

  const totalOrderPrice = orderItems.reduce((sum, item) => sum + (item.total || 0), 0);

  const handleOrder = async () => {
    try {
      const formattedItems = orderItems.map((item) => ({
        productId: item.productId?._id || item.productId || item._id,
        quantity: item.quantity,
      }));
      await PuplicRequest.put(`/order/${id}/add-item`, { items: formattedItems });
      alert("✅ تم حفظ الطلب بنجاح");
    } catch (err) {
      console.error("❌ فشل حفظ الطلب:", err);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const handlecloseOrderAndInvoice = async () => {
    try {
      const confirmProceed = window.confirm("هل تريد اغلاق الطاولة وانشاء فاتوره ؟");
      if (!confirmProceed) return; // المستخدم رفض
      // أولاً: تنفيذ أي منطق داخلي متعلق بالأوردر
      handleOrder();

      // // ثانياً: محاولة إغلاق الطاولة
      const resClose = await PuplicRequest.put(`/taple/close/${tableId}`);
      console.log("إغلاق الطاولة:", resClose);

      // ثالثاً: إنشاء الفاتورة
      await PuplicRequest.get(`/taple/invoice/${tableId}`);

      alert("تم إنشاء الفاتورة بنجاح");
      window.location.reload();
    } catch (error) {
      console.error("حدث خطأ أثناء الإغلاق أو إنشاء الفاتورة:", error);
      alert("حدث خطأ أثناء العملية");
    }
  };


  return (
    <div className="container mt-4" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h4 className="mb-2 p-2 rounded" style={{ color: "white", fontWeight: "700" }}>
        📝 Order Details :
      </h4>
      <h4 className="mb-4 p-2 rounded" style={{ color: "white", fontWeight: "700" }}>
        TABLE: <span style={{ color: "#ffd700" }}>{order?.tableId?.tableNumber || "-"}</span>
      </h4>

      <div className="row mb-4">
        <div className="col-md-3">
          <h5 style={{ color: "white", padding: "8px 12px", borderRadius: "6px", marginBottom: "15px" }}>
            📁 Category
          </h5>
          {categories.map((cat) => {
            const catName = cat.name || cat;
            return (
              <button
                key={catName}
                className={`btn mb-2 w-100 ${selectedCategory === catName ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedCategory(catName)}
                disabled={order?.status === "closed"}
                style={{
                  fontWeight: selectedCategory === catName ? "700" : "500",
                  opacity: order?.status === "closed" ? 0.5 : 1,
                  cursor: order?.status === "closed" ? "not-allowed" : "pointer",
                }}
              >
                {catName}
              </button>
            );
          })}
        </div>

        <div className="col-md-9">
          <h5 style={{ color: "white", padding: "8px 12px", borderRadius: "6px", marginBottom: "15px" }}>
            🧾 Items
          </h5>
          <div className="d-flex flex-wrap gap-2">
            {productsInCategory.length === 0 ? (
              <p style={{ color: "white" }}>لا توجد أصناف في هذا التصنيف</p>
            ) : (
              productsInCategory.map((product) => (
                <button
                  key={product._id}
                  className="btn btn-info"
                  style={{
                    minWidth: "140px",
                    fontWeight: "600",
                    boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
                    opacity: order?.status === "closed" ? 0.5 : 1,
                    cursor: order?.status === "closed" ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleAddItem(product)}
                  disabled={order?.status === "closed"}
                >
                  {product.name} - {product.price} ج
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <h5 className="mb-3" style={{ color: "white" }}>🧮 Order Summary</h5>
      <ul className="list-group mb-4">
        {orderItems.map((item, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {item.productId?.name || item?.name} = {item.quantity} × {item.price || item.product?.price} EGB = {item.total} EGP
            </span>
            <div>
              <button className="btn btn-sm btn-secondary mx-1" onClick={() => handleQuantityChange(item._id || item.product?._id, -1)} disabled={order?.status === "closed"}>-</button>
              <button className="btn btn-sm btn-secondary mx-1" onClick={() => handleQuantityChange(item._id || item.product?._id, 1)} disabled={order?.status === "closed"}>+</button>
              <button className="btn btn-sm btn-danger mx-1" onClick={() => handleDeleteCompletly(item._id || item.product?._id)} disabled={order?.status === "closed"}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between align-items-center">
        <h4 style={{ color: "#00ffcc" }}> TOTAL 💰: {totalOrderPrice} ج</h4>

        {order?.status === "open" ? (
          <button
            className="btn btn-info opacity-25"
            disabled
          >
            View Invoice
          </button>
        ) : (
          <Link to={`/closeInvoice/${invoiceID}`}>
            <button className="btn btn-info opacity-100">
              View Invoice
            </button>
          </Link>
        )}
        <button className="btn btn-danger" onClick={handlecloseOrderAndInvoice} disabled={order?.status === "closed"}>💾 CLOSE ORDER AND CREATE INVOICE</button>

        <Link to={`/print-order/${id}`} className="btn btn-warning " >
          🖨️ طباعة الطلب
        </Link>

        <button className="btn btn-success w-25" onClick={handleOrder} disabled={order?.status === "closed"}> SAVE ORDER 💾</button>

      </div>


    </div>
  );
}
