
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PuplicRequest } from '../utils/requestMethod';
import AuthService from '../utils/AuthService.js';

function Tables() {
  const isAdmin = AuthService.isAdmin();
  const [tables, setTables] = useState([]);

  const getStatusClass = (status) => {
    switch (status) {
      case "شاغر":
        return "badge bg-success";
      case "محجوز":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  useEffect(() => {
    const getTables = async () => {
      try {
        const res = await PuplicRequest.get("/taple");
        setTables(res.data.tables || res.data); // لو الرد مختلف
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    getTables();
  }, []);

  // دالة حذف الطاولة
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الطاولة؟")) return;

    try {
      await PuplicRequest.delete(`/taple/${id}`);
      // حذف الطاولة من الحالة لتحديث الجدول بدون إعادة تحميل
      setTables(tables.filter(table => table.id !== id && table._id !== id));
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🍽️ Tables</h2>
        <Link to={"/addTable"}>
          {/* className={isAdmin ? "" : "hide-for-non-admin"} */}
          <button className={`btn btn-primary ${isAdmin ? "" : "hide-for-non-admin"}`}>
            New Table ➕
          </button>

        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover text-center align-middle">
          <thead className="table-secondary text-dark">
            <tr>
              <th>TABLE NAME</th>
              <th>STATUS</th>
              <th>SEATS</th>
              <th className={isAdmin ? "" : "hide-for-non-admin"}>UPDATE</th>
              <th className={isAdmin ? "" : "hide-for-non-admin"}>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.id || table._id}>
                <td>
                  <Link to={`/taple/${table.id || table._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    Taple {table.tableNumber}
                  </Link>
                </td>
                <td><span className={getStatusClass(table.status)}>{table.status}</span></td>
                <td>{table.seats} Seats</td>
                <td className={isAdmin ? "" : "hide-for-non-admin"}>
                  {/* `btn btn-primary ${isAdmin ? "" : "hide-for-non-admin"}` */}
                  <Link to={`/taple/update/${table.id || table._id}`} className=" btn btn-warning btn-sm">
                    UPDATE
                  </Link>
                </td>
                <td className={isAdmin ? "" : "hide-for-non-admin"}>
                  <button
                    onClick={() => handleDelete(table.id || table._id)}
                    className="btn btn-danger btn-sm "
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tables;
