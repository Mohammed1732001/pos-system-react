import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { PuplicRequest } from "../utils/requestMethod.js";



const categories = {
  "مشروبات": [
    { name: "شاي", price: 10 },
    { name: "قهوة", price: 15 },
    { name: "عصير", price: 20 },
  ],
  "مأكولات": [
    { name: "بيتزا", price: 50 },
    { name: "ساندويتش", price: 25 },
    { name: "برجر", price: 30 },
  ],
};



const OrderForm = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [user, setUser] = useState({ userName: "" })
  const [tables, setTables] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = token ? jwtDecode(token) : null;
      const res = await PuplicRequest.get(`/user/${decodedToken.id}`)
      setUser(res.data.user);

    }
    getUser();
  }, [])

  useEffect(() => {
    const getTables = async () => {
      const res = await PuplicRequest.get("/taple")
      setTables(res.data.tables);
    }
    getTables();
  }, [])

  const handleOrder = async () => {
    try {
      const res = await PuplicRequest.post("/order", {
        tableId: selectedTable,
        cashierId: user._id,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };



  const handleAddItem = (product) => {
    const exist = orderItems.find((item) => item.name === product.name);
    if (exist) {
      setOrderItems(
        orderItems.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price,
        },
      ]);
    }
  };

  const handleQuantityChange = (name, delta) => {
    setOrderItems(
      orderItems
        .map((item) =>
          item.name === name
            ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
              total: Math.max(1, item.quantity + delta) * item.price,
            }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const handleDeleteItem = (name) => {
    if (window.confirm("هل تريد حذف هذا الصنف من الطلب؟")) {
      setOrderItems(orderItems.filter((item) => item.name !== name));
    }
  };

  const totalOrderPrice = orderItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="container mt-4 text-white">
      <h3 className="mb-4">📋 إضافة أوردر جديد</h3>

      <div className="mb-3">
        <label>اختر الطاولة:</label>
        <select
          className="form-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">-- اختر طاولة --</option>
          {tables.map((table, index) => (
            <option key={index} value={table._id}>
              Table {table.tableNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>اسم الكاشيير:</label>
        <input type="text" className="form-control" value={user.userName} readOnly />
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <h5>📁 التصنيفات</h5>
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              className={`btn btn-outline-light mb-2 w-100 ${selectedCategory === cat ? "active" : ""
                }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="col-md-9">
          <h5>🧾 الأصناف</h5>
          <div className="d-flex flex-wrap gap-2">
            {selectedCategory &&
              categories[selectedCategory].map((product, index) => (
                <button
                  key={index}
                  className="btn btn-info"
                  onClick={() => handleAddItem(product)}
                >
                  {product.name} - {product.price} جنيه
                </button>
              ))}
          </div>
        </div>
      </div>

      <h5>🛒 الطلب الحالي:</h5>
      {orderItems.length === 0 ? (
        <p className="text-muted">لا توجد أصناف مضافة.</p>
      ) : (
        <table
          className="table table-bordered table-striped align-middle"
          style={{ backgroundColor: "white", color: "black" }}
        >
          <thead>
            <tr>
              <th>الصنف</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
              <th>تحكم</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price} ج</td>
                <td>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleQuantityChange(item.name, -1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleQuantityChange(item.name, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{item.total} ج</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteItem(item.name)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h5 className="mt-4 text-end">💰 السعر الإجمالي: {totalOrderPrice} جنيه</h5>

      <button onClick={handleOrder} className="btn btn-success w-100 mt-4">✅ حفظ الأوردر</button>
    </div>
  );
};

export default OrderForm;

