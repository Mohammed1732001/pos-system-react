

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PuplicRequest } from "../utils/requestMethod.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // يمنع إعادة تحميل الصفحة
        setError('');

        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        try {
            const res = await PuplicRequest.post("/auth/login", { email, password });
            console.log(res);

            // لو الرد فيه توكن أو بيانات نجاح
            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token); // خزّن التوكن
                navigate("/"); // روح للصفحة الرئيسية
            } else {
                setError("Login failed.");
            }
        } catch (err) {
            console.error(err);
            setError("Login failed. Please try again.");
        }
    };

    return (
        <div className="login-body d-flex align-items-center justify-content-center">
            <div className="signin-box p-4 rounded shadow">
                <div className="coffee-icon mb-3">☕</div>
                <h2 className="text-primary mb-4 text-center">Sign In</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        className="form-control mb-3 input-custom"
                        placeholder="Email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="form-control mb-3 input-custom"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100 btn-custom">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
