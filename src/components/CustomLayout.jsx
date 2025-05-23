import { Link, Outlet, useNavigate } from 'react-router-dom';
import "../style/layout.css";
import { jwtDecode } from "jwt-decode";
import { PuplicRequest } from '../utils/requestMethod';
import { useEffect, useState } from 'react';
import AuthService from '../utils/AuthService.js';


function CustomLayout() {
    const isAdmin = AuthService.isAdmin();
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/Login");
    };
    useEffect(() => {
        const getUser = async () => {

            const token = localStorage.getItem("token");
            const decodedToken = token ? jwtDecode(token) : null;
            const res = await PuplicRequest.get(`/user/${decodedToken.id}`)

            setUser(res.data.user);
        }
        getUser();

    }, [])
    return (
        <div style={{ display: "flex" }}>
            <div className="sidebar">
                <h2 className="logo">Dinga Cashier</h2>
                <nav className="nav-links">
                    <p className='text-center fw-bold fs-5'>{user.userName} </p>

                    <Link  className={isAdmin ? "" : "hide-for-non-admin"} to="/dashboard">📊 Dashboard</Link>
                    <Link to="/">🏠 Home</Link>
                    <Link to="/orders">📦 Orders</Link>
                    <Link to="/invoices">🧾 Invoices</Link>
                    <Link to="/items"> 🍺 ITEMS</Link>
                    <Link to="/taples">🪑 Tables</Link>
                    {/* <Link to="/users"> 👥 Users</Link> */}
                    <button onClick={handleLogout} className="btn btn-danger w-100 mt-3" >🚪 Logout</button>
                </nav>
            </div>
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
}

export default CustomLayout;



