
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PuplicRequest } from '../utils/requestMethod.js';
import {  toast } from 'react-toastify';
import AuthService from '../utils/AuthService.js';

function Orders() {
  const isAdmin = AuthService.isAdmin();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await PuplicRequest.get("/order");
        if (res.data.message !== "Done") {
          console.log("Failed to get orders");
        }
        setOrders(res.data.order);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    getOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "badge bg-warning text-dark";
      case "close":
        return "badge bg-success";
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      try {
        await PuplicRequest.delete(`/order/${id}`);
        setOrders(prev => prev.filter(order => order._id !== id));
        toast.success("تم حذف الأوردر بنجاح");
      } catch (err) {
        console.error("فشل في حذف الأوردر", err);
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  // 🔍 فلترة حسب الحالة والتاريخ
  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === "all" || order.status == filterStatus;
    const matchDate = !filterDate || new Date(order.createdAt).toISOString().split('T')[0] === filterDate;
    return matchStatus && matchDate;
  });

  return (

    <div className="container-fluid p-4" style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2>📦 Orders</h2>
        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-select"
            style={{ minWidth: "150px" }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Order</option>
            <option value="open">Open</option>
            <option value="closed">Done</option>
          </select>

          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <button className="btn btn-outline-light" onClick={() => { setFilterStatus("all"); setFilterDate(""); }}>
            🔄 Refresh
          </button>

        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover text-center align-middle">
          <thead className="table-secondary text-dark">
            <tr>
              <th>ORDER NUMBER</th>
              <th>DATE</th>
              <th>TABLE</th>
              <th>STATUS</th>
              <th>TOTAL</th>
              <th>UPDATE</th>
              <th className={isAdmin ? "" : "hide-for-non-admin"}>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id}>
                <td>
                  <Link to={`/order/${order._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    #{index + 1}
                  </Link>
                </td>
                <td>{new Date(order.createdAt).toISOString().split('T')[0]}</td>
                <td>{order.tableId?.tableNumber ?? "غير محددة"}</td>
                <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                <td>{order.totalAmount ?? 0} EGP</td>
                <td>
                  <Link to={`/order/update/${order._id}`} className="btn btn-sm btn-outline-info">
                    📝 UPDATE
                  </Link>
                </td>
                <td className={isAdmin ? "" : "hide-for-non-admin"}>
                  
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(order._id)}>
                    🗑️ DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
