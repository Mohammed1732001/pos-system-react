
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { PuplicRequest } from "../utils/requestMethod";
// import { useNavigate } from "react-router-dom";

// export default function OrderPrint() {
//     const { id } = useParams();
//     const [order, setOrder] = useState(null);
//     const navigate = useNavigate();
//     useEffect(() => {
//         const fetchOrder = async () => {
//             try {
//                 const res = await PuplicRequest.get(`/order/${id}`);
//                 console.log(res.data.order);

//                 setOrder(res.data.order);
//             } catch (err) {
//                 console.error("❌ خطأ أثناء تحميل الطلب:", err);
//             }
//         };

//         fetchOrder();
//     }, [id]);

//     if (!order) return <p>جاري تحميل الطلب...</p>;

//     const items = order.items || [];
//     const total = items.reduce((acc, item) => acc + (item.total || 0), 0);

//     return (

//         <div style={{ padding: "20px", fontFamily: "Tahoma", direction: "rtl" }}>
//             <button onClick={() => navigate(-1)} style={{ marginBottom: "10px", color: "#09c", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>
//                 ← الرجوع
//             </button>


//             <h2>🧾 فاتورة الطلب</h2>
//             <p>رقم الطاولة: {order.tableId?.tableNumber}</p>
//             <p>تاريخ الطلب: {new Date(order.createdAt).toLocaleString()}</p>
//             <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//                 <thead>
//                     <tr style={{ background: "#eee" }}>
//                         <th style={{ color: "black", textAlign: "center", border: "1px solid #ccc", padding: "8px" }}>الصنف</th>
//                         <th style={{ color: "black", textAlign: "center", border: "1px solid #ccc", padding: "8px" }}>الكمية</th>
//                         <th style={{ color: "black", textAlign: "center", border: "1px solid #ccc", padding: "8px" }}>السعر</th>
//                         <th style={{ color: "black", textAlign: "center", border: "1px solid #ccc", padding: "8px" }}>الإجمالي</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {items.map((item, idx) => {
//                         const name = item.productId.name || item.product?.name || "بدون اسم";
//                         const quantity = item.quantity;
//                         const price = item.price ?? item.product?.price ?? 0;
//                         const totalItem = quantity * price;
//                         return (
//                             <tr key={idx}>
//                                 <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{name}</td>
//                                 <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{quantity}</td>
//                                 <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{price} ج</td>
//                                 <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{totalItem} ج</td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>

//             <h3 style={{ marginTop: "20px" }}>الإجمالي الكلي: {total} ج</h3>
//         </div>
//     );
// }




































// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { PuplicRequest } from "../utils/requestMethod";

// export default function OrderPrint() {
//     const { id } = useParams();
//     const [order, setOrder] = useState(null);
//     const navigate = useNavigate();
//     const printRef = useRef(); // 👈 الريـف للطباعة فقط

//     useEffect(() => {
//         const fetchOrder = async () => {
//             try {
//                 const res = await PuplicRequest.get(`/order/${id}`);
//                 setOrder(res.data.order);
//             } catch (err) {
//                 console.error("❌ خطأ أثناء تحميل الطلب:", err);
//             }
//         };
//         fetchOrder();
//     }, [id]);

//     const handlePrint = () => {
//         const printContents = printRef.current.innerHTML;
//         const originalContents = document.body.innerHTML;

//         document.body.innerHTML = printContents;
//         window.print();
//         document.body.innerHTML = originalContents;
//         window.location.reload(); // يرجع الوضع الطبيعي
//     };

//     if (!order) return <p>جاري تحميل الطلب...</p>;

//     const items = order.items || [];
//     const total = items.reduce((acc, item) => acc + (item.total || 0), 0);

//     return (
//         <div style={{ padding: "20px", fontFamily: "Tahoma", direction: "rtl" }}>
//             <button onClick={() => navigate(-1)} style={{ marginBottom: "10px", color: "#09c", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>
//                 ← الرجوع
//             </button>

//             <button onClick={handlePrint} style={{ background: "#09c", color: "#fff", padding: "10px", border: "none", borderRadius: "5px", marginBottom: "20px", cursor: "pointer" }}>
//                 🖨️ طباعة الفاتورة
//             </button>

