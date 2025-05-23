
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../style/layout.css";
import { jwtDecode } from "jwt-decode";
import { PuplicRequest } from "../utils/requestMethod";
import { useEffect, useState } from "react";
import AuthService from "../utils/AuthService";

function CustomLayout() {
    const isAdmin = AuthService.isAdmin();
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/Login");
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const closeCollapse = () => {
        setIsCollapsed(true);
    };

    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem("token");
            const decodedToken = token ? jwtDecode(token) : null;
            const res = await PuplicRequest.get(`/user/${decodedToken.id}`);
            setUser(res.data.user);
        };
        getUser();
    }, []);

    return (
        <div className="d-flex flex-column flex-md-row">
            {/* Sidebar for md+ screens */}
            <div className="d-none d-md-flex flex-column bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
                <h2 className="logo mb-4">Dinga Cashier</h2>
                <nav className="nav flex-column nav-links">
                    <p className="fw-bold fs-5 text-center">{user.userName}</p>
                    {isAdmin && <Link className="nav-link text-white" to="/dashboard">📊 Dashboard</Link>}
                    <Link className="nav-link text-white" to="/">🏠 Home</Link>
                    <Link className="nav-link text-white" to="/orders">📦 Orders</Link>
                    <Link className="nav-link text-white" to="/invoices">🧾 Invoices</Link>
                    <Link className="nav-link text-white" to="/items">🍺 Items</Link>
                    <Link className="nav-link text-white" to="/taples">🪑 Tables</Link>
                    <button onClick={handleLogout} className="btn btn-danger mt-3">🚪 Logout</button>
                </nav>
            </div>

            {/* Navbar for mobile only (w-100) */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-md-none w-100">
                <div className="container-fluid">
                    <span className="navbar-brand">Dinga Cashier</span>
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-label="Toggle navigation"
                        onClick={toggleCollapse}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className={`navbar-collapse ${isCollapsed ? "collapse" : "show"}`} id="navbarMenu">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item fw-bold text-white mt-2 ms-2">{user.userName}</li>
                            {isAdmin && (
                                <li className="nav-item">
                                    <Link onClick={closeCollapse} className="nav-link" to="/dashboard">📊 Dashboard</Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <Link onClick={closeCollapse} className="nav-link" to="/">🏠 Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link onClick={closeCollapse} className="nav-link" to="/orders">📦 Orders</Link>
                            </li>
                            <li className="nav-item">
                                <Link onClick={closeCollapse} className="nav-link" to="/invoices">🧾 Invoices</Link>
                            </li>
                            <li className="nav-item">
                                <Link onClick={closeCollapse} className="nav-link" to="/items">🍺 Items</Link>
                            </li>
                            <li className="nav-item">
                                <Link onClick={closeCollapse} className="nav-link" to="/taples">🪑 Tables</Link>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={() => {
                                        closeCollapse();
                                        handleLogout();
                                    }}
                                    className="btn btn-danger w-100 my-2"
                                >
                                    🚪 Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="flex-grow-1 p-3">
                <Outlet />
            </div>
        </div>
    );
}

export default CustomLayout;





















































