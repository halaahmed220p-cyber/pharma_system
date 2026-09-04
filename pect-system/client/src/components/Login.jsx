import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import logo from '../assets/logo.png';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-system.onrender.com';
            const res = await axios.post(`${API_URL}/api/login`, { username, password });
            
            if (res.data.success) {
                // تمرير بيانات المستخدم (التي تحتوي على الـ role من قاعدة البيانات)
                onLogin(res.data.user);
            }
        } catch (err) {
            alert('خطأ في تسجيل الدخول، تأكد من البيانات');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="PHARM Logo" className="logo-img" />
                    <h2>نظام إدارة PECT</h2>
                    <p>المؤتمر والمعرض الصيدلاني (PHARM)</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <h3>تسجيل الدخول إلى النظام</h3>
                    
                    <div className="input-group">
                        <label>اسم المستخدم</label>
                        <div className="input-field-wrapper">
                            <input 
                                type="text" 
                                placeholder="أدخل اسم المستخدم" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required 
                            />
                            <i className="icon-user">👤</i>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>كلمة المرور</label>
                        <div className="input-field-wrapper">
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                            <i className="icon-lock">🔒</i>
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        تسجيل الدخول <span>←</span>
                    </button>
                </form>
            </div>
        </div>
    );
}