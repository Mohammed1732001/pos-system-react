
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PuplicRequest } from '../utils/requestMethod';
import { toast } from 'react-toastify';

export default function InvoiceDetails() {
  const invoiceRef = useRef();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const getInvoice = async () => {
      try {
        const res = await PuplicRequest.get(`/invoice/${id}`);
        console.log(res.data.invoice);

        setInvoice(res.data.invoice);
      } catch (err) {
        toast.error("فشل في جلب الفاتورة");
      }
    };
    getInvoice();
  }, [id]);

  // إذا البيانات لسا ما وصلتش، نعرض رسالة تحميل أو فارغة
  if (!invoice) {
    return <div className="text-center mt-5">Loading invoice .....</div>;
  }

  // استخدم بيانات الفاتورة مع قيم افتراضية
  const data = {
    items: invoice.orderId.items ?? [],
    cashierName: invoice?.cashierId?.userName ?? "غير متوفر",
    tableNo: invoice.orderId.tableId.tableNumber ?? "غير متوفر",
    paymentMethod: invoice.paymentMethod ?? "غير متوفر",
    date:
      invoice.issueDate ?
        new Date(invoice.issueDate).toLocaleDateString('en-EG', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : "غير متوفر",

    tax: invoice.taxAmount ?? 0,
  };

  const subtotal = data.items.reduce(
    (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
    0
  );
  const total = subtotal + data.tax;

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    const WinPrint = window.open('', '', 'width=400,height=600');

    WinPrint.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background-color: #191919;
              color: #000;
            }
              
            .invoice {
              width: 300px;
              margin: auto;
              padding: 10px;
              background-color: #1e1e1e;
              border-radius: 8px;
            }
            h2, h4 {
              text-align: center;
              color: #4ec3fa;
              margin: 4px 0;
            }
            .info {
              font-size: 12px;
              margin: 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #4ec3fa;
              padding: 4px;
              text-align: center;
            }
            .totals {
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              padding: 4px 0;
            }
            .thank {
              text-align: center;
              color: #4ec3fa;
              margin-top: 10px;
              font-size: 13px;
            }
            .no-print {
              display: none !important;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="invoice">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);

    WinPrint.document.close();
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div
        ref={invoiceRef}
        className="card shadow-lg p-5"
        style={{
          width: "700px",
          backgroundColor: "#1e1e1e",
          color: "#f0f0f0",
          borderRadius: "18px",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: "#4ec3fa", letterSpacing: 2, fontSize: "2.5rem" }}>
            Makanak
          </h2>
          <h4 className="fw-semibold" style={{ fontSize: "1.5rem" }}>Sales Invoice</h4>
        </div>

        <hr style={{ borderColor: "#4ec3fa", borderWidth: "2px" }} />

        <div className="mb-4 fs-5" style={{ fontSize: "1.25rem" }}>
          <div>Cashier Name: <span className="fw-bold">{data.cashierName}</span></div>
          <div>Table No: <span className="fw-bold">{data.tableNo}</span></div>
          <div>Payment Method: <span className="fw-bold">{data.paymentMethod}</span></div>
          <div>Date: <span className="fw-bold">{data.date}</span></div>
        </div>

        <div className="table-responsive mb-4">
          <table
            className="table table-sm table-bordered text-center"
            style={{ background: "#2a2a2a", color: "#ffffff", fontSize: "1.1rem" }}
          >
            <thead style={{ background: "#4ec3fa", color: "#000", fontSize: "1.2rem" }}>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.productId.name ?? "N/A"}</td>
                  <td>{item.quantity ?? 0}</td>
                  <td>{item.price ?? 0}</td>
                  <td>{(item.quantity ?? 0) * (item.price ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-2 d-flex justify-content-between fs-5" style={{ fontSize: "1.2rem" }}>
          <span>Tax:</span>
          <span>{data.tax} EGP</span>
        </div>
        <div className="mb-2 d-flex justify-content-between fs-5" style={{ fontSize: "1.2rem" }}>
          <span>Subtotal:</span>
          <span>{subtotal} EGP</span>
        </div>
        <div className="border-top pt-2 d-flex justify-content-between fs-4 fw-bold" style={{ fontSize: "1.4rem" }}>
          <span>Total:</span>
          <span>{total} EGP</span>
        </div>

        <div className="text-center mt-4 fs-4" style={{ color: "#4ec3fa", fontWeight: "600" }}>
          Thank you for your visit!
        </div>

        {/* الزرار خارج الطباعة بوضوح */}
        <div className="text-center mt-4 no-print">
          <button
            onClick={handlePrint}
            className="btn"
            style={{
              backgroundColor: "#4ec3fa",
              color: "#000",
              fontWeight: "600",
              padding: "10px 30px",
              fontSize: "1.1rem",
              borderRadius: "10px",
            }}
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
