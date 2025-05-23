
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PuplicRequest } from "../utils/requestMethod";

const UpdateTaple = () => {
    const [seats, setSeats] = useState("");
    const { id } = useParams()
    const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await PuplicRequest.patch(`/taple/${id}`, { seats });
    alert(`✅ تم تحديث عدد الكراسي إلى: ${seats}`);
  } catch (err) {
    console.error(err);
    alert("❌ حدث خطأ أثناء التحديث. تحقق من الاتصال أو بيانات الطاولة.");
  }
};


    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h3 className="mb-4 text-center">تعديل عدد الكراسي للطاولة</h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="seats" className="form-label">عدد الكراسي</label>
                    <input
                        type="number"
                        id="seats"
                        min="1"
                        className="form-control"
                        placeholder="أدخل عدد الكراسي"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">تحديث</button>
            </form>
        </div>
    );
};

export default UpdateTaple;
