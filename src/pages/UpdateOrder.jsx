import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import { useParams } from "react-router-dom";
import { PuplicRequest } from "../utils/requestMethod.js";

const UpdateOrder = () => {
  const { id } = useParams();

  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [openOrders, setOpenOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetOrderId, setTargetOrderId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await PuplicRequest.get(`/order/${id}`);
        setOrder(res.data.order);
        setOrderItems(res.data.order.items || []);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };
    if (id) getOrder();
  }, [id]);

  useEffect(() => {
    const getOpenOrders = async () => {
      try {
        const res = await PuplicRequest.get("/order/open-order");
        // استبعد الأوردر الحالي من القائمة
        const filteredOrders = res.data.order.filter((order) => order._id !== id);
        setOpenOrders(filteredOrders || []);
      } catch (err) {
        console.error("Error fetching open orders:", err);
      }
    };
    getOpenOrders();
  }, [id]);  // لو تغير id يعيد جلب الأوردرات المفتوحة

  const handleMoveItem = (itemId) => {
    const item = orderItems.find((i) => i.productId._id === itemId);
    setSelectedItem(item);
    setSelectedProductId(item.productId._id);
    setSelectedQuantity(1);
    setTargetOrderId("");
    const modal = new bootstrap.Modal(document.getElementById("moveModal"));
    modal.show();
  };

  const confirmMove = async () => {
    try {

      await PuplicRequest.put(`/order/transfer-order/${id}`, {
        orderId: String(targetOrderId),
        itemId: String(selectedItem.productId._id),
        quantity: Number(selectedQuantity),
      });

      alert("Done Move is success");

      setTargetOrderId("");
      setSelectedItem(null);
      setSelectedQuantity(1);
      bootstrap.Modal.getInstance(document.getElementById("moveModal")).hide();

      // تحديث بيانات الأوردر الحالي بعد النقل
      const res = await PuplicRequest.get(`/order/${id}`);
      setOrder(res.data.order);
      setOrderItems(res.data.order.items || []);
    } catch (error) {
      console.error("erorr transfer product:", error);
      alert("An error occurred during the transfer. Please ensure the data is correct..");
    }
  };

  const handleUpdateOrder = () => {
    alert("The order has been updated successfully.");
    // يمكنك إضافة منطق تحديث آخر إذا لزم
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Modifying order items</h3>

      <table className="table table-bordered text-center text-light">
        <thead className="table-secondary">
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.length > 0 ? (
            orderItems.map((item) => (
              <tr key={item.productId._id}>
                <td>{item.productId.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price} ج.م</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleMoveItem(item.productId._id)}
                  >
                    Transfer to another order
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">There are no items in the order.</td>
            </tr>
          )}
        </tbody>
      </table>

      
      {/* Modal */}
      <div
        className="modal fade"
        id="moveModal"
        tabIndex="-1"
        aria-labelledby="moveModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="moveModalLabel">
                Transfer the product to another order
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="إغلاق"
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="targetOrderSelect" className="form-label">
                Choose an open order:
              </label>
              <select
                className="form-select mb-3"
                id="targetOrderSelect"
                value={targetOrderId}
                onChange={(e) => setTargetOrderId(e.target.value)}
              >
                <option value="">-- Select --</option>
                {openOrders.length > 0 ? (
                  openOrders.map((order) => (
                    <option key={order._id} value={order._id}>
                      Table {order.tableId.tableNumber}
                    </option>
                  ))
                ) : (
                  <option disabled>There are no other open orders.</option>
                )}
              </select>

              {selectedItem && (
                <>
                  <label htmlFor="quantitySelect" className="form-label">
                    Choose quantity:
                  </label>
                  <select
                    className="form-select"
                    id="quantitySelect"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  >
                    {[...Array(selectedItem.quantity).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!targetOrderId}
                onClick={confirmMove}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
