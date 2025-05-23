


import React, { useState } from 'react';
import { PuplicRequest } from '../utils/requestMethod';

function AddTable() {
    const [tableNumber, setTableNumber] = useState('');
    const [seats, setSeats] = useState('');

    const handleAddTable = async () => {
        try {
            const res = await PuplicRequest.post("/taple", {
                tableNumber,
                seats,
                
            });
            
            console.log('Table added:', res.data);
            setTableNumber('');
            setSeats('');
        } catch (error) {
            console.error("Error adding table:", error.response?.data || error);
            alert("حدث خطأ أثناء الإضافة");
        }
    };

    return (
        <div className="container mt-5 text-white" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4"> ADD TAPLE ➕</h2>

            <div className="mb-3">
                <label className="form-label">Table Number</label>
                <input
                    type="numper"
                    className="form-control"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Seats</label>
                <input
                    type="number"
                    className="form-control"
                    id="seats"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    required
                />
            </div>

            <button onClick={handleAddTable} className="btn btn-success w-100">
                Save Taple 💾
            </button>
        </div>
    );
}

export default AddTable;
