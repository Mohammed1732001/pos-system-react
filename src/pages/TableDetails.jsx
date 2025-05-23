import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PuplicRequest } from '../utils/requestMethod.js';

function TableDetails() {
  const [table, setTable] = useState({});
  const { id } = useParams();
  const [orderDate, setOrderDate] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const getTable = useCallback( async () => {
    try {
      const res = await PuplicRequest.get(`/taple/${id}`);
      console.log(res.data.table);
      setTable(res.data.table);
    } catch (err) {
      console.error("Error fetching table:", err);
    }
  },[id]);

  useEffect(() => {
    getTable();
  }, [ getTable]);

  const handleReserve = async () => {
    try {
      await PuplicRequest.put(`/taple/reserve/${id}`);
      getTable();
    } catch (err) {
      console.error("Error reserving table:", err);
    }
  };

  const handleCreateOrder = async () => {
    try {
      await PuplicRequest.post(`/taple/${id}`);
      getTable();
    } catch (err) {
      console.error("Error creating order (might already exist):", err);
    }
  };

  const filterByDate = (items, date) => {
    if (!date) return items;
    return items.filter(item => new Date(item.createdAt).toISOString().slice(0, 10) === date);
  };

  const filteredOrders = filterByDate(table.orders || [], orderDate);
  const filteredInvoices = filterByDate(table.invoices || [], invoiceDate);

  const totalOrders = filteredOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  // const totalInvoices = filteredInvoices.reduce((acc, invoice) => acc + (invoice.finalAmount || 0), 0);

  return (
    <>
      <div className="card bg-dark text-white mb-3 shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="card-body">
          <h5 className="card-title">Table {table.tableNumber}</h5>
          <p className="card-text">
            Status: <span className={`fw-bold ${table.status === "reserved" ? "text-success" : "text-info"}`}>{table.status}</span>
          </p>
          <p className="card-text">Seats: {table.seats}</p>

          {table.status === "reserved" && table.activeOrderId ? (
            <div className="alert alert-info mt-3">
              ✅ يوجد أوردر بالفعل للطاولة.
              <br />
              <Link to={`/order/${table.activeOrderId._id}`} className="btn btn-primary mt-2">View Order</Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <button
                className="btn btn-success"
                style={{ color: "#fff", opacity: table.status === "reserved" ? 1 : 0.5, cursor: table.status === "reserved" ? "pointer" : "not-allowed", flex: 1 }}
                disabled={table.status !== "reserved"}
                onClick={handleCreateOrder}
              >
                Create Order
              </button>
              <button
                className="btn btn-info"
                style={{ color: "#000", opacity: table.status === "reserved" ? 0.5 : 1, cursor: table.status === "reserved" ? "not-allowed" : "pointer", flex: 1 }}
                disabled={table.status === "reserved"}
                onClick={handleReserve}
              >
                Reserved Table
              </button>
            </div>
          )}
        </div>
      </div>

      {/* جدول الأوردرات */}
      {table.orders && table.orders.length > 0 && (
        <div className="card bg-dark text-white mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Orders</h5>
            <input
              type="date"
              className="form-control mb-3"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
            <table className="table table-bordered table-dark table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Cashier</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.status}</td>
                    <td>{order.totalAmount || 0}</td>
                    <td>{table.orders?.[table.orders.length - 1]?.cashierId?.userName || "—"}</td>

                    <td>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                    <td>
                      <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-info">View</Link>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="text-end fw-bold">Total:</td>
                  <td colSpan="4" className="fw-bold">{totalOrders}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* جدول الفواتير */}
      {table.invoices && table.invoices.length > 0 && (
  <div className="card bg-dark text-white mb-3 shadow-sm">
    <div className="card-body">
      <h5 className="card-title">Invoices</h5>

      <input
        type="date"
        className="form-control mb-3"
        value={invoiceDate}
        onChange={(e) => setInvoiceDate(e.target.value)}
      />

      {/* الحسابات الخاصة بإجماليات الدفع */}
      {(() => {
        const visaTotal = filteredInvoices
          .filter(inv => inv.paymentMethod === 'credit_card')
          .reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);

        const cashTotal = filteredInvoices
          .filter(inv => inv.paymentMethod === 'cash')
          .reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);

        const walletTotal = filteredInvoices
          .filter(inv => inv.paymentMethod === 'digital_wallet')
          .reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);

        const totalInvoices = filteredInvoices.reduce(
          (sum, inv) => sum + (inv.finalAmount || 0),
          0
        );

        return (
          <table className="table table-bordered table-dark table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Cashier</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, index) => (
                <tr key={invoice._id}>
                  <td>{index + 1}</td>
                  <td>{invoice.finalAmount || 0}</td>
                  <td>{invoice.paymentStatus || 'Paid'}</td>
                  <td>{invoice.paymentMethod || '—'}</td>
                  <td>{invoice.cashierId?.userName || "—"}</td>
                  <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/invoice-details/${invoice._id}`}
                      className="btn btn-sm btn-outline-warning"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="text-end fw-bold">Total:</td>
                <td colSpan="5" className="fw-bold">{totalInvoices}</td>
              </tr>
              <tr>
                <td colSpan="2" className="text-end fw-bold text-success">Visa Total:</td>
                <td colSpan="5" className="fw-bold text-success">{visaTotal}</td>
              </tr>
              <tr>
                <td colSpan="2" className="text-end fw-bold text-info">Cash Total:</td>
                <td colSpan="5" className="fw-bold text-info">{cashTotal}</td>
              </tr>
              <tr>
                <td colSpan="2" className="text-end fw-bold text-warning">Wallet Total:</td>
                <td colSpan="5" className="fw-bold text-warning">{walletTotal}</td>
              </tr>
            </tbody>
          </table>
        );
      })()}
    </div>
  </div>
)}


    </>
  );
}

export default TableDetails;


















