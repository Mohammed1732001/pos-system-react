
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PuplicRequest } from '../utils/requestMethod.js';
import AuthService from '../utils/AuthService.js';

function Invoices() {
      const isAdmin = AuthService.isAdmin();

  const [invoices, setInvoices] = useState([]);
  const [totals, setTotals] = useState({});
  const [filterDate, setFilterDate] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const navigate = useNavigate();

  const calculateTotals = (data) => {
    return data.reduce(
      (acc, invoice) => {
        const method = invoice.paymentMethod;
        const amount = Number(invoice.finalAmount) || 0;

        if (method === 'cash') acc.cash += amount;
        else if (method === 'credit_card') acc.credit_card += amount;
        else if (method === 'digital_wallet') acc.digital_wallet += amount;

        return acc;
      },
      { cash: 0, credit_card: 0, digital_wallet: 0 }
    );
  };

  const getInvoices = async () => {
    try {
      const res = await PuplicRequest.get('/invoice');
      let data = Array.isArray(res.data.invoices) ? res.data.invoices : [];

      if (filterDate) {
        data = data.filter((invoice) =>
          new Date(invoice.issueDate).toISOString().split('T')[0] === filterDate
        );
      }

      if (filterPayment) {
        data = data.filter((invoice) => invoice.paymentMethod === filterPayment);
      }

      setInvoices(data);
      setTotals(calculateTotals(data));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    }
  };

  useEffect(() => {
    getInvoices();
  }, [filterDate, filterPayment]);

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      try {
        await PuplicRequest.delete(`/invoice/${id}`);
        const updated = invoices.filter((invoice) => invoice._id !== id);
        setInvoices(updated);
        setTotals(calculateTotals(updated));
      } catch (error) {
        console.error('خطأ أثناء حذف الفاتورة:', error);
      }
    }
  };

  const handleResetFilters = () => {
    setFilterDate('');
    setFilterPayment('');
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h2>📄 Invoices</h2>
        <div className="d-flex flex-wrap gap-2">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ maxWidth: '200px' }}
          />
          <select
            className="form-select"
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            style={{ maxWidth: '180px' }}
          >
            <option value="">All Payment Methods</option>
            <option value="cash">💵 Cash</option>
            <option value="credit_card">💳 Visa</option>
            <option value="digital_wallet">📱 WALLET</option>
          </select>
          <button className="btn btn-outline-light" onClick={handleResetFilters}>🔄 إعادة تعيين</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover text-center align-middle">
          <thead className="table-secondary text-dark">
            <tr>
              <th>Invoice Number</th>
              <th>DATE</th>
              <th>TAPLE</th>
              <th>Status</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th className={isAdmin ? "" : "hide-for-non-admin"}>EDit</th>
              <th className={isAdmin ? "" : "hide-for-non-admin"}>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="8">لا توجد فواتير حالياً</td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>
                    <Link to={`/closeInvoice/${invoice._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      #{invoice._id}
                    </Link>
                  </td>
                  <td>{new Date(invoice.issueDate).toLocaleString()}</td>
                  <td>{invoice.orderId?.tableId?.tableNumber || 'N/A'}</td>
                  <td>
                    <span className={`badge ${invoice.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                      {invoice.paymentStatus}
                    </span>
                  </td>
                  <td>{invoice.finalAmount} ج.م</td>
                  <td>{invoice.paymentMethod || 'N/A'}</td>
                  <td className={isAdmin ? "" : "hide-for-non-admin"}>
                    <button className="btn btn-sm btn-warning" onClick={() => navigate(`/editInvoice/${invoice._id}`)}>
                      ✏️
                    </button>
                  </td>
                  <td className={isAdmin ? "" : "hide-for-non-admin"}>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice._id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* مجاميع الدفع */}
      <div className="mt-4 bg-dark p-3 rounded text-white">
        <h5>💰 Total paid by payment method:</h5>
        <ul className="list-group list-group-flush text-white">
          <li className="list-group-item bg-dark text-white border-0">💵 Cash: {totals.cash} ج.م</li>
          <li className="list-group-item bg-dark text-white border-0">💳 Visa: {totals.credit_card} ج.م</li>
          <li className="list-group-item bg-dark text-white border-0">📱 WAllet: {totals.digital_wallet} ج.م</li>
        </ul>
      </div>
    </div>
  );
}

export default Invoices;
