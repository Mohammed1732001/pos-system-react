import React, { useState, useEffect } from "react";
import { PuplicRequest } from "../utils/requestMethod.js";
import { useParams } from "react-router-dom";

const CloseInvoice = () => {
    const [invoice, setInvoice] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [isProcessing, setIsProcessing] = useState(false);
    const [autoUpdate, setAutoUpdate] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        const getInvoice = async () => {
            try {
                const res = await PuplicRequest.get(`/invoice/${id}`);
                console.log(res.data.invoice);

                setInvoice(res.data.invoice);
                if (res.data.invoice.paymentStatus === "paid") {
                    setAutoUpdate(false);
                }
            } catch (err) {
                console.error("فشل في تحميل الفاتورة:", err);
            }
        };

        getInvoice();
    }, [id]);

    useEffect(() => {
        if (!autoUpdate) return;

        const interval = setInterval(() => {
            console.log("Checking for updates... (simulation)");
        }, 3000);

        return () => clearInterval(interval);
    }, [autoUpdate]);

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            await PuplicRequest.put(`/invoice/${id}/payment-method`, {
                paymentMethod,
            });

            await PuplicRequest.put(`/invoice/${id}/pay-or-not`, {
                paymentStatus: "paid",
            });

            // 3. تحديث الواجهة
            setInvoice((prev) => ({
                ...prev,
                paymentStatus: "paid",
                paymentMethod,
            }));

            setAutoUpdate(false);
        } catch (error) {
            console.error("فشل في تحديث حالة الدفع:", error);
            alert("حدث خطأ أثناء تنفيذ العملية، حاول مرة أخرى.");
        }

        setIsProcessing(false);
    };

    if (!invoice) return <div className="text-center mt-5">LOADING ....</div>;

    return (
        <div
            className="container mt-4 p-4 border rounded shadow"
            style={{ maxWidth: 600, backgroundColor: "#f9f9f9", color: "#000" }}
        >
            <h3 style={{ borderBottom: "1px solid #000", paddingBottom: "8px" }}>
                invoice/N/{invoice._id}
            </h3>

            <p>
                <strong>Total:</strong> {invoice.finalAmount} EGP
            </p>

            <p>
                <strong>Payment Status:</strong>{" "}
                <span
                    className={`badge ${invoice.paymentStatus === "paid"
                        ? "bg-success"
                        : "bg-warning text-dark"
                        }`}
                >
                    {invoice.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </span>
            </p>

            {invoice.paymentStatus === "unpaid" && (
                <>
                    <div className="mb-3">
                        <label className="form-label"><strong>Choose Payment Method :</strong></label>
                        <select
                            className="form-select border border-dark"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="cash">كاش</option>
                            <option value="credit_card">فيزا</option>
                            <option value="digital_wallet">محفظة</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-dark w-100"
                        onClick={handlePayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "جارٍ المعالجة..." : "تأكيد الدفع"}
                    </button>
                </>
            )}

            {invoice.paymentStatus === "paid" && (
                <div className="alert alert-success mt-3">
                    Payed With ✅ <strong>{invoice.paymentMethod}</strong>.
                </div>
            )}

            <hr />

            <h5 className="mt-3">Details of the products</h5>
            <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.orderId.items?.map((item, index) => (
                        <tr key={index}>
                            <td>{item.productId.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price} ج</td>
                            <td>{item.price * item.quantity} ج</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CloseInvoice;