//             {/* ✅ المكون القابل للطباعة فقط */}
//             <div ref={printRef} className="print-area">
//                 <h2>🧾 فاتورة الطلب</h2>
//                 <p>رقم الطاولة: {order.tableId?.tableNumber}</p>
//                 <p>تاريخ الطلب: {new Date(order.createdAt).toLocaleString()}</p>
//                 <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//                     <thead>
//                         <tr style={{ background: "#eee" }}>
//                             <th style={cell}>الصنف</th>
//                             <th style={cell}>الكمية</th>
//                             <th style={cell}>السعر</th>
//                             <th style={cell}>الإجمالي</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {items.map((item, idx) => {
//                             const name = item.productId.name || item.product?.name || "بدون اسم";
//                             const quantity = item.quantity;
//                             const price = item.price ?? item.product?.price ?? 0;
//                             const totalItem = quantity * price;
//                             return (
//                                 <tr key={idx}>
//                                     <td style={cell}>{name}</td>
//                                     <td style={cell}>{quantity}</td>
//                                     <td style={cell}>{price} ج</td>
//                                     <td style={cell}>{totalItem} ج</td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>

//                 <h3 style={{ marginTop: "20px" }}>الإجمالي الكلي: {total} ج</h3>
//             </div>
//         </div>
//     );
// }

// const cell = {
//     border: "1px solid #ccc",
//     textAlign: "center",
//     padding: "8px",
// };








































import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PuplicRequest } from "../utils/requestMethod";

export default function OrderPrint() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();
    const printRef = useRef(); // ✅ Ref للطباعة فقط

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await PuplicRequest.get(`/order/${id}`);
                setOrder(res.data.order);
            } catch (err) {
                console.error("❌ خطأ أثناء تحميل الطلب:", err);
            }
        };
        fetchOrder();
    }, [id]);

    // ✅ وظيفة الطباعة الخاصة
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const win = window.open('', '', 'width=300,height=500');
        win.document.write(`
            <html>
                <head>
                    <title>طباعة الطلب</title>
                    <style>
                        @media print {
                            body {
                                width: 58mm;
                                margin: 0;
                                padding: 0;
                                font-family: Tahoma, sans-serif;
                                font-size: 12px;
                                direction: rtl;
                                color: #000;
                            }
                            h2, h3, p {
                                text-align: center;
                                margin: 5px 0;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 10px;
                            }
                            th, td {
                                border: 1px dashed #000;
                                padding: 5px;
                                text-align: center;
                            }
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    ${printContents}
                </body>
            </html>
        `);
        win.document.close();
    };

    if (!order) return <p>جاري تحميل الطلب...</p>;

    const items = order.items || [];
    const total = items.reduce((acc, item) => acc + (item.total || 0), 0);

    return (
        <div style={{ padding: "20px", fontFamily: "Tahoma", direction: "rtl" }}>
            {/* زر الرجوع */}
            <button onClick={() => navigate(-1)} style={{ marginBottom: "10px", color: "#09c", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>
                ← الرجوع
            </button>

            {/* ✅ زر طباعة */}
            <button onClick={handlePrint} style={{ background: "#09c", color: "#fff", padding: "10px", border: "none", borderRadius: "5px", marginBottom: "20px", cursor: "pointer" }}>
                🖨️ طباعة الفاتورة
            </button>

            {/* ✅ الفاتورة نفسها */}
            <div ref={printRef}>
                <h2>🧾 فاتورة الطلب</h2>
                <p>رقم الطاولة: {order.tableId?.tableNumber}</p>
                <p>تاريخ الطلب: {new Date(order.createdAt).toLocaleString()}</p>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr style={{ background: "#eee" }}>
                            <th style={{ color: "black", textAlign: "center", border: "1px solid #ccc", padding: "8px" }}>الصنف</th>
                            <th style={{ color: "black", textAlign: "center", border: "1px solid #ccc", padding: "8px" }}>الكمية</th>
                            <th style={{ color: "black", textAlign: "center", border: "1px solid #ccc", padding: "8px" }}>السعر</th>
                            <th style={{ color: "black", textAlign: "center", border: "1px solid #ccc", padding: "8px" }}>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => {
                            const name = item.productId.name || item.product?.name || "بدون اسم";
                            const quantity = item.quantity;
                            const price = item.price ?? item.product?.price ?? 0;
                            const totalItem = quantity * price;
                            return (
                                <tr key={idx}>
                                    <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{name}</td>
                                    <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{quantity}</td>
                                    <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{price} ج</td>
                                    <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{totalItem} ج</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <h3 style={{ marginTop: "20px" }}>الإجمالي الكلي: {total} ج</h3>
            </div>
        </div>
    );
}
