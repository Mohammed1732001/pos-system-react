import React, { useState, useEffect } from 'react';
import { PuplicRequest } from '../utils/requestMethod.js';
import { Link } from 'react-router-dom';

function HomePages() {
  const [selectedView, setSelectedView] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const tablesPerPage = 20;

  const [allTables, setAllTables] = useState([]); // جميع الطاولات من الـ API
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // تحميل البيانات من السيرفر
  useEffect(() => {
    const getTables = async () => {
      const res = await PuplicRequest.get("/taple");
      setAllTables(res.data.tables);
    };

    const getOpenOrders = async () => {
      const res = await PuplicRequest.get("/order/open-order");
      setUnpaidOrders(res.data.order);
    };

    const getInvoice = async () => {
      const res = await PuplicRequest.get("/invoice");
      setInvoices(res.data.invoices);
    };

    getTables();
    getOpenOrders();
    getInvoice();
  }, []);

  // فلترة الطاولات بناءً على الـ View المختار
  const filteredTables = allTables.filter((table) => {
    if (selectedView === "All") return true;
    if (selectedView === "Receve") return table.status === "reserved";
    if (selectedView === "Open") return table.status === "open";
    return true;
  });

  // Pagination
  const indexOfLastTable = currentPage * tablesPerPage;
  const indexOfFirstTable = indexOfLastTable - tablesPerPage;
  const currentTables = filteredTables.slice(indexOfFirstTable, indexOfLastTable);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTables.length / tablesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // المجموعات
  const totalCash = invoices
    .filter((invoice) => invoice.paymentMethod === 'cash')
    .reduce((sum, invoice) => sum + invoice.finalAmount, 0)
    .toFixed(2);

  const totalVisa = invoices
    .filter((invoice) => invoice.paymentMethod === 'credit_card')
    .reduce((sum, invoice) => sum + invoice.finalAmount, 0)
    .toFixed(2);
  const totalwallet = invoices
    .filter((invoice) => invoice.paymentMethod === 'digital_wallet')
    .reduce((sum, invoice) => sum + invoice.finalAmount, 0)
    .toFixed(2);

  // دالة الضغط على الطاولة
  const handleTableClick = async (tableId) => {
    const selectedTable = allTables.find((t) => t._id === tableId);

    if (!selectedTable) return;

    // لو الطاولة محجوزة بالفعل، نفتح صفحتها
    if (selectedTable.status === "reserved") {
      window.location.href = `/taple/${tableId}`;
    }

    // لو الطاولة مفتوحة (مش محجوزة)
    if (selectedTable.status === "open") {
      const confirmBooking = window.confirm("هل تريد حجز هذه الطاولة؟");

      if (confirmBooking) {
        try {
          // تحديث حالة الطاولة في السيرفر
          await PuplicRequest.put(`/taple/reserve/${tableId}`, { status: "reserved" });

          // تحديث الحالة محليًا بدون إعادة تحميل
          setAllTables((prevTables) =>
            prevTables.map((table) =>
              table._id === tableId ? { ...table, status: "reserved" } : table
            )
          );

          // بعد الحجز، فتح صفحة الطاولة
          // window.location.href = `/table/${tableId}`;
        } catch (error) {
          console.error("فشل في تحديث حالة الطاولة:", error);
          alert("حدث خطأ أثناء حجز الطاولة.");
        }
      }
    }
  };
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-7 mb-4">
          <div className="card bg-dark text-light p-3 shadow mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">🪑 Tables</h5>
              <div className="d-flex gap-3">
                {["All", "Receve", "Open"].map((view) => (
                  <label key={view} className="form-check-label text-light">
                    <input
                      type="radio"
                      className="form-check-input me-1"
                      name="view"
                      value={view}
                      checked={selectedView === view}
                      onChange={(e) => setSelectedView(e.target.value)}
                    />
                    {view}
                  </label>
                ))}
              </div>
            </div>

            <div className="row g-3">
              {currentTables.map((table) => (
                <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={table._id}>
                  <button
                    className={`btn w-100 py-3 ${table.status === "reserved" ? "btn-info text-white" : "btn-outline-info"
                      }`}
                    onClick={() => handleTableClick(table._id)}
                  >
                    {table.tableNumber}
                  </button>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button onClick={prevPage} disabled={currentPage === 1} className="btn btn-outline-info">
                &lt; Prev
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === Math.ceil(filteredTables.length / tablesPerPage)}
                className="btn btn-outline-info"
              >
                Next &gt;
              </button>
            </div>
          </div>

          <div className="card bg-dark text-light p-3 shadow">
            <h5 className="text-light mb-3">📄 Invoices</h5>
            <table className="table table-sm table-dark table-bordered mb-0">
              <thead>
                <tr>
                  <th>#Invoice</th>
                  <th>Table</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice._id}</td>
                    <td>{invoice?.orderId?.tableId?.tableNumber}</td>
                    <td>
                      {new Date(invoice.createdAt).toLocaleDateString("en-EG")}
                    </td>


                    <td>{invoice.finalAmount} </td>
                    <td>{invoice.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3">
              <p><strong>Total Paid by Cash: </strong>{totalCash} </p>
              <p><strong>Total Paid by Visa: </strong>{totalVisa} </p>
              <p><strong>Total Paid by Wallet: </strong>{totalwallet} </p>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card bg-dark text-light p-3 shadow">
            <h5 className="text-light mb-3">🧾 Unpaid Orders</h5>
            {unpaidOrders.map((order) => {
              const total = order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2);
              return (
                <div key={order._id} className="card bg-dark text-light mb-3 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span><strong>Order: {order._id.slice(10)}</strong></span>
                      <span>Table {order.tableId.tableNumber}</span>
                      <span className="text-danger" style={{ cursor: "pointer" }}>&times;</span>
                    </div>
                    <table className="table table-sm table-dark table-bordered mb-2">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>qty</th>
                          <th>Price</th>
                          <th>total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.productId.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price} EGP</td>
                            <td>{item.total} EGP</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="text-end" colSpan="3"><strong>Total</strong></td>
                          <td><strong>{total} EGP</strong></td>
                        </tr>

                      </tbody>
                    </table>

                    <div className="d-flex justify-content-end gap-2">
                      <Link to={`/order/${order._id}`}>
                        <button className="btn btn-outline-info btn-sm">View DEtails</button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePages;
