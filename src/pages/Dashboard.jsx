import React, { useEffect, useState } from "react";
import { PuplicRequest } from "../utils/requestMethod.js";

function Dashboard() {

    const [stats, setStats] = useState({});
    const [recentOrders, setRecentOrders] = useState([]);
    const [tablesStatus, setTablesStatus] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const getStats = async () => {
            const res = await PuplicRequest.get('/invoice');
            setInvoice(res.data.invoices);

            const totalSales = res.data.invoices
                .filter(invoice => invoice.paymentStatus === 'paid')
                .reduce((sum, invoice) => sum + invoice.finalAmount, 0);
            const invoicesCount = res.data.invoices.length;

            const resOr = await PuplicRequest.get('/order');
            const recentOrders = resOr.data.order.filter(order => order.status === 'open');
            const ordersCount = resOr.data.order.length;

            const resUs = await PuplicRequest.get('/user');
            const usersCount = resUs.data.users.length;

            const resTab = await PuplicRequest.get('/taple');

            console.log(recentOrders);

            setTablesStatus(resTab.data.tables || []);
            setRecentOrders(recentOrders);
            setStats({ totalSales, ordersCount, invoicesCount, usersCount });
        };
        getStats();
    }, []);

    useEffect(() => {
        const getMostSoldProducts = (invoices) => {
            const productCountMap = {};

            invoices.forEach(invoice => {
                if (invoice.orderId && Array.isArray(invoice.orderId.items)) {
                    invoice.orderId.items.forEach(item => {
                        const key = item.productId._id || item.productId; // تأكد من وجود ID
                        const name = item.productId.name || 'منتج بدون اسم';
                        if (!productCountMap[key]) {
                            productCountMap[key] = {
                                name: name,
                                sold: item.quantity,
                            };
                        } else {
                            productCountMap[key].sold += item.quantity;
                        }
                    });
                }
            });

            const topProducts = Object.entries(productCountMap)
                .map(([productId, data]) => ({ productId, ...data }))
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 10); // optional: top 10

            return topProducts;
        };

        if (invoice.length > 0) {
            const top = getMostSoldProducts(invoice);
            setTopProducts(top);
        }
    }, [invoice]);

    const statusBadge = (status) => {
        switch (status) {
            case 'open': return 'success';
            case 'pending': return 'warning';
            case 'closed': return 'secondary';
            default: return 'info';
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">📊 Dinga Dashboard</h1>

            {/* Summary cards */}
            <div className="row mb-4">
                {[
                    { title: "Total Sales", value: `${stats.totalSales || 0} EGP`, color: "primary" },
                    { title: "Orders", value: stats.ordersCount || 0, color: "success" },
                    { title: "Invoices", value: stats.invoicesCount || 0, color: "info" },
                    { title: "Users", value: stats.usersCount || 0, color: "warning" },
                ].map((card, idx) => (
                    <div className="col-md-3 mb-3" key={idx}>
                        <div className={`card text-white bg-${card.color} h-100`}>
                            <div className="card-body text-center">
                                <h5 className="card-title">{card.title}</h5>
                                <p className="card-text display-6">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="mb-4">
                <h2>📦 Recent Orders</h2>
                <table className="table text-center  table-striped table-bordered" style={{ color: "white" }}>
                    <thead className="table-dark">
                        <tr>
                            <th>Cashier</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {recentOrders.map((order) => (
                            <tr style={{ color: "white" }} key={order._id}>
                                <td style={{ color: "white" }}>{order.cashierId.userName}</td>
                                <td style={{ color: "white" }}>{order.total} EGP</td>
                                <td >
                                    <span className={`badge bg-${statusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ color: "white" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Status */}
            <div className="mb-4">
                <h2>🪑 Tables Status</h2>
                <div className="d-flex flex-wrap gap-3">
                    {tablesStatus.map((table) => (
                        <div
                            key={table.tableNumber}
                            className={`p-3 rounded text-white ${table.status === "reserved" ? "bg-danger" : "bg-success"}`}
                            style={{ minWidth: "120px", textAlign: "center", fontWeight: "bold" }}
                        >
                            Table {table.tableNumber} <br />
                            {table.status === "reserved" ? "Reserved" : "Available"}
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="mb-4">
                <h2 className="text-center">🔥 Top Selling Products</h2>
                <div className="card shadow">
                    <div className="card-body">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th>Units Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((prod, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{prod.name}</td>
                                        <td>{prod.sold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Dashboard;















































// [جزء التقارير اليوميه والشهريه لسه محتاج يتظبط الداتا بيز بتاعته ]

// const [selectedDate, setSelectedDate] = useState("");
// const [selectedMonth, setSelectedMonth] = useState("");

// const [reportDay, setReportDay] = useState({
//     date: "2025-05-22",
//     totalSales: 3200,
//     totalTax: 400,
//     totalDiscount: 150,
//     balance: 2650,
// });

// const [reportMonth, setReportMonth] = useState({
//     date: "2025-05",
//     totalSales: 45000,
//     totalTax: 5200,
//     totalDiscount: 1800,
//     balance: 38000,
// });

// const handleDaySearch = (e) => {
//     e.preventDefault();
//     alert(`Searching day report for ${selectedDate}`);
// };
// const handleMonthSearch = (e) => {
//     e.preventDefault();
//     alert(`Searching month report for ${selectedMonth}`);
// };

// <div className="row mb-4">
//     <div className="col-md-6 mb-3">
//         <div className="card border-primary shadow h-100">
//             <div className="card-body">
//                 <h5 className="card-title">📅 Daily Report</h5>
//                 <ul className="list-group list-group-flush">
//                     <li className="list-group-item">Date: {reportDay.date}</li>
//                     <li className="list-group-item">Total Sales: {reportDay.totalSales} EGP</li>
//                     <li className="list-group-item">Total Tax: {reportDay.totalTax} EGP</li>
//                     <li className="list-group-item">Total Discount: {reportDay.totalDiscount} EGP</li>
//                     <li className="list-group-item">Balance: {reportDay.balance} EGP</li>
//                 </ul>
//                 <form className="d-flex gap-2 mt-3" onSubmit={handleDaySearch}>
//                     <input
//                         type="date"
//                         className="form-control"
//                         value={selectedDate}
//                         onChange={(e) => setSelectedDate(e.target.value)}
//                     />
//                     <button className="btn btn-primary" type="submit">Search</button>
//                 </form>
//             </div>
//         </div>
//     </div>

//     <div className="col-md-6 mb-3">
//         <div className="card border-success shadow h-100">
//             <div className="card-body">
//                 <h5 className="card-title">📆 Monthly Report</h5>
//                 <ul className="list-group list-group-flush">
//                     <li className="list-group-item">Month: {reportMonth.date}</li>
//                     <li className="list-group-item">Total Sales: {reportMonth.totalSales} EGP</li>
//                     <li className="list-group-item">Total Tax: {reportMonth.totalTax} EGP</li>
//                     <li className="list-group-item">Total Discount: {reportMonth.totalDiscount} EGP</li>
//                     <li className="list-group-item">Balance: {reportMonth.balance} EGP</li>
//                 </ul>
//                 <form className="d-flex gap-2 mt-3" onSubmit={handleMonthSearch}>
//                     <input
//                         type="month"
//                         className="form-control"
//                         value={selectedMonth}
//                         onChange={(e) => setSelectedMonth(e.target.value)}
//                     />
//                     <button className="btn btn-success" type="submit">Search</button>
//                 </form>
//             </div>
//         </div>
//     </div>
// </div>
