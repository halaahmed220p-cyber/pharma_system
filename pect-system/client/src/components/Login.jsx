import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // سنقوم بإنشاء هذا الملف للتنسيقات
import logo from '../assets/logo.png'; // مسار الشعار

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Master Admin');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', { username, password });
            if (res.data.success) {
                onLogin(res.data.user);
            }
        } catch (err) {
            alert('خطأ في تسجيل الدخول، تأكد من البيانات');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                {/* الهيدر العلوي الأزرق مع الشعار والعناوين */}
                <div className="login-header">
                    <img src={logo} alt="PHARM Logo" className="logo-img" />
                    <h2>نظام إدارة PECT</h2>
                    <p>المؤتمر والمعرض الصيدلاني (PHARM)</p>
                </div>

                {/* نموذج تسجيل الدخول */}
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

                    <div className="input-group">
                        <label>الصلاحية / الدور</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    checked={role === 'Master Admin'} 
                                    onChange={() => setRole('Master Admin')} 
                                />
                                المسؤول (Admin)
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        تسجيل الدخول <span>←</span>
                    </button>
                </form>

                {/* بيانات الدخول الجاهزة */}
               
            </div>
        </div>
    );
}