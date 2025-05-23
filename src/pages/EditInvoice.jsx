
import React, { useEffect, useState } from 'react';
import { PuplicRequest } from '../utils/requestMethod.js';
import { Link, useParams } from 'react-router-dom';

function EditInvoice() {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [invoice, setInvoice] = useState({})
    const [items, setItems] = useState([]);
    const [cashier, setCashier] = useState([]);
    const { id } = useParams()

    const handleUpdate = async () => {
        try {
            await PuplicRequest.put(`/invoice/${id}/payment-method`, {
                paymentMethod,
            });

            console.log("تم اختيار طريقة الدفع:", paymentMethod);
            alert(`تم اختيار طريقة الدفع: ${paymentMethod}`);
        } catch (error) {
            console.error("خطأ أثناء تحديث طريقة الدفع:", error);
            alert("حدث خطأ أثناء تحديث طريقة الدفع");
        }
    };

    useEffect(() => {
        const getInvoice = async () => {
            const res = await PuplicRequest.get(`/invoice/${id}`);
            console.log(res.data.invoice);
            setInvoice(res.data.invoice);
            setItems(res.data.invoice.orderId.items);

            setCashier(res.data.invoice.cashierId.userName);
        }
        getInvoice();
    }, [id])

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Update Invoice</h2>
            <div className="card p-4 shadow">

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className='text-dark'>invoice Number:</label>
                        <input type="text" className="form-control" value={"INV-" + invoice._id || ""} disabled />
                    </div>
                    <div className="col-md-6">
                        <label className='text-dark'>Invoice Date:</label>
                        <input type="text" className="form-control" value={invoice.createdAt || ""} disabled />
                    </div>
                </div>

                <div className="mb-3">
                    <label className='text-dark'>Cashier Name</label>
                    <input type="text" className="form-control" value={cashier || ""} disabled />
                </div>

                <div className="mb-3">
                    <label className='text-dark'>items:</label>
                    {items.map((item, index) => (
                        <ul key={index} className="list-group mb-2">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex justify-content-between w-100">
                                    <span style={{ width: "30%" }}>{item.productId.name || ""}</span>
                                    <span style={{ width: "20%", textAlign: "center" }}>{item.quantity || ""}</span>
                                    <span style={{ width: "5%", textAlign: "center" }}>*</span>
                                    <span style={{ width: "20%", textAlign: "center" }}>{item.price || ""} EGP</span>
                                    <span style={{ width: "30%", textAlign: "end" }}>{item.quantity * item.price || ""} EGP</span>
                                </div>
                            </li>
                        </ul>
                    ))}


                </div>

                <div className="mb-3">
                    <label className='text-dark'>TOTAL:</label>
                    <input type="text" className="form-control" value={invoice.finalAmount || ""} disabled />
                </div>

                <div className="mb-4">
                    <label className='text-dark'>Payment Method:</label>
                    <select
                        className="form-select"
                        value={paymentMethod || ""}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="cash">cash</option>
                        <option value="credit_card">Visa</option>
                        <option value="digital_wallet">Digital Wallet</option>
                    </select>
                </div>
                <Link to={`/invoices`}>
                    <button className="btn btn-primary" onClick={handleUpdate}>
                        UPdate PAyment Method
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default EditInvoice;
