import { useState } from "react";
import { api } from "../api";
import "../index.css";

export function Authentication({ onLogin, onClose }) {
    const [tab, setTab] = useState("login");
    const [error, setError] = useState("");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirm: "" });

    const handleLogin = async () => {
    const res = await api.login(loginData.email, loginData.password);
    if (res.error) { setError(res.error); return; }
    localStorage.setItem('token', res.token);
    onLogin({ username: res.username, email: res.email }, res.flowers); // ← pass flowers
};

const handleRegister = async () => {
    if (!registerData.username || !registerData.email || !registerData.password) {
        setError("Please fill in all fields!"); return;
    }
    if (registerData.password !== registerData.confirm) {
        setError("Passwords don't match!"); return;
    }
    const res = await api.register(registerData.username, registerData.email, registerData.password);
    if (res.error) { setError(res.error); return; }
    localStorage.setItem('token', res.token);
    onLogin({ username: res.username, email: res.email }, []); // ← pass empty flowers for new user
};

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose}>×</button>
                <h4>🌸 Welcome!</h4>

                <div className="auth-tabs">
                    <button className={`auth-tab ${tab === "login" ? "active" : ""}`}
                        onClick={() => { setTab("login"); setError(""); }}>Login</button>
                    <button className={`auth-tab ${tab === "register" ? "active" : ""}`}
                        onClick={() => { setTab("register"); setError(""); }}>Register</button>
                </div>

                {tab === "login" ? (
                    <div className="auth-fields">
                        <input className="auth-input" type="email" placeholder="Email"
                            value={loginData.email}
                            onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
                        <input className="auth-input" type="password" placeholder="Password"
                            value={loginData.password}
                            onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                        <button className="auth-submit" onClick={handleLogin}>Login</button>
                    </div>
                ) : (
                    <div className="auth-fields">
                        <input className="auth-input" type="text" placeholder="Username"
                            value={registerData.username}
                            onChange={e => setRegisterData({ ...registerData, username: e.target.value })} />
                        <input className="auth-input" type="email" placeholder="Email"
                            value={registerData.email}
                            onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
                        <input className="auth-input" type="password" placeholder="Password"
                            value={registerData.password}
                            onChange={e => setRegisterData({ ...registerData, password: e.target.value })} />
                        <input className="auth-input" type="password" placeholder="Confirm Password"
                            value={registerData.confirm}
                            onChange={e => setRegisterData({ ...registerData, confirm: e.target.value })} />
                        <button className="auth-submit" onClick={handleRegister}>Register</button>
                    </div>
                )}

                {error && <p className="auth-error">{error}</p>}
            </div>
        </div>
    );
}